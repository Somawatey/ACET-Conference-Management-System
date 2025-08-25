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
        
        // User role counts - with safety checks
        $totalOrganizers = $this->getUserRoleCount('Admin');
        $totalReviewers = $this->getUserRoleCount('Reviewer');
        $totalAttendees = $this->getUserRoleCount('Attendees');
        $totalAuthors = $this->getUserRoleCount('Author');

        $papersByTopic = Paper::select('topic', DB::raw('count(*) as total'))
            ->groupBy('topic')
            ->get();

        // ✅ NEW: Paper status data for bar chart
        $paperStatusData = $this->getPaperStatusData();
        
        // ✅ NEW: Monthly data for line chart
        $monthlyData = $this->getMonthlyData();
        
        // Recent Papers
        $recentPapers = Paper::latest()->take(5)->get(['id','paper_title','created_at'])
            ->map(function ($paper) {
                return [
                    'type' => 'paper_submitted',
                    'message' => "Paper submitted: {$paper->paper_title}",
                    'created_at' => $paper->created_at,
                ];
            });
        
        // Recent Activities
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
            'recentUsers' => $recentUsers,
            
            // ✅ NEW: Chart data
            'paperStatusData' => $paperStatusData,
            'monthlyData' => $monthlyData,
        ]);
    }
    
    /**
     * Get paper status data for bar chart
     */
    private function getPaperStatusData()
    {
        // Get paper counts by status
        $paperStatuses = Paper::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();
        
        // Ensure we have all statuses even if count is 0
        $statuses = ['pending', 'accepted', 'rejected', 'under_review'];
        $data = [];
        $labels = [];
        
        foreach ($statuses as $status) {
            $count = $paperStatuses[$status] ?? 0;
            if ($count > 0 || in_array($status, ['accepted', 'rejected'])) { // Always show accepted/rejected
                $labels[] = ucfirst(str_replace('_', ' ', $status));
                $data[] = $count;
            }
        }
        
        // If no status data exists, create sample data based on topics
        if (empty($data)) {
            $topicData = Paper::select('topic', DB::raw('count(*) as count'))
                ->groupBy('topic')
                ->pluck('count', 'topic')
                ->toArray();
            
            if (!empty($topicData)) {
                $labels = array_keys($topicData);
                $data = array_values($topicData);
            } else {
                // Fallback data
                $labels = ['Pending', 'Accepted', 'Rejected'];
                $data = [0, 0, 0];
            }
        }
        
        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Paper Count',
                    'data' => $data,
                    'backgroundColor' => [
                        'rgba(251, 191, 36, 0.8)',  // Yellow for pending
                        'rgba(34, 197, 94, 0.8)',   // Green for accepted
                        'rgba(239, 68, 68, 0.8)',   // Red for rejected
                        'rgba(99, 102, 241, 0.8)',  // Blue for under review
                    ],
                    'borderColor' => [
                        'rgb(251, 191, 36)',
                        'rgb(34, 197, 94)',
                        'rgb(239, 68, 68)',
                        'rgb(99, 102, 241)',
                    ],
                    'borderWidth' => 1
                ]
            ]
        ];
    }
    
    /**
     * Get monthly submission data for line chart
     */
    private function getMonthlyData()
    {
        $months = [];
        $paperData = [];
        $userData = [];
        
        // Get last 6 months of data
        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $months[] = $date->format('M Y');
            
            // Count papers for this month
            $paperCount = Paper::whereYear('created_at', $date->year)
                              ->whereMonth('created_at', $date->month)
                              ->count();
            $paperData[] = $paperCount;
            
            // Count users for this month
            $userCount = User::whereYear('created_at', $date->year)
                            ->whereMonth('created_at', $date->month)
                            ->count();
            $userData[] = $userCount;
        }
        
        return [
            'labels' => $months,
            'datasets' => [
                [
                    'label' => 'Paper Submissions',
                    'data' => $paperData,
                    'fill' => true,
                    'backgroundColor' => 'rgba(59, 130, 246, 0.2)',
                    'borderColor' => 'rgb(59, 130, 246)',
                    'tension' => 0.4,
                ],
                [
                    'label' => 'User Registrations',
                    'data' => $userData,
                    'fill' => true,
                    'backgroundColor' => 'rgba(16, 185, 129, 0.2)',
                    'borderColor' => 'rgb(16, 185, 129)',
                    'tension' => 0.4,
                ]
            ]
        ];
    }
    
    /**
     * Safely get user role count
     */
    private function getUserRoleCount($roleName)
    {
        try {
            return User::role($roleName)->count();
        } catch (\Exception $e) {
            // Role doesn't exist, return 0
            return 0;
        }
    }
}
