<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    /** @use HasFactory<\Database\Factories\StudentFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'applicant_id',

        'lrn',
        'first_name',
        'last_name',
        'middle_name',
        'suffix',
        'email',
        'contact_number',
        'address',
        'gender',
        'birthdate',

        'is_graduated',

        
        // NEW
        'has_special_needs',
        'special_needs_type',

        'is_4ps',
    ];


    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function applicant()
    {
        return $this->belongsTo(Applicant::class);
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    // Shortcut: A student has many grades through enrollments
    public function grades()
    {
        return $this->hasManyThrough(Grade::class, Enrollment::class);
    }

    public function latestEnrollment()
    {
        return $this->hasOne(Enrollment::class)->latestOfMany('enrolled_at');
    }

    public function alumni()
    {
        return $this->hasOne(Alumni::class);
    }
}
