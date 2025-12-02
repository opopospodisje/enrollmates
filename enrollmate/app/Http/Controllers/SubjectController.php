<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use App\Models\ClassGroupSubject;
use App\Models\ClassGroup;
use App\Models\GradeLevel;
use App\Models\Section;
use App\Models\Enrollment;
use App\Models\Teacher;
use App\Http\Requests\StoreSubjectRequest;
use App\Http\Requests\UpdateSubjectRequest;
use Illuminate\Http\Request;

class SubjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filter = $request->get('filter', 'all');

        $subjectsQuery = Subject::select( 'id', 'code', 'name','is_special');

    
        if ($filter === 'is_special') {
            $subjectsQuery->where('is_special', true);
        }

        $classGroupSubject = ClassGroupSubject::with(['classGroup', 'subject', 'teacher'])
            ->select('id', 'class_group_id', 'subject_id', 'teacher_id')
            ->get()
            ->map(function ($classGroupSubject) {
                return [
                    'id' => $classGroupSubject->id,
                    'class_group_id' => $classGroupSubject->class_group_id,
                    'subject_id' => $classGroupSubject->subject_id,
                    'teacher_id' => $classGroupSubject->teacher_id,
                    'class_group_name' => ($classGroupSubject->classGroup->section->name ?? 'N/A') . ' - ' . ($classGroupSubject->classGroup->section->gradeLevel->name ?? 'N/A'),
                    'subject_name' => $classGroupSubject->subject->name ?? 'N/A',
                    'teacher_name' => ($classGroupSubject->teacher->last_name ?? 'N/A') . ', ' . ($classGroupSubject->teacher->first_name ?? 'N/A'),
                ];
            });

        $subject =  $subjectsQuery
            ->get()
            ->map(function ($subject) {
                return [
                    'id' => $subject->id,
                    'code' => $subject->code,
                    'name' => $subject->name,
                    'is_special' =>$subject->is_special,
                ];
            });

        return inertia('admin/subject/index', [
            'classGroupSubjects' => $classGroupSubject,
            'subjects' => $subject,
            'classGroups' => ClassGroup::with(['section.gradeLevel', 'schoolYear'])
                ->get(['id', 'section_id', 'school_year_id'])
                ->map(function ($classGroup) {
                    return [
                        'id' => $classGroup->id,
                        'section_name' => $classGroup->section->name ?? 'N/A',
                        'school_year_name' => $classGroup->schoolYear->name ?? 'N/A',
                        'grade_level_name' => $classGroup->section->gradeLevel->name ?? 'N/A',
                    ];
                }),
            'teachers' => Teacher::select('id', 'first_name', 'last_name')->get(),
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
    public function store(StoreSubjectRequest $request)
    {
        $validated = $request->validated();

        Subject::create($validated);

        return redirect()->route('admin.subjects.index')->with('success', 'Subject created successfully.');
    }

    /**
     * Display the specified resource.
     */
public function show(Subject $subject, Request $request)
{
    // Get filters from query parameters
    $selectedLevel = $request->query('level', 'allLevels');
    $selectedSection = $request->query('section', 'allSections');
    $selectedGender = $request->query('gender', 'allGenders');

    // Eager load related data for subject
    $subject->load([
        'classGroupSubjects.classGroup.section.gradeLevel',
        'classGroupSubjects.classGroup.schoolYear',
        'classGroupSubjects.teacher'
    ]);

    // Get class group IDs for this subject
    $classGroupIds = $subject->classGroupSubjects()->pluck('class_group_id');

    // Base query for enrollments
    $enrollmentsQuery = Enrollment::with([
        'student:id,first_name,last_name,middle_name,suffix,gender',
        'classGroup.section.gradeLevel:id,name',
        'classGroup.schoolYear:id,name'
    ])
    ->whereIn('class_group_id', $classGroupIds);

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
            $q->where('gender', $selectedGender);
        });
    }


    // Map enrollments to format student data
    $students = $enrollmentsQuery->get()->map(function ($enrollment) {
        return [
            'id' => $enrollment->student->id,
            'full_name' => trim(
                $enrollment->student->last_name . ', ' .
                $enrollment->student->first_name . ' ' .
                ($enrollment->student->middle_name ?? '') . ' ' .
                ($enrollment->student->suffix ?? '')
            ),
            'class_group' => sprintf(
                '%s - %s (%s)',
                $enrollment->classGroup->section->gradeLevel->name ?? 'No Grade',
                $enrollment->classGroup->section->name ?? 'No Section',
                $enrollment->classGroup->schoolYear->name ?? 'No SY'
            ),
            'gender' => $enrollment->student->gender,
        ];
    });

    // Get all grade levels and sections for filters
    $gradeLevels = GradeLevel::select('id', 'name')->get();

    $sectionsQuery = Section::select('id', 'name', 'grade_level_id');
    if ($selectedLevel !== 'allLevels') {
        $sectionsQuery->where('grade_level_id', $selectedLevel);
    }
    $sections = $sectionsQuery->get();

    return inertia('teacher/subject/show', [
        'subject' => $subject,
        'students' => $students,
        'gradeLevels' => $gradeLevels,
        'sections' => $sections,
        'selectedLevel' => $selectedLevel,
        'selectedSection' => $selectedSection,
        'selectedGender' => $selectedGender,
    ]);
}

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Subject $subject)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSubjectRequest $request, Subject $subject)
    {
        $validated = $request->validated();

        $subject->update($validated);

        return redirect()->route('admin.subjects.index')->with('success', 'Subject updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Subject $subject)
    {
        $subject->delete();

        return redirect()->route('admin.subjects.index')->with('success', 'Subject deleted successfully.');
    }

    public function bulkDelete(Request $request)
    {
        //dd($request->all());
        $ids = $request->input('ids');

        if (empty($ids)) {
            return back()->withErrors(['ids' => 'No IDs provided']);
        }

        Subject::whereIn('id', $ids)->delete();

        return redirect()->back()->with('success', 'Selected rows deleted successfully.');
    }
}
