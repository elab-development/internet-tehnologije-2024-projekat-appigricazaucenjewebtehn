<?php

namespace Database\Factories;
use App\Models\Game;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Question>
 */
class QuestionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'game_id'=>Game::factory,
            'question_text'=>$this->faker->question_text(),
            'options'=>$this->faker->optins(),
            'correct_answer'=>$this->faker->correct_answer(),
            'points'=>$this->faker->numberBetween(0, 10)
        ];
    }
}
