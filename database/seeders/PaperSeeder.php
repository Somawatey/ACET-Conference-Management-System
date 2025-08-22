<?php

namespace Database\Seeders;

use App\Models\Paper;
use App\Models\User;
use App\Models\Submission;
use App\Models\AuthorInfo;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class PaperSeeder extends Seeder
{
    /**
     * Seed authors and papers with only the allowed Paper attributes.
     */
    public function run(): void
    {
        DB::transaction(function () {
            // Create some authors first
            $author1 = User::firstOrCreate(
                ['email' => 'author1@example.com'],
                [
                    'name' => 'Dr. John Smith',
                    'password' => Hash::make('password123'),
                ]
            );

            $author2 = User::firstOrCreate(
                ['email' => 'author2@example.com'],
                [
                    'name' => 'Dr. Jane Doe',
                    'password' => Hash::make('password123'),
                ]
            );

            // Create author info
            $ai1 = AuthorInfo::firstOrCreate(
                ['author_name' => 'Dr. John Smith'],
                [
                    'author_email' => 'author1@example.com',
                    'institute' => 'Tech University',
                    'correspond_name' => 'Dr. John Smith',
                    'correspond_email' => 'author1@example.com',
                ]
            );

            $ai2 = AuthorInfo::firstOrCreate(
                ['author_name' => 'Dr. Jane Doe'],
                [
                    'author_email' => 'author2@example.com',
                    'institute' => 'Research Institute',
                    'correspond_name' => 'Dr. Jane Doe',
                    'correspond_email' => 'author2@example.com',
                ]
            );

            $topics = ['AI', 'ML', 'Data Science', 'Software Engineering', 'Computer Networks', 'Cybersecurity', 'Other'];
            $tracks = ['Research Track', 'Industry Track', 'Short Papers', 'Poster Session'];

            // Create papers
            $paper1 = Paper::firstOrCreate(
                ['paper_title' => 'Enhancing Edge AI Systems'],
                [
                    'url' => 'https://example.com/papers/edge-ai.pdf',
                    'topic' => $topics[array_rand($topics)],
                    'keyword' => 'edge, ai, optimization',
                    'abstract' => 'This paper explores optimization techniques for edge AI.',
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
        });
    }
}
