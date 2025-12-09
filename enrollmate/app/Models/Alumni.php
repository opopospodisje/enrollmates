<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Alumni extends Model
{
    protected $fillable = [
        'student_id',
        'year_graduated',
        'employment_status',
        'job_title',
        'work_history',
    ];

    // Define the relationship between Alumni and Student (inverse of the 'hasOne' in the Student model)
    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
