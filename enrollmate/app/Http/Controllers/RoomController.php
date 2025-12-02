<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\RoomType;
use App\Models\FileAttachment;
use App\Http\Requests\StoreRoomRequest;
use App\Http\Requests\UpdateRoomRequest;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Tinify\Tinify;
use Tinify\Exception as TinifyException;
use Tinify\Source;

class RoomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $rooms = Room::select('id', 'image', 'name', 'view', 'size', 'room_type_id','sub_room_of', 'capacity', 'price', 'number_of_bed', 'description','featured','is_active')
            ->with('roomType:id,name', 'fileAttachments:id,file_name,file_path,file_type')
            ->get()
            ->map(function ($room) {
                return [
                    'id' => $room->id,
                    'image' => $room->image,
                    'name' => $room->name,
                    'view' => $room->view,
                    'size' => $room->size,
                    'room_type_id' => $room->room_type_id,
                    'room_type_name' => $room->roomType->name,
                    'sub_room_of' => $room->sub_room_of,
                    'capacity' => $room->capacity,
                    'price' => $room->price,
                    'number_of_bed' => $room->number_of_bed,
                    'description' => $room->description,
                    'featured' => (bool) $room->featured,
                    'is_active' => (bool) $room->is_active,
                    'attachments' => $room->fileAttachments->map(function ($attachment) {
                        return [
                            'id' => $attachment->id,
                            'file_name' => $attachment->file_name,
                            'file_path' => asset('storage/' . $attachment->file_path),
                            'file_type' => $attachment->file_type,
                        ];
                    }),
                ];
            });

        $allRooms = Room::with('roomType')->get();

        return Inertia::render('rooms/index', [
            'rooms' => $rooms,
            'roomTypes' => RoomType::all(),

            'allRooms' => $allRooms->map(fn($r) => [
                'id' => $r->id,
                'name' => $r->name,
            ]),
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
    public function store(StoreRoomRequest $request)
    {
        $validated = $request->validated();

        // Create the Room
        $room = Room::create($validated);

        // Handle attachments
        if ($request->hasFile('attachments')) {
            $this->handleFileAttachments($room, $request->file('attachments'));
        }

        return redirect()->back()->with('success', 'Room created successfully.');
    }
    /**
     * Display the specified resource.
     */
    public function show(Room $room)
    {
        $room->load(['bookings', 'roomType', 'fileAttachments', 'parentRoom']);

        //dd($room);

        $bookings = $room->bookings->map(function ($booking) use ($room) {
            return [
                'id' => $booking->id,
                'room_name' => $room->name,
                'booking_date_to' => $booking->booking_date_to,
                'booking_date_from' => $booking->booking_date_from,
            ];
        });

        $allRooms = Room::with('roomType')->get();

        return Inertia::render('rooms/show', [
            'room' => [
                'id' => $room->id,
                'name' => $room->name,
                'size' => $room->size,
                'view' => $room->view,
                'room_type_id' => $room->room_type_id,
                'room_type_name' => $room->roomType?->name,
                'sub_room_of' => $room->sub_room_of,
                'sub_room_of_name' => $room->parentRoom?->name,
                'capacity' => $room->capacity,
                'number_of_bed' => $room->number_of_bed,
                'price' => $room->price,
                'description' => $room->description,
                'featured' => (bool) $room->featured,
                'is_active' => (bool) $room->is_active,
                'attachments' => $room->fileAttachments->map(function ($attachment) {
                    return [
                        'id' => $attachment->id,
                        'file_name' => $attachment->file_name,
                        'file_path' => asset('storage/' . $attachment->file_path),
                        'file_type' => $attachment->file_type,
                    ];
                }),
            ],
            'bookings' => $bookings,
            'roomTypes' => RoomType::all(),

            'allRooms' => $allRooms->map(fn($r) => [
                'id' => $r->id,
                'name' => $r->name,
            ]),

        ]);
    }



    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Room $room)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRoomRequest $request, Room $room)
    {
        $validated = $request->validated();

        // Update basic fields
        $room->update($validated);

        // Delete removed attachments
        if ($request->has('deleted_attachments')) {
            foreach ($request->deleted_attachments as $attachmentId) {
                $attachment = FileAttachment::find($attachmentId);
                if ($attachment) {
                    // Delete physical file
                    Storage::disk('public')->delete($attachment->file_path);
                    $room->fileAttachments()->detach($attachmentId);
                    $attachment->delete();
                }
            }
        }

        // Handle uploaded files using the extracted method
        if ($request->hasFile('attachments')) {
            $this->handleFileAttachments($room, $request->file('attachments'));
        }

        return Inertia::location(url()->previous());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Room $room)
    {
        $room->delete();
        return redirect()->route('rooms.index')->with('success', 'Room deleted successfully.');
    }

    public function bulkDelete(Request $request)
    {
        //dd($request->all());
        $ids = $request->input('ids');

        if (empty($ids)) {
            return back()->withErrors(['ids' => 'No IDs provided']);
        }

        Room::whereIn('id', $ids)->delete();

        return redirect()->back()->with('success', 'Selected room types deleted successfully.');
    }

    private function handleFileAttachments(Room $room, array $files): void
    {
        // Ensure the 'tmp' directory exists
        Storage::makeDirectory('tmp');

        foreach ($files as $file) {
            $randomString = Str::random(8);
            $extension = $file->getClientOriginalExtension();
            $generatedName = "room_{$room->id}_{$randomString}.{$extension}";
            $tempPath = $file->storeAs('tmp', $generatedName);
            $fullTempPath = Storage::disk('local')->path($tempPath);

            if (!Storage::exists($tempPath)) {
                throw new \Exception("Temp file was not saved: {$tempPath}");
            }

            $filePath = "attachments/rooms/{$generatedName}";
            $optimizedPath = storage_path("app/public/{$filePath}");

            try {
                if (config('services.tinify.key')) {
                    Source::fromFile($fullTempPath)->toFile($optimizedPath);
                } else {
                    Storage::disk('public')->put($filePath, Storage::get($tempPath));
                }
            } catch (TinifyException $e) {
                logger()->error('Tinify compression failed: ' . $e->getMessage());
                Storage::disk('public')->put($filePath, Storage::get($tempPath));
            } finally {
                Storage::delete($tempPath);
            }

            $attachment = FileAttachment::create([
                'file_name' => $generatedName,
                'file_path' => $filePath,
                'file_type' => $file->getClientMimeType(),
            ]);

            $room->fileAttachments()->attach($attachment->id);
        }
    }

}
