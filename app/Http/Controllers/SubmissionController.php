<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
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
     * Store a new submission
     */
    public function store(Request $request)
    {
        // For now, just return a success message
        return redirect()->back()->with('success', 'Submission received!');
    }

    /**
     * Show user's submissions
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

        return Inertia::render('Submission/Index', [
            'submissions' => $submissions,
        ]);
    }

    /**
     * Show specific submission
     */
    public function show($id)
    {
        return Inertia::render('Submission/Show', [
            'submission' => []
        ]);
    }

    /**
     * Show edit form
     */
    public function edit($id)
    {
        return Inertia::render('Submission/Edit');
    }

    /**
     * Update submission
     */
    public function update(Request $request, $id)
    {
        return redirect()->back()->with('success', 'Submission updated!');
    }

    /**
     * Delete submission
     */
    public function destroy($id)
    {
        return redirect()->route('submissions.index')->with('success', 'Submission deleted!');
    }
}