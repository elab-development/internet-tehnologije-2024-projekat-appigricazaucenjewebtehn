<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Foundation\Rule;

class UpdateGameRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
     public function authorize(): bool
    {
        $user = $this->user();
        return $user !== null && $user->tokenCan('update');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $method = $this->method();

        if($method == 'PUT'){
            return [
                'playerId'=>['required', 'integer', 'exists:players,id'],
                'score'=>['required','integer','min:0','max:1000'],
                'completed'=>['required','boolean']
            ];
        } else {
            return [
                'playerId'=>['sometimes', 'required', 'integer', 'exists:players,id'],
                'score'=>['sometimes', 'required','integer','min:0','max:1000'],
                'completed'=>['sometimes', 'required','boolean']
            ];
        }
        
    }

    protected function prepareForValidation(){
        if($this->playerId){
            $this->merge([
                'player_id'=>$this->playerId
            ]);
        }
        
    }
}
