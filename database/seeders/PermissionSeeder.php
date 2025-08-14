<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

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

            'paper-list',
            'paper-create',
            'paper-edit',
            'paper-delete',
            'paper-assign',

            // Required by routes under `paper-decisions` group
            'paper-decision',

        ];

        foreach ($permissions as $permission) {
            $old_permission = Permission::where('name', $permission)->first();
            if (!$old_permission) {
                Permission::create(['name' => $permission]);
            }
        }

        // Ensure Admin role (if it already exists) gets all current permissions
        $adminRole = Role::where('name', 'Admin')->first();
        if ($adminRole) {
            $adminRole->syncPermissions(Permission::all());
        }
    }
}
