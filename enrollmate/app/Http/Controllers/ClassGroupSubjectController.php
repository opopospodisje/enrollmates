<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreClassGroupSubjectRequest;
use App\Http\Requests\UpdateClassGroupSubjectRequest;
use App\Models\ClassGroup;
use App\Models\ClassGroupSubject;
use App\Models\Enrollment;
use App\Models\Grade;
use App\Models\SchoolSettings;
use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ClassGroupSubjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $classGroupSubject = ClassGroupSubject::with(['classGroup', 'subject', 'teacher'])
            ->select('id', 'class_group_id', 'subject_id', 'teacher_id')
            ->get()
            ->map(function ($classGroupSubject) {
                return [
                    'id' => $classGroupSubject->id,
                    'class_group_id' => $classGroupSubject->class_group_id,
                    'subject_id' => $classGroupSubject->subject_id,
                    'teacher_id' => $classGroupSubject->teacher_id,
                    'class_group_name' => ($classGroupSubject->classGroup->section->name ?? 'N/A').' - '.($classGroupSubject->classGroup->section->gradeLevel->name ?? 'N/A'),
                    'subject_name' => $classGroupSubject->subject->name ?? 'N/A',
                    'teacher_name' => ($classGroupSubject->teacher->last_name ?? 'N/A').', '.($classGroupSubject->teacher->first_name ?? 'N/A'),
                ];
            });

        return inertia('admin/classgroupsubject/index', [
            'classGroupSubjects' => $classGroupSubject,
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
            'subjects' => Subject::select('id', 'name')->get(),
            'teachers' => Teacher::select('id', 'first_name', 'last_name')->get(),
        ]);
    }

    public function teacherClassGroupSubjectIndex()
    {
        $teacher = Teacher::where('user_id', auth()->id())->firstOrFail();

        $classGroupSubject = ClassGroupSubject::with(['classGroup.section.gradeLevel', 'subject', 'teacher'])
            ->where('teacher_id', $teacher->id) // ✅ Only subjects for this teacher
            ->select('id', 'class_group_id', 'subject_id', 'teacher_id')
            ->get()
            ->map(function ($classGroupSubject) {
                return [
                    'id' => $classGroupSubject->id,
                    'class_group_id' => $classGroupSubject->class_group_id,
                    'subject_id' => $classGroupSubject->subject_id,
                    'teacher_id' => $classGroupSubject->teacher_id,
                    'class_group_name' => ($classGroupSubject->classGroup->section->name ?? 'N/A').
                                        ' - '.($classGroupSubject->classGroup->section->gradeLevel->name ?? 'N/A'),
                    'subject_name' => $classGroupSubject->subject->name ?? 'N/A',
                    'teacher_name' => ($classGroupSubject->teacher->last_name ?? 'N/A').', '.
                                    ($classGroupSubject->teacher->first_name ?? 'N/A'),
                ];
            });

        return inertia('teacher/classgroupsubject/index', [
            'classGroupSubjects' => $classGroupSubject,
        ]);
    }

    public function teacherSubjects()
    {
        // Get the teacher's information based on the authenticated user
        $teacher = Teacher::where('user_id', auth()->id())->firstOrFail();

        // Fetch class group subjects related to this teacher, then retrieve the subjects
        $classGroupSubjects = ClassGroupSubject::with(['subject'])
            ->where('teacher_id', $teacher->id) // Only get subjects for this teacher
            ->get();

        // Extract the subject IDs from class group subjects
        $subjectIds = $classGroupSubjects->pluck('subject_id');

        // Fetch only the subjects that match the extracted subject IDs
        $teacherSubjects = Subject::whereIn('id', $subjectIds)
            ->select(['id', 'name', 'code'])
            ->get();

        // Return the data to the Inertia page
        return inertia('teacher/subject/index', [
            'teacherSubjects' => $teacherSubjects,
        ]);
    }

    public function classGroupSubjectGrades($classGroupId, $classGroupSubjectId)
    {
        // Get the ClassGroupSubject with its subject & teacher
        $classGroupSubject = ClassGroupSubject::with(['subject', 'teacher', 'classGroup.section.gradeLevel', 'classGroup.schoolYear'])
            ->where('id', $classGroupSubjectId)
            ->where('class_group_id', $classGroupId)
            ->firstOrFail();

        // Get all enrollments in the ClassGroup
        $enrollments = Enrollment::with(['student', 'grades' => function ($q) use ($classGroupSubjectId) {
            // Only fetch grades for this subject
            $q->where('class_group_subject_id', $classGroupSubjectId)
                ->with('classGroupSubject.subject', 'classGroupSubject.teacher');
        }])
            ->where('class_group_id', $classGroupId)
            ->get();

        // Format data
        $studentsWithGrades = $enrollments->map(function ($enrollment) {
            $grade = $enrollment->grades->first();

            return [
                'enrollment_id' => $enrollment->id,
                'student_id' => $enrollment->student->id,
                'student_name' => $enrollment->student->last_name.', '.$enrollment->student->first_name,
                'first_quarter' => $grade?->first_quarter,
                'second_quarter' => $grade?->second_quarter,
                'third_quarter' => $grade?->third_quarter,
                'fourth_quarter' => $grade?->fourth_quarter,
                'final_grade' => $grade?->final_grade,
            ];
        });

        $settings = SchoolSettings::all();

        return inertia('teacher/classgroupsubject/classGrade', [
            'classGroupSubject' => $classGroupSubject,
            'grades' => $studentsWithGrades,
            'settings' => $settings,
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
    public function store(StoreClassGroupSubjectRequest $request)
    {
        $validated = $request->validated();

        // Create the new ClassGroupSubject
        $classGroupSubject = ClassGroupSubject::create($validated);

        // Find all enrollments in this class group
        $enrollments = Enrollment::where('class_group_id', $classGroupSubject->class_group_id)->get();

        foreach ($enrollments as $enrollment) {
            // Only create if it doesn't exist yet
            Grade::firstOrCreate([
                'enrollment_id' => $enrollment->id,
                'class_group_subject_id' => $classGroupSubject->id,
            ]);
        }

        return redirect()->route('admin.subjects.index')->with('success', 'Class Group Subject created successfully and grade records added for all enrolled students.');
    }

    /**
     * Display the specified resource.
     */
    public function show(ClassGroupSubject $classGroupSubject)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ClassGroupSubject $classGroupSubject)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateClassGroupSubjectRequest $request, ClassGroupSubject $classGroupSubject)
    {
        $validated = $request->validated();

        $classGroupSubject->update($validated);

        return redirect()->route('admin.subjects.index')->with('success', 'Class Group Subject updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ClassGroupSubject $classGroupSubject)
    {
        $classGroupSubject->delete();

        return redirect()->route('admin.subjects.index')->with('success', 'Class Group Subject deleted successfully.');
    }

    public function bulkDelete(Request $request)
    {
        // dd($request->all());
        $ids = $request->input('ids');

        if (empty($ids)) {
            return back()->withErrors(['ids' => 'No IDs provided']);
        }

        ClassGroupSubject::whereIn('id', $ids)->delete();

        return redirect()->back()->with('success', 'Selected rows deleted successfully.');
    }

    public function updateClassGroupSubjectGrades(Request $request, ClassGroupSubject $classGroupSubject)
    {
        // Validate directly here
        $validated = $request->validate([
            'grades' => 'required|array',
            'grades.*.enrollment_id' => 'required|exists:enrollments,id',
            'grades.*.first_quarter' => 'nullable|numeric|min:0|max:100',
            'grades.*.second_quarter' => 'nullable|numeric|min:0|max:100',
            'grades.*.third_quarter' => 'nullable|numeric|min:0|max:100',
            'grades.*.fourth_quarter' => 'nullable|numeric|min:0|max:100',
            'grades.*.final_grade' => 'nullable|numeric|min:0|max:100',
        ]);

        $gradesData = $validated['grades'];

        DB::transaction(function () use ($gradesData, $classGroupSubject) {
            foreach ($gradesData as $g) {
                Grade::updateOrCreate(
                    [
                        'enrollment_id' => $g['enrollment_id'],
                        'class_group_subject_id' => $classGroupSubject->id,
                    ],
                    [
                        'first_quarter' => $g['first_quarter'] ?? null,
                        'second_quarter' => $g['second_quarter'] ?? null,
                        'third_quarter' => $g['third_quarter'] ?? null,
                        'fourth_quarter' => $g['fourth_quarter'] ?? null,
                        'final_grade' => $g['final_grade'] ?? null,
                    ]
                );
            }
        });

        return redirect()->back()->with('success', 'Grades updated successfully.');
    }
}
