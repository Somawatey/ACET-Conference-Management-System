<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
   public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        // UPDATED: Smart redirect based on user role
        return $this->redirectBasedOnUserRole();
    }

    /**
     * Redirect user based on their role and permissions
     */
    private function redirectBasedOnUserRole(): RedirectResponse
    {
        $user = Auth::user();
        
        // Load roles if not loaded
        if (!$user->relationLoaded('roles')) {
            $user->load('roles');
        }
        
        // Only users with roles AND dashboard permission go to dashboard
        if (!$user->roles->isEmpty() && $user->can('dashboard')) {
            return redirect()->route('dashboard');
        }
        
        // Everyone else goes to submissions
        return redirect()->route('submissions.index')
            ->with('info', 'Welcome! You can submit papers and view conference information.');
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
