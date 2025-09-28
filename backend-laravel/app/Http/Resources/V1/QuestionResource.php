<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuestionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'=>$this->id,
            'gameId'=>$this->game_id,
            'questionText'=>$this->question_text,
            'optionA'=>$this->option_a,
            'optionB'=>$this->option_b,
            'optionC'=>$this->option_c,
            'optionD'=>$this->option_d,
            'correctAnswer'=>$this->correct_answer,
            'points'=>$this->points
        ];
    }
}
