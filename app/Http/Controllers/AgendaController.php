<?php

namespace App\Http\Controllers;

use App\Models\Agenda;
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
        $items = collect([
            ['id' => 1, 'title' => 'Opening Ceremony', 'description' => 'Welcome address and conference overview. Introduction of keynote speakers and conference agenda.', 'start_time' => '2025-09-15 09:00:00', 'end_time' => '2025-09-15 09:30:00', 'location' => 'Main Auditorium', 'speaker' => 'Dr. John Smith, Conference Chair'],
            ['id' => 2, 'title' => 'Keynote: Future of AI in Education', 'description' => 'Exploring how AI technologies are transforming educational practices and student learning experiences.', 'start_time' => '2025-09-15 09:30:00', 'end_time' => '2025-09-15 10:30:00', 'location' => 'Main Auditorium', 'speaker' => 'Prof. Sarah Johnson, MIT'],
            ['id' => 3, 'title' => 'Coffee Break', 'description' => 'Networking opportunity with refreshments.', 'start_time' => '2025-09-15 10:30:00', 'end_time' => '2025-09-15 11:00:00', 'location' => 'Conference Lobby', 'speaker' => null],
            ['id' => 4, 'title' => 'Panel: Digital Transformation', 'description' => 'Discussion on implementing digital technologies in university settings and overcoming challenges.', 'start_time' => '2025-09-15 11:00:00', 'end_time' => '2025-09-15 12:00:00', 'location' => 'Conference Hall A', 'speaker' => 'Multiple Panelists'],
            ['id' => 5, 'title' => 'Workshop: Modern Teaching', 'description' => 'Hands-on workshop covering interactive teaching techniques and student engagement strategies.', 'start_time' => '2025-09-15 11:00:00', 'end_time' => '2025-09-15 12:00:00', 'location' => 'Workshop Room B', 'speaker' => 'Dr. Emily Chen, Stanford'],
            ['id' => 6, 'title' => 'Lunch Break', 'description' => 'Catered lunch with networking opportunities.', 'start_time' => '2025-09-15 12:00:00', 'end_time' => '2025-09-15 13:00:00', 'location' => 'Dining Hall', 'speaker' => null],
            ['id' => 7, 'title' => 'Research Methodology in CS', 'description' => 'Advanced research techniques and best practices for conducting computer science research.', 'start_time' => '2025-09-15 13:00:00', 'end_time' => '2025-09-15 14:00:00', 'location' => 'Conference Hall A', 'speaker' => 'Dr. Michael Rodriguez, UCB'],
            ['id' => 8, 'title' => 'Poster Session', 'description' => 'Student and faculty poster presentations showcasing recent research findings.', 'start_time' => '2025-09-15 14:00:00', 'end_time' => '2025-09-15 15:00:00', 'location' => 'Exhibition Hall', 'speaker' => 'Various Presenters'],
            ['id' => 9, 'title' => 'Cybersecurity in Academia', 'description' => 'Addressing security challenges and implementing robust cybersecurity measures in educational environments.', 'start_time' => '2025-09-15 15:00:00', 'end_time' => '2025-09-15 16:00:00', 'location' => 'Conference Hall B', 'speaker' => 'Dr. Lisa Wang, Security Expert'],
            ['id' => 10, 'title' => 'Closing Ceremony & Awards', 'description' => 'Conference wrap-up, best paper awards, and closing remarks.', 'start_time' => '2025-09-15 16:00:00', 'end_time' => '2025-09-15 16:30:00', 'location' => 'Main Auditorium', 'speaker' => 'Conference Committee'],
            ['id' => 11, 'title' => 'AI Ethics Workshop', 'description' => 'Interactive session on ethical considerations in AI development and deployment.', 'start_time' => '2025-09-16 09:00:00', 'end_time' => '2025-09-16 10:30:00', 'location' => 'Workshop Room A', 'speaker' => 'Dr. Anna Williams, Ethics Lab'],
            ['id' => 12, 'title' => 'Machine Learning Demo', 'description' => 'Live demonstration of cutting-edge machine learning applications in education.', 'start_time' => '2025-09-16 11:00:00', 'end_time' => '2025-09-16 12:00:00', 'location' => 'Demo Lab', 'speaker' => 'Prof. Kevin Zhang, Tech Institute'],
            ['id' => 13, 'title' => 'Student Competition Finals', 'description' => 'Final presentations from student teams competing in the innovation challenge.', 'start_time' => '2025-09-16 13:00:00', 'end_time' => '2025-09-16 15:00:00', 'location' => 'Main Auditorium', 'speaker' => 'Student Teams'],
            ['id' => 14, 'title' => 'Industry Panel', 'description' => 'Representatives from leading tech companies discuss industry trends and career opportunities.', 'start_time' => '2025-09-16 15:30:00', 'end_time' => '2025-09-16 16:30:00', 'location' => 'Conference Hall A', 'speaker' => 'Industry Leaders'],
            ['id' => 15, 'title' => 'Networking Reception', 'description' => 'Evening reception with dinner and informal networking opportunities.', 'start_time' => '2025-09-16 18:00:00', 'end_time' => '2025-09-16 20:00:00', 'location' => 'Conference Center Terrace', 'speaker' => null],
        ]);

        $perPage = 15;
        $page = (int) ($request->get('page', 1));
        $paged = new LengthAwarePaginator(
            $items->forPage($page, $perPage)->values(),
            $items->count(),
            $perPage,
            $page,
            ['path' => $request->url(), 'query' => $request->query()]
        );

        return Inertia::render('Agenda/Index', [
            'agendas' => $paged,
        ]);
    }
  
    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Agenda/CreateEdit', [
            'datas' => null,
        ]);
    }
     
    /**
     * Display the specified resource.
     */
    public function show(Agenda $agenda)
    {
        
    }
  
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'location' => 'nullable|string|max:255',
            'speaker' => 'nullable|string|max:255',
        ]);

        // In a real implementation, you would save to database
        // Agenda::create($validated);

        return redirect()->route('agenda.index')
            ->with('success', 'Agenda item created successfully.');
    }
      
    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id): Response
    {
        // Find the item from mock data
        $agenda = collect([
            ['id' => 1, 'title' => 'Opening Ceremony', 'description' => 'Welcome address and conference overview. Introduction of keynote speakers and conference agenda.', 'start_time' => '2025-09-15 09:00:00', 'end_time' => '2025-09-15 09:30:00', 'location' => 'Main Auditorium', 'speaker' => 'Dr. John Smith, Conference Chair'],
            ['id' => 2, 'title' => 'Keynote: Future of AI in Education', 'description' => 'Exploring how AI technologies are transforming educational practices and student learning experiences.', 'start_time' => '2025-09-15 09:30:00', 'end_time' => '2025-09-15 10:30:00', 'location' => 'Main Auditorium', 'speaker' => 'Prof. Sarah Johnson, MIT'],
            // ... add more items as needed for editing
        ])->firstWhere('id', $id);
        
        return Inertia::render('Agenda/CreateEdit', [
            'datas' => $agenda,
        ]);
    }
    
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'location' => 'nullable|string|max:255',
            'speaker' => 'nullable|string|max:255',
        ]);

        // In a real implementation, you would update the database
        // $agenda = Agenda::findOrFail($id);
        // $agenda->update($validated);

        return redirect()->route('agenda.index')
            ->with('success', 'Agenda item updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // In a real implementation, you would delete from database
        // $agenda = Agenda::findOrFail($id);
        // $agenda->delete();

        return back()->with('message', 'Agenda item deleted successfully');
    }
}