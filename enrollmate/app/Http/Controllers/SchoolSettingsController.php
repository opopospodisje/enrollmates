<?php

namespace App\Http\Controllers;

use App\Models\SchoolSettings;
use Illuminate\Http\Request;

class SchoolSettingsController extends Controller
{
    public function index()
    {
        // Fetch all settings
        $settings = SchoolSettings::all();

        return inertia('admin/settings/index', [
            'settings' => $settings, // This is now an array
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:school_settings,id',
            'value' => 'required|string',
        ]);

        $setting = SchoolSettings::findOrFail($request->id);
        $setting->value = $request->value;
        $setting->save();

        return back()->with('success', 'Setting updated successfully.');
    }
}
