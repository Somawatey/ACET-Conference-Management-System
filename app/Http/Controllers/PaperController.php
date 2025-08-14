<?php

namespace App\Http\Controllers;
use Inertia\Response;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Paper;
use App\Models\Review;
use App\Models\Decision;

class PaperController extends Controller
{
    /**
     * Display a listing of papers
     */
    public function index()
    {
        $papers = Paper::with(['user', 'conference'])
                      ->orderBy('created_at', 'desc')
                      ->paginate(10);

        return Inertia::render('Papers/Index', [
            'papers' => $papers
        ]);
    }

    /**
     * Show the form for creating a new paper
     */
    public function create()
    {
        return Inertia::render('Papers/Create');
    }

    /**
     * Store a newly created paper
     */
    public function store(Request $request)
    {
        // Implementation here
        return redirect()->route('papers.index');
    }

    /**
     * Display the specified paper
     */
    public function show($id)
    {
        $paper = Paper::with(['user', 'conference', 'reviews', 'decision'])->findOrFail($id);
        
        return Inertia::render('Papers/Show', [
            'paper' => $paper
        ]);
    }

    /**
     * Show the form for editing the specified paper
     */
    public function edit($id)
    {
        $paper = Paper::findOrFail($id);
        
        return Inertia::render('Papers/Edit', [
            'paper' => $paper
        ]);
    }

    /**
     * Update the specified paper
     */
    public function update(Request $request, $id)
    {
        // Implementation here
        return redirect()->route('papers.index');
    }

    /**
     * Remove the specified paper
     */
    public function destroy($id)
    {
        $paper = Paper::findOrFail($id);
        $paper->delete();
        
        return redirect()->route('papers.index');
    }

	/**
	 * Display a listing page for paper decisions.
	 */
	public function decisions(): Response
	{
		$papers = Paper::with(['user', 'conference'])
			->orderBy('created_at', 'desc')
			->paginate(10);

		return Inertia::render('Papers/Index', [
			'papers' => $papers,
		]);
	}

	/**
	 * Show the decision page for a specific paper.
	 */
	public function decisionShow($id): Response
	{
		$paper = Paper::with(['user', 'conference'])->findOrFail($id);

		$reviews = Review::with('reviewer')
			->where('paper_id', $id)
			->get()
			->map(function ($review) {
				return [
					'id' => $review->id,
					'reviewer' => optional($review->reviewer)->name ?? 'Unknown',
					'status' => $review->recommendation ?? 'Pending',
				];
			});

		$transformedPaper = [
			'id' => $paper->id,
			'title' => $paper->paper_title ?? ($paper->title ?? ''),
			'author' => optional($paper->user)->name ?? '',
			'track' => is_string($paper->topic)
				? $paper->topic
				: (is_array($paper->topic) ? ($paper->topic['name'] ?? '') : ''),
		];

		return Inertia::render('PaperDecision/Index', [
			'paper' => $transformedPaper,
			'reviews' => $reviews,
		]);
	}

	/**
	 * Accept (or finalize) a decision for a paper.
	 */
	public function accept(Request $request, $id)
	{
		$validated = $request->validate([
			'decision' => 'nullable|in:Accept,Reject,Revise',
			'comment' => 'nullable|string',
		]);

		$finalDecision = $validated['decision'] ?? 'Accept';

		Decision::updateOrCreate(
			['paper_id' => $id],
			[
				'organizer_id' => auth()->id(),
				'decision' => $finalDecision,
				'comment' => $validated['comment'] ?? null,
			]
		);

		$paper = Paper::findOrFail($id);
		$statusMap = [
			'Accept' => 'accepted',
			'Reject' => 'rejected',
			'Revise' => 'needs_revision',
		];
		$paper->status = $statusMap[$finalDecision] ?? $paper->status;
		$paper->save();

		return redirect()->route('paper-decisions.show', ['id' => $id])
			->with('success', 'Decision saved successfully.');
	}

	/**
	 * Reject a paper (helper that delegates to accept with Reject default).
	 */
	public function reject(Request $request, $id)
	{
		$request->merge(['decision' => 'Reject']);
		return $this->accept($request, $id);
	}
    /**
     * Display the decisions for papers
     */
    
    
}