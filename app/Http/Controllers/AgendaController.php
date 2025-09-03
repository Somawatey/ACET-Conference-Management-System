<?php

namespace App\Http\Controllers;

use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Agenda;
use App\Models\Paper;
use App\Models\Conference;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Validation\Rule;

class AgendaController extends Controller
{
    /**
     * Download agenda as PDF.
     */
    public function downloadAgenda() {

    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $pagination = $request->input('pagination', 10);
        $totalAgendas = Agenda::count();

        $agendas = Agenda::with('conference') // <- This loads the conference data
            ->orderBy('id', 'asc')
            ->paginate($pagination);
        $sortBy = $request->input('sort_by', 'date'); // Default sort by date
        $sortOrder = $request->input('sort_order', 'asc'); // Default ascending
        $filterId = $request->input('filter_id'); // Filter by ID
        $search = $request->input('search'); // General search

        $query = Agenda::with('conference', 'paper');

        // Filter by ID if provided
        if ($filterId) {
            $query->where('id', $filterId);
        }
        
        // General search in title, speaker, location
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('speaker', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%");
            });
        }
        
        // Apply sorting
        switch ($sortBy) {
            case 'id':
                $query->orderBy('id', $sortOrder);
                break;
            case 'title':
                $query->orderBy('title', $sortOrder);
                break;
            case 'date':
                $query->orderBy('date', $sortOrder)
                    ->orderBy('start_time', $sortOrder);
                break;
            case 'speaker':
                $query->orderBy('speaker', $sortOrder);
                break;
            default:
                $query->orderBy('date', 'asc')
                    ->orderBy('start_time', 'asc');
        }
        
        $agendas = $query->paginate($pagination);
        
        return Inertia::render('Agenda/Index', [
            'agendas' => $agendas,
            'filters' => [
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
                'filter_id' => $filterId,
                'search' => $search,
                'pagination' => $pagination,
            ]
        ]);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $papers = Paper::select('id', 'paper_title')->get();
        
        // FIXED: Include the date fields that the frontend needs
        $conferences = Conference::select([
            'id', 
            'conf_name',
            'start_date',     // Add this field
            'end_date',       // Add this field
            'topic',          // Optional: for more context
            'location'        // Optional: for more context
        ])->get();
        
        $sessionValues = $this->getEnumValues('agendas', 'session');
        $typeValues = $this->getEnumValues('agendas', 'type');
        
        return Inertia::render('Agenda/CreateEdit', [
            'papers' => $papers,
            'conferences' => $conferences,
            'session' => $sessionValues,
            'type' => $typeValues,
        ]);
    }
    /**
     * Helper function to get enum values from database
     */
    private function getEnumValues($table, $column)
    {
        $schema = \DB::select("SHOW COLUMNS FROM {$table} WHERE Field = '{$column}'");
        
        if (!empty($schema)) {
            $enumStr = $schema[0]->Type;
            
            // Extract enum values: enum('value1','value2','value3')
            preg_match_all("/'([^']+)'/", $enumStr, $matches);
            
            return $matches[1];
        }
        
        return [];
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'conference_id' => 'required|integer|exists:conferences,id',
            'paper_id' => 'nullable|integer|exists:papers,id',  // Changed to nullable
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => [
                'nullable',
                Rule::in(['session', 'keynote', 'break', 'lunch', 'networking', 'workshop']),
            ],
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'location' => 'nullable|string|max:255',
            'speaker' => 'nullable|string|max:255',
            'order_index' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
            'session' => [
                'nullable',  // Changed to nullable
                Rule::in(['morning', 'afternoon', 'evening']),
            ],
        ]);

        Agenda::create($validated);

        return redirect()->route('agenda.index')
            ->with('success', 'Agenda item created successfully.');
    }
    /**
     * Display the specified resource.
     */
    public function show(Agenda $agenda)
    {
        
    }
    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id): Response
    {
        $agenda = Agenda::findOrFail($id);
        $papers = Paper::select('id', 'paper_title')->get();
        
        // FIXED: Include the date fields that the frontend needs
        $conferences = Conference::select([
            'id', 
            'conf_name',
            'start_date',     // Add this field
            'end_date',       // Add this field
            'topic',          // Optional: for more context
            'location'        // Optional: for more context
        ])->get();
        
        // Get enum values directly from database schema
        $sessionValues = $this->getEnumValues('agendas', 'session');
        $typeValues = $this->getEnumValues('agendas', 'type');
        
        return Inertia::render('Agenda/CreateEdit', [
            'datas' => $agenda,
            'papers' => $papers,
            'conferences' => $conferences,
            'session' => $sessionValues,
            'type' => $typeValues,
        ]);
    }
    
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $agenda = Agenda::findOrFail($id);
        $validated = $request->validate([
            'conference_id' => 'required|integer|exists:conferences,id',
            'paper_id' => 'nullable|integer|exists:papers,id',  // Changed to nullable
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => [
                'nullable',
                Rule::in(['session', 'keynote', 'break', 'lunch', 'networking', 'workshop']),
            ],
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'location' => 'nullable|string|max:255',
            'speaker' => 'nullable|string|max:255',
            'order_index' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
            'session' => [
                'nullable',  // Changed to nullable
                Rule::in(['morning', 'afternoon', 'evening']),
            ],
        ]);
        
        $agenda->update($validated);
        return redirect()->route('agenda.index')
            ->with('success', 'Agenda item updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy( $id)
    {
        $agenda = Agenda::findOrFail($id);
        $agenda->delete();

        return back()->with('message', 'Agenda item deleted successfully');
    }
}