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

        $search = $request->string('search')->toString();
        $topic = $request->string('topic')->toString();
        $track = $request->string('track')->toString();

        $query = Review::query()
            ->with(['paper.submission', 'reviewer']);

        if ($search !== '') {
            $query->whereHas('paper', function ($q) use ($search) {
                $q->where('paper_title', 'like', "%{$search}%");
            });
        }

        if ($topic !== '') {
            $query->whereHas('paper', function ($q) use ($topic) {
                $q->where('topic', $topic);
            });
        }

        if ($track !== '') {
            $query->whereHas('paper.submission', function ($q) use ($track) {
                $q->where('track', $track);
            });
        }

        $reviews = $query
            ->orderByDesc('created_at')
            ->paginate(10)
            ->appends($request->only(['search', 'topic', 'track']))
            ->through(function ($review) {
                return [
                    'id' => $review->id,
                    'reviewBy' => optional($review->reviewer)->name,
                    'reviewDate' => optional($review->created_at)?->toDateString(),
                    'status' => $review->recommendation, // expect: accept|revise|reject
                    'comments' => $review->feedback,
                    'rating' => $review->score,
                    'paper' => [
                        'title' => optional($review->paper)->paper_title,
                        'topic' => optional($review->paper)->topic,
                        'track' => optional(optional($review->paper)->submission)->track,
                    ],
                ];
            });

        $topics = Paper::query()->select('topic')->distinct()->pluck('topic');
        $tracks = Submission::query()->select('track')->distinct()->pluck('track');

        return Inertia::render('ReviewHistory/ReviewHistory', [
            'reviews' => $reviews,
            'filters' => [
                'search' => $search,
                'topic' => $topic,
                'track' => $track,
            ],
            'topics' => $topics,
            'tracks' => $tracks,
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
