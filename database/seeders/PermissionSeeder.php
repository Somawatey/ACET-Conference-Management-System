<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            'role-list',
            'role-create',
            'role-edit',
            'role-delete',

            'user-list',
            'user-create',
            'user-edit',
            'user-delete',

            'agenda-list',
            'agenda-create',
            'agenda-edit',
            'agenda-delete',

            'paper-list',
            'paper-create',
            'paper-edit',
            'paper-delete',
            'paper-assign',
            'paper-review',
            'paper-approve',
            'paper-reject',

            'conference-list',
            'conference-create', 
            'conference-edit',
            'conference-delete',

            'review-history',
            'submission-history',
            'dashboard',
            'review-list',
            'review-create',
            'review-edit',
            'review-delete',

        ];

        foreach ($permissions as $permission) {
            $old_permission = Permission::where('name', $permission)->first();
            if (!$old_permission) {
                Permission::create(['name' => $permission]);
            }
        }
    }
}
