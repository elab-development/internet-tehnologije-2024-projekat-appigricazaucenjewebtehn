<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Foundation\Rule;

class UpdatePlayerRequest extends FormRequest
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
                'name'=>['required'],
                'password'=>['required'],
                'email'=>['required', 'email']
            ];
        }else{
            return [
                'name'=>['sometimes', 'required'],
                'password'=>['sometimes', 'required'],
                'email'=>['sometimes', 'required', 'email']
            ];
        }

        
    }

    protected function prepareForValidation(){
        //$this->merge([
            //
        //]);
    }
}
