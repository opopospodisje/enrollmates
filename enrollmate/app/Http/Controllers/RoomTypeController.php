<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRoomTypeRequest;
use App\Http\Requests\UpdateRoomTypeRequest;
use App\Models\RoomType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoomTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $roomtype = RoomType::select('id', 'name')->get();

        return inertia('roomtype/index', [
            'roomTypes' => $roomtype,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRoomTypeRequest $request)
    {
        // dump
        // dd($request->all());
        $validated = $request->validate([
            'name' => 'required|string|unique:room_types,name',
        ]);

        RoomType::create($validated);

        return redirect()->route('roomtypes.index')->with('success', 'Room Type created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(RoomType $roomType)
    {
        // Load rooms under this type with relationships
        $roomType->load('rooms.roomType', 'rooms.fileAttachments', 'rooms.parentRoom');

        // Get ALL rooms for sub_room_of dropdown (optional: filter only active, or not self)
        $allRooms = \App\Models\Room::with('roomType')->get();

        return Inertia::render('roomtype/show', [
            'roomType' => [
                'id' => $roomType->id,
                'name' => $roomType->name,
            ],
            'roomTypes' => RoomType::all(),

            // Main list of rooms to display (still only those under this RoomType)
            'rooms' => $roomType->rooms->map(fn ($room) => [
                'id' => $room->id,
                'name' => $room->name,
                'size' => $room->size,
                'view' => $room->view,
                'room_type_name' => $room->roomType->name ?? null,
                'room_type_id' => $room->roomType->id ?? null,
                'sub_room_of' => $room->parentRoom?->id ?? null,
                'sub_room_of_name' => $room->parentRoom?->name ?? null,
                'capacity' => $room->capacity,
                'number_of_bed' => $room->number_of_bed,
                'price' => $room->price,
                'description' => $room->description,
                'featured' => (bool) $room->featured,
                'is_active' => (bool) $room->is_active,
                'attachments' => $room->fileAttachments->map(fn ($attachment) => [
                    'id' => $attachment->id,
                    'file_name' => $attachment->file_name,
                    'file_path' => asset('storage/'.$attachment->file_path),
                    'file_type' => $attachment->file_type,
                ]),
            ]),

            // NEW: All rooms for dropdown
            'allRooms' => $allRooms->map(fn ($r) => [
                'id' => $r->id,
                'name' => $r->name,
            ]),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(RoomType $roomType) {}

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRoomTypeRequest $request, RoomType $roomType)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $roomType->update($validated);

        return redirect()->back()->with('success', 'Room Type updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(RoomType $roomType)
    {
        $roomType->delete();

        return redirect()->route('roomtypes.index')->with('success', 'Room Type deleted successfully.');
    }

    public function bulkDelete(Request $request)
    {
        // dd($request->all());
        $ids = $request->input('ids');

        if (empty($ids)) {
            return back()->withErrors(['ids' => 'No IDs provided']);
        }

        RoomType::whereIn('id', $ids)->delete();

        return redirect()->back()->with('success', 'Selected room types deleted successfully.');
    }
}
