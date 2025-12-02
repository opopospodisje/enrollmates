<?php

namespace App\Http\Controllers;

use App\Models\SchoolYear;
use App\Models\Section;
use App\Models\ClassGroup;
use App\Http\Requests\StoreSchoolYearRequest;
use App\Http\Requests\UpdateSchoolYearRequest;

class SchoolYearController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $schoolYear = SchoolYear::select( 'id', 'name', 'is_active')->get();

        return inertia('admin/schoolyear/index', [
            'schoolYear' => $schoolYear,
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSchoolYearRequest $request)
    {
        $validated = $request->validated();

        // If this school year is set to active, deactivate all others
        if ($validated['is_active']) {
            SchoolYear::where('is_active', true)->update(['is_active' => false]);
        }

        $schoolYear = SchoolYear::create($validated);

        // Automatically create class groups for all existing sections
        $sections = Section::all();
        foreach ($sections as $section) {
            ClassGroup::create([
                'section_id' => $section->id,
                'school_year_id' => $schoolYear->id,
                // 'adviser_id' => null, // optional
            ]);
        }

        return redirect()->route('admin.schoolyears.index')
                        ->with('success', 'School Year created successfully.');
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSchoolYearRequest $request, SchoolYear $schoolYear)
    {
        $validated = $request->validated();

        if ($validated['is_active']) {
            SchoolYear::where('is_active', true)
                ->where('id', '!=', $schoolYear->id)
                ->update(['is_active' => false]);
        }

        $schoolYear->update($validated);

        return redirect()
            ->route('admin.schoolyears.index')
            ->with('success', 'School Year updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SchoolYear $schoolYear)
    {
        //
    }
}
