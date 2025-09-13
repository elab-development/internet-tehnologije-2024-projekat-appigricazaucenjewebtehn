<?php

namespace Database\Factories;
use App\Models\Player;
use App\Models\Game;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Game>
 */
class GameFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $completed = $this->faker->boolean();
        return [
            'player_id'=> Player::factory(),
            'score' => $completed == 1 ? $this->faker->numberBetween(1, 1000) : 0,
            'completed' => $completed
        ];
    }
}
