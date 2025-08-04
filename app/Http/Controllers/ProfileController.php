<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    public function updatePhoto(Request $request): RedirectResponse
    {
        $request->validate([
            'photo' => ['required', 'image', 'mimes:jpeg,jpg,png', 'max:2048'], // 2MB max
        ]);

        $user = $request->user();

        // Delete old photo if exists
        if ($user->profile_photo_path) {
            Storage::disk('public')->delete($user->profile_photo_path);
        }

        // Store new photo
        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('profile-photos', 'public');
            
            $user->update([
                'profile_photo_path' => $path,
            ]);
        }

        return Redirect::route('profile.edit')->with('status', 'Photo updated successfully!');
    }
    public function deletePhoto(Request $request): RedirectResponse
    {
        $user = $request->user();

        // Delete photo file if exists
        if ($user->profile_photo_path) {
            Storage::disk('public')->delete($user->profile_photo_path);
            
            // Clear the photo path from database
            $user->update([
                'profile_photo_path' => null,
            ]);
        }

        return Redirect::route('profile.edit')->with('success', 'Photo removed successfully!');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
