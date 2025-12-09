<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateApplicantRequest extends FormRequest
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
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'suffix' => 'nullable|string|max:10',
            'email' => 'required|email|max:255|unique:applicants,email,'.$this->applicant->id,
            'contact_number' => 'nullable|string|max:15',
            'address' => 'nullable|string|max:255',
            'gender' => 'required|in:male,female',
            'birthdate' => 'nullable|date_format:Y-m-d',
            'school_year_id' => 'required|exists:school_years,id',
            'entrance_exam_score' => 'nullable|numeric|min:0|max:100',
            'exam_taken_at' => 'nullable|date',
        ];
    }
}
