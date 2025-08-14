<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Paper;
use App\Models\User;
use App\Models\Category;

class PaperSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get some users and categories for seeding
        $users = User::all();

        if ($users->isEmpty()) {
            $this->command->warn('Users or Categories not found. Please run UserSeeder and CategorySeeder first.');
            return;
        }

        $papers = [
            [
                'title' => 'AI for Healthcare: A Comprehensive Review',
                'abstract' => 'This paper presents a comprehensive review of artificial intelligence applications in healthcare, covering diagnosis, treatment planning, and patient care.',
                'status' => 'submitted',
                'submission_date' => now()->subDays(5),
            ],
            [
                'title' => 'Quantum Computing Advances in Cryptography',
                'abstract' => 'Exploring the latest developments in quantum computing and their implications for cryptographic security systems.',
                'status' => 'submitted',
                'submission_date' => now()->subDays(3),
            ],
            [
                'title' => 'Natural Language Processing for Low-Resource Languages',
                'abstract' => 'Novel approaches to NLP challenges in languages with limited digital resources and training data.',
                'status' => 'under_review',
                'submission_date' => now()->subDays(10),
            ],
            [
                'title' => 'Ethics in Artificial Intelligence: A Framework',
                'abstract' => 'A comprehensive framework for addressing ethical considerations in AI development and deployment.',
                'status' => 'submitted',
                'submission_date' => now()->subDays(2),
            ],
            [
                'title' => 'Computer Vision Applications in Autonomous Robotics',
                'abstract' => 'Advanced computer vision techniques for improving autonomous robot navigation and object recognition.',
                'status' => 'submitted',
                'submission_date' => now()->subDays(7),
            ],
        ];

        foreach ($papers as $paperData) {
            Paper::create([
                'title' => $paperData['title'],
                'abstract' => $paperData['abstract'],
                'status' => $paperData['status'],
                'author_id' => $users->random()->id,
                'submission_date' => $paperData['submission_date'],
                'review_deadline' => now()->addDays(30),
            ]);
        }

        $this->command->info('Papers seeded successfully!');
    }
}
