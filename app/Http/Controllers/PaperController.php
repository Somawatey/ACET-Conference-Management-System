<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Paper;
use App\Models\User;


class PaperController extends Controller
{
    /**
     * Display a listing of papers
     */
    public function index()
    {
        $users = User::with('roles')->paginate(10)->appends(request()->query());
		
        $papers = Paper::with(['user', 'conference'])
						
                      ->orderBy('created_at', 'desc')
                      ->paginate(10);
        return Inertia::render('Papers/Index', [
            'users' => $users,
            'papers' => $papers,
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
        $paper = Paper::with(['author', 'submission', 'reviews', 'decision'])->findOrFail($id);
        
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
     * Display paper history for reviews
     */
    public function paperHistory()
    {
        // Build history rows from submissions to reflect actual submission events
    $histories = \App\Models\Submission::with(['paper.user', 'paper.decision', 'authorInfo', 'user'])
            ->orderByDesc('submitted_at')
            ->get()
            ->map(function ($s) {
                return [
                    'id' => $s->id,
                    'paper_id' => $s->paper_id,
                    'paper_title' => optional($s->paper)->paper_title ?? optional($s->paper)->title ?? '',
                    'author_name' => optional($s->authorInfo)->author_name ?? optional(optional($s->paper)->user)->name ?? '',
                    'corresponding_email' => optional($s->authorInfo)->correspond_email ?? optional($s->authorInfo)->author_email ?? '',
            'submitted_by' => optional($s->user)->name ?? '',
                    'created_at' => optional($s->created_at)->toDateTimeString() ?? optional($s->submitted_at)->toDateTimeString(),
            'status' => optional(optional($s->paper)->decision)->decision ?? optional($s->paper)->status ?? 'Pending',
                ];
            });

        return Inertia::render('PaperHistory/Index', [
            'histories' => $histories,
        ]);
    }

    /**
     * Display papers for decision making
     */
    public function decisions()
    {
        $papers = Paper::with(['user', 'conference', 'reviews.reviewer'])
                      ->whereHas('reviews', function($query) {
                          $query->whereNotNull('rating');
                      })
                      ->whereDoesntHave('decision')
                      ->orderBy('created_at', 'desc')
                      ->get();

        return Inertia::render('PaperDecision/Index', [
            'papers' => $papers
        ]);
    }

    /**
     * Show individual paper for decision making
     */
    public function showDecision($id)
    {
        $paper = Paper::with(['user', 'conference', 'reviews.reviewer'])
                     ->findOrFail($id);
        
        $reviews = $paper->reviews;

        return Inertia::render('PaperDecision/Show', [
            'paper' => $paper,
            'reviews' => $reviews
        ]);
    }
}