<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use App\Models\Review;
use App\Models\Decision;
use Illuminate\Http\Request;
use App\Models\Paper;
use resources\js\Pages\PaperDecision\index;

class DecisionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();
        $papers = Paper::where('user_id', $user->id)->get();
        // Define the $reviews variable by fetching data from the Paper model
        $reviews = Review::whereIn('paper_id', $papers->pluck('id'))->get();
        // Transform the reviews to include only necessary fields
        $transformedReviews = $reviews->map(function ($review) {
            return [
                'id' => $review->id,
                'paper_id' => $review->paper_id,
                'reviewer' => optional($review->reviewer)->name ?? 'Unknown',
                'status' => $review->recommendation ?? 'Pending',
            ];
        });
        return Inertia::render('PaperDecision/Index', [
            'papers' => $papers,
            'reviews' => $transformedReviews,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function decisionshow($id)
    {
        // 1. Find the paper by its ID or fail with a 404 error if not found.
        $paper = Paper::findOrFail($id);
        $paper = Paper::with(['user', 'topic', 'reviews.reviewer'])->findOrFail($id);
        $reviews = $paper->reviews()->get();
        $transformedPaper = [
            'id' => $paper->id,
            'title' => $paper->paper_title ?? $paper->title ?? '',
            'author' => optional($paper->user)->name ?? '',
            'track' => is_string($paper->topic)
                ? $paper->topic
                : (is_object($paper->topic) ? ($paper->topic->name ?? '') : ''),
        ];

        $reviews = $paper->reviews->map(function ($review) {
            return [
                'id' => $review->id,
                'reviewer' => optional($review->reviewer)->name ?? 'Unknown',
                'status' => $review->recommendation ?? 'Pending',
            ];

        });

        return Inertia::render('PaperDecision/Index', [
            'paper' => $transformedPaper,
            'reviews' => $reviews,
        ]);
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
    public function show(Decision $decision)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Decision $decision)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Decision $decision)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Decision $decision)
    {
        //
    }
}
