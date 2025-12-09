<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSectionRequest extends FormRequest
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
        // $this->section comes from route‑model binding:  /sections/{section}
        return [
            'name' => ['required', 'string', 'max:255', Rule::unique('sections', 'name')->ignore($this->section?->id)],
            'grade_level_id' => ['required', 'exists:grade_levels,id'],

            'is_special' => ['boolean'],
            // Optional, numeric 0‑100, and **required if is_special = true**
            'cutoff_grade' => ['nullable', 'numeric', 'min:0', 'max:100',
                function ($attribute, $value, $fail) {
                    if ($this->boolean('is_special') && $value === null) {
                        $fail('Cutoff grade is required for special sections.');
                    }
                },
            ],
        ];
    }

    protected function prepareForValidation()
    {
        if (! $this->boolean('is_special')) {
            $this->merge([
                'cutoff_grade' => null,
            ]);
        }
    }
}
