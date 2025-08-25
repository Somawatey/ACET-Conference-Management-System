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
            // Create sample users (authors)
            $author1 = User::firstOrCreate([
                'email' => 'author1@example.com'
            ], [
                'name' => 'Alice Author',
                'password' => bcrypt('password'),
            ]);
            $author2 = User::firstOrCreate([
                'email' => 'author2@example.com'
            ], [
                'name' => 'Bob Writer',
                'password' => bcrypt('password'),
            ]);

            // Create sample papers
            Paper::firstOrCreate([
                'title' => 'Enhancing Edge AI Systems',
            ], [
                'topic' => 'AI',
                'author_name' => $author1->name,
                'status' => 'pending',
                'abstract' => 'This paper explores optimization techniques for edge AI.',
                'keyword' => 'edge, ai, optimization',
                'user_id' => $author1->id,
            ]);

            Paper::firstOrCreate([
                'title' => 'Secure Federated Learning Framework',
            ], [
                'topic' => 'Cybersecurity',
                'author_name' => $author2->name,
                'status' => 'under_review',
                'abstract' => 'We propose a secure framework for federated learning.',
                'keyword' => 'federated, privacy, security',
                'user_id' => $author2->id,
            ]);
        });
    }
}
