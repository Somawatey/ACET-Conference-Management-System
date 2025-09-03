<?php

namespace App\Http\Controllers;

use App\Models\Conference;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConferenceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $conferences = Conference::orderBy('start_date', 'desc') // Changed from 'date' to 'start_date'
            ->paginate(10);

        return Inertia::render('Conferences/Index', [
            'conferences' => $conferences
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Conferences/CreateEdit');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
        'conf_name' => 'required|string|max:255',
        'topic' => 'required|string|max:255',
        'start_date' => 'required|date|after_or_equal:today',
        'end_date' => 'required|date|after_or_equal:start_date',
        'location' => 'required|string|max:255',
    ]);

    Conference::create($validated);

    return redirect()->route('conferences.index')
        ->with('success', 'Conference created successfully.');
}

    /**
     * Display the specified resource.
     */
    public function show(Conference $conference)
    {
        return Inertia::render('Conferences/Show', [
            'conference' => $conference
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Conference $conference)
    {
        return Inertia::render('Conferences/CreateEdit', [
            'conference' => $conference
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Conference $conference)
    {
        $validated = $request->validate([
        'conf_name' => 'required|string|max:255',
        'topic' => 'required|string|max:255',
        'start_date' => 'required|date',
        'end_date' => 'required|date|after_or_equal:start_date',
        'location' => 'required|string|max:255',
    ]);

    $conference->update($validated);

    return redirect()->route('conferences.index')
        ->with('success', 'Conference updated successfully.');
}

/**
 * Remove the specified resource from storage.
 */
public function destroy(Conference $conference)
{
        $conference->delete();

        return redirect()->route('conferences.index')
            ->with('success', 'Conference deleted successfully.');
    }
}