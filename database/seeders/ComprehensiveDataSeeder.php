<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Paper;
use App\Models\AuthorInfo;
use App\Models\Submission;
use App\Models\Conference;
use Spatie\Permission\Models\Role;
use Carbon\Carbon;

class ComprehensiveDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create roles if they don't exist
        $authorRole = Role::firstOrCreate(['name' => 'Author']);
        $reviewerRole = Role::firstOrCreate(['name' => 'Reviewer']);
        $adminRole = Role::firstOrCreate(['name' => 'Admin']);

        // Sample conference data - using correct column names
        $conferences = [
            [
                'conf_name' => 'ACET 2025 - Advanced Computing and Emerging Technologies',
                'topic' => 'Advanced Computing and Emerging Technologies',
                'location' => 'Phnom Penh, Cambodia',
                'start_date' => '2025-11-15',
                'end_date' => '2025-11-17',
            ]
        ];

        foreach ($conferences as $conferenceData) {
            Conference::firstOrCreate(['conf_name' => $conferenceData['conf_name']], $conferenceData);
        }

        // Sample authors with realistic data
        $authors = [
            [
                'name' => 'Dr. Sophea Chan',
                'email' => 'sophea.chan@uit.edu.kh',
                'password' => 'password123',
                'author_info' => [
                    'author_name' => 'Dr. Sophea Chan',
                    'author_email' => 'sophea.chan@uit.edu.kh',
                    'institute' => 'University of Information Technology',
                    'correspond_name' => 'Dr. Sophea Chan',
                    'correspond_email' => 'sophea.chan@uit.edu.kh',
                    'coauthors' => 'Dr. Vicheka Pich, Prof. Bunroeun Sao',
                ],
                'papers' => [
                    [
                        'title' => 'Machine Learning Applications in Cambodian Healthcare System',
                        'topic' => 'Machine Learning',
                        'keyword' => 'healthcare, machine learning, Cambodia, medical diagnosis',
                        'abstract' => 'This paper presents a comprehensive study on implementing machine learning algorithms to improve healthcare delivery in Cambodia. We analyze various ML models for disease prediction and patient management systems.',
                        'track' => 'AI and Healthcare',
                    ]
                ]
            ],
            [
                'name' => 'Prof. Pisach Vong',
                'email' => 'pisach.vong@rupp.edu.kh',
                'password' => 'password123',
                'author_info' => [
                    'author_name' => 'Prof. Pisach Vong',
                    'author_email' => 'pisach.vong@rupp.edu.kh',
                    'institute' => 'Royal University of Phnom Penh',
                    'correspond_name' => 'Prof. Pisach Vong',
                    'correspond_email' => 'pisach.vong@rupp.edu.kh',
                    'coauthors' => 'Dr. Malika Chhim, Dr. Ratha Sok',
                ],
                'papers' => [
                    [
                        'title' => 'Cybersecurity Framework for Cambodian Banking Sector',
                        'topic' => 'Cybersecurity',
                        'keyword' => 'cybersecurity, banking, fintech, Cambodia, data protection',
                        'abstract' => 'This research proposes a comprehensive cybersecurity framework tailored for the Cambodian banking sector, addressing unique challenges in emerging financial technology adoption.',
                        'track' => 'Cybersecurity and Fintech',
                    ]
                ]
            ],
            [
                'name' => 'Dr. Chanthy Leng',
                'email' => 'chanthy.leng@ite.edu.kh',
                'password' => 'password123',
                'author_info' => [
                    'author_name' => 'Dr. Chanthy Leng',
                    'author_email' => 'chanthy.leng@ite.edu.kh',
                    'institute' => 'Institute of Technology of Cambodia',
                    'correspond_name' => 'Dr. Chanthy Leng',
                    'correspond_email' => 'chanthy.leng@ite.edu.kh',
                    'coauthors' => 'Mr. Sokha Meas, Ms. Bopha Khiev',
                ],
                'papers' => [
                    [
                        'title' => 'IoT-Based Smart Agriculture System for Rice Farming in Cambodia',
                        'topic' => 'IOT Networking',
                        'keyword' => 'IoT, agriculture, smart farming, sensors, Cambodia, rice production',
                        'abstract' => 'We present an IoT-based smart agriculture system designed specifically for rice farming in Cambodia, incorporating weather sensors, soil monitoring, and automated irrigation systems.',
                        'track' => 'IoT and Smart Agriculture',
                    ]
                ]
            ],
            [
                'name' => 'Dr. Rithy Kong',
                'email' => 'rithy.kong@uc.edu.kh',
                'password' => 'password123',
                'author_info' => [
                    'author_name' => 'Dr. Rithy Kong',
                    'author_email' => 'rithy.kong@uc.edu.kh',
                    'institute' => 'University of Cambodia',
                    'correspond_name' => 'Dr. Rithy Kong',
                    'correspond_email' => 'rithy.kong@uc.edu.kh',
                    'coauthors' => 'Dr. Socheata Sorn, Prof. Dara Mao',
                ],
                'papers' => [
                    [
                        'title' => 'Natural Language Processing for Khmer Text Analysis',
                        'topic' => 'NLP',
                        'keyword' => 'NLP, Khmer language, text analysis, machine translation, Cambodia',
                        'abstract' => 'This paper explores advanced NLP techniques for processing and analyzing Khmer text, including sentiment analysis, machine translation, and text summarization for the Cambodian language.',
                        'track' => 'Natural Language Processing',
                    ]
                ]
            ],
            [
                'name' => 'Prof. Chenda Heng',
                'email' => 'chenda.heng@niptict.edu.kh',
                'password' => 'password123',
                'author_info' => [
                    'author_name' => 'Prof. Chenda Heng',
                    'author_email' => 'chenda.heng@niptict.edu.kh',
                    'institute' => 'National Institute of Posts, Telecommunications and ICT',
                    'correspond_name' => 'Prof. Chenda Heng',
                    'correspond_email' => 'chenda.heng@niptict.edu.kh',
                    'coauthors' => 'Dr. Kosal Ly, Ms. Sreypich Yim',
                ],
                'papers' => [
                    [
                        'title' => 'Blockchain Technology for Supply Chain Management in Cambodia',
                        'topic' => 'Software Engineering',
                        'keyword' => 'blockchain, supply chain, transparency, Cambodia, distributed systems',
                        'abstract' => 'We propose a blockchain-based supply chain management system to enhance transparency and traceability in Cambodian agricultural and manufacturing sectors.',
                        'track' => 'Blockchain and Supply Chain',
                    ]
                ]
            ],
            [
                'name' => 'Dr. Samphy Keo',
                'email' => 'samphy.keo@beltei.edu.kh',
                'password' => 'password123',
                'author_info' => [
                    'author_name' => 'Dr. Samphy Keo',
                    'author_email' => 'samphy.keo@beltei.edu.kh',
                    'institute' => 'BELTEI International University',
                    'correspond_name' => 'Dr. Samphy Keo',
                    'correspond_email' => 'samphy.keo@beltei.edu.kh',
                    'coauthors' => 'Mr. Virak Tep, Dr. Soksan Chay',
                ],
                'papers' => [
                    [
                        'title' => 'Big Data Analytics for Educational Performance in Cambodian Universities',
                        'topic' => 'Data Sciences',
                        'keyword' => 'big data, education analytics, student performance, Cambodia, data mining',
                        'abstract' => 'This study presents a big data analytics framework for analyzing and improving educational performance across Cambodian universities using advanced data mining techniques.',
                        'track' => 'Educational Data Analytics',
                    ]
                ]
            ],
            [
                'name' => 'Dr. Pheakdey Nguon',
                'email' => 'pheakdey.nguon@asia.edu.kh',
                'password' => 'password123',
                'author_info' => [
                    'author_name' => 'Dr. Pheakdey Nguon',
                    'author_email' => 'pheakdey.nguon@asia.edu.kh',
                    'institute' => 'Asia Euro University',
                    'correspond_name' => 'Dr. Pheakdey Nguon',
                    'correspond_email' => 'pheakdey.nguon@asia.edu.kh',
                    'coauthors' => 'Prof. Rattana Kim, Dr. Sopheak Un',
                ],
                'papers' => [
                    [
                        'title' => 'AI-Powered Traffic Management System for Phnom Penh',
                        'topic' => 'AI',
                        'keyword' => 'artificial intelligence, traffic management, smart city, Cambodia, urban planning',
                        'abstract' => 'We develop an AI-powered traffic management system specifically designed for Phnom Penh, addressing traffic congestion through intelligent signal control and route optimization.',
                        'track' => 'AI and Smart Cities',
                    ]
                ]
            ],
            [
                'name' => 'Prof. Sokunthea Chey',
                'email' => 'sokunthea.chey@puc.edu.kh',
                'password' => 'password123',
                'author_info' => [
                    'author_name' => 'Prof. Sokunthea Chey',
                    'author_email' => 'sokunthea.chey@puc.edu.kh',
                    'institute' => 'Paññāsāstra University of Cambodia',
                    'correspond_name' => 'Prof. Sokunthea Chey',
                    'correspond_email' => 'sokunthea.chey@puc.edu.kh',
                    'coauthors' => 'Dr. Bunnet Chhun, Ms. Sothea Pen',
                ],
                'papers' => [
                    [
                        'title' => 'Computer Networks Optimization for Rural Cambodia Connectivity',
                        'topic' => 'Computer Networks',
                        'keyword' => 'computer networks, rural connectivity, Cambodia, network optimization, telecommunications',
                        'abstract' => 'This research focuses on optimizing computer networks to improve internet connectivity in rural areas of Cambodia, proposing cost-effective solutions for bridging the digital divide.',
                        'track' => 'Network Infrastructure',
                    ]
                ]
            ]
        ];

        // Create authors and their papers
        foreach ($authors as $authorData) {
            // Create user
            $user = User::firstOrCreate(
                ['email' => $authorData['email']],
                [
                    'name' => $authorData['name'],
                    'email' => $authorData['email'],
                    'password' => Hash::make($authorData['password']),
                    'email_verified_at' => now(),
                ]
            );

            // Assign Author role
            $user->assignRole($authorRole);

            // Create author info
            $authorInfo = AuthorInfo::create($authorData['author_info']);

            // Create papers and submissions
            foreach ($authorData['papers'] as $paperData) {
                $paper = Paper::create([
                    'paper_title' => $paperData['title'],
                    'topic' => $paperData['topic'],
                    'keyword' => $paperData['keyword'],
                    'abstract' => $paperData['abstract'],
                    'user_id' => $user->user_id,
                    'status' => 'pending',
                ]);

                // Create submission
                Submission::create([
                    'user_id' => $user->user_id,
                    'paper_id' => $paper->id,
                    'author_info_id' => $authorInfo->id,
                    'track' => $paperData['track'],
                    'submitted_elsewhere' => false,
                    'original_submission' => true,
                    'submitted_at' => now()->subDays(rand(1, 30)),
                ]);
            }
        }

        // Create some reviewers
        $reviewers = [
            [
                'name' => 'Dr. Reviewer One',
                'email' => 'reviewer1@acet.edu.kh',
                'password' => 'password123',
            ],
            [
                'name' => 'Prof. Reviewer Two',
                'email' => 'reviewer2@acet.edu.kh',
                'password' => 'password123',
            ],
            [
                'name' => 'Dr. Reviewer Three',
                'email' => 'reviewer3@acet.edu.kh',
                'password' => 'password123',
            ],
        ];

        foreach ($reviewers as $reviewerData) {
            $reviewer = User::firstOrCreate(
                ['email' => $reviewerData['email']],
                [
                    'name' => $reviewerData['name'],
                    'email' => $reviewerData['email'],
                    'password' => Hash::make($reviewerData['password']),
                    'email_verified_at' => now(),
                ]
            );

            $reviewer->assignRole($reviewerRole);
        }

        $this->command->info('Comprehensive data seeded successfully!');
        $this->command->info('Created:');
        $this->command->info('- ' . count($authors) . ' authors with papers');
        $this->command->info('- ' . count($reviewers) . ' reviewers');
        $this->command->info('- ' . array_sum(array_map(fn($a) => count($a['papers']), $authors)) . ' papers with submissions');
    }
}