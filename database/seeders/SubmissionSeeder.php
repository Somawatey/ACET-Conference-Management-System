<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Paper;
use App\Models\AuthorInfo;
use App\Models\Submission;
use App\Models\Conference;

class SubmissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // First, let's make sure we have a conference
        $conference = Conference::firstOrCreate([
            'conf_name' => 'ACET 2024 Conference',
            'topic' => 'Educational Technology and Innovation',
            'date' => '2024-12-01',
            'location' => 'Virtual Conference',
        ]);

        // Create some additional users (authors)
        $user1 = User::firstOrCreate(
            ['email' => 'author1@example.com'],
            [
                'name' => 'Dr. John Smith',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );

        $user2 = User::firstOrCreate(
            ['email' => 'author2@example.com'],
            [
                'name' => 'Dr. Jane Doe',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );

        $user3 = User::firstOrCreate(
            ['email' => 'author3@example.com'],
            [
                'name' => 'Prof. Alice Johnson',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );

        // Create AuthorInfo records
        $authorInfo1 = AuthorInfo::create([
            'author_name' => 'Dr. John Smith',
            'author_email' => 'author1@example.com',
            'institute' => 'MIT Technology Institute',
            'correspond_name' => 'Dr. John Smith',
            'correspond_email' => 'author1@example.com',
            'coauthors' => 'Dr. Sarah Wilson, Prof. Mike Brown',
        ]);

        $authorInfo2 = AuthorInfo::create([
            'author_name' => 'Dr. Jane Doe',
            'author_email' => 'author2@example.com',
            'institute' => 'Stanford University',
            'correspond_name' => 'Dr. Jane Doe',
            'correspond_email' => 'author2@example.com',
            'coauthors' => 'Dr. Robert Lee',
        ]);

        $authorInfo3 = AuthorInfo::create([
            'author_name' => 'Prof. Alice Johnson',
            'author_email' => 'author3@example.com',
            'institute' => 'Harvard University',
            'correspond_name' => 'Prof. Alice Johnson',
            'correspond_email' => 'author3@example.com',
            'coauthors' => null,
        ]);

        // Create Papers
        $paper1 = Paper::create([
            'paper_title' => 'AI in Education: A Comprehensive Review',
            'url' => '/storage/papers/ai-education-review.pdf',
            'topic' => 'AI',
            'keyword' => 'AI, Education, Machine Learning, Personalized Learning',
            'abstract' => 'This paper presents a comprehensive review of artificial intelligence applications in educational settings, examining current trends and future possibilities.',
        ]);

        $paper2 = Paper::create([
            'paper_title' => 'Virtual Reality for Immersive Learning Experiences',
            'url' => '/storage/papers/vr-immersive-learning.pdf',
            'topic' => 'Other',
            'keyword' => 'VR, Virtual Reality, Immersive Learning, Education Technology',
            'abstract' => 'An exploration of virtual reality technologies and their impact on creating immersive learning experiences in various educational contexts.',
        ]);

        $paper3 = Paper::create([
            'paper_title' => 'Blockchain Technology in Educational Credentialing',
            'url' => '/storage/papers/blockchain-education.pdf',
            'topic' => 'Cybersecurity',
            'keyword' => 'Blockchain, Credentials, Digital Certificates, Education',
            'abstract' => 'This study investigates the potential of blockchain technology for secure and verifiable educational credentialing systems.',
        ]);

        // Create Submissions linking papers to authors
        Submission::create([
            'user_id' => $user1->id,
            'paper_id' => $paper1->id,
            'author_info_id' => $authorInfo1->id,
            'track' => 'AI and Technology',
            'submitted_elsewhere' => false,
            'original_submission' => true,
            'submitted_at' => now()->subDays(10),
        ]);

        Submission::create([
            'user_id' => $user2->id,
            'paper_id' => $paper2->id,
            'author_info_id' => $authorInfo2->id,
            'track' => 'Virtual Reality',
            'submitted_elsewhere' => false,
            'original_submission' => true,
            'submitted_at' => now()->subDays(8),
        ]);

        Submission::create([
            'user_id' => $user3->id,
            'paper_id' => $paper3->id,
            'author_info_id' => $authorInfo3->id,
            'track' => 'Emerging Technologies',
            'submitted_elsewhere' => true,
            'original_submission' => false,
            'submitted_at' => now()->subDays(5),
        ]);

        $this->command->info('Created 3 papers with submissions and author information.');
        $this->command->info('Papers now have proper relationships with users through submissions.');
    }
}
