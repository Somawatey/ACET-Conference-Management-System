<?php

namespace App\Http\Controllers;

use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search');
        
        $query = User::with('roles');
        
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }
        
        $users = $query->paginate(10);
        
        return Inertia::render('Users/Index', [
            'users' => $users,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create()
    {
        $roles = Role::all();
        
        return Inertia::render('Users/CreateEdit', [
            'roles' => $roles,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'roles' => 'required|array',
            'roles.*' => 'exists:roles,id',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        if (!empty($validated['roles'])) {
            $roleNames = Role::whereIn('id', $validated['roles'])->pluck('name')->toArray();
            $user->assignRole($roleNames);
        }

        return to_route('users.index')->with("success", "User created successfully");
    }

    public function edit($id)
    {
        $user = User::with(['roles'])->find($id);
        $roles = Role::all();

        return Inertia::render('Users/CreateEdit', [
            'roles' => $roles,
            'user' => $user
        ]);
    }

    // FIXED: Complete update method with proper validation and data assignment
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        // Validation rules
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'roles' => 'required|array',
            'roles.*' => 'exists:roles,id',
        ];
        
        // Only validate password if it's provided (for future password updates)
        if ($request->filled('password')) {
            $rules['password'] = 'required|string|min:8|confirmed';
        }
        
        $validated = $request->validate($rules);
        
        // Update user data
        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
        ];
        
        // Only update password if provided
        if (isset($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }
        
        // FIXED: Actually update the user with the validated data
        $user->update($updateData);
        
        // Sync roles
        if (!empty($validated['roles'])) {
            $roleNames = Role::whereIn('id', $validated['roles'])->pluck('name')->toArray();
            $user->syncRoles($roleNames);
        }
        
        return to_route('users.index')->with("success", "User updated successfully");
    }

    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id);
            
            // Now that we have cascade delete constraints, we can delete the user directly
            $user->delete();
            
            return back()->with('success', 'User deleted successfully');
            
        } catch (\Exception $e) {
            return back()->with('error', 'Cannot delete user: ' . $e->getMessage());
        }
    }
}