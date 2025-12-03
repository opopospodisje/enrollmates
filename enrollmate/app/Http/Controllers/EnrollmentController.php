<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use App\Models\ClassGroup;
use App\Models\Student;
use App\Models\ClassGroupSubject;
use App\Models\GradeLevel;
use App\Models\Grade;
use App\Models\Section;
use App\Models\SchoolYear;
use App\Http\Requests\StoreEnrollmentRequest;
use App\Http\Requests\UpdateEnrollmentRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class EnrollmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $activeSchoolYearId = SchoolYear::where('is_active', true)->value('id');

        $selectedLevel = $request->query('level', 'allLevels');
        $selectedSection = $request->query('section', 'allSections');
        $selectedSchoolYear = $request->query('schoolYear', $activeSchoolYearId);   

        // Get all Grade Levels
        $gradeLevels = GradeLevel::select('id', 'name')->get();

        // Get all School Years
        $schoolYears = SchoolYear::select('id', 'name', 'is_active')->get();

        // Get Sections filtered by grade level
        $sectionsQuery = Section::select('id', 'name', 'grade_level_id');
        if ($selectedLevel !== 'allLevels') {
            $sectionsQuery->where('grade_level_id', $selectedLevel);
        }
        $sections = $sectionsQuery->get();

        // Enrollment base query
        $enrollmentQuery = Enrollment::select(
            'id', 'student_id', 'class_group_id', 'enrolled_at', 'status'
        );

        // ✅ Filter by grade level if selected
        if ($selectedLevel !== 'allLevels') {
            $enrollmentQuery->whereHas('classGroup.section', function ($query) use ($selectedLevel) {
                $query->where('grade_level_id', $selectedLevel);
            });
        }

        // ✅ Filter by section if selected
        if ($selectedSection !== 'allSections') {
            $enrollmentQuery->whereHas('classGroup.section', function ($query) use ($selectedSection) {
                $query->where('id', $selectedSection);
            });
        }

        // ✅ Filter by school year
        if ($selectedSchoolYear) {
            $enrollmentQuery->whereHas('classGroup.schoolYear', function ($query) use ($selectedSchoolYear) {
                $query->where('id', $selectedSchoolYear);
            });
        }


        // Execute enrollment query
        $enrollments = $enrollmentQuery
            ->with(['student', 'classGroup.section.gradeLevel', 'classGroup.schoolYear'])
            ->latest('enrolled_at')
            ->get()
            ->map(function ($enrollment) {
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
                    'is_special' => $enrollment->classGroup->section->is_special ?? false,
                ];
            });

        // Students (dropdown/reference, not filtered here)
        $students = Student::select('id', 'first_name', 'last_name', 'middle_name', 'suffix')
            ->where('is_graduated', false)
            ->get();

        // Active School Year condition
        $activeSchoolYear = function ($query) {
            $query->where('is_active', true);
        };

        // ClassGroups with active school year
        $classGroups = ClassGroup::with([
                'section.gradeLevel:id,name',
                'schoolYear:id,name,is_active',
            ])
            ->withCount('enrollments')
            ->whereHas('schoolYear', $activeSchoolYear)
            ->get();

        // Return the data
        return inertia('admin/enrollment/index', [
            'enrollments' => $enrollments,
            'students' => $students,
            'classGroups' => $classGroups,
            'gradeLevels' => $gradeLevels,
            'sections' => $sections,
            'schoolYears' => $schoolYears,
            'selectedLevel' => $selectedLevel,
            'selectedSection' => $selectedSection,
            'selectedSchoolYear' => $selectedSchoolYear,
        ]);
    }

    public function teacherIndex(Request $request)
    {
        $user = Auth::user();
        $teacher = $user?->teacher;

        $activeSchoolYearId = SchoolYear::where('is_active', true)->value('id');

        $selectedLevel = $request->query('level', 'allLevels');
        $selectedSection = $request->query('section', 'allSections');
        $selectedSchoolYear = $request->query('schoolYear', $activeSchoolYearId);

        $gradeLevels = GradeLevel::select('id', 'name')->get();
        $schoolYears = SchoolYear::select('id', 'name', 'is_active')->get();

        $sectionsQuery = Section::select('id', 'name', 'grade_level_id');
        if ($selectedLevel !== 'allLevels') {
            $sectionsQuery->where('grade_level_id', $selectedLevel);
        }
        $sections = $sectionsQuery->get();

        $teacherClassGroupIds = ClassGroupSubject::where('teacher_id', $teacher?->id)->pluck('class_group_id')->unique();

        $enrollmentQuery = Enrollment::select('id', 'student_id', 'class_group_id', 'enrolled_at', 'status')
            ->whereIn('class_group_id', $teacherClassGroupIds);

        if ($selectedLevel !== 'allLevels') {
            $enrollmentQuery->whereHas('classGroup.section', function ($query) use ($selectedLevel) {
                $query->where('grade_level_id', $selectedLevel);
            });
        }

        if ($selectedSection !== 'allSections') {
            $enrollmentQuery->whereHas('classGroup.section', function ($query) use ($selectedSection) {
                $query->where('id', $selectedSection);
            });
        }

        if ($selectedSchoolYear) {
            $enrollmentQuery->whereHas('classGroup.schoolYear', function ($query) use ($selectedSchoolYear) {
                $query->where('id', $selectedSchoolYear);
            });
        }

        $enrollments = $enrollmentQuery
            ->with(['student', 'classGroup.section.gradeLevel', 'classGroup.schoolYear'])
            ->latest('enrolled_at')
            ->get()
            ->map(function ($enrollment) {
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
                    'is_special' => $enrollment->classGroup->section->is_special ?? false,
                ];
            });

        $students = Student::select('id', 'first_name', 'last_name', 'middle_name', 'suffix')
            ->where('is_graduated', false)
            ->get();

        $activeSchoolYear = function ($query) {
            $query->where('is_active', true);
        };

        $classGroups = ClassGroup::with([
                'section.gradeLevel:id,name',
                'schoolYear:id,name,is_active',
            ])
            ->withCount('enrollments')
            ->whereHas('schoolYear', $activeSchoolYear)
            ->whereIn('id', $teacherClassGroupIds)
            ->get();

        return inertia('teacher/enrollment/index', [
            'enrollments' => $enrollments,
            'students' => $students,
            'classGroups' => $classGroups,
            'gradeLevels' => $gradeLevels,
            'sections' => $sections,
            'schoolYears' => $schoolYears,
            'selectedLevel' => $selectedLevel,
            'selectedSection' => $selectedSection,
            'selectedSchoolYear' => $selectedSchoolYear,
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
    public function store(StoreEnrollmentRequest $request)
    {
        $validated = $request->validated();

        $user = Auth::user();
        if ($user && $user->hasRole('teacher')) {
            $teacherId = $user->teacher?->id;
            $ownsClass = ClassGroupSubject::where('class_group_id', $validated['class_group_id'])
                ->where('teacher_id', $teacherId)
                ->exists();
            if (!$ownsClass) {
                abort(403);
            }
        }

        $enrollment = Enrollment::create($validated);

        // Get all subjects in this class group
        $subjects = ClassGroupSubject::where('class_group_id', $enrollment->class_group_id)->get();

        // Create blank grades for this student for each subject
        foreach ($subjects as $subject) {
            Grade::create([
                'enrollment_id' => $enrollment->id,
                'class_group_subject_id' => $subject->id,
                'first_quarter' => null,
                'second_quarter' => null,
                'third_quarter' => null,
                'fourth_quarter' => null,
                'final_grade' => null,
            ]);
        }

        if ($user && $user->hasRole('teacher')) {
            return redirect()->route('teacher.enrollments.index')->with('success', 'Enrollment created successfully.');
        }
        return redirect()->route('admin.enrollments.index')->with('success', 'Enrollment created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Enrollment $enrollment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Enrollment $enrollment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEnrollmentRequest $request, Enrollment $enrollment)
    {
        $validated = $request->validated();

         $enrollment->update($validated);

        return redirect()->back()->with('success', 'Enrollment created successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Enrollment $enrollment)
    {
        $enrollment->delete();

        return redirect()->route('admin.enrollments.index')->with('success', 'Section deleted successfully.');
    }
}
