<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreStudentRequest extends FormRequest
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
            'applicant_id' => 'sometimes|nullable|exists:applicants,id',
            'lrn' => 'required|string|max:12|unique:students,lrn',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'suffix' => 'nullable|string|max:10',
            'email' => 'required|email|max:255|unique:users,email', // Fix: Check users table
            'contact_number' => 'nullable|string|max:15',
            'address' => 'nullable|string|max:255',
            'gender' => 'required|in:male,female,others',
            'birthdate' => 'nullable|date_format:Y-m-d',
            'has_special_needs' => ['boolean'],
            'special_needs_type' => ['nullable', 'string'],

            'is_4ps' => ['boolean'],

        ];
    }
}
