<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enrollment extends Model
{
    /** @use HasFactory<\Database\Factories\EnrollmentFactory> */
    use HasFactory;

    protected $fillable = [
        'student_id',
        'class_group_id',
        'enrolled_at',
        'status',
    ];

    // Relationships

    // Each enrollment has many grades
    public function grades()
    {
        return $this->hasMany(Grade::class);
    }

    public function classGroup()
    {
        return $this->belongsTo(ClassGroup::class);
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
