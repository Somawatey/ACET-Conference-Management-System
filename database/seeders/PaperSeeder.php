<?php

namespace Database\Seeders;

use App\Models\Paper;
use App\Models\User;
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
            // Ensure base authors exist

            $topics = ['AI', 'ML', 'Data Science', 'Software Engineering', 'Computer Networks', 'Cybersecurity', 'Other'];

            // Papers (only the specified attributes)
            Paper::firstOrCreate(
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

            // $paper2 = Paper::firstOrCreate(
            // Paper::firstOrCreate(
            //     ['paper_title' => 'Secure Federated Learning Framework'],
            //     [
            //         'url' => 'https://example.com/papers/federated-learning.pdf',
            //         'topic' => $topics[array_rand($topics)],
            //         'keyword' => 'federated, privacy, security',
            //         'abstract' => 'We propose a secure framework for federated learning.',
            //         'user_id' => $author2->id,
            //         'conference_id' => $conference->id,
            //         'status' => 'under_review',
            //     ]
            // );

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
