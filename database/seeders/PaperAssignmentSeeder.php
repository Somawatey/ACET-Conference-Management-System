<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\PaperAssignment;
use App\Models\Paper;
use App\Models\User;
use Carbon\Carbon;

class PaperAssignmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get papers and users
        $papers = Paper::all();
        $users = User::all();
        
        if ($papers->isEmpty() || $users->count() < 3) {
            $this->command->warn('Not enough papers or users found. Please run PaperSeeder and UserSeeder first.');
            return;
        }

        // Get admin user (or first user as fallback for assigned_by)
        $admin = User::where('email', 'admin@gmail.com')->first() ?? $users->first();
        
        // Get potential reviewers (exclude admin if possible, or use all users)
        $reviewers = $users->where('id', '!=', $admin->id);
        if ($reviewers->isEmpty()) {
            $reviewers = $users; // Fallback to all users if only admin exists
        }

        $statuses = ['pending', 'in_progress', 'completed', 'cancelled'];
        $notes = [
            'Please provide a thorough review focusing on technical accuracy and contribution to the field.',
            'Focus on methodology and experimental design.',
            'Review for clarity, originality, and significance.',
            'Evaluate the literature review and related work section.',
            'Assess the conclusions and their support by the data.',
        ];

        // Create assignments for each paper
        foreach ($papers as $paper) {
            // Assign 2-3 reviewers to each paper (or fewer if not enough users)
            $numReviewers = min(rand(2, 3), $reviewers->count());
            $selectedReviewers = $reviewers->random($numReviewers);
            
            foreach ($selectedReviewers as $reviewer) {
                // Check if assignment already exists to avoid duplicates
                $existingAssignment = PaperAssignment::where('paper_id', $paper->id)
                    ->where('reviewer_id', $reviewer->id)
                    ->first();
                    
                if (!$existingAssignment) {
                    PaperAssignment::create([
                        'paper_id' => $paper->id,
                        'reviewer_id' => $reviewer->id,
                        'assigned_by' => $admin->id,
                        'due_date' => Carbon::now()->addDays(rand(7, 30))->format('Y-m-d'),
                        'status' => $statuses[array_rand($statuses)],
                        'notes' => $notes[array_rand($notes)],
                    ]);
                }
            }
        }

        $this->command->info('Paper assignments seeded successfully!');
    }
}
