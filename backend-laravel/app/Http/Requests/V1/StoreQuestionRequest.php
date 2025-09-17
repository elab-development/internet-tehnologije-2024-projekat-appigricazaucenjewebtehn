<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreQuestionRequest extends FormRequest
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
            'gameId' => ['required', 'integer', 'exists:games,id'],
            'questionText' => ['required', 'string', 'max:255'],
            'optionA' => ['required', 'string', 'max:255'],
            'optionB' => ['required', 'string', 'max:255'],
            'optionC' => ['required', 'string', 'max:255'],
            'optionD' => ['required', 'string', 'max:255'],
            'correctAnswer' => ['required', 'string', 'max:255'],
            'points' => ['required', 'integer', 'min:0', 'max:10']
        ];
    }

    protected function prepareForValidation(){
        $this->merge([
            'game_id'=>$this->gameId,           
            'question_text'=>$this->questionText,
            'option_a'=>$this->optionA,
            'option_b'=>$this->optionB,
            'option_c'=>$this->optionC,
            'option_d'=>$this->optionD,
            'correct_answer'=>$this->correctAnswer,
        ]);
    }
}
