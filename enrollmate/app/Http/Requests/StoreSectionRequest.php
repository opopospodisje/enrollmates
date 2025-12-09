<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSectionRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'grade_level_id' => 'required|exists:grade_levels,id',
            'is_special' => 'boolean',
            'cutoff_grade' => [
                'nullable',
                'numeric',
                'min:0',
                'max:100',
                function ($attribute, $value, $fail) {
                    if (request('is_special') && $value === null) {
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
