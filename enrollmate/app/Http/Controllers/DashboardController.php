<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\Applicant;
use App\Models\Teacher;
use App\Models\Section;
use App\Models\ClassGroup;
use App\Models\Enrollment;
use App\Models\SchoolYear;
use App\Models\ClassGroupSubject;
use App\Models\Alumni;


class DashboardController extends Controller
{
    public function index()
    {
        $admin = auth()->user();

        $activeSchoolYear = SchoolYear::where('is_active', true)->first();

        $recentEnrollments = Enrollment::with('student', 'classGroup.section.gradeLevel')
            ->whereHas('classGroup')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($enrollment) {
                return [
                    'id' => $enrollment->id,
                    'student' => [
                        'first_name' => $enrollment->student->first_name ?? 'N/A',
                        'last_name' => $enrollment->student->last_name ?? 'N/A',
                    ],
                    'classGroup' => $enrollment->classGroup ? [
                        'section' => $enrollment->classGroup->section ? [
                            'name' => $enrollment->classGroup->section->name ?? 'N/A',
                            'gradeLevel' => $enrollment->classGroup->section->gradeLevel ? [
                                'name' => $enrollment->classGroup->section->gradeLevel->name ?? 'N/A'
                            ] : null,
                        ] : null,
                    ] : null,
                    'enrolled_at' => $enrollment->enrolled_at,
                ];
            });

        $pendingApplicants = Applicant::where('status', 'pending')->get();

        $alumniStats = Alumni::select('employment_status')
            ->selectRaw('COUNT(*) as total')
            ->groupBy('employment_status')
            ->get()
            ->map(function ($row) {
                return [
                    'stats' => $row->employment_status,
                    'total' => $row->total,
                ];
            });

        // ✅ Student gender counts
        $totalStudents = Student::count();
        $maleStudents = Student::where('gender', 'male')->count();
        $femaleStudents = Student::where('gender', 'female')->count();

        return inertia('admin/dashboard', [
            'admin' => $admin,
            'totalStudents' => $totalStudents,
            'maleStudents' => $maleStudents,
            'femaleStudents' => $femaleStudents,
            'totalApplicants' => Applicant::count(),
            'totalTeachers' => Teacher::count(),
            'totalSections' => Section::count(),
            'totalClassGroups' => ClassGroup::count(),
            'activeSchoolYear' => $activeSchoolYear,
            'recentEnrollments' => $recentEnrollments,
            'pendingApplicants' => $pendingApplicants,
            'alumniStats' => $alumniStats,
        ]);
    }

    public function teacherIndex()
    {
        $teacher = auth()->user()->teacher;
        $activeSchoolYear = SchoolYear::where('is_active', true)->first();

        // Get class group IDs where the teacher is assigned
        $classGroupIds = ClassGroupSubject::where('teacher_id', $teacher->id)
            ->pluck('class_group_id');

        // Count total students
        $totalStudents = Enrollment::whereIn('class_group_id', $classGroupIds)->count();

        // Count subjects assigned
        $totalSubjectsAssigned = ClassGroupSubject::where('teacher_id', $teacher->id)->count();

        // Count total classes (unique class groups)
        $totalClasses = $classGroupIds->unique()->count();

        // Get recent enrollments in those class groups
        $recentStudents = Enrollment::with('student', 'classGroup.section.gradeLevel')
            ->whereIn('class_group_id', $classGroupIds)
            ->latest()
            ->take(5)
            ->get()
            ->map(function($enrollment) {
                return [
                    'id' => $enrollment->student->id,
                    'first_name' => $enrollment->student->first_name,
                    'last_name' => $enrollment->student->last_name,
                    'class_group' => ($enrollment->classGroup->section->name ?? 'N/A') . 
                                    ' - ' . ($enrollment->classGroup->section->gradeLevel->name ?? 'N/A'),
                ];
            });

        return inertia('teacher/dashboard', [
            'teacher' => $teacher,
            'activeSchoolYear' => $activeSchoolYear,
            'totalStudents' => $totalStudents,
            'totalSubjectsAssigned' => $totalSubjectsAssigned,
            'totalClasses' => $totalClasses,
            'recentStudents' => $recentStudents,
        ]);
    }


}
