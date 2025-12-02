<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use App\Models\User;
use App\Http\Requests\StoreTeacherRequest;
use App\Http\Requests\UpdateTeacherRequest;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;


class TeacherController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $teacher = Teacher::select( 
            'id', 
            'user_id',
            'first_name',
            'last_name',
            'middle_name',
            'suffix',
            'email',
            'address',
            'contact_number',
            'gender',
            'birthdate',
        )->get();

        return inertia('admin/teacher/index', [
            'teachers' => $teacher,
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTeacherRequest $request)
    {
        // Create the user first
        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'contact_number' => $request->contact_number,
            'address' => $request->address,
            'email' => $request->email,
            'password' => Hash::make('password'), // default password
        ]);

        // Assign "teacher" role using Spatie
        $user->assignRole('teacher');

        // Create the teacher profile
        $teacher = Teacher::create([
            'user_id' => $user->id,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'middle_name' => $request->middle_name,
            'suffix' => $request->suffix,
            'email' => $request->email,
            'address' => $request->address,
            'contact_number' => $request->contact_number,
            'gender' => $request->gender,
            'birthdate' => $request->birthdate,
        ]);

        return redirect()->back()->with('success', 'Teacher created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Teacher $teacher)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTeacherRequest $request, Teacher $teacher)
    {
        // Update the teacher record
        $teacher->update([
            'first_name'     => $request->first_name,
            'last_name'      => $request->last_name,
            'middle_name'    => $request->middle_name,
            'suffix'         => $request->suffix,
            'email'          => $request->email,
            'address'        => $request->address,
            'contact_number' => $request->contact_number,
            'gender'         => $request->gender,
            'birthdate'      => $request->birthdate,
        ]);

        // Also update the associated user
        $teacher->user->update([
            'first_name'     => $request->first_name,
            'last_name'      => $request->last_name,
            'email'          => $request->email,
            'address'        => $request->address,
            'contact_number' => $request->contact_number,
        ]);

        return redirect()->back()->with('success', 'Teacher updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Teacher $teacher)
    {
        //
    }
}
