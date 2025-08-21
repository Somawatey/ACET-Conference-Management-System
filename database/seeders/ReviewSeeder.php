<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\Conference;
use App\Models\AuthorInfo;
use App\Models\Paper;
use App\Models\Submission;
use App\Models\Review;

class ReviewSeeder extends Seeder
{
    /**
     * Seed the application's database with sample review history.
     */
    public function run(): void
    {
        DB::transaction(function () {
            // Ensure we have at least 3 users: 1 admin (as reviewer) and 2 authors
            $admin = User::firstOrCreate(
                ['email' => 'admin@gmail.com'],
                [
                    'name' => 'admin',
                    'password' => Hash::make('123456'),
                ]
            );

            $author1 = User::firstOrCreate(
                ['email' => 'author1@example.com'],
                [
                    'name' => 'Author One',
                    'password' => Hash::make('password'),
                ]
            );

            $author2 = User::firstOrCreate(
                ['email' => 'author2@example.com'],
                [
                    'name' => 'Author Two',
                    'password' => Hash::make('password'),
                ]
            );

            // Create a conference if none
            $conference = Conference::firstOrCreate(
                ['conf_name' => 'ACET 2025'],
                [
                    'topic' => 'Technology',
                    'date' => now()->toDateString(),
                    'location' => 'Phnom Penh',
                ]
            );

            // Author infos
            $ai1 = AuthorInfo::firstOrCreate(
                ['author_email' => 'author1@example.com'],
                [
                    'author_name' => 'Author One',
                    'institute' => 'CADT',
                    'correspond_name' => 'Author One',
                    'correspond_email' => 'author1@example.com',
                    'coauthors' => 'Co Author A; Co Author B',
                ]
            );

            $ai2 = AuthorInfo::firstOrCreate(
                ['author_email' => 'author2@example.com'],
                [
                    'author_name' => 'Author Two',
                    'institute' => 'CADT',
                    'correspond_name' => 'Author Two',
                    'correspond_email' => 'author2@example.com',
                    'coauthors' => 'Co Author C',
                ]
            );

            $topics = ['AI', 'ML', 'Data Science', 'Software Engineering', 'Computer Networks', 'Cybersecurity', 'Other'];
            $tracks = ['Research', 'Industry', 'Student'];
            $recs = ['Accept', 'Revise', 'Reject'];

            // Create two papers and their submissions
            $paper1 = Paper::firstOrCreate(
                ['paper_title' => 'Enhancing Edge AI Systems'],
                [
                    'url' => 'https://example.com/papers/edge-ai.pdf',
                    'topic' => $topics[array_rand($topics)],
                    'keyword' => 'edge, ai, optimization',
                    'abstract' => 'This paper explores optimization techniques for edge AI.',
                    'user_id' => $author1->id,
                    'conference_id' => $conference->id,
                    'status' => 'under_review',
                ]
            );

            Submission::firstOrCreate(
                ['paper_id' => $paper1->id],
                [
                    'user_id' => $author1->id,
                    'author_info_id' => $ai1->id,
                    'track' => $tracks[array_rand($tracks)],
                    'submitted_elsewhere' => false,
                    'original_submission' => true,
                    'submitted_at' => now()->subDays(15),
                ]
            );

            $paper2 = Paper::firstOrCreate(
                ['paper_title' => 'Secure Federated Learning Framework'],
                [
                    'url' => 'https://example.com/papers/federated-learning.pdf',
                    'topic' => $topics[array_rand($topics)],
                    'keyword' => 'federated, privacy, security',
                    'abstract' => 'We propose a secure framework for federated learning.',
                    'user_id' => $author2->id,
                    'conference_id' => $conference->id,
                    'status' => 'under_review',
                ]
            );

            Submission::firstOrCreate(
                ['paper_id' => $paper2->id],
                [
                    'user_id' => $author2->id,
                    'author_info_id' => $ai2->id,
                    'track' => $tracks[array_rand($tracks)],
                    'submitted_elsewhere' => false,
                    'original_submission' => true,
                    'submitted_at' => now()->subDays(10),
                ]
            );

            // Seed reviews for review history page
            $reviewsData = [
                [
                    'paper_id' => $paper1->id,
                    'reviewer_id' => $admin->id,
                    'recommendation' => $recs[array_rand($recs)],
                    'feedback' => 'Well-written. Consider expanding experimental section.',
                    'score' => rand(6, 10),
                    'created_at' => now()->subDays(7),
                    'updated_at' => now()->subDays(7),
                ],
                [
                    'paper_id' => $paper1->id,
                    'reviewer_id' => $admin->id,
                    'recommendation' => $recs[array_rand($recs)],
                    'feedback' => 'Strong contribution to edge computing community.',
                    'score' => rand(7, 10),
                    'created_at' => now()->subDays(3),
                    'updated_at' => now()->subDays(3),
                ],
                [
                    'paper_id' => $paper2->id,
                    'reviewer_id' => $admin->id,
                    'recommendation' => $recs[array_rand($recs)],
                    'feedback' => 'Privacy implications discussed, add more benchmarks.',
                    'score' => rand(5, 9),
                    'created_at' => now()->subDays(5),
                    'updated_at' => now()->subDays(5),
                ],
                [
                    'paper_id' => $paper2->id,
                    'reviewer_id' => $admin->id,
                    'recommendation' => $recs[array_rand($recs)],
                    'feedback' => 'Solid methodology but needs clarity in threat model.',
                    'score' => rand(5, 9),
                    'created_at' => now()->subDays(2),
                    'updated_at' => now()->subDays(2),
                ],
            ];

            foreach ($reviewsData as $data) {
                Review::create($data);
            }
        });
    }
}
