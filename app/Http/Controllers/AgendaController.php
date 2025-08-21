<?php

namespace App\Http\Controllers;

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
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        // Fetch all agenda items, ordered by date and start time
        $pagination = $request->input('pagination', 10);
        $totalAgendas = Agenda::count();

        $agendas = Agenda::with('conference') // <- This loads the conference data
            ->orderBy('id', 'asc')
            ->paginate($pagination);
        
        return Inertia::render('Agenda/Index', [
            'agendas' => $agendas,
        ]);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $papers = Paper::select('id', 'paper_title')->get();
        $conferences = Conference::select('id', 'conf_name')->get();
        $sessionValues = $this->getEnumValues('agendas', 'session');
        $typeValues = $this->getEnumValues('agendas', 'type');
        // dd($papers);
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
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => [
                'required',
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
                'required',
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
        $conferences = Conference::select('id', 'conf_name')->get();
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
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => [
                'required',
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
                'required',
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