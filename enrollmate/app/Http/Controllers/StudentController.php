<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEnrollmentRequest;
use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use App\Models\Alumni;
use App\Models\Applicant;
use App\Models\ClassGroup;
use App\Models\ClassGroupSubject;
use App\Models\Enrollment;
use App\Models\Grade;
use App\Models\GradeLevel;
use App\Models\SchoolSettings;
use App\Models\SchoolYear;
use App\Models\Section;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class StudentController extends Controller
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

        // Build query for students, with optional filters for grade level and section
        $studentsQuery = Student::select(
            'id', 'user_id', 'applicant_id', 'lrn',
            'first_name', 'last_name', 'middle_name', 'suffix',
            'email', 'contact_number', 'address', 'gender', 'birthdate', 'has_special_needs', 'special_needs_type', 'is_4ps'
        )->where('is_graduated', false);

        // Filter by grade level if selected
        if ($selectedLevel !== 'allLevels') {
            $studentsQuery->whereHas('enrollments.classGroup.section', function ($query) use ($selectedLevel) {
                $query->where('grade_level_id', $selectedLevel);
            });
        }

        // Filter by section if selected
        if ($selectedSection !== 'allSections') {
            $studentsQuery->whereHas('enrollments.classGroup.section', function ($query) use ($selectedSection) {
                $query->where('id', $selectedSection);
            });
        }

        if ($selectedGender !== 'allGenders') {
            $studentsQuery->where('gender', $selectedGender);
        }

        $students = $studentsQuery->get()->map(function ($student) {
            $currentEnrollment = $student->enrollments()
                ->whereHas('classGroup.schoolYear', fn ($q) => $q->where('is_active', true))
                ->with('classGroup.section.gradeLevel', 'classGroup.schoolYear')
                ->first();

            return [
                'id' => $student->id,
                'applicant_id' => $student->applicant_id,
                'lrn' => $student->lrn,
                'first_name' => $student->first_name,
                'last_name' => $student->last_name,
                'middle_name' => $student->middle_name,
                'suffix' => $student->suffix,
                'address' => $student->address,
                'birthdate' => $student->birthdate,
                'gender' => $student->gender,
                'full_name' => trim($student->last_name.', '.$student->first_name.' '.($student->middle_name ?? '').' '.($student->suffix ?? '')),
                'email' => $student->email,
                'contact_number' => $student->contact_number,
                'has_special_needs' => $student->has_special_needs,
                'special_needs_type' => $student->special_needs_type,
                'is_4ps' => $student->is_4ps,
                'current_class_name' => $currentEnrollment
                    ? sprintf(
                        '%s - %s (%s)',
                        $currentEnrollment->classGroup->section->gradeLevel->name ?? 'No Grade',
                        $currentEnrollment->classGroup->section->name ?? 'No Section',
                        $currentEnrollment->classGroup->schoolYear->name ?? 'No SY'
                    )
                    : null,
            ];
        });

        // Get all applicant IDs that are already linked to students
        $linkedApplicantIds = $students->pluck('applicant_id')->filter()->unique();

        $pendingApplicants = Applicant::select('id', 'first_name', 'last_name', 'middle_name', 'suffix', 'email', 'contact_number', 'address', 'birthdate', 'gender')
            ->where('status', 'pending')
            ->get();

        // Get applicants that are either pending OR linked to students
        $applicants = Applicant::select('id', 'first_name', 'last_name', 'middle_name', 'suffix', 'email', 'contact_number', 'address', 'birthdate', 'gender')
            ->where(function ($query) use ($linkedApplicantIds) {
                $query->where('status', 'pending')
                    ->orWhereIn('id', $linkedApplicantIds);
            })
            ->get();

        return inertia('admin/student/index', [
            'students' => $students,
            'applicants' => $applicants,
            'pendingApplicants' => $pendingApplicants,
            'gradeLevels' => $gradeLevels,
            'sections' => $sections,
            'selectedLevel' => $selectedLevel,
            'selectedSection' => $selectedSection,
            'selectedGender' => $selectedGender,
        ]);
    }

    public function teacherIndex(Request $request)
    {
        $user = Auth::user();
        $teacher = $user?->teacher;

        $filter = $request->query('filter', 'all');

        $classGroupIds = ClassGroupSubject::where('teacher_id', $teacher?->id)
            ->pluck('class_group_id');

        $studentsQuery = Student::select(
            'id', 'user_id', 'applicant_id', 'lrn',
            'first_name', 'last_name', 'middle_name', 'suffix',
            'email', 'contact_number', 'address', 'gender', 'birthdate'
        )->where('is_graduated', false)
            ->whereHas('enrollments', function ($q) use ($classGroupIds) {
                $q->whereIn('class_group_id', $classGroupIds);
            });

        $students = $studentsQuery->get()->map(function ($student) {
            $currentEnrollment = $student->enrollments()
                ->whereHas('classGroup.schoolYear', fn ($q) => $q->where('is_active', true))
                ->with('classGroup.section.gradeLevel', 'classGroup.schoolYear')
                ->first();

            return [
                'id' => $student->id,
                'applicant_id' => $student->applicant_id,
                'lrn' => $student->lrn,
                'first_name' => $student->first_name,
                'last_name' => $student->last_name,
                'middle_name' => $student->middle_name,
                'suffix' => $student->suffix,
                'address' => $student->address,
                'birthdate' => $student->birthdate,
                'gender' => $student->gender,
                'full_name' => trim($student->last_name.', '.$student->first_name.' '.($student->middle_name ?? '').' '.($student->suffix ?? '')),
                'email' => $student->email,
                'contact_number' => $student->contact_number,
                'current_class_name' => $currentEnrollment
                    ? sprintf(
                        '%s - %s (%s)',
                        $currentEnrollment->classGroup->section->gradeLevel->name ?? 'No Grade',
                        $currentEnrollment->classGroup->section->name ?? 'No Section',
                        $currentEnrollment->classGroup->schoolYear->name ?? 'No SY'
                    )
                    : null,
            ];
        });

        $pendingApplicants = Applicant::select('id', 'first_name', 'last_name', 'middle_name', 'suffix', 'email', 'contact_number', 'address', 'birthdate', 'gender')
            ->where('status', 'pending')
            ->get();

        return inertia('teacher/student/index', [
            'students' => $students,
            'applicants' => [],
            'pendingApplicants' => $pendingApplicants,
        ]);
    }

    public function teacherShow(Student $student)
    {
        $user = Auth::user();
        $teacherId = $user?->teacher?->id;

        $classGroupIds = ClassGroupSubject::where('teacher_id', $teacherId)
            ->pluck('class_group_id');

        $hasEnrollment = Enrollment::where('student_id', $student->id)
            ->whereIn('class_group_id', $classGroupIds)
            ->exists();

        if (! $hasEnrollment) {
            abort(403);
        }

        $latestEnrollment = Enrollment::where('student_id', $student->id)
            ->with(['classGroup.section.gradeLevel', 'classGroup.schoolYear'])
            ->orderByDesc('enrolled_at')
            ->first();

        $studentData = [
            'id' => $student->id,
            'applicant_id' => $student->applicant_id ?? null,
            'lrn' => $student->lrn ?? null,
            'first_name' => $student->first_name,
            'last_name' => $student->last_name,
            'middle_name' => $student->middle_name,
            'suffix' => $student->suffix,
            'email' => $student->email,
            'address' => $student->address,
            'contact_number' => $student->contact_number,
            'gender' => $student->gender,
            'birthdate' => $student->birthdate,
            'full_name' => trim("{$student->last_name}, {$student->first_name} ".($student->middle_name ?? '').' '.($student->suffix ?? '')),
            'current_class_name' => $latestEnrollment ? sprintf(
                '%s - %s (%s)',
                optional($latestEnrollment->classGroup->section->gradeLevel)->name,
                optional($latestEnrollment->classGroup->section)->name,
                optional($latestEnrollment->classGroup->schoolYear)->name
            ) : null,
        ];

        return inertia('teacher/student/show', [
            'student' => $studentData,
        ]);
    }

    public function specialStudentsIndex(Request $request)
    {
        // Get filter values from the request
        $selectedLevel = $request->query('level', 'allLevels');
        $selectedSection = $request->query('section', 'allSections');
        $selectedGender = $request->query('gender', 'allGenders');

        // Get all Grade Levels
        $gradeLevels = GradeLevel::select('id', 'name')->get();

        // Get Sections filtered by grade level and is_special condition
        $sectionsQuery = Section::select('id', 'name', 'grade_level_id');
        if ($selectedLevel !== 'allLevels') {
            $sectionsQuery->where('grade_level_id', $selectedLevel);
        }
        $sectionsQuery->where('is_special', true);  // Adding condition for is_special being true
        $sections = $sectionsQuery->get();

        // Build query for special students, with optional filters for grade level, section, and gender
        $studentsQuery = Student::with([
            'latestEnrollment.classGroup.section.gradeLevel',
            'latestEnrollment.classGroup.schoolYear',
        ])
            ->whereHas('latestEnrollment.classGroup.section', function ($q) {
                $q->where('is_special', true);
            })
            ->where('is_graduated', false);

        // Apply filter by grade level
        if ($selectedLevel !== 'allLevels') {
            $studentsQuery->whereHas('latestEnrollment.classGroup.section', function ($query) use ($selectedLevel) {
                $query->where('grade_level_id', $selectedLevel);
            });
        }

        // Apply filter by section
        if ($selectedSection !== 'allSections') {
            $studentsQuery->whereHas('latestEnrollment.classGroup.section', function ($query) use ($selectedSection) {
                $query->where('id', $selectedSection);
            });
        }

        // Apply filter by gender
        if ($selectedGender !== 'allGenders') {
            $studentsQuery->where('gender', $selectedGender);
        }

        // Fetch students with the applied filters
        $students = $studentsQuery->get()->map(function ($student) {
            $enrollment = $student->latestEnrollment;

            return [
                'id' => $student->id,
                'applicant_id' => $student->applicant_id,
                'lrn' => $student->lrn,
                'first_name' => $student->first_name,
                'last_name' => $student->last_name,
                'middle_name' => $student->middle_name,
                'suffix' => $student->suffix,
                'address' => $student->address,
                'gender' => $student->gender,
                'full_name' => trim($student->last_name.', '.$student->first_name.' '.($student->middle_name ?? '').' '.($student->suffix ?? '')),
                'email' => $student->email,
                'contact_number' => $student->contact_number,
                'current_class_name' => $enrollment
                    ? sprintf(
                        '%s - %s (%s)',
                        $enrollment->classGroup->section->gradeLevel->name ?? 'No Grade',
                        $enrollment->classGroup->section->name ?? 'No Section',
                        $enrollment->classGroup->schoolYear->name ?? 'No SY'
                    )
                    : null,
                'latest_enrollment' => $enrollment ? [
                    'id' => $enrollment->id,
                    'class_group_id' => $enrollment->class_group_id,
                    'student_id' => $enrollment->student_id,
                    'enrolled_at' => $enrollment->enrolled_at,
                    'status' => $enrollment->status,
                ] : null,
            ];
        });

        // Get regular students for the other section view
        $regularStudentsQuery = Student::whereHas('latestEnrollment.classGroup.section', function ($q) {
            $q->where('is_special', false);
        })
            ->orDoesntHave('latestEnrollment')
            ->with(['latestEnrollment.classGroup.section'])
            ->select('id', 'first_name', 'last_name', 'middle_name', 'suffix');

        // Apply filters for regular students as well
        if ($selectedLevel !== 'allLevels') {
            $regularStudentsQuery->whereHas('latestEnrollment.classGroup.section', function ($query) use ($selectedLevel) {
                $query->where('grade_level_id', $selectedLevel);
            });
        }

        if ($selectedSection !== 'allSections') {
            $regularStudentsQuery->whereHas('latestEnrollment.classGroup.section', function ($query) use ($selectedSection) {
                $query->where('id', $selectedSection);
            });
        }

        if ($selectedGender !== 'allGenders') {
            $regularStudentsQuery->where('gender', $selectedGender);
        }

        // Fetch regular students with filters applied
        $regularStudents = $regularStudentsQuery->get();

        // Get all Class Groups (regular and special)
        $classGroups = ClassGroup::with([
            'section.gradeLevel:id,name',
            'schoolYear:id,name',
        ])
            ->whereHas('section', fn ($q) => $q->where('is_special', false))
            ->get();

        // Get all Special Class Groups
        $specialClassGroups = ClassGroup::with([
            'section.gradeLevel:id,name',
            'schoolYear:id,name',
        ])
            ->whereHas('section', fn ($q) => $q->where('is_special', true))
            ->get();

        return inertia('admin/specialStudent/index', [
            'regularStudents' => $regularStudents,
            'students' => $students,
            'classGroups' => $classGroups,
            'specialClassGroups' => $specialClassGroups,
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
    public function store(StoreStudentRequest $request)
    {
        $validatedData = $request->validated();

        // dd($validatedData);
        // Create the User first
        $user = User::create([
            'first_name' => $validatedData['first_name'],
            'last_name' => $validatedData['last_name'],
            'contact_number' => $validatedData['contact_number'] ?? null,
            'address' => $validatedData['address'] ?? null,
            'email' => $validatedData['email'],
            'password' => Hash::make('password'), // Default password
        ]);

        // Assign "student" role
        $user->assignRole('student');

        // Create the Student profile
        $student = Student::create([
            'user_id' => $user->id,
            'applicant_id' => $validatedData['applicant_id'],
            'lrn' => $validatedData['lrn'],
            'first_name' => $validatedData['first_name'],
            'last_name' => $validatedData['last_name'],
            'middle_name' => $validatedData['middle_name'] ?? null,
            'suffix' => $validatedData['suffix'] ?? null,
            'email' => $validatedData['email'],
            'address' => $validatedData['address'] ?? null,
            'contact_number' => $validatedData['contact_number'] ?? null,
            'gender' => $validatedData['gender'],
            'birthdate' => $validatedData['birthdate'] ?? null,

            // NEW
            'has_special_needs' => $validatedData['has_special_needs'] ?? false,
            'special_needs_type' => $validatedData['special_needs_type'] ?? null,

            'is_4ps' => $validatedData['is_4ps'] ?? false,

        ]);

        optional($student->applicant)->update(['status' => 'accepted']);

        $actor = Auth::user();
        $role = $actor ? DB::table('model_has_roles')
            ->join('roles', 'roles.id', '=', 'model_has_roles.role_id')
            ->where('model_has_roles.model_id', $actor->id)
            ->value('roles.name') : null;
        if ($role === 'teacher') {
            return redirect()->route('teacher.students.index')->with('success', 'Student created successfully.');
        }

        return redirect()->route('admin.students.index')->with('success', 'Student created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Student $student)
    {
        $latestEnrollment = Enrollment::where('student_id', $student->id)
            ->with(['classGroup.section.gradeLevel', 'classGroup.schoolYear'])
            ->orderByDesc('enrolled_at')
            ->first();

        $studentData = [
            'id' => $student->id,
            'applicant_id' => $student->applicant_id ?? null,
            'lrn' => $student->lrn ?? null,
            'first_name' => $student->first_name,
            'last_name' => $student->last_name,
            'middle_name' => $student->middle_name,
            'suffix' => $student->suffix,
            'email' => $student->email,
            'address' => $student->address,
            'contact_number' => $student->contact_number,
            'gender' => $student->gender,
            'birthdate' => $student->birthdate,
            'full_name' => trim("{$student->last_name}, {$student->first_name} ".($student->middle_name ?? '').' '.($student->suffix ?? '')),
            'current_class_name' => $latestEnrollment ? sprintf(
                '%s - %s (%s)',
                optional($latestEnrollment->classGroup->section->gradeLevel)->name,
                optional($latestEnrollment->classGroup->section)->name,
                optional($latestEnrollment->classGroup->schoolYear)->name
            ) : null,
        ];

        return inertia('admin/student/show', [
            'student' => $studentData,
        ]);
    }

    public function studentHomePage()
    {
        $settings = SchoolSettings::all();

        $user = Auth::user();
        $student = $user
            ? Student::with([
                'user',
                'applicant',
                'enrollments.classGroup.section.gradeLevel',
                'enrollments.classGroup.schoolYear',
            ])->where('user_id', $user->id)->first()
            : null;

        // Default
        $isFreshmen = false;
        $isGraduating = false;

        // Determine latest enrollment (based on highest school year ID)
        if ($student && $student->enrollments->isNotEmpty()) {
            $latestEnrollment = $student->enrollments->sortByDesc(fn ($enrollment) => $enrollment->classGroup->school_year_id)->first();

            $gradeLevelName = optional($latestEnrollment->classGroup->section->gradeLevel)->name;

            $isFreshmen = $gradeLevelName === 'Grade 7';
            $isGraduating = $gradeLevelName === 'Grade 12';
        }

        return inertia('student/home', [
            'student' => $student,
            'settings' => $settings,
            'isFreshmen' => $isFreshmen,
            'isGraduating' => $isGraduating,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Student $student)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStudentRequest $request, Student $student)
    {
        // Update the student record
        $student->update([
            'applicant_id' => $request->applicant_id ?: null,
            'lrn' => $request->lrn,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'middle_name' => $request->middle_name,
            'suffix' => $request->suffix,
            'email' => $request->email,
            'address' => $request->address,
            'contact_number' => $request->contact_number,
            'gender' => $request->gender,
            'birthdate' => $request->birthdate,

            // FIXED BOOLEAN FIELDS
            'has_special_needs' => (bool) $request->has_special_needs,
            'special_needs_type' => $request->has_special_needs
                                        ? $request->special_needs_type
                                        : null,
            'is_4ps' => (bool) $request->is_4ps,
        ]);

        // Also update the associated user
        if ($student->user) {
            $student->user->update([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'address' => $request->address,
                'contact_number' => $request->contact_number,
            ]);
        }

        return redirect()->back()->with('success', 'Student updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Student $student)
    {
        $student->delete();

        return redirect()->route('admin.students.index')->with('success', 'Section deleted successfully.');
    }

    public function bulkDelete(Request $request)
    {
        // dd($request->all());
        $ids = $request->input('ids');

        if (empty($ids)) {
            return back()->withErrors(['ids' => 'No IDs provided']);
        }

        Student::whereIn('id', $ids)->delete();

        return redirect()->back()->with('success', 'Selected rows deleted successfully.');
    }

    public function getStudentGrades()
    {

        $settings = SchoolSettings::all();

        $user = Auth::user();
        $student = $user ? Student::where('user_id', $user->id)->first() : null;

        if ($student) {
            $student->load([
                'enrollments.grades.classGroupSubject.subject',
                'enrollments.grades.classGroupSubject.teacher',
                'enrollments.classGroup.section.gradeLevel',
                'enrollments.classGroup.schoolYear',
            ]);
        }

        return inertia('student/grade/index', [
            'student' => $student,
            'settings' => $settings,
        ]);
    }

    public function profile()
    {
        $user = Auth::user();

        $student = $user->student;

        if (! $student) {
            abort(404, 'Student record not found.');
        }

        return inertia('student/profile/index', [
            'student' => [
                'id' => $student->id,
                'applicant_id' => $student->applicant_id,
                'lrn' => $student->lrn,
                'first_name' => $student->first_name,
                'last_name' => $student->last_name,
                'middle_name' => $student->middle_name,
                'suffix' => $student->suffix,
                'address' => $student->address,
                'birthdate' => $student->birthdate,
                'gender' => $student->gender,
                'full_name' => trim($student->last_name.', '.$student->first_name.' '.($student->middle_name ?? '').' '.($student->suffix ?? '')),
                'email' => $student->email,
                'contact_number' => $student->contact_number,
            ],
        ]);
    }

    public function graduates(Request $request)
    {
        // Common fields to select
        $fields = [
            'id', 'user_id', 'applicant_id', 'lrn',
            'first_name', 'last_name', 'middle_name', 'suffix',
            'email', 'contact_number', 'address', 'gender', 'birthdate',
        ];

        // Fetch and format students
        $formatStudent = function ($student, $isGraduated = true) {
            $fullName = $isGraduated
                ? trim("{$student->last_name}, {$student->first_name} ".($student->middle_name ?? '').' '.($student->suffix ?? ''))
                : trim("{$student->first_name} {$student->middle_name} {$student->last_name} {$student->suffix}");

            // Assuming alumni info is needed, include it here
            $alumni = $student->alumni; // This will get the associated Alumni record, if it exists

            return [
                'id' => $student->id,
                'applicant_id' => $student->applicant_id ?? null,
                'lrn' => $student->lrn ?? null,
                'first_name' => $student->first_name,
                'last_name' => $student->last_name,
                'middle_name' => $student->middle_name,
                'suffix' => $student->suffix,
                'email' => $student->email,
                'contact' => $student->contact_number,
                'gender' => $student->gender,
                'birthdate' => $student->birthdate,
                'address' => $student->address,
                'full_name' => $fullName,
                'year_graduated' => $alumni->year_graduated ?? null, // Include alumni information here
            ];
        };

        // Get graduated students with alumni data
        $graduatedStudents = Student::select($fields)
            ->where('is_graduated', true)
            ->with('alumni')  // Eager load the alumni relation
            ->get()
            ->map(fn ($student) => $formatStudent($student, true));

        $nonGraduatedStudents = Student::select($fields)
            ->where('is_graduated', false)
            ->with([
                'enrollments.classGroup.section.gradeLevel',
                'enrollments.classGroup.schoolYear',
                'enrollments.grades',
            ])
            ->get()
            ->filter(function ($student) {
                // Get the latest enrollment based on school year ID
                $latestEnrollment = $student->enrollments
                    ->sortByDesc(fn ($e) => optional($e->classGroup->schoolYear)->id)
                    ->first();

                if (! $latestEnrollment) {
                    return false;
                }

                // Check if enrolled in Grade 12
                $gradeLevelName = optional($latestEnrollment->classGroup->section->gradeLevel)->name;
                $isGrade12 = $gradeLevelName === 'Grade 12';

                if (! $isGrade12) {
                    return false;
                }

                // Check if all final grades are passing
                $allGradesPassing = $latestEnrollment->grades->every(function ($grade) {
                    return $grade->final_grade >= 75;
                });

                return $allGradesPassing;
            })
            ->map(fn ($student) => $formatStudent($student, false))
            ->values(); // Reindex collection

        // Return to Inertia
        return inertia('admin/graduation/index', [
            'graduatedStudents' => $graduatedStudents,
            'nonGraduatedStudents' => $nonGraduatedStudents,
        ]);
    }

    public function graduatesUpdate(UpdateStudentRequest $request, Student $student)
    {
        $student->update([
            'is_graduated' => $request->boolean('is_graduated'),
        ]);

        // If student is marked as graduated, create alumni record if not exists
        if ($student->is_graduated) {
            Alumni::firstOrCreate(
                ['student_id' => $student->id], // prevent duplicate
                [
                    'year_graduated' => now()->year,
                    'employment_status' => null,
                    'job_title' => null,
                    'work_history' => null,
                ]
            );
        }

        return redirect()->route('admin.graduates')->with('success', 'Student updated successfully.');
    }

    public function createEnrollment()
    {
        $user = Auth::user();
        $student = $user ? Student::where('user_id', $user->id)->first() : null;

        // Get the active school year
        $activeSchoolYear = SchoolYear::where('is_active', true)->first();

        // Default: no next grade level
        $nextGradeLevelId = null;

        if ($student) {
            // Get student's latest enrollment (based on school year order)
            $latestEnrollment = Enrollment::where('student_id', $student->id)
                ->with('classGroup.section.gradeLevel')
                ->latest('id') // you can also order by enrolled_at if needed
                ->first();

            if ($latestEnrollment) {
                $currentGradeLevelId = $latestEnrollment->classGroup->section->grade_level_id;

                // Find the next grade level (assuming grade levels have numeric order field or IDs are sequential)
                $nextGradeLevel = GradeLevel::where('id', '>', $currentGradeLevelId)
                    ->orderBy('id', 'asc')
                    ->first();

                if ($nextGradeLevel) {
                    $nextGradeLevelId = $nextGradeLevel->id;
                }
            }
        }

        // Fetch class groups only for the next grade level within active school year
        $classGroups = collect(); // default empty collection
        if ($nextGradeLevelId && $activeSchoolYear) {
            $classGroups = ClassGroup::with([
                'section.gradeLevel:id,name',
                'schoolYear:id,name,is_active',
            ])
                ->withCount('enrollments')
                ->where('school_year_id', $activeSchoolYear->id)
                ->whereHas('section', function ($q) use ($nextGradeLevelId) {
                    $q->where('grade_level_id', $nextGradeLevelId);
                })
                ->get();
        }

        // Check if student already enrolled in active school year
        $alreadyEnrolled = false;
        if ($student && $activeSchoolYear) {
            $alreadyEnrolled = Enrollment::where('student_id', $student->id)
                ->whereHas('classGroup', function ($q) use ($activeSchoolYear) {
                    $q->where('school_year_id', $activeSchoolYear->id);
                })
                ->exists();
        }

        return inertia('student/enrollment/index', [
            'classGroups' => $classGroups,
            'studentId' => $student->id ?? null,
            'alreadyEnrolled' => $alreadyEnrolled,
        ]);
    }

    public function storeEnrollment(StoreEnrollmentRequest $request)
    {
        $validated = $request->validated();

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

        return redirect()->route('student.home')->with('success', 'Enrollment created successfully.');
    }
}
