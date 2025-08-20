<?php

namespace Tests\Feature;

use App\Models\Paper;
use App\Models\PaperAssignment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class PaperAssignmentTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create roles
        $adminRole = Role::create(['name' => 'Admin']);
        $reviewerRole = Role::create(['name' => 'Reviewer']);
        
        // Create permissions
        $permission = \Spatie\Permission\Models\Permission::create(['name' => 'paper-assign']);
        $adminRole->givePermissionTo($permission);
    }

    public function test_admin_can_view_paper_assignment_page()
    {
        $admin = User::factory()->create();
        $admin->assignRole('Admin');

        $response = $this->actingAs($admin)
            ->get('/paper-assignments');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Paper/AssignPaper'));
    }

    public function test_non_admin_cannot_view_paper_assignment_page()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->get('/paper-assignments');

        $response->assertStatus(403);
    }

    public function test_can_assign_reviewers_to_paper()
    {
        $admin = User::factory()->create();
        $admin->assignRole('Admin');
        
        $reviewer1 = User::factory()->create();
        $reviewer1->assignRole('Reviewer');
        
        $reviewer2 = User::factory()->create();
        $reviewer2->assignRole('Reviewer');
        
        $paper = Paper::factory()->create(['status' => 'submitted']);

        $response = $this->actingAs($admin)
            ->post('/paper-assignments/assign', [
                'paper_id' => $paper->id,
                'reviewer_ids' => [$reviewer1->id, $reviewer2->id],
                'deadline' => now()->addDays(14)->format('Y-m-d'),
                'notes' => 'Please review thoroughly',
            ]);

        $response->assertRedirect();
        
        $this->assertDatabaseHas('paper_assignments', [
            'paper_id' => $paper->id,
            'reviewer_id' => $reviewer1->id,
        ]);
        
        $this->assertDatabaseHas('paper_assignments', [
            'paper_id' => $paper->id,
            'reviewer_id' => $reviewer2->id,
        ]);
        
        // Check if paper status was updated
        $this->assertDatabaseHas('papers', [
            'id' => $paper->id,
            'status' => 'under_review',
        ]);
    }
}
