<?php

namespace App\Http\Controllers;

use App\Models\Grade;
use App\Models\Student;
use App\Models\Enrollment;
use App\Models\GradeLevel;
use App\Models\Section;
use App\Models\ClassGroupSubject;
use App\Models\ClassGroup;
use App\Models\SchoolSettings;
use App\Models\SchoolYear;

use App\Http\Requests\StoreGradeRequest;
use App\Http\Requests\UpdateGradeRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class GradeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $selectedLevel = $request->query('level', 'allLevels');
        $selectedSection = $request->query('section', 'allSections');
        $selectedGender = $request->query('gender', 'allGenders');

        // Get all Grade Levels
        $gradeLevels = GradeLevel::select('id', 'name')->get();

        // Get Sections filtered by grade level
        $sectionsQuery = Section::select('id', 'name', 'grade_level_id');
        if ($selectedLevel !== 'allLevels') {
            $sectionsQuery->where('grade_level_id', $selectedLevel);
        }
        
        $sections = $sectionsQuery->get();

        // Get the current active school year
        $activeSchoolYear = SchoolYear::where('is_active', true)->first();

        if (!$activeSchoolYear) {
            // Handle case when there's no active school year
            return response()->json(['message' => 'No active school year found'], 404);
        }

        // Query enrollments with filters, only for active school year
        $enrollmentsQuery = Enrollment::with([
            'student:id,last_name,first_name,middle_name,suffix,gender,is_graduated',
            'classGroup.section.gradeLevel:id,name',
            'classGroup.schoolYear:id,name'
        ])
        ->select('id', 'student_id', 'class_group_id', 'enrolled_at', 'status')
        ->whereHas('classGroup.schoolYear', function ($query) use ($activeSchoolYear) {
            $query->where('id', $activeSchoolYear->id); // Only consider enrollments for active school year
        })
        ->whereHas('student', function ($query) {
            $query->where('is_graduated', false); // Only students who are not graduated
        });

        // Filter by grade level
        if ($selectedLevel !== 'allLevels') {
            $enrollmentsQuery->whereHas('classGroup.section.gradeLevel', function ($q) use ($selectedLevel) {
                $q->where('id', $selectedLevel);
            });
        }

        // Filter by section
        if ($selectedSection !== 'allSections') {
            $enrollmentsQuery->whereHas('classGroup.section', function ($q) use ($selectedSection) {
                $q->where('id', $selectedSection);
            });
        }

        // Filter by gender
        if ($selectedGender !== 'allGenders') {
            $enrollmentsQuery->whereHas('student', function ($q) use ($selectedGender) {
                $q->where('gender', $selectedGender);  // Directly filter by gender column
            });
        }

        // Get data
        $enrollments = $enrollmentsQuery->get()->map(function ($enrollment) {
            return [
                'id' => $enrollment->id,
                'student_id' => $enrollment->student_id,
                'student_name' => trim(
                    $enrollment->student->last_name . ', ' .
                    $enrollment->student->first_name . ' ' .
                    ($enrollment->student->middle_name ?? '') . ' ' .
                    ($enrollment->student->suffix ?? '')
                ),
                'class_group_id' => $enrollment->class_group_id,
                'class_group_name' => sprintf(
                    '%s - %s (%s)',
                    $enrollment->classGroup->section->gradeLevel->name ?? 'No Grade',
                    $enrollment->classGroup->section->name ?? 'No Section',
                    $enrollment->classGroup->schoolYear->name ?? 'No SY'
                ),
                'gender' => $enrollment->student->gender,
                'enrolled_at' => $enrollment->enrolled_at,
                'status' => $enrollment->status,
            ];
        });

        return inertia('admin/grade/index', [
            'enrollments' => $enrollments,
            'gradeLevels' => $gradeLevels,
            'sections' => $sections,
            'selectedLevel' => $selectedLevel,
            'selectedSection' => $selectedSection,
            'selectedGender' => $selectedGender,
        ]);
    }

    public function teacherIndex(Request $request)
    {
        $teacher = auth()->user()->teacher; // Get the logged-in teacher
        $selectedLevel = $request->query('level', 'allLevels');
        $selectedSection = $request->query('section', 'allSections');
        $selectedGender = $request->query('gender', 'allGenders');

        // Get all Grade Levels
        $gradeLevels = GradeLevel::select('id', 'name')->get();

        // Get Sections filtered by grade level
        $sectionsQuery = Section::select('id', 'name', 'grade_level_id');
        if ($selectedLevel !== 'allLevels') {
            $sectionsQuery->where('grade_level_id', $selectedLevel);
        }
        $sections = $sectionsQuery->get();

        // Get class group IDs assigned to this teacher
        $classGroupIds = ClassGroupSubject::where('teacher_id', $teacher->id)
            ->pluck('class_group_id');

        // Query enrollments only for those class groups and active school year
        $enrollmentsQuery = Enrollment::with([
            'student:id,last_name,first_name,middle_name,suffix,gender',
            'classGroup.section.gradeLevel:id,name',
            'classGroup.schoolYear:id,name'
        ])
        ->select('id', 'student_id', 'class_group_id', 'enrolled_at', 'status')
        ->whereIn('class_group_id', $classGroupIds)
        ->whereHas('classGroup.schoolYear', function ($q) {
            $q->where('is_active', true);
        });

        // Filter by grade level
        if ($selectedLevel !== 'allLevels') {
            $enrollmentsQuery->whereHas('classGroup.section.gradeLevel', function ($q) use ($selectedLevel) {
                $q->where('id', $selectedLevel);
            });
        }

        // Filter by section
        if ($selectedSection !== 'allSections') {
            $enrollmentsQuery->whereHas('classGroup.section', function ($q) use ($selectedSection) {
                $q->where('id', $selectedSection);
            });
        }

        // Filter by gender
        if ($selectedGender !== 'allGenders') {
            $enrollmentsQuery->whereHas('student', function ($q) use ($selectedGender) {
                $q->where('gender', $selectedGender);  // Directly filter by gender column
            });
        }

        // Get data
        $enrollments = $enrollmentsQuery->get()->map(function ($enrollment) {
            return [
                'id' => $enrollment->id,
                'student_id' => $enrollment->student_id,
                'student_name' => trim(
                    $enrollment->student->last_name . ', ' .
                    $enrollment->student->first_name . ' ' .
                    ($enrollment->student->middle_name ?? '') . ' ' .
                    ($enrollment->student->suffix ?? '')
                ),
                'class_group_id' => $enrollment->class_group_id,
                'class_group_name' => sprintf(
                    '%s - %s (%s)',
                    $enrollment->classGroup->section->gradeLevel->name ?? 'No Grade',
                    $enrollment->classGroup->section->name ?? 'No Section',
                    $enrollment->classGroup->schoolYear->name ?? 'No SY'
                ),
                'enrolled_at' => $enrollment->enrolled_at,
                'status' => $enrollment->status,
                'gender' => $enrollment->student->gender,
            ];
        });

        return inertia('teacher/grade/index', [
            'enrollments' => $enrollments,
            'gradeLevels' => $gradeLevels,
            'sections' => $sections,
            'selectedLevel' => $selectedLevel,
            'selectedSection' => $selectedSection,
            'selectedGender' => $selectedGender,
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
    public function store(StoreGradeRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Grade $grade)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Enrollment $enrollment)
    {
        
        $enrollment->load('student', 'classGroup.section.gradeLevel', 'classGroup.schoolYear');
        //dd($enrollment);

        // Load grades with subject + teacher info
        $grades = $enrollment->grades()->with('classGroupSubject.subject', 'classGroupSubject.teacher')->get();

        //dd($grades);

        $settings = SchoolSettings::all();

        return inertia('admin/grade/edit', [
            'enrollment' => $enrollment,
            'grades' => $grades,
            'settings' => $settings,
        ]);
    }

    public function teacherEdit(Enrollment $enrollment)
    {
        $teacherId = auth()->user()->teacher->id;

        // Load enrollment relationships
        $enrollment->load('student', 'classGroup.section.gradeLevel', 'classGroup.schoolYear');

        // Load only grades for subjects assigned to the logged-in teacher
        $grades = $enrollment->grades()
            ->whereHas('classGroupSubject', function ($q) use ($teacherId) {
                $q->where('teacher_id', $teacherId);
            })
            ->with('classGroupSubject.subject', 'classGroupSubject.teacher')
            ->get();

        $settings = SchoolSettings::all();

        return inertia('teacher/grade/edit', [
            'enrollment' => $enrollment,
            'grades' => $grades,
            'settings' => $settings,
        ]);
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGradeRequest $request, Enrollment $enrollment)
    {
        //dd($request->validated());

        $gradesData = $request->validated()['grades'];

        DB::transaction(function () use ($gradesData, $enrollment) {
            foreach ($gradesData as $g) {
                Grade::where('id', $g['id'])
                    ->where('enrollment_id', $enrollment->id)
                    ->update([
                        'first_quarter'  => $g['first_quarter'] ?? null,
                        'second_quarter' => $g['second_quarter'] ?? null,
                        'third_quarter'  => $g['third_quarter'] ?? null,
                        'fourth_quarter' => $g['fourth_quarter'] ?? null,
                        'final_grade'    => $g['final_grade'] ?? null,
                    ]);
            }
        });

        return redirect()->back()->with('success', 'Grades updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Grade $grade)
    {
        //
    }
}
