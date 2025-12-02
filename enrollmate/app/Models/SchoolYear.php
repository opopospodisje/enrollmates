<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SchoolYear extends Model
{
    /** @use HasFactory<\Database\Factories\SchoolYearFactory> */
    use HasFactory;

    protected $casts = [
        'name' => 'string',
        'is_active' => 'boolean',
    ];

    protected $fillable = [
        'name',
        'is_active',
    ];

    // 🔗 Relationships

    public function classGroups()
    {
        return $this->hasMany(ClassGroup::class);
    }

    public function applicants()
    {
        return $this->hasMany(Applicant::class);
    }
}
