<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RolesController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SubmissionController;
use App\Http\Controllers\PaperController;
use App\Http\Controllers\PaperAssignmentController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/profile/photo', [ProfileController::class, 'updatePhoto'])->name('profile.photo.update');
    Route::delete('/profile/photo', [ProfileController::class, 'deletePhoto'])->name('profile.photo.delete');

    Route::prefix('roles')->group(function () {
        Route::get('/', [RolesController::class, 'index'])->name('roles.index')->middleware(['check:role-list']);
        Route::get('/create', [RolesController::class, 'create'])->name('roles.create')->middleware(['check:role-create']);
        Route::get('/{id}', [RolesController::class, 'edit'])->name('roles.edit')->middleware(['check:role-edit']);
        Route::post("/", [RolesController::class, 'store'])->name('roles.store');
        Route::patch("/{id}", [RolesController::class, 'update'])->name('roles.update');
        Route::delete("/{id}", [RolesController::class, 'destroy'])->name('roles.destroy')->middleware(['check:role-delete']);
    });
    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('users.index')->middleware(['check:user-list']);
        Route::get('/create', [UserController::class, 'create'])->name('users.create')->middleware(['check:user-create']);
        Route::get('/{id}', [UserController::class, 'edit'])->name('users.edit')->middleware(['check:user-edit']);
        Route::post("/", [UserController::class, 'store'])->name('users.store');
        Route::patch("/{id}", [UserController::class, 'update'])->name('users.update');
        Route::delete("/{id}", [UserController::class, 'destroy'])->name('users.destroy')->middleware(['check:user-delete']);
    });

    // Submission routes - PERMISSION REQUIRED ✅
    // Route::prefix('submissions')->group(function () {
    //     Route::get('/', [SubmissionController::class, 'index'])->name('submissions.index')->middleware(['check:paper-list']);
    //     Route::get('/create', [SubmissionController::class, 'create'])->name('submissions.create')->middleware(['check:paper-create']);
    //     Route::get('/{id}', [SubmissionController::class, 'show'])->name('submissions.show')->middleware(['check:paper-list']);
    //     Route::get('/{id}/edit', [SubmissionController::class, 'edit'])->name('submissions.edit')->middleware(['check:paper-edit']);
    //     Route::post("/", [SubmissionController::class, 'store'])->name('submissions.store');
    //     Route::patch("/{id}", [SubmissionController::class, 'update'])->name('submissions.update');
    //     Route::delete("/{id}", [SubmissionController::class, 'destroy'])->name('submissions.destroy')->middleware(['check:paper-delete']);
    // });

       // Submission routes - NO PERMISSION REQUIRED ✅
    Route::prefix('submissions')->group(function () {
        Route::get('/', [SubmissionController::class, 'index'])->name('submissions.index'); 
        Route::get('/create', [SubmissionController::class, 'create'])->name('submissions.create'); 
        Route::get('/{id}', [SubmissionController::class, 'show'])->name('submissions.show');
        Route::get('/{id}/edit', [SubmissionController::class, 'edit'])->name('submissions.edit');
        Route::post("/", [SubmissionController::class, 'store'])->name('submissions.store');
        Route::patch("/{id}", [SubmissionController::class, 'update'])->name('submissions.update');
        Route::delete("/{id}", [SubmissionController::class, 'destroy'])->name('submissions.destroy');
    });

    //paper
    Route::prefix('papers')->group(function () {
        Route::get('/', [PaperController::class, 'index'])->name('papers.index')->middleware(['check:paper-list']);
        Route::get('/create', [PaperController::class, 'create'])->name('papers.create')->middleware(['check:paper-create']);
        Route::get('/{id}', [PaperController::class, 'show'])->name('papers.show')->middleware(['check:paper-list']);
        Route::get('/{id}/edit', [PaperController::class, 'edit'])->name('papers.edit')->middleware(['check:paper-edit']);
        Route::post("/", [PaperController::class, 'store'])->name('papers.store');
        Route::patch("/{id}", [PaperController::class, 'update'])->name('papers.update');
        Route::delete("/{id}", [PaperController::class, 'destroy'])->name('papers.destroy')->middleware(['check:paper-delete']);
    });

    Route::prefix('paper-assignments')->group(function () {
        Route::get('/', [PaperAssignmentController::class, 'index'])->name('paper-assignments.index')->middleware(['check:paper-assign']);
        Route::get('/create', [PaperAssignmentController::class, 'create'])->name('paper-assignments.create')->middleware(['check:paper-assign']);
        Route::get('/{id}', [PaperAssignmentController::class, 'show'])->name('paper-assignments.show')->middleware(['check:paper-assign']);
        Route::get('/{id}/edit', [PaperAssignmentController::class, 'edit'])->name('paper-assignments.edit')->middleware(['check:paper-assign']);
        Route::post("/", [PaperAssignmentController::class, 'store'])->name('paper-assignments.store');
        Route::patch("/{id}", [PaperAssignmentController::class, 'update'])->name('paper-assignments.update');
        Route::delete("/{id}", [PaperAssignmentController::class, 'destroy'])->name('paper-assignments.destroy')->middleware(['check:paper-assign']);
    });
    // paper decision
    Route::prefix('paper-decisions')
    ->name('paper-decisions.') // Adds 'paper-decisions.' prefix to all route names
    ->middleware(['auth', 'permission:paper-decision']) // Apply to the whole group
    ->group(function () {
        // GET /paper-decisions
        // Name: paper-decisions.index
        Route::get('/', [PaperController::class, 'decisions'])->name('index');

        // GET /paper-decisions/{id}
        // Name: paper-decisions.show
        Route::get('/{id}', [PaperController::class, 'decisionShow'])->name('show');

        // POST /paper-decisions/{id}/accept
        // Name: paper-decisions.accept
        Route::post("/{id}/accept", [PaperController::class, 'accept'])->name('accept');

        // POST /paper-decisions/{id}/reject
        // Name: paper-decisions.reject
        Route::post("/{id}/reject", [PaperController::class, 'reject'])->name('reject');
    });

});


require __DIR__.'/auth.php';
