<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    /** @use HasFactory<\Database\Factories\SubjectFactory> */
    use HasFactory;

    // cast
    protected $casts = [
        'is_special' => 'boolean',
    ];

    protected $fillable = [
        'code',
        'name',
        'is_special',
    ];

    public function classGroupSubjects()
    {
        return $this->hasMany(ClassGroupSubject::class);
    }
}
