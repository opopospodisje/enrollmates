<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassGroup extends Model
{
    /** @use HasFactory<\Database\Factories\ClassGroupFactory> */
    use HasFactory;

    protected $fillable = [
        'section_id',
        'school_year_id',
        'adviser_id',
        'student_limit',
    ];

    // 🔗 Relationships

    public function section()
    {
        return $this->belongsTo(Section::class);
    }

    public function schoolYear()
    {
        return $this->belongsTo(SchoolYear::class);
    }

    public function subjects()
    {
        return $this->hasMany(ClassGroupSubject::class);
    }

    // public function adviser()
    // {
    //    return $this->belongsTo(Teacher::class, 'adviser_id');
    // }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }
}
