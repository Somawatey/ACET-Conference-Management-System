<?php

namespace App\Http\Controllers;
use Inertia\Response;

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
     * Display the decisions for papers
     */
    
    public function decisions(): Response
    {
        // For now, we will use sample data for the index page.
        $paper = (object)[
            'id' => 1, // Sample ID
            'title' => 'The Future of AI in Academic Research',
            'author' => 'Dr. Alex Ray',
            'track' => 'Artificial Intelligence',
        ];

        $reviews = [
            ['id' => 1, 'reviewer' => 'Panha', 'status' => 'Accept'],
            ['id' => 2, 'reviewer' => 'Ronaldo', 'status' => 'Reject'],
            ['id' => 3, 'reviewer' => 'Ngorl Ngorl', 'status' => 'Revise'],
        ];

        // Now, we pass the data to the correct component.
        return Inertia::render('PaperDecision/Index', [
            'paper' => $paper,
            'reviews' => $reviews,
        ]);
    }
    public function decisionShow($id): Response
    {
        // In a real app, you would find the specific paper by its $id
        // $paper = Paper::findOrFail($id);
        // $reviews = $paper->reviews;

        $paper = (object)[
            'id' => $id,
            'title' => 'The Future of AI in Academic Research',
            'author' => 'Dr. Alex Ray',
            'track' => 'Artificial Intelligence',
        ];

        $reviews = [
            ['id' => 1, 'reviewer' => 'Panha', 'status' => 'Accept'],
            ['id' => 2, 'reviewer' => 'Ronaldo', 'status' => 'Reject'],
            ['id' => 3, 'reviewer' => 'Ngorl Ngorl', 'status' => 'Revise'],
        ];

        // This renders the component for the 'show' page.
        // It's good to use a different component for this later.
        return Inertia::render('PaperDecision/ReviewedPaper', [
            'paper' => $paper,
            'reviews' => $reviews,
        ]);
    }
}