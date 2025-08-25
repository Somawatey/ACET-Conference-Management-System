<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class SetupPaperSystem extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'setup:paper-system';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Set up the paper assignment system with required permissions and roles';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Setting up Paper Assignment System...');

        // Check if permissions exist
        $this->info('Checking permissions...');
        $requiredPermissions = [
            'paper-list',
            'paper-create',
            'paper-edit',
            'paper-delete',
            'paper-assign',
            'paper-review',
            'paper-approve',
            'paper-reject',
            'category-list',
            'category-create',
            'category-edit',
            'category-delete',
        ];

        foreach ($requiredPermissions as $permissionName) {
            $permission = Permission::firstOrCreate(['name' => $permissionName]);
            $this->line("✓ Permission '{$permissionName}' exists");
        }

        // Check if roles exist
        $this->info('Checking roles...');
        $adminRole = Role::firstOrCreate(['name' => 'Admin']);
        $reviewerRole = Role::firstOrCreate(['name' => 'Reviewer']);
        
        $this->line("✓ Admin role exists");
        $this->line("✓ Reviewer role exists");

        // Assign all permissions to Admin role
        $this->info('Assigning permissions to Admin role...');
        $adminRole->syncPermissions(Permission::all());
        $this->line("✓ Admin role has all permissions");

        // Assign specific permissions to Reviewer role
        $this->info('Assigning permissions to Reviewer role...');
        $reviewerPermissions = Permission::whereIn('name', [
            'paper-list',
            'paper-review'
        ])->get();
        $reviewerRole->syncPermissions($reviewerPermissions);
        $this->line("✓ Reviewer role has paper-list and paper-review permissions");

        $this->info('Paper Assignment System setup completed successfully!');
        $this->info('');
        $this->info('Next steps:');
        $this->info('1. Run: php artisan migrate');
        $this->info('2. Run: php artisan db:seed');
        $this->info('3. Login with admin@gmail.com / 123456');
        $this->info('4. Navigate to /paper-assignments to start assigning papers');

        return Command::SUCCESS;
    }
}
