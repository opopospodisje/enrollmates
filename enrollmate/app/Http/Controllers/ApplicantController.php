<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreApplicantRequest;
use App\Http\Requests\UpdateApplicantRequest;
use App\Models\Applicant;
use App\Models\SchoolYear;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ApplicantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $applicant = Applicant::with('schoolYear:id,name')
            ->select('id', 'first_name', 'middle_name', 'last_name', 'suffix', 'email', 'contact_number', 'address', 'birthdate', 'gender', 'school_year_id', 'entrance_exam_score', 'exam_taken_at', 'exam_remarks', 'status')
            ->get()
            ->map(function ($applicant) {
                return [
                    'id' => $applicant->id,
                    'full_name' => $applicant->first_name.' '.$applicant->middle_name.' '.$applicant->last_name.($applicant->suffix ? ', '.$applicant->suffix : ''),
                    'first_name' => $applicant->first_name,
                    'last_name' => $applicant->last_name,
                    'middle_name' => $applicant->middle_name,
                    'suffix' => $applicant->suffix,
                    'email' => $applicant->email,
                    'contact_number' => $applicant->contact_number,
                    'address' => $applicant->address,
                    'birthdate' => $applicant->birthdate,
                    'gender' => $applicant->gender,

                    'status' => $applicant->status,
                    'entrance_exam_score' => $applicant->entrance_exam_score,
                    'exam_taken_at' => $applicant->exam_taken_at ? $applicant->exam_taken_at->format('Y-m-d') : null,

                    'school_year_id' => $applicant->school_year_id,
                    'school_year_name' => $applicant->schoolYear->name,
                ];
            });

        return inertia('admin/applicant/index', [
            'applicants' => $applicant,
            'schoolYears' => SchoolYear::all(),
            'currentSchoolYear' => SchoolYear::where('is_active', true)->first(),
        ]);
    }

    public function teacherIndex()
    {
        $applicant = Applicant::with('schoolYear:id,name')
            ->select('id', 'first_name', 'middle_name', 'last_name', 'suffix', 'email', 'contact_number', 'address', 'birthdate', 'gender', 'school_year_id', 'entrance_exam_score', 'exam_taken_at', 'exam_remarks', 'status')
            ->get()
            ->map(function ($applicant) {
                return [
                    'id' => $applicant->id,
                    'full_name' => $applicant->first_name.' '.$applicant->middle_name.' '.$applicant->last_name.($applicant->suffix ? ', '.$applicant->suffix : ''),
                    'first_name' => $applicant->first_name,
                    'last_name' => $applicant->last_name,
                    'middle_name' => $applicant->middle_name,
                    'suffix' => $applicant->suffix,
                    'email' => $applicant->email,
                    'contact_number' => $applicant->contact_number,
                    'address' => $applicant->address,
                    'birthdate' => $applicant->birthdate,
                    'gender' => $applicant->gender,
                    'status' => $applicant->status,
                    'entrance_exam_score' => $applicant->entrance_exam_score,
                    'exam_taken_at' => $applicant->exam_taken_at ? $applicant->exam_taken_at->format('Y-m-d') : null,
                    'school_year_id' => $applicant->school_year_id,
                    'school_year_name' => $applicant->schoolYear->name,
                ];
            });

        return inertia('teacher/applicant/index', [
            'applicants' => $applicant,
            'schoolYears' => SchoolYear::all(),
            'currentSchoolYear' => SchoolYear::where('is_active', true)->first(),
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
    public function store(StoreApplicantRequest $request)
    {
        $validatedData = $request->validated();

        // Automatically assign status based on entrance exam score
        $score = $validatedData['entrance_exam_score'] ?? null;

        if (is_null($score)) {
            $validatedData['status'] = 'pending'; // Optional: for applicants without score yet
        } elseif ($score < 30) {
            $validatedData['status'] = 'failed';
        } else {
            $validatedData['status'] = 'pending';
        }

        Applicant::create($validatedData);

        $user = Auth::user();
        $role = $user ? DB::table('model_has_roles')
            ->join('roles', 'roles.id', '=', 'model_has_roles.role_id')
            ->where('model_has_roles.model_id', $user->id)
            ->value('roles.name') : null;
        if ($role === 'teacher') {
            return redirect()->route('teacher.applicants.index')->with('success', 'Applicant created successfully.');
        }

        return redirect()->route('admin.applicants.index')->with('success', 'Applicant created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Applicant $applicant)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateApplicantRequest $request, Applicant $applicant)
    {
        $validatedData = $request->validated();

        // Automatically assign status based on entrance exam score
        $score = $validatedData['entrance_exam_score'] ?? null;

        if (is_null($score)) {
            $validatedData['status'] = 'pending'; // Optional: for applicants without score yet
        } elseif ($score < 30) {
            $validatedData['status'] = 'failed';
        } else {
            $validatedData['status'] = 'pending';
        }

        $applicant->update($validatedData);

        $user = Auth::user();
        $role = $user ? DB::table('model_has_roles')
            ->join('roles', 'roles.id', '=', 'model_has_roles.role_id')
            ->where('model_has_roles.model_id', $user->id)
            ->value('roles.name') : null;
        if ($role === 'teacher') {
            return redirect()->route('teacher.applicants.index')->with('success', 'Applicant updated successfully.');
        }

        return redirect()->route('admin.applicants.index')->with('success', 'Applicant updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Applicant $applicant)
    {
        $applicant->delete();

        $user = Auth::user();
        $role = $user ? DB::table('model_has_roles')
            ->join('roles', 'roles.id', '=', 'model_has_roles.role_id')
            ->where('model_has_roles.model_id', $user->id)
            ->value('roles.name') : null;
        if ($role === 'teacher') {
            return redirect()->route('teacher.applicants.index')->with('success', 'Applicant deleted successfully.');
        }

        return redirect()->route('admin.applicants.index')->with('success', 'Applicant deleted successfully.');
    }

    public function bulkDelete(Request $request)
    {
        // dd($request->all());
        $ids = $request->input('ids');

        if (empty($ids)) {
            return back()->withErrors(['ids' => 'No IDs provided']);
        }

        Applicant::whereIn('id', $ids)->delete();

        return redirect()->back()->with('success', 'Selected rows deleted successfully.');
    }
}
