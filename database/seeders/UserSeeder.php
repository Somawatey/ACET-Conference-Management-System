<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Admin user
        // $adminUser = User::create([
        //     'name' => 'admin2',
        //     'email' => 'admin2@gmail.com',
        //     'password' => Hash::make('123456')
        // ]);
        
        // Create Admin role with all permissions
        $adminRole = Role::create(['name' => 'Admin']);
        $allPermissions = Permission::pluck('id','id')->all();
        $adminRole->syncPermissions($allPermissions);
        $adminUser->assignRole([$adminRole->id]);

        // Create Reviewer role with paper-related permissions
        $reviewerRole = Role::create(['name' => 'Reviewer']);
        $reviewerPermissions = Permission::whereIn('name', [
            'paper-list',
            'paper-review'
        ])->pluck('id','id')->all();
        $reviewerRole->syncPermissions($reviewerPermissions);

        // Create some sample reviewer users
        $reviewers = [
            [
                'name' => 'Dr. Sarah Johnson',
                'email' => 'sarah.johnson@university.edu',
                'password' => Hash::make('123456')
            ],
            [
                'name' => 'Prof. Michael Chen',
                'email' => 'michael.chen@institute.edu',
                'password' => Hash::make('123456')
            ],
            [
                'name' => 'Dr. Emily Rodriguez',
                'email' => 'emily.rodriguez@college.edu',
                'password' => Hash::make('123456')
            ],
            [
                'name' => 'Prof. David Kim',
                'email' => 'david.kim@university.edu',
                'password' => Hash::make('123456')
            ]
        ];

        foreach ($reviewers as $reviewerData) {
            $reviewerUser = User::create($reviewerData);
            $reviewerUser->assignRole([$reviewerRole->id]);
        }

        $this->command->info('Admin user and Reviewer users created successfully!');
    }
}
