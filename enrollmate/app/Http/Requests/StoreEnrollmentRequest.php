<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEnrollmentRequest extends FormRequest
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
            'student_id' => 'required|exists:students,id',
            'class_group_id' => [
                'required',
                'exists:class_groups,id',
                Rule::unique('enrollments')->where(function ($query) {
                    return $query->where('student_id', $this->student_id);
                }),
            ],
            'enrolled_at' => 'nullable|date',
            'status' => 'required|in:new,promoted,retained,transferred,dropped',
        ];
    }
}
