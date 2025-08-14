<?php

namespace App\Http\Controllers;
use Inertia\Response;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Paper;

class PaperDecisionController extends Controller
{
    /**
     * Display the specified paper
     */
    public function showPaper($id)
    {
        $paper = Paper::with(['user', 'conference', 'reviews', 'decision'])->findOrFail($id);
        
        return Inertia::render('Papers/Show', [
            'paper' => $paper
        ]);
    }
    public function show(PaperDecision $paperDecision)
    {
        // This line checks the 'view' method in the PaperDecisionPolicy
        $this->authorize('view', $paperDecision);

        // ... rest of the method
    }
}