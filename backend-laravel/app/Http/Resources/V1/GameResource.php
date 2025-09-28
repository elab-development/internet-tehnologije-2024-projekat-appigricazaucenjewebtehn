<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GameResource extends JsonResource
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
            'playerId'=>$this->player_id,
            'score'=>$this->score,
            'completed'=>$this->completed,
            'questions'=>QuestionResource::collection($this->whenLoaded('questions'))
        ];
    }
}
