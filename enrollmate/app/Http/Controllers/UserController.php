<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Spatie\Permission\Models\Role;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */


    public function index()
    {
        $users = User::with('roles')->get();
        $roles = Role::all(['id', 'name']); // You can select specific fields if needed

        return inertia('admin/users/index', [
            'users' => $users->map(function ($user) {
                return [
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'contact_number' => $user->contact_number,
                    'address' => $user->address,
                    'email' => $user->email,
                    'role' => $user->roles->pluck('name')->first(),
                    'role_id' => $user->roles->pluck('id')->first(),
                    'role_id' => $user->roles->pluck('id')->first(),
                    'is_verified' => $user->email_verified_at ? 'Verified' : 'Unverified',
                ];
            }),
            'roles' => $roles, // send to frontend
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $validated = $request->validated();

        $user = User::create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'contact_number' => $validated['contact_number'],
            'address' => $validated['address'],
            'email' => $validated['email'],
            'email_verified_at' => now(),
            'password' => Hash::make($validated['password']),
        ]);

        $user->roles()->sync([$validated['role_id']]);

        return redirect()->back()->with('success', 'User created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        $user->load('roles'); // Eager load roles
        $roles = Role::all(['id', 'name']); // You can select specific fields if needed

        return inertia('users/show', [
            'user' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'contact_number' => $user->contact_number,
                'address' => $user->address,
                'email' => $user->email,
                'role' => $user->roles->pluck('name')->first(),
                'role_id' => $user->roles->pluck('id')->first(),
                'is_verified' => $user->email_verified_at ? 'Verified' : 'Unverified',
                'email_verified_at' => $user->email_verified_at
                    ? $user->email_verified_at->format('F j, Y g:i A') // e.g., July 4, 2025 3:15 PM
                    : null,
                'created_at' => $user->created_at->toDateTimeString(),
            ],

            'roles' => $roles, // send to frontend
        ]);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $validated = $request->validated();

        $user->update([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'contact_number' => $validated['contact_number'],
            'address' => $validated['address'],
            'email' => $validated['email'],
            'password' => isset($validated['password']) && $validated['password']
                ? Hash::make($validated['password'])
                : $user->password, // retain old password if not updating
        ]);

        $user->roles()->sync([$validated['role_id']]);

        return redirect()->back()->with('success', 'User updated successfully!');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->back()->with('success', 'User deleted successfully!');
    }
}
