<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreGameRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();
        return $user !== null && $user->tokenCan('create');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'playerId'=>['required', 'integer', 'exists:players,id'],
            'score'=>['required','integer','min:0','max:1000'],
            'completed'=>['required','boolean']
        ];
    }

    protected function prepareForValidation(){
        $this->merge([
            'player_id'=>$this->playerId
        ]);
    }
}
