<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGradeRequest extends FormRequest
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
            'grades' => ['required', 'array'],
            'grades.*.id' => ['required', 'integer', 'exists:grades,id'],
            'grades.*.first_quarter'  => ['nullable','numeric','min:0','max:100'],
            'grades.*.second_quarter' => ['nullable','numeric','min:0','max:100'],
            'grades.*.third_quarter'  => ['nullable','numeric','min:0','max:100'],
            'grades.*.fourth_quarter' => ['nullable','numeric','min:0','max:100'],
            'grades.*.final_grade'    => ['nullable','numeric','min:0','max:100'],
        ];
    }
}
