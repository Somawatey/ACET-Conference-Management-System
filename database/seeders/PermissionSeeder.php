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

            'category-list',
            'category-create',
            'category-edit',
            'category-delete',
        ];

        foreach ($permissions as $permission) {
            $old_permission = Permission::where('name', $permission)->first();
            if (!$old_permission) {
                Permission::create(['name' => $permission]);
            }
        }
    }
}
