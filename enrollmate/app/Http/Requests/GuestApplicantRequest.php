<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GuestApplicantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'suffix' => 'nullable|string|max:10',
            'email' => 'required|email|max:255|unique:applicants,email',
            'contact_number' => 'nullable|string|max:15',
            'address' => 'nullable|string|max:500',
            'gender' => 'required|in:male,female',
            'birthdate' => 'nullable|date_format:Y-m-d',
            'school_year_id' => 'nullable|exists:school_years,id',
        ];
    }
}
