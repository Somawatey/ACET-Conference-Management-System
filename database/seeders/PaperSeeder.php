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

            $topics = ['AI', 'ML', 'Data Science', 'Software Engineering', 'Computer Networks', 'Cybersecurity', 'Other'];

            // Papers (only the specified attributes)
            Paper::firstOrCreate(
                ['paper_title' => 'Enhancing Edge AI Systems'],
                [
                    'url' => 'https://example.com/papers/edge-ai.pdf',
                    'topic' => $topics[array_rand($topics)],
                    'keyword' => 'edge, ai, optimization',
                    'abstract' => 'This paper explores optimization techniques for edge AI.',
                    'author_id' => $author1->id,
                ]
            );

            Paper::firstOrCreate(
                ['paper_title' => 'Secure Federated Learning Framework'],
                [
                    'url' => 'https://example.com/papers/federated-learning.pdf',
                    'topic' => $topics[array_rand($topics)],
                    'keyword' => 'federated, privacy, security',
                    'abstract' => 'We propose a secure framework for federated learning.',
                    'author_id' => $author2->id,
                ]
            );
        });
    }
}