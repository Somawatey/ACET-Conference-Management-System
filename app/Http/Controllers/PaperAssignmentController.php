<?php

namespace App\Http\Controllers;

use App\Models\Paper;
use App\Models\PaperAssignment;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaperAssignmentController extends Controller
{
    public function index(): Response
    {
        $papers = Paper::with(['author', 'category', 'assignments.reviewer'])
            ->where('status', 'submitted')
            ->orWhere('status', 'under_review')
            ->paginate(10);

        $reviewers = User::role('Reviewer')->get(['id', 'name', 'email']);

        return Inertia::render('Paper/AssignPaper', [
            'papers' => $papers,
            'reviewers' => $reviewers,
        ]);
    }

    public function assign(Request $request)
    {
        $validated = $request->validate([
            'paper_id' => 'required|exists:papers,id',
            'reviewer_ids' => 'required|array|min:1',
            'reviewer_ids.*' => 'exists:users,id',
            'deadline' => 'required|date|after:today',
            'notes' => 'nullable|string|max:500',
        ]);

        $assignments = [];
        foreach ($validated['reviewer_ids'] as $reviewerId) {
            // Check if assignment already exists
            $existingAssignment = PaperAssignment::where('paper_id', $validated['paper_id'])
                ->where('reviewer_id', $reviewerId)
                ->first();

            if (!$existingAssignment) {
                $assignment = PaperAssignment::create([
                    'paper_id' => $validated['paper_id'],
                    'reviewer_id' => $reviewerId,
                    'assigned_by' => auth()->id(),
                    'deadline' => $validated['deadline'],
                    'notes' => $validated['notes'],
                    'status' => 'assigned',
                ]);

                $assignments[] = $assignment;
            }
        }

        // Update paper status to under_review if it was submitted
        $paper = Paper::find($validated['paper_id']);
        if ($paper && $paper->status === 'submitted') {
            $paper->update(['status' => 'under_review']);
        }

        return back()->with('success', 'Papers assigned successfully to ' . count($assignments) . ' reviewer(s)');
    }

    public function unassign(Request $request)
    {
        $validated = $request->validate([
            'assignment_id' => 'required|exists:paper_assignments,id',
        ]);

        $assignment = PaperAssignment::find($validated['assignment_id']);
        $assignment->delete();

        // Check if paper has any remaining assignments
        $remainingAssignments = PaperAssignment::where('paper_id', $assignment->paper_id)->count();
        if ($remainingAssignments === 0) {
            $paper = Paper::find($assignment->paper_id);
            if ($paper && $paper->status === 'under_review') {
                $paper->update(['status' => 'submitted']);
            }
        }

        return back()->with('success', 'Reviewer unassigned successfully');
    }

    public function getAssignments($paperId)
    {
        $assignments = PaperAssignment::with(['reviewer', 'assignedBy'])
            ->where('paper_id', $paperId)
            ->get();

        return response()->json($assignments);
    }
}
