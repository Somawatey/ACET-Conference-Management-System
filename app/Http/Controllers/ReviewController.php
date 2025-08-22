<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Paper;
use App\Models\Submission;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function index()
    {
        $request = request();

        // Review filters
        $reviewer = $request->string('reviewer')->toString();
        $status = $request->string('status')->toString(); // Accept | Revise | Reject (UI may send lowercase)
        $rating = $request->string('rating')->toString(); // numeric score
        $show = $request->string('show')->toString();

        // Normalize status to match DB values
        if ($status !== '') {
            $status = ucfirst(strtolower($status)); // accept -> Accept, etc.
        }

        // Paginate papers: one paper per page
        $papers = Paper::query()
            ->with(['submission', 'author'])
            ->orderByDesc('created_at')
            ->paginate(1)
            ->appends($request->only(['reviewer', 'status', 'rating', 'show']));

        $currentPaper = collect($papers->items())->first();

        // Build top-level paper payload for UI
        $paperPayload = null;
        if ($currentPaper) {
            $paperPayload = [
                'id' => $currentPaper->id,
                'title' => $currentPaper->paper_title,
                'track' => optional($currentPaper->submission)->track,
                'abstract' => $currentPaper->abstract,
                'authors' => optional($currentPaper->author)->name,
                'submissionDate' => optional($currentPaper->submission?->submitted_at)?->toDateString(),
            ];
        }

        // Reviews for current paper (no pagination; paper pagination controls navigation)
        $items = collect();
        if ($currentPaper) {
            $reviewQuery = Review::query()
                ->with(['reviewer'])
                ->where('paper_id', $currentPaper->id);

            if ($reviewer !== '') {
                $reviewQuery->whereHas('reviewer', function ($q) use ($reviewer) {
                    $q->where('name', 'like', "%{$reviewer}%");
                });
            }

            if ($status !== '') {
                $reviewQuery->where('recommendation', $status);
            }

            if ($rating !== '') {
                $reviewQuery->where('score', (int) $rating);
            }

            $items = $reviewQuery
                ->orderByDesc('created_at')
                ->get()
                ->map(function ($review) {
                    return [
                        'id' => $review->id,
                        'reviewBy' => optional($review->reviewer)->name,
                        'reviewDate' => optional($review->created_at)?->toDateString(),
                        'status' => $review->recommendation, // Accept | Revise | Reject
                        'comments' => $review->feedback,
                        'rating' => $review->score,
                    ];
                });
        }

        return Inertia::render('ReviewHistory/ReviewHistory', [
            'papers' => $papers,
            'paper' => $paperPayload,
            'reviews' => $items,
            'filters' => [
                'reviewer' => $reviewer,
                'status' => $status,
                'rating' => $rating,
                'show' => $show,
            ],
        ]);
    }

    /**
     * Display a listing of reviews for reviewer.
     */
    public function reviewList()
    {
        $reviews = Review::with([
            'paper.user',
            'paper.submission.authorInfo',
            'paper.submission',
            'reviewer'
        ])
        ->where('reviewer_id', auth()->id())
        ->orderByDesc('created_at')
        ->paginate(10);

        // Add author_name to each review's paper using Submission and AuthorInfo
        $reviews->getCollection()->transform(function ($review) {
            if ($review->paper) {
                // Try AuthorInfo from Submission
                $authorName = null;
                if ($review->paper->submission && $review->paper->submission->authorInfo) {
                    $authorName = $review->paper->submission->authorInfo->author_name;
                }
                // Fallback to authorInfo directly on paper
                if (!$authorName && $review->paper->authorInfo) {
                    $authorName = $review->paper->authorInfo->author_name;
                }
                // Fallback to user name
                if (!$authorName && $review->paper->user) {
                    $authorName = $review->paper->user->name;
                }
                $review->paper->author_name = $authorName ?? '';
            }
            return $review;
        });

        return Inertia::render('Reviews/Index', [
            'reviews' => $reviews
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create($paper_id = null)
    {
        $paper = null;
        if ($paper_id) {
            $paper = Paper::with(['author', 'submission'])->findOrFail($paper_id);
        }

        return Inertia::render('Reviews/Review', [
            'paper' => $paper
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'paper_id' => 'required|exists:papers,id',
            'reviewer_id' => 'required|exists:users,id',
            'score' => 'required|integer|min:1|max:10',
            'feedback' => 'nullable|string|max:2000',
            'recommendation' => 'nullable|string|max:255',
        ]);

        // Check if review already exists for this user and paper
        $existing = Review::where('paper_id', $validated['paper_id'])
            ->where('reviewer_id', $validated['reviewer_id'])
            ->first();
        if ($existing) {
            // Redirect to edit page for this review
            return redirect()->route('reviews.edit', $existing->id)
                ->with('info', 'You have already submitted a review for this paper. You can edit your review.');
        }

        $review = Review::create([
            'paper_id' => $validated['paper_id'],
            'reviewer_id' => $validated['reviewer_id'],
            'score' => $validated['score'],
            'feedback' => $validated['feedback'] ?? '',
            'recommendation' => $validated['recommendation'] ?? '',
        ]);

        return redirect()->back()->with('success', 'Review submitted successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Review $review)
    {
        //
        $review->load(['paper', 'reviewer']);
        return Inertia::render('Reviews/show', [
            'review' => $review
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Review $review)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Review $review)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Review $review)
    {
        //
    }
}
