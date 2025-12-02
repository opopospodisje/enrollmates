<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Grade extends Model
{
    /** @use HasFactory<\Database\Factories\GradeFactory> */
    use HasFactory;

    protected $fillable = [
        'enrollment_id',
        'class_group_subject_id',
        'first_quarter',
        'second_quarter',
        'third_quarter',
        'fourth_quarter',
        'final_grade',
    ];

    // A grade belongs to a specific enrollment (student in a class group)
    public function enrollment()
    {
        return $this->belongsTo(Enrollment::class);
    }

    // A grade belongs to a class group subject
    public function classGroupSubject()
    {
        return $this->belongsTo(ClassGroupSubject::class);
    }
}
