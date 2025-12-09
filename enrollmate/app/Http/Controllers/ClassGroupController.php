<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreClassGroupRequest;
use App\Http\Requests\UpdateClassGroupRequest;
use App\Models\ClassGroup;
use App\Models\Enrollment;
use App\Models\SchoolYear;
use App\Models\Section;
use Illuminate\Http\Request;

class ClassGroupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $classGroups = ClassGroup::with(['section.gradeLevel', 'schoolYear'])
            ->select('id', 'section_id', 'school_year_id', 'student_limit') // 'adviser_id'
            ->withCount('enrollments')
            ->get()
            ->map(function ($classGroup) {
                return [
                    'id' => $classGroup->id,
                    'section_id' => $classGroup->section_id,
                    'school_year_id' => $classGroup->school_year_id,
                    'section_name' => $classGroup->section->name ?? 'N/A',
                    'school_year_name' => $classGroup->schoolYear->name ?? 'N/A',
                    'grade_level_name' => $classGroup->section->gradeLevel->name ?? 'N/A',
                    'section_and_level' => $classGroup->section->name.' - '.($classGroup->section->gradeLevel->name ?? 'N/A'),
                    // 'adviser_id' => $classGroup->adviser_id,
                    'student_limit' => $classGroup->student_limit,
                    'enrollments_count' => $classGroup->enrollments_count, // ← here it is!
                ];
            });

        return inertia('admin/classgroup/index', [
            'classGroups' => $classGroups,
            'sections' => Section::with('gradeLevel')
                ->get(),
            'schoolYears' => SchoolYear::all(),
            'schoolYear' => SchoolYear::where('is_active', true)->first(),
        ]);
    }

    public function topStudentsByClassGroups()
    {
        $classGroups = ClassGroup::with(['section.gradeLevel', 'schoolYear'])
            ->select('id', 'section_id', 'school_year_id', 'student_limit') // 'adviser_id'
            ->withCount('enrollments')
            // Fix the whereHas to filter schoolYear's 'is_active' column
            ->whereHas('schoolYear', function ($query) {
                $query->where('is_active', true);
            })
            ->get()
            ->map(function ($classGroup) {
                return [
                    'id' => $classGroup->id,
                    'section_id' => $classGroup->section_id,
                    'school_year_id' => $classGroup->school_year_id,
                    'section_name' => $classGroup->section->name ?? 'N/A',
                    'school_year_name' => $classGroup->schoolYear->name ?? 'N/A',
                    'grade_level_name' => $classGroup->section->gradeLevel->name ?? 'N/A',
                    'section_and_level' => $classGroup->section->name.' - '.($classGroup->section->gradeLevel->name ?? 'N/A'),
                    // 'adviser_id' => $classGroup->adviser_id,
                    'student_limit' => $classGroup->student_limit,
                    'enrollments_count' => $classGroup->enrollments_count, // ← this looks good!
                ];
            });

        return inertia('admin/classgroup/top-student-index', [
            'classGroups' => $classGroups,
            'sections' => Section::with('gradeLevel')->get(),
            'schoolYears' => SchoolYear::all(),
            'schoolYear' => SchoolYear::where('is_active', true)->first(),
        ]);
    }

    public function teacherIndex()
    {
        $classGroups = ClassGroup::with(['section.gradeLevel', 'schoolYear'])
            ->select('id', 'section_id', 'school_year_id') // 'adviser_id'
            ->get()
            ->map(function ($classGroup) {
                return [
                    'id' => $classGroup->id,
                    'section_id' => $classGroup->section_id,
                    'school_year_id' => $classGroup->school_year_id,
                    'section_name' => $classGroup->section->name ?? 'N/A',
                    'school_year_name' => $classGroup->schoolYear->name ?? 'N/A',
                    'grade_level_name' => $classGroup->section->gradeLevel->name ?? 'N/A',
                    'section_and_level' => $classGroup->section->name.' - '.($classGroup->section->gradeLevel->name ?? 'N/A'),
                    // 'adviser_id' => $classGroup->adviser_id,
                ];
            });

        return inertia('teacher/classgroup/index', [
            'classGroups' => $classGroups,
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
    public function store(StoreClassGroupRequest $request)
    {
        $validated = $request->validated();

        ClassGroup::create($validated);

        return redirect()->route('admin.classgroups.index')->with('success', 'Class Group created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function topStudentsByClassGroupsShow(ClassGroup $classGroup)
    {
        $enrollments = Enrollment::with([
            'student:id,first_name,last_name,middle_name,suffix,gender',
            'grades.classGroupSubject.subject',
        ])
            ->where('class_group_id', $classGroup->id)
            ->get();

        $gradingPeriods = ['first_quarter', 'second_quarter', 'third_quarter', 'fourth_quarter'];
        $topStudentsByGrading = [];

        foreach ($gradingPeriods as $grading) {
            $studentsWithAverage = $enrollments->map(function ($enrollment) use ($grading) {
                $grades = $enrollment->grades;

                $total = $grades->sum($grading);
                $count = $grades->whereNotNull($grading)->count();

                $average = $count > 0 ? $total / $count : null;

                return [
                    'id' => $enrollment->student->id,
                    'name' => trim(
                        $enrollment->student->last_name.', '.
                        $enrollment->student->first_name.' '.
                        ($enrollment->student->middle_name ?? '').' '.
                        ($enrollment->student->suffix ?? '')
                    ),
                    'gender' => $enrollment->student->gender,
                    'average' => $average,
                ];
            })
                ->filter(fn ($student) => $student['average'] !== null)
                ->sortByDesc('average')
                ->take(10)
                ->values();

            $topStudentsByGrading[$grading] = $studentsWithAverage;
        }

        $classGroup->load('section.gradeLevel', 'schoolYear');

        return inertia('admin/classgroup/top-student-show', [
            'classGroup' => $classGroup,
            'topStudentsByGrading' => $topStudentsByGrading,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ClassGroup $classGroup)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateClassGroupRequest $request, ClassGroup $classGroup)
    {
        $validated = $request->validated();

        $classGroup->update($validated);

        return redirect()->route('admin.classgroups.index')->with('success', 'Class Group updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ClassGroup $classGroup)
    {
        $classGroup->delete();

        return redirect()->route('admin.classgroups.index')->with('success', 'Class Group deleted successfully.');
    }

    public function bulkDelete(Request $request)
    {
        // dd($request->all());
        $ids = $request->input('ids');

        if (empty($ids)) {
            return back()->withErrors(['ids' => 'No IDs provided']);
        }

        ClassGroup::whereIn('id', $ids)->delete();

        return redirect()->back()->with('success', 'Selected rows deleted successfully.');
    }
}
