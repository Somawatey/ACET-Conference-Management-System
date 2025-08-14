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
}