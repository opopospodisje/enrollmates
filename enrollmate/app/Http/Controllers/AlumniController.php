<?php

namespace App\Http\Controllers;

use App\Models\Alumni;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AlumniController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Fetch alumni records with the related student information
        $alumnis = Alumni::with('student:id,first_name,last_name,suffix,middle_name,lrn')
            ->select('id', 'student_id', 'year_graduated', 'employment_status')
            ->get();

        // Map the alumni data to a flat structure and add the full_name field
        $flattenedAlumnis = $alumnis->map(function ($alumni) {
            // Combine first_name, middle_name, last_name, and suffix to form full_name
            $fullName = trim("{$alumni->student->first_name} {$alumni->student->middle_name} {$alumni->student->last_name} {$alumni->student->suffix}");

            return [
                'id' => $alumni->id,
                'student_id' => $alumni->student_id,
                'year_graduated' => $alumni->year_graduated,
                'lrn' => $alumni->student->lrn,
                'full_name' => $fullName,  // Adding the full_name field
                'employment_status' => $alumni->employment_status ?? 'Awaiting Update',
            ];
        });

        // Return the flattened data to the frontend
        return inertia('admin/alumni/index', [
            'alumnis' => $flattenedAlumnis,
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
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Alumni $alumni)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Alumni $alumni)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Alumni $alumni)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Alumni $alumni)
    {
        //
    }

    public function alumniInfo()
    {
        // Get the authenticated user
        $user = Auth::user();

        // Check if the user is a student and has a related student record
        if (! $user || ! $user->student) {
            abort(403, 'Unauthorized or student record not found.');
        }

        // Get the student
        $student = $user->student;

        // Get the alumni record associated with the student
        $alumni = $student->alumni;

        // Check if alumni record exists
        if (! $alumni) {
            abort(404, 'Alumni record not found.');
        }

        // Construct the full name
        $fullName = trim("{$student->first_name} {$student->middle_name} {$student->last_name} {$student->suffix}");

        // Prepare the flattened alumni data
        $alumniData = [
            'id' => $alumni->id,
            'student_id' => $student->id,
            'year_graduated' => $alumni->year_graduated,
            'lrn' => $student->lrn,
            'full_name' => $fullName,
            'employment_status' => $alumni->employment_status ?? null,
            'job_title' => $alumni->job_title ?? null,
            'work_history' => $alumni->work_history ?? null,
        ];

        // Return to the frontend
        return inertia('student/alumni/index', [
            'alumni' => $alumniData,
        ]);
    }

    public function updateAlumniInfo(Request $request)
    {
        $request->validate([
            'employment_status' => 'required|in:not_set,employed,unemployed,self-employed,student,retired',
            'work_history' => 'nullable|string|max:500',  // Add validation for work history
            'job_title' => 'nullable|string|max:255',      // Add validation for job title
        ]);

        $user = Auth::user();

        if (! $user || ! $user->student) {
            abort(403, 'Unauthorized or student record not found.');
        }

        $student = $user->student;
        $alumni = $student->alumni;

        if (! $alumni) {
            abort(404, 'Alumni record not found.');
        }

        $employmentStatus = $request->employment_status;

        // Set employment status to null if 'not_set' is passed
        if ($employmentStatus === 'not_set') {
            $employmentStatus = null;
        }

        // Update the alumni record
        $alumni->update([
            'employment_status' => $employmentStatus,
            'work_history' => $request->work_history,  // Update work history
            'job_title' => $request->job_title,        // Update job title
        ]);

        return redirect()->route('student.alumnis.show')->with('success', 'Alumni info updated.');
    }
}
