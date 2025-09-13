<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use App\Models\Paper;
use App\Models\PaperAssignment;
use App\Models\Review;

echo "=== Database Check ===\n";

// Check total counts
echo "Total Users: " . User::count() . "\n";
echo "Total Papers: " . Paper::count() . "\n";
echo "Total Paper Assignments: " . PaperAssignment::count() . "\n";
echo "Total Reviews: " . Review::count() . "\n\n";

// Check users with reviewer role
$reviewers = User::whereHas('roles', function($q) {
    $q->where('name', 'reviewer');
})->get();

echo "=== Reviewers ===\n";
foreach ($reviewers as $reviewer) {
    echo "Reviewer ID: {$reviewer->id}, Name: {$reviewer->name}\n";
    
    // Check assignments for this reviewer
    $assignments = PaperAssignment::where('reviewer_id', $reviewer->id)
        ->where('status', '!=', 'cancelled')
        ->get();
    
    echo "  Assignments: {$assignments->count()}\n";
    
    foreach ($assignments as $assignment) {
        echo "    - Paper ID: {$assignment->paper_id}, Status: {$assignment->status}\n";
    }
    
    // Check reviews by this reviewer
    $reviews = Review::where('reviewer_id', $reviewer->id)->get();
    echo "  Reviews: {$reviews->count()}\n";
    
    foreach ($reviews as $review) {
        echo "    - Paper ID: {$review->paper_id}, Recommendation: {$review->recommendation}, Score: {$review->score}\n";
    }
    
    echo "\n";
}

// Check if there are any papers with both assignments and reviews
echo "=== Papers with Assignments and Reviews ===\n";
$papersWithBoth = Paper::whereHas('assignments', function($q) {
    $q->where('status', '!=', 'cancelled');
})->whereHas('reviews')->get();

echo "Papers with both assignments and reviews: {$papersWithBoth->count()}\n";
foreach ($papersWithBoth as $paper) {
    echo "Paper ID: {$paper->id}, Title: {$paper->paper_title}\n";
}
