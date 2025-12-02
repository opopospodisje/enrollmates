<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRoomRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'room_type_id' => ['required', 'exists:room_types,id'],
            'capacity' => ['required', 'integer', 'min:1'],
            'number_of_bed' => ['required', 'integer', 'min:1'],
            'price' => ['required', 'numeric', 'min:0'],
            'description' => ['nullable', 'string', 'max:1000'],
            'size' => ['nullable', 'string', 'max:255'],
            'view' => ['nullable', 'string', 'max:255'],
            'featured' => ['required', 'boolean'],
            'is_active' => ['required', 'boolean'],
            'sub_room_of' => ['nullable', 'exists:rooms,id'],

            // File validation
            //'attachments.*' => ['file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'], // max 5MB per file
            'deleted_attachments' => ['nullable', 'array'],
            'deleted_attachments.*' => ['integer', 'exists:file_attachments,id'],
        ];
    }
}
