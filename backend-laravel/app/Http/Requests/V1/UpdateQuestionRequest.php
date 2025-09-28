<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Foundation\Rule;

class UpdateQuestionRequest extends FormRequest
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
                'gameId' => ['required', 'integer', 'exists:games,id'],
                'questionText' => ['required', 'string', 'max:255'],
                'optionA' => ['required', 'string', 'max:255'],
                'optionB' => ['required', 'string', 'max:255'],
                'optionC' => ['required', 'string', 'max:255'],
                'optionD' => ['required', 'string', 'max:255'],
                'correctAnswer' => ['required', 'string', 'max:255'],
                'points' => ['required', 'integer', 'min:0', 'max:10']
            ];
        } else {
            return [
                'gameId' => ['sometimes', 'required', 'integer', 'exists:games,id'],
                'questionText' => ['sometimes', 'required', 'string', 'max:255'],
                'optionA' => ['sometimes', 'required', 'string', 'max:255'],
                'optionB' => ['sometimes', 'required', 'string', 'max:255'],
                'optionC' => ['sometimes', 'required', 'string', 'max:255'],
                'optionD' => ['sometimes', 'required', 'string', 'max:255'],
                'correctAnswer' => ['sometimes', 'required', 'string', 'max:255'],
                'points' => ['sometimes', 'required', 'integer', 'min:0', 'max:10']
            ];
        }
        
    }

    protected function prepareForValidation(){
        if($this->gameId){
            $this->merge([
                'game_id'=>$this->gameId
            ]);
        }
        if($this->questionText){
            $this->merge([
                'question_text'=>$this->questionText
            ]);
        }
        if($this->optionA){
            $this->merge([
                'option_a'=>$this->optionA
            ]);
        }
        if($this->optionB){
            $this->merge([
                'option_b'=>$this->optionB
            ]);
        }
        if($this->optionC){
            $this->merge([
                'option_c'=>$this->optionC,
            ]);
        }
        if($this->optionD){
            $this->merge([
                'option_d'=>$this->optionD
            ]);
        }
        if($this->correctAnswer){
            $this->merge([
                'correct_answer'=>$this->correctAnswer
            ]);
        }
    }
}
