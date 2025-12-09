<?php

namespace App\Traits;

use Illuminate\Support\Facades\Auth;

trait Userstamps
{
    public static function bootUserstamps()
    {
        static::creating(function ($model) {
            if (Auth::check()) {
                $model->created_by = $model->created_by ?? Auth::id();
                $model->updated_by = $model->updated_by ?? Auth::id();
            }
        });

        static::updating(function ($model) {
            if (Auth::check()) {
                $model->updated_by = Auth::id();
            }
        });

        static::deleting(function ($model) {
            if (Auth::check() && $model->usesSoftDeletes()) {
                $model->deleted_by = Auth::id();
                $model->save(); // Save deleted_by before actual soft delete
            }
        });
    }

    public function usesSoftDeletes(): bool
    {
        return method_exists($this, 'getDeletedAtColumn');
    }
}
