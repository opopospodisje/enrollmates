<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreClassGroupRequest extends FormRequest
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
            'section_id' => [
                'required',
                'exists:sections,id',
                Rule::unique('class_groups')
                    ->where(function ($query) {
                        return $query->where('school_year_id', $this->input('school_year_id'));
                    }),
            ],
            'school_year_id' => 'required|exists:school_years,id',
        ];
    }
}
