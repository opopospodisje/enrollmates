<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSectionRequest;
use App\Http\Requests\UpdateSectionRequest;
use App\Models\ClassGroup;
use App\Models\GradeLevel;
use App\Models\SchoolYear;
use App\Models\Section;
use Illuminate\Http\Request;

class SectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $section = Section::with('gradeLevel:id,name')
            ->select('id', 'name', 'grade_level_id', 'cutoff_grade', 'is_special')
            ->get()
            ->map(function ($section) {
                return [
                    'id' => $section->id,
                    'name' => $section->name,
                    'grade_level_id' => $section->grade_level_id,
                    'grade_level_name' => $section->gradeLevel->name ?? 'N/A',
                    'cutoff_grade' => $section->cutoff_grade,
                    'is_special' => $section->is_special,
                ];
            });

        return inertia('admin/section/index', [
            'sections' => $section,
            'gradeLevels' => GradeLevel::all(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSectionRequest $request)
    {
        $validated = $request->validated();

        // Create the section
        $section = Section::create($validated);

        // Get the active school year
        $activeSchoolYear = SchoolYear::where('is_active', true)->first();

        if ($activeSchoolYear) {
            // Create the class group for this section in the active school year
            ClassGroup::create([
                'section_id' => $section->id,
                'school_year_id' => $activeSchoolYear->id,
                // Optionally, set adviser_id if you want
            ]);
        }

        return redirect()->back()->with('success', 'Section created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Section $section)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Section $section)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSectionRequest $request, Section $section)
    {
        $validated = $request->validated();

        $section->update($validated);

        return redirect()->back()->with('success', 'Section updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Section $section)
    {
        $section->delete();

        return redirect()->route('admin.sections.index')->with('success', 'Section deleted successfully.');
    }

    public function bulkDelete(Request $request)
    {
        // dd($request->all());
        $ids = $request->input('ids');

        if (empty($ids)) {
            return back()->withErrors(['ids' => 'No IDs provided']);
        }

        Section::whereIn('id', $ids)->delete();

        return redirect()->back()->with('success', 'Selected rows deleted successfully.');
    }
}
