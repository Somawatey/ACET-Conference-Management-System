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
            ->with(['submission', 'user'])
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
                'authors' => optional($currentPaper->user)->name,
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
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Review $review)
    {
        //
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
