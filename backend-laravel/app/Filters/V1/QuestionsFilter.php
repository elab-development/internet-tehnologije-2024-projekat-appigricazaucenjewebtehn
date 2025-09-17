<?php

namespace App\Filters\V1;

use Illuminate\Http\Request;
use App\Filters\ApiFilter;

class QuestionsFilter extends ApiFilter{
    protected $safeParms = [
        'gameId'=>['eq', 'lt', 'gt'],
        'questionText'=>['eq'],
        'optionA'=>['eq'],
        'optionB'=>['eq'],
        'optionC'=>['eq'],
        'optionD'=>['eq'],
        'correctAnswer'=>['eq'],
        'points'=>['eq', 'gt', 'lt']
    ];
    protected $columnMap = [
        'optionA'=>'option_a',
        'optionB'=>'option_b',
        'optionC'=>'option_c',
        'optionD'=>'option_d',
        'questionText'=>'question_text',
        'correctAnswer'=>'correct_answer',
        'gameId'=>'game_id',
    ];

    protected $operatorMap = [
        'eq' => '=',
        'lt'=> '<',
        'lte' => '<=',
        'gt'=> '>',
        'gte' => '>='
    ];

    public function transform(Request $request){
        $eloQuery =[];

        foreach($this->safeParms as $parm => $operators){
            $query = $request->query($parm);

            if(!isset($query)){
                continue;
            }

            $column = $this->columnMap[$parm] ?? $parm;

            foreach($operators as $operator){
                if(isset($query[$operator])){
                    $eloQuery[]=[$column, $this->operatorMap[$operator], $query[$operator]];
                }
            }
        }

        return $eloQuery;
    }
}