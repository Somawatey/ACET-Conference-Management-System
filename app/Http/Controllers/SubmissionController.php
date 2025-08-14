<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class SubmissionController extends Controller
{
    /**
     * Show the submission form
     */
    public function create()
    {
        return Inertia::render('Submission/Submit');
    }

    /**
     * Store a new submission
     */
    public function store(Request $request)
    {
        // For now, just return a success message
        return redirect()->back()->with('success', 'Submission received!');
    }

    /**
     * Show user's submissions
     */
    public function index()
    {
        return Inertia::render('Submission/Index', [
            'submissions' => []
        ]);
    }

    /**
     * Show specific submission
     */
    public function show($id)
    {
        return Inertia::render('Submission/Show', [
            'submission' => []
        ]);
    }

    /**
     * Show edit form
     */
    public function edit($id)
    {
        return Inertia::render('Submission/Edit');
    }

    /**
     * Update submission
     */
    public function update(Request $request, $id)
    {
        return redirect()->back()->with('success', 'Submission updated!');
    }

    /**
     * Delete submission
     */
    public function destroy($id)
    {
        return redirect()->route('submissions.index')->with('success', 'Submission deleted!');
    }
}