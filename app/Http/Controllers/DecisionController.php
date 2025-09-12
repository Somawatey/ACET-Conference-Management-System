<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use App\Models\Review;
use App\Models\Decision;
use Illuminate\Http\Request;
use App\Models\Paper;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Notifications\PaperDecisionMade;

class DecisionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $user = Auth::user();

            // Get papers through submissions that belong to the current user with existing decision (if any)
            $papers = Paper::with(['decision', 'submission.authorInfo'])
                ->whereHas('submission', function($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->orderByDesc('created_at')
                ->get();
            
            // Define the $reviews variable by fetching data from the Paper model
            $reviews = Review::whereIn('paper_id', $papers->pluck('id'))->get();
            
            // Fetch recent decisions from the decisions table
            $recentDecisions = Decision::with(['paper', 'organizer'])
                ->whereIn('paper_id', $papers->pluck('id'))
                ->latest()
                ->take(10)
                ->get();
            
            // Log recent decisions for debugging
            Log::info('Recent decisions from database: ' . $recentDecisions->count() . ' found for user: ' . $user->id);
            
            // Transform the reviews to include only necessary fields
            $transformedReviews = $reviews->map(function ($review) {
                return [
                    'id' => $review->id,
                    'paper_id' => $review->paper_id,
                    'reviewer' => optional($review->reviewer)->name ?? 'Unknown',
                    'status' => $review->recommendation ?? 'Pending',
                    'author' => optional($review->paper->user)->name ?? 'Unknown',
                ];
            });
            
            // Transform papers for index listing
            $transformedPapers = $papers->map(function ($paper) {
                return [
                    'id' => $paper->id,
                    'title' => $paper->paper_title ?? $paper->title ?? '',
                    'status' => $paper->status ?? 'Pending',
                    'decision' => $paper->decision ? [
                        'id' => $paper->decision->id,
                        'decision' => $paper->decision->decision,
                        'comment' => $paper->decision->comment,
                        'updated_at' => optional($paper->decision->updated_at)->toDateTimeString(),
                    ] : null,
                ];
            });

            return Inertia::render('PaperDecision/Index', [
                'papers' => $transformedPapers,
                'reviews' => $transformedReviews,
                'recentDecisions' => $recentDecisions,
                'auth' => ['user' => $user],
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error in DecisionController@index: ' . $e->getMessage());
            
            return redirect()->back()
                             ->withErrors(['error' => 'Failed to load paper decisions. Please try again.']);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Paper $paper)
    {
        try {
            // Load paper with relationships (removed 'topic' as it's not a relationship)
            $paper->load(['user', 'reviews.reviewer']);
            
            // Transform paper data
            $transformedPaper = [
                'id' => $paper->id,
                'title' => $paper->paper_title ?? $paper->title ?? '',
                'author' => optional($paper->user)->name ?? '',
                'track' => $paper->topic, // topic is a direct field, not a relationship
                'status' => $paper->status ?? 'Pending',
            ];

            // Transform reviews data
            $reviews = $paper->reviews->map(function ($review) {
                return [
                    'id' => $review->id,
                    'paper_id' => $review->paper_id,
                    'reviewer' => optional($review->reviewer)->name ?? 'Unknown',
                    'status' => $review->recommendation ?? 'Pending',
                    'comment' => $review->comment ?? '',
                    'score' => $review->score ?? null,
                ];
            });

            return Inertia::render('PaperDecision/Index', [
                'paper' => $transformedPaper,
                'reviews' => $reviews,
                'auth' => ['user' => Auth::user()],
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error in DecisionController@create: ' . $e->getMessage());
            
            return redirect()->route('paper-decision.index')
                             ->withErrors(['error' => 'Failed to load paper details. Please try again.']);
        }
    }


    /**
     * Display the specified resource for decision making (show method).
     */
    public function show(Paper $paper)
    {
        // Load relationships (removed 'topic' as it's not a relationship)
        $paper->load(['submission.authorInfo', 'reviews.reviewer']);
        $transformedPaper = [
            'id' => $paper->id,
            'title' => $paper->paper_title ?? $paper->title ?? '',
            'author' => optional($paper->submission?->authorInfo)->author_name ?? '',
            'track' => $paper->topic, // topic is a direct field, not a relationship
            'status' => $paper->status ?? 'Pending',
        ];

        $reviews = $paper->reviews->map(function ($review) {
            return [
                'id' => $review->id,
                'paper_id' => $review->paper_id,
                'reviewer' => optional($review->reviewer)->name ?? 'Unknown',
                'status' => $review->recommendation ?? 'Pending',
                'comment' => $review->comment ?? '',
                'score' => $review->score ?? null,
            ];
        });

        // Include existing decision if present
        $existingDecision = $paper->decision;
        $decision = $existingDecision ? [
            'id' => $existingDecision->id,
            'decision' => $existingDecision->decision,
            'comment' => $existingDecision->comment,
            'organizer' => optional($existingDecision->organizer)->name,
            'created_at' => $existingDecision->created_at?->toDateTimeString(),
            'updated_at' => $existingDecision->updated_at?->toDateTimeString(),
        ] : null;

        $editing = (bool) request()->boolean('edit', false);

        return Inertia::render('PaperDecision/Index', [
            'paper' => $transformedPaper,
            'reviews' => $reviews,
            'decision' => $decision,
            'editing' => $editing,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Paper $paper)
    {
        Log::info('DecisionController@store called', [
            'paper_id' => $paper->id,
            'user_id' => auth()->id(),
            'request_data' => $request->all()
        ]);

        // Validate the request data
        $validated = $request->validate([
            'decision' => ['required', 'in:Accept,Reject,Revise'],
            'comment' => ['nullable', 'string', 'max:5000'],
        ]);

        try {
            // Check if paper exists and load relationships
            $paper->load(['submission.authorInfo', 'decision']);

            // Save decision (create or update if exists)
            $decision = Decision::updateOrCreate(
                ['paper_id' => $paper->id],
                [
                    'organizer_id' => auth()->id(),
                    'decision' => $validated['decision'],
                    'comment' => $validated['comment'] ?? null,
                ]
            );

            // Map decision to paper status enum values
            $statusMap = [
                'Accept' => 'accepted',
                'Reject' => 'rejected',
                'Revise' => 'needs_revision',
            ];

            // Update paper status accordingly
            $paper->status = $statusMap[$validated['decision']] ?? $paper->status;
            $paper->save();
            
            // Notify the author about the decision
            $author = $paper->user;
            if ($author) {
            $author->notify(new PaperDecisionMade($paper, $validated['decision'], $validated['comment']));
        }
            // Redirect to show page so the saved decision is visible
            return redirect()
                ->route('paper-decision.show', ['paper' => $paper->id])
                ->with('success', 'Decision saved successfully.');

        } catch (\Exception $e) {
            Log::error('Error submitting paper decision: ' . $e->getMessage());

            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Failed to submit decision. Please try again.']);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Paper $paper)
    {
        // Load relationships (removed 'topic' as it's not a relationship)
        $paper->load(['user', 'reviews.reviewer', 'decision.organizer']);

        $transformedPaper = [
            'id' => $paper->id,
            'title' => $paper->paper_title ?? $paper->title ?? '',
            'author' => optional($paper->user)->name ?? '',
            'track' => $paper->topic, // topic is a direct field, not a relationship
        ];

        $reviews = $paper->reviews->map(function ($review) {
            return [
                'id' => $review->id,
                'paper_id' => $review->paper_id,
                'reviewer' => optional($review->reviewer)->name ?? 'Unknown',
                'status' => $review->recommendation ?? 'Pending',
            ];
        });

        $existingDecision = $paper->decision;
        if (!$existingDecision) {
            // No decision yet; redirect to show/create flow
            return redirect()->route('paper-decision.show', ['paper' => $paper->id]);
        }

        $decision = [
            'id' => $existingDecision->id,
            'decision' => $existingDecision->decision,
            'comment' => $existingDecision->comment,
            'organizer' => optional($existingDecision->organizer)->name,
            'created_at' => $existingDecision->created_at?->toDateTimeString(),
            'updated_at' => $existingDecision->updated_at?->toDateTimeString(),
        ];

        return Inertia::render('PaperDecision/Index', [
            'paper' => $transformedPaper,
            'reviews' => $reviews,
            'decision' => $decision,
            'editing' => true,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Paper $paper)
    {
        $validated = $request->validate([
            'decision' => ['required', 'in:Accept,Reject,Revise'],
            'comment' => ['nullable', 'string', 'max:5000'],
        ]);

        try {
            $decision = $paper->decision;
            if (!$decision) {
                return redirect()->route('paper-decision.show', ['paper' => $paper->id])
                                 ->withErrors(['error' => 'No decision found to update.']);
            }

            $decision->update([
                'decision' => $validated['decision'],
                'comment' => $validated['comment'] ?? null,
            ]);

            // Update paper status accordingly
            $statusMap = [
                'Accept' => 'accepted',
                'Reject' => 'rejected',
                'Revise' => 'needs_revision',
            ];
            $paper->status = $statusMap[$validated['decision']] ?? $paper->status;
            $paper->save();

            return redirect()->route('paper-decision.show', ['paper' => $paper->id])
                             ->with('success', 'Decision updated successfully.');
        } catch (\Exception $e) {
            Log::error('Error updating paper decision: ' . $e->getMessage());
            return redirect()->back()->withInput()->withErrors(['error' => 'Failed to update decision. Please try again.']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Decision $decision)
    {
        //
    }
}
