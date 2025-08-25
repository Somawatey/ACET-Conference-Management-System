<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\PaperAssignment;
use App\Models\Paper;
use App\Models\User;

class PaperAssignmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get papers and users
        $papers = Paper::where('status', 'under_review')->get();
        $reviewers = User::role('Reviewer')->get();
        $admins = User::role('Admin')->get();

        if ($papers->isEmpty() || $reviewers->isEmpty() || $admins->isEmpty()) {
            $this->command->warn('Papers, Reviewers, or Admins not found. Please run PaperSeeder and UserSeeder first.');
            return;
        }

        // Create some sample assignments
        foreach ($papers as $paper) {
            // Assign 2-3 reviewers to each paper
            $numReviewers = rand(2, 3);
            $selectedReviewers = $reviewers->random($numReviewers);
            
            foreach ($selectedReviewers as $reviewer) {
                PaperAssignment::create([
                    'paper_id' => $paper->id,
                    'reviewer_id' => $reviewer->id,
                    'assigned_by' => $admins->random()->id,
                    'status' => 'assigned',
                    'deadline' => now()->addDays(rand(7, 21)),
                    'notes' => 'Please provide a thorough review focusing on technical accuracy and contribution to the field.',
                ]);
            }
        }

        $this->command->info('Paper assignments seeded successfully!');
    }
}
