<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Paper;
use App\Models\Submission;
use App\Models\PaperAssignment;
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
        $paper_id = $request->get('paper_id'); // Get specific paper ID if provided

        // Normalize status to match DB values
        if ($status !== '') {
            $status = ucfirst(strtolower($status)); // accept -> Accept, etc.
        }

        // Query papers with their reviews and related data
        $papersQuery = Paper::query()
            ->with([
                'submission.authorInfo',
                'user',
                'reviews' => function ($query) use ($reviewer, $status, $rating) {
                    $query->with('reviewer');
                    
                    if ($reviewer !== '') {
                        $query->whereHas('reviewer', function ($q) use ($reviewer) {
                            $q->where('name', 'like', "%{$reviewer}%");
                        });
                    }

                    if ($status !== '') {
                        $query->where('recommendation', $status);
                    }

                    if ($rating !== '') {
                        $query->where('score', (int) $rating);
                    }
                    
                    $query->orderByDesc('created_at');
                }
            ])
            ->whereHas('reviews') // Only show papers that have reviews
            ->orderByDesc('created_at');

        // If a specific paper ID is provided, filter to that paper
        if ($paper_id) {
            $papersQuery->where('id', $paper_id);
        }

        // Apply additional filters if needed
        if ($reviewer !== '' || $status !== '' || $rating !== '') {
            $papersQuery->whereHas('reviews', function ($query) use ($reviewer, $status, $rating) {
                if ($reviewer !== '') {
                    $query->whereHas('reviewer', function ($q) use ($reviewer) {
                        $q->where('name', 'like', "%{$reviewer}%");
                    });
                }

                if ($status !== '') {
                    $query->where('recommendation', $status);
                }

                if ($rating !== '') {
                    $query->where('score', (int) $rating);
                }
            });
        }

        // Paginate papers: one paper per page
        $papers = $papersQuery
            ->paginate(1)
            ->appends($request->only(['reviewer', 'status', 'rating', 'show', 'paper_id']));

        $currentPaper = collect($papers->items())->first();

        // Build top-level paper payload for UI
        $paperPayload = null;
        $reviewsData = collect();
        
        if ($currentPaper) {
            // Get author name from submission->authorInfo first, then fallback to user
            $authorName = null;
            if ($currentPaper->submission && $currentPaper->submission->authorInfo) {
                $authorName = $currentPaper->submission->authorInfo->author_name;
            } elseif ($currentPaper->user) {
                $authorName = $currentPaper->user->name;
            }

            $paperPayload = [
                'id' => $currentPaper->id,
                'title' => $currentPaper->paper_title,
                'topic' => $currentPaper->topic,
                'track' => optional($currentPaper->submission)->track,
                'abstract' => $currentPaper->abstract,
                'keywords' => $currentPaper->keywords,
                'authors' => $authorName ?? 'Unknown Author',
                'submissionDate' => optional($currentPaper->submission?->submitted_at)?->toDateString(),
                'pdf_path' => $currentPaper->pdf_path,
            ];

            // Format reviews data for UI
            $reviewsData = $currentPaper->reviews->map(function ($review) {
                return [
                    'id' => $review->id,
                    'reviewBy' => optional($review->reviewer)->name ?? 'Unknown Reviewer',
                    'reviewDate' => optional($review->created_at)?->format('Y-m-d'),
                    'status' => $review->recommendation, // Accept | Revise | Reject
                    'comments' => $review->feedback,
                    'rating' => $review->score,
                ];
            });
        }

        return Inertia::render('ReviewHistory/ReviewHistory', [
            'papers' => $papers,
            'paper' => $paperPayload,
            'reviews' => $reviewsData,
            'filters' => [
                'reviewer' => $reviewer,
                'status' => $status,
                'rating' => $rating,
                'show' => $show,
                'paper_id' => $paper_id,
            ],
        ]);
    }

    /**
     * Display a listing of reviews for reviewer.
     */
    public function reviewList()
    {
        // Get papers assigned to the current user as reviewer
        $assignedPapers = PaperAssignment::with([
            'paper.submission.authorInfo',
            'paper.user',
            'reviewer',
            'assignedBy'
        ])
        ->where('reviewer_id', auth()->id())
        ->orderByDesc('created_at')
        ->get();

        // Create a collection to hold the review data
        $reviewsData = collect();

        foreach ($assignedPapers as $assignment) {
            $paper = $assignment->paper;
            
            if ($paper) {
                // Get author name from submission->authorInfo first, then fallback to user
                $authorName = null;
                if ($paper->submission && $paper->submission->authorInfo) {
                    $authorName = $paper->submission->authorInfo->author_name;
                } elseif ($paper->user) {
                    $authorName = $paper->user->name;
                }
                
                // Add author_name and assignment info to paper
                $paper->author_name = $authorName ?? 'Unknown Author';
                $paper->assignment_status = $assignment->status;
                $paper->assignment_due_date = $assignment->due_date;
                $paper->assignment_notes = $assignment->notes;
                $paper->assigned_by_name = $assignment->assignedBy ? $assignment->assignedBy->name : 'Unknown';
                
                // Check if there's an existing review for this paper by current user
                $existingReview = Review::where('paper_id', $paper->id)
                    ->where('reviewer_id', auth()->id())
                    ->first();
                
                if ($existingReview) {
                    // Use existing review and add review status to paper
                    $paper->review_status = $existingReview->recommendation ?? 'pending';
                    $existingReview->paper = $paper;
                    $reviewsData->push($existingReview);
                } else {
                    // No review exists yet - set status as pending
                    $paper->review_status = 'pending';
                    // Create a mock review object for papers without reviews yet
                    $mockReview = new Review();
                    $mockReview->paper = $paper;
                    $mockReview->id = null;
                    $mockReview->reviewer_id = auth()->id();
                    $mockReview->paper_id = $paper->id;
                    $mockReview->score = null;
                    $mockReview->feedback = null;
                    $mockReview->recommendation = null;
                    $mockReview->created_at = $assignment->created_at;
                    $reviewsData->push($mockReview);
                }
            }
        }

        // Paginate the results
        $currentPage = request()->get('page', 1);
        $perPage = 10;
        $total = $reviewsData->count();
        $currentPageItems = $reviewsData->slice(($currentPage - 1) * $perPage, $perPage)->values();

        $paginatedReviews = new \Illuminate\Pagination\LengthAwarePaginator(
            $currentPageItems,
            $total,
            $perPage,
            $currentPage,
            [
                'path' => request()->url(),
                'pageName' => 'page',
            ]
        );

        return Inertia::render('Reviews/Index', [
            'reviews' => $paginatedReviews
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create($paper_id = null)
    {
        $paper = null;
        if ($paper_id) {
            $paper = Paper::with(['submission.authorInfo', 'user'])->findOrFail($paper_id);
            
            // Add author name to paper object
            $authorName = null;
            if ($paper->submission && $paper->submission->authorInfo) {
                $authorName = $paper->submission->authorInfo->author_name;
            } elseif ($paper->user) {
                $authorName = $paper->user->name;
            }
            $paper->author_name = $authorName ?? 'Unknown Author';
            
            // Check if user already has a review for this paper
            $existingReview = Review::where('paper_id', $paper->id)
                ->where('reviewer_id', auth()->id())
                ->first();
                
            if ($existingReview) {
                return Inertia::render('Reviews/Review', [
                    'paper' => $paper,
                    'review' => $existingReview
                ]);
            }
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
            'score' => 'required|integer|min:1|max:10',
            'feedback' => 'nullable|string|max:2000',
            'recommendation' => 'nullable|string|max:255',
        ]);

        // Add the current user as reviewer
        $validated['reviewer_id'] = auth()->id();

        // Check if review already exists for this user and paper
        $existing = Review::where('paper_id', $validated['paper_id'])
            ->where('reviewer_id', $validated['reviewer_id'])
            ->first();
            
        if ($existing) {
            return redirect()->route('reviews.create', ['paper' => $validated['paper_id']])
                ->with('error', 'You have already submitted a review for this paper.');
        }

        $review = Review::create([
            'paper_id' => $validated['paper_id'],
            'reviewer_id' => $validated['reviewer_id'],
            'score' => $validated['score'],
            'feedback' => $validated['feedback'] ?? '',
            'recommendation' => $validated['recommendation'] ?? '',
        ]);

        return redirect()->route('reviews.reviewList')
            ->with('success', 'Review submitted successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Review $review)
    {
        // Load review with all related data
        $review->load([
            'paper.submission.authorInfo',
            'paper.user',
            'reviewer'
        ]);

        // Get paper information
        $paper = $review->paper;
        
        // Get author name from submission->authorInfo first, then fallback to user
        $authorName = null;
        if ($paper->submission && $paper->submission->authorInfo) {
            $authorName = $paper->submission->authorInfo->author_name;
        } elseif ($paper->user) {
            $authorName = $paper->user->name;
        }

        // Format paper information
        $paperInfo = [
            'id' => $paper->id,
            'title' => $paper->paper_title,
            'topic' => $paper->topic,
            'track' => optional($paper->submission)->track,
            'abstract' => $paper->abstract,
            'keywords' => $paper->keywords,
            'authors' => $authorName ?? 'Unknown Author',
            'submissionDate' => optional($paper->submission?->submitted_at)?->format('Y-m-d'),
            'pdf_path' => $paper->pdf_path,
            'status' => $paper->status ?? 'Pending',
        ];

        // Format review information
        $reviewInfo = [
            'id' => $review->id,
            'reviewer' => optional($review->reviewer)->name ?? 'Unknown Reviewer',
            'reviewDate' => optional($review->created_at)?->format('Y-m-d H:i:s'),
            'score' => $review->score,
            'recommendation' => $review->recommendation,
            'feedback' => $review->feedback,
            'created_at' => optional($review->created_at)?->format('Y-m-d H:i:s'),
            'updated_at' => optional($review->updated_at)?->format('Y-m-d H:i:s'),
        ];

        // Get all reviews for this paper to show context
        $allReviews = Review::with('reviewer')
            ->where('paper_id', $paper->id)
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($rev) use ($review) {
                return [
                    'id' => $rev->id,
                    'reviewer' => optional($rev->reviewer)->name ?? 'Unknown Reviewer',
                    'reviewDate' => optional($rev->created_at)?->format('Y-m-d'),
                    'status' => $rev->recommendation,
                    'score' => $rev->score,
                    'is_current' => $rev->id === $review->id,
                ];
            });

        return Inertia::render('Reviews/show', [
            'review' => $reviewInfo,
            'paper' => $paperInfo,
            'allReviews' => $allReviews,
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
