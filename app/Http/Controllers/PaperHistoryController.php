<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PaperHistory;

class PaperHistoryController extends Controller
{
    // Display a listing of the paper history
    public function index()
    {
        $histories = PaperHistory::all();
        return response()->json($histories);
    }

    // Store a newly created paper history
    public function store(Request $request)
    {
        $history = PaperHistory::create($request->all());
        return response()->json($history, 201);
    }

    // Display the specified paper history
    public function show($id)
    {
        $history = PaperHistory::findOrFail($id);
        return response()->json($history);
    }

    // Update the specified paper history
    public function update(Request $request, $id)
    {
        $history = PaperHistory::findOrFail($id);
        $history->update($request->all());
        return response()->json($history);
    }

    // Remove the specified paper history
    public function destroy($id)
    {
        $history = PaperHistory::findOrFail($id);
        $history->delete();
        return response()->json(null,204);
    }
}