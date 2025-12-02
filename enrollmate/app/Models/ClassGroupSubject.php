<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassGroupSubject extends Model
{
    /** @use HasFactory<\Database\Factories\ClassGroupSubjectFactory> */
    use HasFactory;

    protected $fillable = [
        'class_group_id',
        'subject_id',
        'teacher_id',
    ];

    public function classGroup()
    {
        return $this->belongsTo(ClassGroup::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function grades()
    {
        return $this->hasMany(Grade::class);
    }
}
