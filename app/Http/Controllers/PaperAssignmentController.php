<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Paper;
use App\Models\User;
use App\Models\PaperAssignment;

class PaperAssignmentController extends Controller
{
    /**
     * Display a listing of paper assignments
     */
    public function index()
    {
        $assignments = PaperAssignment::with(['paper', 'reviewer', 'assignedBy'])
                                    ->orderBy('created_at', 'desc')
                                    ->paginate(10);

        return Inertia::render('PaperAssignments/Index', [
            'assignments' => $assignments
        ]);
    }

    /**
     * Show the form for creating a new assignment
     */
    public function create()
    {
        $papers = Paper::with('user')->get();
        $reviewers = User::role('Reviewer')->get(); // Assuming you have reviewer role

        return Inertia::render('PaperAssignments/Create', [
            'papers' => $papers,
            'reviewers' => $reviewers
        ]);
    }

    /**
     * Store a newly created assignment
     */
    public function store(Request $request)
    {
        $request->validate([
            'paper_id' => 'required|exists:papers,id',
            'reviewer_id' => 'required|exists:users,id',
            'due_date' => 'required|date|after:today',
        ]);

        PaperAssignment::create([
            'paper_id' => $request->paper_id,
            'reviewer_id' => $request->reviewer_id,
            'assigned_by' => auth()->id(),
            'due_date' => $request->due_date,
            'status' => 'pending'
        ]);

        return redirect()->route('paper-assignments.index')
                        ->with('success', 'Paper assigned successfully.');
    }

    /**
     * Display the specified assignment
     */
    public function show($id)
    {
        $assignment = PaperAssignment::with(['paper', 'reviewer', 'assignedBy'])
                                   ->findOrFail($id);

        return Inertia::render('PaperAssignments/Show', [
            'assignment' => $assignment
        ]);
    }

    /**
     * Show the form for editing the specified assignment
     */
    public function edit($id)
    {
        $assignment = PaperAssignment::with(['paper', 'reviewer'])
                                   ->findOrFail($id);
        $papers = Paper::with('user')->get();
        $reviewers = User::role('Reviewer')->get();

        return Inertia::render('PaperAssignments/Edit', [
            'assignment' => $assignment,
            'papers' => $papers,
            'reviewers' => $reviewers
        ]);
    }

    /**
     * Update the specified assignment
     */
    public function update(Request $request, $id)
    {
        $assignment = PaperAssignment::findOrFail($id);

        $request->validate([
            'paper_id' => 'required|exists:papers,id',
            'reviewer_id' => 'required|exists:users,id',
            'due_date' => 'required|date',
            'status' => 'required|in:pending,in_progress,completed,cancelled'
        ]);

        $assignment->update($request->all());

        return redirect()->route('paper-assignments.index')
                        ->with('success', 'Assignment updated successfully.');
    }

    /**
     * Remove the specified assignment
     */
    public function destroy($id)
    {
        $assignment = PaperAssignment::findOrFail($id);
        $assignment->delete();

        return redirect()->route('paper-assignments.index')
                        ->with('success', 'Assignment deleted successfully.');
    }
}