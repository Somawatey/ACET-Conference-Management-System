<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Paper;

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
     * Display paper history for reviews
     */
    public function paperHistory()
    {
        $papers = Paper::with(['user', 'conference', 'reviews.reviewer'])
                      ->orderBy('created_at', 'desc')
                      ->get();

        return Inertia::render('PaperHistory/Index', [
            'papers' => $papers
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