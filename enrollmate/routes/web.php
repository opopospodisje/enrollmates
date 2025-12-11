<?php

use App\Http\Controllers\AlumniController;
use App\Http\Controllers\ApplicantController;
use App\Http\Controllers\ClassGroupController;
use App\Http\Controllers\ClassGroupSubjectController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\GradeController;
use App\Http\Controllers\GradeLevelController;
use App\Http\Controllers\LoginInfoController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\RoomTypeController;
use App\Http\Controllers\SchoolSettingsController;
use App\Http\Controllers\SchoolYearController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    if (! Auth::check()) {
        return redirect()->route('login');
    }

    $user = Auth::user();

    $role = DB::table('model_has_roles')
        ->join('roles', 'roles.id', '=', 'model_has_roles.role_id')
        ->where('model_has_roles.model_id', $user->id)
        ->value('roles.name');
    if ($role === 'admin') {
        return redirect()->route('admin.dashboard'); // admin dashboard
    } elseif ($role === 'teacher') {
        return redirect()->route('teacher.dashboard'); // teacher dashboard
    } elseif ($role === 'student') {
        return redirect()->route('student.home'); // (if you have one)
    }

    return abort(403, 'No dashboard available for your role.');
});

Route::middleware(['auth', 'verified', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        Route::get('/specialStudentsIndex', [StudentController::class, 'specialStudentsIndex'])->name('specialStudentsIndex');
        Route::get('/top-students', [ClassGroupController::class, 'topStudentsByClassGroups'])->name('top-students-by-classgroups.index');
        Route::get('/top-students-by-classgroups/{classGroup}', [ClassGroupController::class, 'topStudentsByClassGroupsShow'])->name('top-students-by-classgroups.show');
        Route::get('/graduates', [StudentController::class, 'graduates'])->name('graduates');
        Route::put('/graduates/{student}', [StudentController::class, 'graduatesUpdate'])->name('graduates.update');

        // Applicants
        Route::prefix('applicants')->name('applicants.')->group(function () {
            Route::get('/', [ApplicantController::class, 'index'])->name('index');
            Route::post('/', [ApplicantController::class, 'store'])->name('store');
            Route::get('/{applicant}/show', [ApplicantController::class, 'show'])->name('show');
            Route::put('/{applicant}', [ApplicantController::class, 'update'])->name('update');
            Route::delete('/{applicant}', [ApplicantController::class, 'destroy'])->name('destroy');
            Route::post('/bulk-delete', [ApplicantController::class, 'bulkDelete'])->name('bulkDelete');
        });

        // Students
        Route::prefix('students')->name('students.')->group(function () {
            Route::get('/', [StudentController::class, 'index'])->name('index');
            Route::post('/', [StudentController::class, 'store'])->name('store');
            Route::get('/{student}/show', [StudentController::class, 'show'])->name('show');
            Route::put('/{student}', [StudentController::class, 'update'])->name('update');
            Route::delete('/{student}', [StudentController::class, 'destroy'])->name('destroy');
            Route::post('/bulk-delete', [StudentController::class, 'bulkDelete'])->name('bulkDelete');

        });

        // Alumni
        Route::prefix('alumnis')->name('alumnis.')->group(function () {
            Route::get('/', [AlumniController::class, 'index'])->name('index');
        });

        // Enrollments
        Route::prefix('enrollments')->name('enrollments.')->group(function () {
            Route::get('/', [EnrollmentController::class, 'index'])->name('index');
            Route::post('/', [EnrollmentController::class, 'store'])->name('store');
            Route::get('/{enrollment}/show', [EnrollmentController::class, 'show'])->name('show');
            Route::put('/{enrollment}', [EnrollmentController::class, 'update'])->name('update');
            Route::delete('/{enrollment}', [EnrollmentController::class, 'destroy'])->name('destroy');
            Route::post('/bulk-delete', [EnrollmentController::class, 'bulkDelete'])->name('bulkDelete');
        });

        // School Years
        Route::prefix('schoolyears')->name('schoolyears.')->group(function () {
            Route::get('/', [SchoolYearController::class, 'index'])->name('index');
            Route::post('/', [SchoolYearController::class, 'store'])->name('store');
            Route::put('/{schoolYear}', [SchoolYearController::class, 'update'])->name('update');
            Route::delete('/{schoolYear}', [SchoolYearController::class, 'destroy'])->name('destroy');
            Route::post('/bulk-delete', [SchoolYearController::class, 'bulkDelete'])->name('bulkDelete');

        });

        // Grade Levels
        Route::prefix('gradelevels')->name('gradelevels.')->group(function () {
            Route::get('/', [GradeLevelController::class, 'index'])->name('index');
            Route::post('/', [GradeLevelController::class, 'store'])->name('store');
            Route::get('/{gradeLevel}/show', [GradeLevelController::class, 'show'])->name('show');
            Route::put('/{gradeLevel}', [GradeLevelController::class, 'update'])->name('update');
            Route::delete('/{gradeLevel}', [GradeLevelController::class, 'destroy'])->name('destroy');
            Route::post('/bulk-delete', [GradeLevelController::class, 'bulkDelete'])->name('bulkDelete');
        });

        // Sections
        Route::prefix('sections')->name('sections.')->group(function () {
            Route::get('/', [SectionController::class, 'index'])->name('index');
            Route::post('/', [SectionController::class, 'store'])->name('store');
            Route::get('/{section}/show', [SectionController::class, 'show'])->name('show');
            Route::put('/{section}', [SectionController::class, 'update'])->name('update');
            Route::delete('/{section}', [SectionController::class, 'destroy'])->name('destroy');
            Route::post('/bulk-delete', [SectionController::class, 'bulkDelete'])->name('bulkDelete');
        });

        // Class Groups
        Route::prefix('classgroups')->name('classgroups.')->group(function () {
            Route::get('/', [ClassGroupController::class, 'index'])->name('index');
            Route::post('/', [ClassGroupController::class, 'store'])->name('store');
            Route::get('/{classGroup}/show', [ClassGroupController::class, 'show'])->name('show');
            Route::put('/{classGroup}', [ClassGroupController::class, 'update'])->name('update');
            Route::delete('/{classGroup}', [ClassGroupController::class, 'destroy'])->name('destroy');
            Route::post('/bulk-delete', [ClassGroupController::class, 'bulkDelete'])->name('bulkDelete');
        });

        // Class Group Subjects
        Route::prefix('classgroupsubjects')->name('classgroupsubjects.')->group(function () {
            Route::get('/', [ClassGroupSubjectController::class, 'index'])->name('index');
            Route::post('/', [ClassGroupSubjectController::class, 'store'])->name('store');
            Route::get('/{classGroupSubject}/show', [ClassGroupSubjectController::class, 'show'])->name('show');
            Route::put('/{classGroupSubject}', [ClassGroupSubjectController::class, 'update'])->name('update');
            Route::delete('/{classGroupSubject}', [ClassGroupSubjectController::class, 'destroy'])->name('destroy');
            Route::post('/bulk-delete', [ClassGroupSubjectController::class, 'bulkDelete'])->name('bulkDelete');
        });

        // Subjects
        Route::prefix('subjects')->name('subjects.')->group(function () {
            Route::get('/', [SubjectController::class, 'index'])->name('index');
            Route::post('/', [SubjectController::class, 'store'])->name('store');
            Route::get('/{subject}/show', [SubjectController::class, 'show'])->name('show');
            Route::put('/{subject}', [SubjectController::class, 'update'])->name('update');
            Route::delete('/{subject}', [SubjectController::class, 'destroy'])->name('destroy');
            Route::post('/bulk-delete', [SubjectController::class, 'bulkDelete'])->name('bulkDelete');
        });

        // Grades
        Route::prefix('grades')->name('grades.')->group(function () {
            Route::get('/', [GradeController::class, 'index'])->name('index');
            Route::post('/', [GradeController::class, 'store'])->name('store');
            Route::get('/{grade}/show', [GradeController::class, 'show'])->name('show');
            Route::delete('/{grade}', [GradeController::class, 'destroy'])->name('destroy');
            Route::post('/bulk-delete', [GradeController::class, 'bulkDelete'])->name('bulkDelete');

            Route::put('/{enrollment}', [GradeController::class, 'update'])->name('update');

            Route::get('{enrollment}/edit', [GradeController::class, 'edit'])->name('edit');
        });

        // Teachers
        Route::prefix('teachers')->name('teachers.')->group(function () {
            Route::get('/', [TeacherController::class, 'index'])->name('index');
            Route::post('/', [TeacherController::class, 'store'])->name('store');
            Route::get('/{teacher}/show', [TeacherController::class, 'show'])->name('show');
            Route::put('/{teacher}', [TeacherController::class, 'update'])->name('update');
            Route::delete('/{teacher}', [TeacherController::class, 'destroy'])->name('destroy');
            Route::post('/bulk-delete', [TeacherController::class, 'bulkDelete'])->name('bulkDelete');
            Route::put('/{teacher}/unarchive', [TeacherController::class, 'unarchive'])->name('unarchive');
            Route::post('/bulk-unarchive', [TeacherController::class, 'bulkUnarchive'])->name('bulkUnarchive');
        });

        // Room Types
        Route::prefix('roomtypes')->name('roomtypes.')->group(function () {
            Route::get('/', [RoomTypeController::class, 'index'])->name('index');
            Route::get('/create', [RoomTypeController::class, 'create'])->name('create');
            Route::post('/', [RoomTypeController::class, 'store'])->name('store');
            Route::get('/{roomType}/show', [RoomTypeController::class, 'show'])->name('show');
            Route::get('/{roomType}/edit', [RoomTypeController::class, 'edit'])->name('edit');
            Route::put('/{roomType}', [RoomTypeController::class, 'update'])->name('update');
            Route::delete('/{roomType}', [RoomTypeController::class, 'destroy'])->name('destroy');
            Route::post('/bulk-delete', [RoomTypeController::class, 'bulkDelete'])->name('bulkDelete');

        });

        // Room
        Route::prefix('rooms')->name('rooms.')->group(function () {
            Route::get('/', [RoomController::class, 'index'])->name('index');
            Route::get('/{room}/show', [RoomController::class, 'show'])->name('show');
            Route::get('/create', [RoomController::class, 'create'])->name('create');
            Route::post('/', [RoomController::class, 'store'])->name('store');
            Route::get('/{room}/edit', [RoomController::class, 'edit'])->name('edit');
            Route::put('/{room}', [RoomController::class, 'update'])->name('update');
            Route::delete('/{room}', [RoomController::class, 'destroy'])->name('destroy');
            Route::post('/bulk-delete', [RoomController::class, 'bulkDelete'])->name('bulkDelete');
        });

        // Users
        Route::prefix('users')->name('users.')->group(function () {
            Route::get('/', [UserController::class, 'index'])->name('index');
            Route::post('/', [UserController::class, 'store'])->name('store');
            Route::put('/{user}', [UserController::class, 'update'])->name('update');
            Route::get('/{user}', [UserController::class, 'show'])->name('show');
            Route::delete('/{user}', [UserController::class, 'destroy'])->name('destroy');

        });

        // login info
        Route::get('/login-info', [LoginInfoController::class, 'index'])->name('login-info.index');

        // Settings
        Route::prefix('settings')->name('settings.')->group(function () {
            Route::get('/', [SchoolSettingsController::class, 'index'])->name('index');
            Route::put('/', [SchoolSettingsController::class, 'update'])->name('update');
        });

    });

Route::middleware(['auth', 'verified', 'role:teacher'])
    ->prefix('teacher')
    ->name('teacher.')
    ->group(function () {

        Route::get('/dashboard', [DashboardController::class, 'teacherIndex'])->name('dashboard');

        // Class Group Subjects
        Route::prefix('classgroupsubjects')->name('classgroupsubjects.')->group(function () {
            Route::get('/', [ClassGroupSubjectController::class, 'teacherClassGroupSubjectIndex'])->name('index');
            Route::get('/subjects', [ClassGroupSubjectController::class, 'teacherClassGroupSubjects'])->name('subjects');

            // Nested "grades" route for each class group subject
            Route::get('{classGroup}/subjects/{classGroupSubject}/grades',
                [ClassGroupSubjectController::class, 'classGroupSubjectGrades']
            )->name('grades.index');

            Route::put('/{classGroupSubject}/grades',
                [ClassGroupSubjectController::class, 'updateClassGroupSubjectGrades']
            )->name('grades.update');

        });

        // Class Group Subjects
        Route::prefix('subjects')->name('subjects.')->group(function () {
            Route::get('/', [ClassGroupSubjectController::class, 'teacherSubjects'])->name('index');
            Route::get('{subject}/show', [SubjectController::class, 'show'])->name('show');
        });

        // Grades (general teacher grade management)
        Route::prefix('grades')->name('grades.')->group(function () {
            Route::get('/', [GradeController::class, 'teacherIndex'])->name('index');
            Route::put('/{enrollment}', [GradeController::class, 'update'])->name('update');
            Route::get('{enrollment}/edit', [GradeController::class, 'teacherEdit'])->name('edit');
        });

        Route::prefix('enrollments')->name('enrollments.')->group(function () {
            Route::get('/', [EnrollmentController::class, 'teacherIndex'])->name('index');
            Route::post('/', [EnrollmentController::class, 'store'])->name('store');
        });

        Route::prefix('students')->name('students.')->group(function () {
            Route::get('/', [StudentController::class, 'teacherIndex'])->name('index');
            Route::post('/', [StudentController::class, 'store'])->name('store');
            Route::get('/{student}/show', [StudentController::class, 'teacherShow'])->name('show');
        });

        Route::prefix('applicants')->name('applicants.')->group(function () {
            Route::get('/', [ApplicantController::class, 'teacherIndex'])->name('index');
            Route::post('/', [ApplicantController::class, 'store'])->name('store');
            Route::put('/{applicant}', [ApplicantController::class, 'update'])->name('update');
            Route::delete('/{applicant}', [ApplicantController::class, 'destroy'])->name('destroy');
            Route::post('/bulk-delete', [ApplicantController::class, 'bulkDelete'])->name('bulkDelete');
        });
    });

Route::middleware(['auth', 'verified', 'role:student'])
    ->prefix('student')
    ->name('student.')
    ->group(function () {

        Route::get('/', [StudentController::class, 'studentHomePage'])->name('home');

        Route::prefix('grades')->name('grades.')->group(function () {
            Route::get('/', [StudentController::class, 'getStudentGrades'])->name('index');
        });

        Route::prefix('enrollments')->name('enrollments.')->group(function () {
            Route::get('/', [StudentController::class, 'createEnrollment'])->name('create');
            Route::post('/', [StudentController::class, 'storeEnrollment'])->name('store');
        });

        Route::prefix('alumnis')->name('alumnis.')->group(function () {
            Route::get('/', [AlumniController::class, 'alumniInfo'])->name('show');
            Route::put('/update', [AlumniController::class, 'updateAlumniInfo'])->name('update');
        });

        Route::prefix('profile')->name('profile.')->group(function () {
            Route::get('/', [StudentController::class, 'profile'])->name('profile');
            Route::put('/{student}', [StudentController::class, 'update'])->name('update');
        });
    });

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
