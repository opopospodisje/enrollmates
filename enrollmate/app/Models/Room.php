<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;
use OwenIt\Auditing\Auditable;

class Room extends Model implements AuditableContract
{
    use HasFactory, Auditable;

    protected $fillable = [
        'name',
        'description',
        'price',
        'capacity',
        'size',
        'view',
        'number_of_bed',
        'is_active',
        'featured',
        'room_type_id',
        'sub_room_of',
    ];

    public function roomType()
    {
        return $this->belongsTo(RoomType::class);
    }

    // Parent room (if this room is a sub-room)
    public function parentRoom()
    {
        return $this->belongsTo(Room::class, 'sub_room_of');
    }

    // Sub-rooms (if this room is the main room)
    public function subRooms()
    {
        return $this->hasMany(Room::class, 'sub_room_of');
    }

    public function fileAttachments()
    {
        return $this->belongsToMany(FileAttachment::class, 'room_file_attachments');
    }


}
