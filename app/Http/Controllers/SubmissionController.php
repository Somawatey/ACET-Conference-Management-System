<?php

namespace App\Http\Controllers;

use App\Models\AuthorInfo;
use App\Models\Paper;
use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SubmissionController extends Controller
{
    /**
     * Show the submission form
     */
    public function create()
    {
        return Inertia::render('Submission/Submit');
    }

    /**
     * Store a new submission with its Paper and AuthorInfo,
     * and attach the relationships. Handles PDF upload to public storage.
     */
    public function store(Request $request)
    {
        // Validate incoming data from the form
        $validated = $request->validate([
            // Author Info
            'author_name'        => ['required', 'string', 'max:255'],
            'author_institute'   => ['required', 'string', 'max:255'],
            'author_email'       => ['required', 'email', 'max:255'],
            'correspond_name'    => ['required', 'string', 'max:255'],
            'correspond_email'   => ['required', 'email', 'max:255'],
            'coauthors'          => ['nullable', 'string'],

            // Paper Info
            'track'              => ['required', 'string', 'max:255'],
            'topic'              => ['required', 'string', 'max:255'],
            'paper_title'        => ['required', 'string', 'max:255'],
            'abstract'           => ['required', 'string'],
            'keyword'            => ['required', 'string'],

            // File upload (PDF) — allow larger files (100 MB)
            'paper_file'         => ['required', 'file', 'mimes:pdf', 'mimetypes:application/pdf,application/x-pdf,application/octet-stream', 'max:102400'], // 100MB

            // Declaration
            'submitted_elsewhere'=> ['nullable'],
            'original_submission'=> ['nullable'],
        ]);

        // Normalize incoming booleans from checkboxes/strings
        $submittedElsewhere = $this->toBool($request->input('submitted_elsewhere'));
        $originalSubmission = $this->toBool($request->input('original_submission'));

        // Normalize topic to match Paper enum
        $topic = $this->normalizeTopic($validated['topic']);

        // Store PDF to public disk exactly like profile photo: store relative path under 'papers'
        $paperPath = null;
        if ($request->hasFile('paper_file')) {
            // Returns e.g. "papers/abcd1234.pdf"
            $paperPath = $request->file('paper_file')->store('papers', 'public');
            if (!$paperPath) {
                return back()
                    ->withErrors(['paper_file' => 'Failed to upload file.'])
                    ->withInput();
            }
        }

        // 1) Create Paper (restricted to only allowed attributes)
        $paper = Paper::create([
            'paper_title' => $validated['paper_title'],
            'url'         => $paperPath, // store path like profile_photo_path
            'topic'       => $topic,
            'keyword'     => $validated['keyword'],
            'abstract'    => $validated['abstract'],
            'author_id'   => Auth::id(),
        ]);

        // 2) Create AuthorInfo record
        $authorInfo = AuthorInfo::create([
            'author_name'      => $validated['author_name'],
            'author_email'     => $validated['author_email'],
            'institute'        => $validated['author_institute'],
            'correspond_name'  => $validated['correspond_name'],
            'correspond_email' => $validated['correspond_email'],
            'coauthors'        => $validated['coauthors'] ?? null,
        ]);

        // 3) Create Submission and link to Paper
        $submission = Submission::create([
            'user_id'             => Auth::id(),
            'paper_id'            => $paper->id,
            'author_info_id'      => $authorInfo->id,
            'decision_id'         => null,
            'track'               => $validated['track'],
            'submitted_elsewhere' => $submittedElsewhere,
            'original_submission' => $originalSubmission,
            'submitted_at'        => now(),
        ]);

        return redirect()
            ->route('submissions.create')
            ->with('success', 'Submission created successfully!');
    }

    /**
     * List the current user's submissions (with their papers)
     */
    public function index()
    {
    // Fetch submissions with related paper (incl. decision), author info, and user (submitter)
    $submissions = \App\Models\Submission::with(['paper.decision', 'authorInfo', 'user'])
            ->latest('submitted_at')
            ->get()
            ->map(function ($s) {
                $paperTitle = $s->paper->paper_title ?? ($s->paper->title ?? '');
                $authorName = $s->authorInfo->author_name ?? optional($s->paper->user)->name ?? '';
                $correspondingEmail = $s->authorInfo->correspond_email ?? $s->authorInfo->author_email ?? '';
                $submittedBy = optional($s->user)->name ?? '';
                $createdAt = optional($s->created_at)->toDateTimeString() ?? optional($s->submitted_at)->toDateTimeString();
        // Prefer final decision from decisions table via paper_id; fallback to paper status
        $status = optional(optional($s->paper)->decision)->decision ?? ($s->paper->status ?? 'Pending');

                return [
                    'id' => $s->id,
                    'paper_title' => $paperTitle,
                    'author_name' => $authorName,
                    'corresponding_email' => $correspondingEmail,
                    'submitted_by' => $submittedBy,
                    'created_at' => $createdAt,
                    'status' => $status,
                ];
            });
        $submissions = Submission::with(['paper'])
            ->where('user_id', Auth::id())
            ->latest('submitted_at')
            ->get();

        return Inertia::render('Submission/Index', [
            'submissions' => $submissions,
        ]);
    }

    /**
     * Show a specific submission (with its paper)
     */
    public function show($id)
    {
        $submission = Submission::with(['paper'])->findOrFail($id);

        return Inertia::render('Submission/Show', [
            'submission' => $submission,
        ]);
    }

    /**
     * Show edit form
     */
    public function edit($id)
    {
        $submission = Submission::with(['paper'])->findOrFail($id);

        return Inertia::render('Submission/Edit', [
            'submission' => $submission,
        ]);
    }

    /**
     * Update submission (basic example)
     */
    public function update(Request $request, $id)
    {
        $submission = Submission::findOrFail($id);

        $submission->update($request->only([
            'track',
            'submitted_elsewhere',
            'original_submission',
        ]));

        return redirect()->back()->with('success', 'Submission updated!');
    }

    /**
     * Delete submission
     */
    public function destroy($id)
    {
        $submission = Submission::findOrFail($id);
        $submission->delete();

        return redirect()->route('submissions.index')->with('success', 'Submission deleted!');
    }

    /**
     * Normalize checkbox/text boolean values.
     */
    private function toBool($value): bool
    {
        if (is_bool($value)) {
            return $value;
        }
        $truthy = ['1', 1, 'true', 'on', 'yes', 'y'];
        return in_array($value, $truthy, true);
    }

    /**
     * Map UI topic values to the allowed enum values in papers table.
     */
    private function normalizeTopic(string $topic): string
    {
        $map = [
            'NLP'             => 'AI',
            'Data Sciences'   => 'Data Science',
            'IoT Networking'  => 'Computer Networks',
        ];
        $allowed = ['AI', 'ML', 'Data Science', 'Software Engineering', 'Computer Networks', 'Cybersecurity', 'Other'];

        $normalized = $map[$topic] ?? $topic;

        return in_array($normalized, $allowed, true) ? $normalized : 'Other';
    }
}