<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SchoolSettings extends Model
{
    protected $fillable = ['setting_name', 'value', 'default_value'];
}
