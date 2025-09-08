<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RolesController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SubmissionController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\AgendaController;
use App\Http\Controllers\PaperController;
use App\Http\Controllers\PaperAssignmentController;
use App\Http\Controllers\DecisionController;
use App\Http\Controllers\PaperHistoryController;
use App\Http\Controllers\ConferenceController;
use App\Http\Controllers\DashboardController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});



Route::middleware('auth')->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

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

    // Agenda routes
    Route::prefix('agenda')->group(function () {
        Route::get('/', [AgendaController::class, 'index'])->name('agenda.index');
        Route::get('/create', [AgendaController::class, 'create'])->name('agenda.create');
        Route::get('/{id}', [AgendaController::class, 'show'])->name('agenda.show');
        Route::get('/{id}/edit', [AgendaController::class, 'edit'])->name('agenda.edit');
        Route::put("/{id}", [AgendaController::class, 'update'])->name('agenda.update');
        Route::post("/", [AgendaController::class, 'store'])->name('agenda.store');
        Route::delete("/{id}", [AgendaController::class, 'destroy'])->name('agenda.destroy');
        Route::get("/download-pdf", [AgendaController::class, 'downloadPdf'])->name('agenda.downloadPdf');
    });

    // Paper routes
    Route::prefix('papers')->group(function () {
        Route::get('/', [PaperController::class, 'index'])->name('papers.index');
        Route::get('/create', [PaperController::class, 'create'])->name('papers.create');
        Route::get('/{id}', [PaperController::class, 'show'])->name('papers.show');
        Route::get('/{id}/edit', [PaperController::class, 'edit'])->name('papers.edit');
        Route::post("/", [PaperController::class, 'store'])->name('papers.store');
        Route::patch("/{id}", [PaperController::class, 'update'])->name('papers.update');
        Route::delete("/{id}", [PaperController::class, 'destroy'])->name('papers.destroy');
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

    // Your Submissions alias route
    Route::get('/your-submissions', [SubmissionController::class, 'index'])->name('your-submissions.index');
    
    // Submission History route
    Route::get('/submission-history', [SubmissionController::class, 'history'])->name('submissions.history');

    // Paper Assignment routes
    Route::prefix('paper-assignments')->group(function () {
        Route::get('/', [PaperAssignmentController::class, 'index'])->name('paper-assignments.index');
        Route::get('/create', [PaperAssignmentController::class, 'create'])->name('paper-assignments.create');
        Route::get('/{id}', [PaperAssignmentController::class, 'show'])->name('paper-assignments.show');
        Route::get('/{id}/edit', [PaperAssignmentController::class, 'edit'])->name('paper-assignments.edit');
        Route::post("/", [PaperAssignmentController::class, 'store'])->name('paper-assignments.store');
        Route::patch("/{id}", [PaperAssignmentController::class, 'update'])->name('paper-assignments.update');
        Route::delete("/{id}", [PaperAssignmentController::class, 'destroy'])->name('paper-assignments.destroy');
    });

    Route::prefix('paper-history')->group(function () {
        Route::get('/', [PaperHistoryController::class, 'index'])->name('paper-history.index');
        Route::get('/create', [PaperHistoryController::class, 'create'])->name('paper-history.create')->middleware(['check:paper-history-create']);
        Route::get('/{id}', [PaperHistoryController::class, 'show'])->name('paper-history.show')->middleware(['check:paper-history-list']);
        Route::get('/{id}/edit', [PaperHistoryController::class, 'edit'])->name('paper-history.edit')->middleware(['check:paper-history-edit']);
        Route::post("/", [PaperHistoryController::class, 'store'])->name('paper-history.store');
        Route::patch("/{id}", [PaperHistoryController::class, 'update'])->name('paper-history.update');
        Route::delete("/{id}", [PaperHistoryController::class, 'destroy'])->name('paper-history.destroy')->middleware(['check:paper-history-delete']);
    });

    // Review routes
    Route::prefix('reviews')->group(function () {
        Route::get('/', [ReviewController::class, 'reviewList'])->name('reviews.reviewList');
        Route::get('/index', [ReviewController::class, 'reviewList'])->name('reviews.index');
        Route::get('/create/{paper?}', [ReviewController::class, 'create'])->name('reviews.create');
        //for viewing feedback in paperDecision
        Route::get('/{review}', [ReviewController::class, 'show'])->name('reviews.show');
        Route::get('/{id}/edit', [ReviewController::class, 'edit'])->name('reviews.edit');
        Route::post('/', [ReviewController::class, 'store'])->name('reviews.store');
        Route::patch("/{id}", [ReviewController::class, 'update'])->name('reviews.update');
        Route::delete("/{id}", [ReviewController::class, 'destroy'])->name('reviews.destroy');
    });

    // Paper Decision routes
    Route::prefix('paper-decision')->group(function () {
        Route::get('/', [DecisionController::class, 'index'])->name('paper-decision.index');
        Route::get('/create/{paper}', [DecisionController::class, 'create'])->name('paper-decision.create');
        Route::get('/{paper}/edit', [DecisionController::class, 'edit'])->name('paper-decision.edit');
        Route::get('/{paper}', [DecisionController::class, 'show'])->name('paper-decision.show');
        Route::post('/{paper}', [DecisionController::class, 'store'])->name('paper-decision.store');
        Route::patch('/{paper}', [DecisionController::class, 'update'])->name('paper-decision.update');
        Route::post('/notify/{paper}', [DecisionController::class, 'notifyAuthor'])->name('paper-decision.notify');
    });

    // Debug routes
    Route::get('/debug/paper/{paper}', function(App\Models\Paper $paper) {
        return response()->json([
            'paper_id' => $paper->id,
            'paper_title' => $paper->paper_title,
            'status' => $paper->status ?? 'no status'
        ]);
    });
    
    Route::post('/debug/paper/{paper}', function(Request $request, App\Models\Paper $paper) {
        return response()->json([
            'message' => 'POST request received',
            'paper_id' => $paper->id,
            'request_data' => $request->all()
        ]);
    });

    // Review History
    Route::get('/review-history', [ReviewController::class, 'index'])->name('review.history');
     // Paper History
    Route::get('/paper-history', [PaperController::class, 'paperHistory'])->name('paper-history.index');

    Route::get('/reviewers', [UserController::class, 'reviewers']);

     // Conference routes
    Route::prefix('conferences')->group(function () {
        Route::get('/', [ConferenceController::class, 'index'])->name('conferences.index')->middleware(['check:conference-list']);
        Route::get('/create', [ConferenceController::class, 'create'])->name('conferences.create')->middleware(['check:conference-create']);
        Route::get('/{conference}', [ConferenceController::class, 'show'])->name('conferences.show');
        Route::get('/{conference}/edit', [ConferenceController::class, 'edit'])->name('conferences.edit')->middleware(['check:conference-edit']);
        Route::post('/', [ConferenceController::class, 'store'])->name('conferences.store');
        Route::patch('/{conference}', [ConferenceController::class, 'update'])->name('conferences.update');
        Route::delete('/{conference}', [ConferenceController::class, 'destroy'])->name('conferences.destroy')->middleware(['check:conference-delete']);
    });
   
});

require __DIR__.'/auth.php';
