<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreGradeLevelRequest;
use App\Http\Requests\UpdateGradeLevelRequest;
use App\Models\GradeLevel;
use Illuminate\Http\Request;

class GradeLevelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $gradeLevel = GradeLevel::select('id', 'name')->get();

        return inertia('admin/gradelevel/index', [
            'gradeLevels' => $gradeLevel,
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
    public function store(StoreGradeLevelRequest $request)
    {
        $validated = $request->validated();

        GradeLevel::create($validated);

        return redirect()->route('admin.gradelevels.index')->with('success', 'Grade Level created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(GradeLevel $gradeLevel)
    {
        // Assuming you want to return a view with the grade level details
        // $gradeLevel->load();

        return inertia('gradelevel/show', [
            'gradeLevel' => $gradeLevel,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(GradeLevel $gradeLevel)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGradeLevelRequest $request, GradeLevel $gradeLevel)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(GradeLevel $gradeLevel)
    {
        $gradeLevel->delete();

        return redirect()->route('admin.gradelevels.index')->with('success', 'Grade Level deleted successfully.');
    }

    public function bulkDelete(Request $request)
    {
        // dd($request->all());
        $ids = $request->input('ids');

        if (empty($ids)) {
            return back()->withErrors(['ids' => 'No IDs provided']);
        }

        GradeLevel::whereIn('id', $ids)->delete();

        return redirect()->back()->with('success', 'Selected rows deleted successfully.');
    }
}
