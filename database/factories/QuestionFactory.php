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
        $options = [
            'option_a' => $this->faker->word(),
            'option_b' => $this->faker->word(),
            'option_c' => $this->faker->word(), 
            'option_d' => $this->faker->word(),
        ];
        $correctOption = $this->faker->randomElement(['a', 'b', 'c', 'd']);
        $correctAnswer = $options['option_' . $correctOption];

        return [
            'game_id'=>Game::factory(),
            'question_text'=>$this->faker->realText(20),
            'option_a' => $options['option_a'],
            'option_b' => $options['option_b'],
            'option_c' => $options['option_c'],
            'option_d' => $options['option_d'],
            'correct_answer' => $correctAnswer,
            'points'=>$this->faker->numberBetween(0, 10)
        ];
    }
}
