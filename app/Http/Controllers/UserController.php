<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use App\Models\User;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('roles')->paginate(10)->appends(request()->query());
        return Inertia::render('Users/Index', [
            'users' => $users,
        ]);
    }

    public function create()
    {
        $roles = Role::all();
        return Inertia::render('Users/CreateEdit', [
            'roles' => $roles
        ]);
    }

    public function store(Request $request)
{
    $validated = Validator::make($request->all(), [
        'name' => ['required', 'string', 'max:255'],
        'email' => [
            'required',
            'string',
            'email',
            'max:255',
            Rule::unique('users', 'email'),
        ],
        'password' => ['required', 'string', 'min:8', 'confirmed'], // Add confirmed rule
        'roles' => ['required', 'array'], // Change to array and make required
        'roles.*' => ['integer', 'exists:roles,id'], // Validate IDs not names
    ])->validate();

    $user = User::create([
        'name' => $validated['name'],
        'email' => $validated['email'],
        'password' => Hash::make($validated['password']),
    ]);

    // Get role names from IDs for assignment
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

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $user->save();
        $user->syncRoles($request->roles);
        return to_route('users.index')->with("success", "User updated successfully");
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return to_route('users.index')->with("success", "User Deleted successfully");
    }

public function reviewers()
{
    $reviewers = User::whereHas('roles', function($q) {
        $q->where('name', 'reviewer');
    })->select('id', 'name')->get();

    return response()->json($reviewers);
}
}
