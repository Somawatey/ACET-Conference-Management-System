<?php

namespace App\Http\Controllers;

use App\Models\Agenda;
use App\Models\Conference;
use App\Models\Paper;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller 
{
    /** 
     * Display the list of resource
     */
    public function index()
    {
        $totalConferences = Conference::count();
        $totalPapers = Paper::count();
        $totalSpeakers = Agenda::count();
        $totalUsers = DB::table('users')->count();
        
        // User role counts
        $totalOrganizers = User::role('Admin')->count();
        $totalReviewers = User::role('Reviewer')->count();
        $totalAttendees = User::role('Attendees')->count();
        $totalAuthors   = User::role('Author')->count();

        $papersByTopic = Paper::select('topic', DB::raw('count(*) as total'))
            ->groupBy('topic')
            ->get();
        // Recent Papers
        $recentPapers = Paper::latest()->take(5)->get(['id','paper_title','created_at'])
            ->map(function ($paper) {
                return [
                    'type' => 'paper_submitted',
                    'message' => "Paper submitted: {$paper->paper_title}",
                    'created_at' => $paper->created_at,
                ];
            });
        
        // 🔹 Recent Activities
        $recentUsers = User::latest()->take(5)->get(['id','name','created_at'])
            ->map(function ($user) {
                return [
                    'type' => 'registration',
                    'message' => "{$user->name} registered",
                    'created_at' => $user->created_at,
                ];
            });
        
        return Inertia::render('Dashboard', [
            'totalConferences' => $totalConferences,
            'totalPapers' => $totalPapers,
            'totalSpeakers' => $totalSpeakers,
            'totalUsers' => $totalUsers,
            
            'totalOrganizers' => $totalOrganizers,
            'totalReviewers' => $totalReviewers,
            'totalAttendees' => $totalAttendees,
            'totalAuthors' => $totalAuthors,

            'papersByTopic' => $papersByTopic,
            'recentPapers' => $recentPapers,
            'recentUsers' => $recentUsers
        ]);
    }
}
