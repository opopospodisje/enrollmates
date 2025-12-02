<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    /** @use HasFactory<\Database\Factories\SectionFactory> */
    use HasFactory;

    protected $casts = [
        'cutoff_grade' => 'float',
        'is_special' => 'boolean',
    ];

    protected $fillable = [
        'name', 
        'grade_level_id',
        'cutoff_grade', // Only for special or selective sections
        'is_special', // For identifying special sections
    ];

    // 🔗 Relationships

    public function gradeLevel()
    {
        return $this->belongsTo(GradeLevel::class);
    }

    public function classGroups()
    {
        return $this->hasMany(ClassGroup::class);
    }
}
