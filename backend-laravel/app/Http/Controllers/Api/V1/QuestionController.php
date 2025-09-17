<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Question;
use App\Http\Requests\V1\StoreQuestionRequest;
use App\Http\Requests\V1\UpdateQuestionRequest;
use App\Http\Controllers\Controller;
use App\Http\Resources\V1\QuestionResource;
use App\Http\Resources\V1\QuestionCollection;
use App\Filters\V1\QuestionsFilter;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class QuestionController extends Controller
{
    public function index(Request $request)
    {
        try{
            $filter = new QuestionsFilter();
            $filterItems = $filter->transform($request); //column operator value

            if(count($filterItems) == 0){
             return new QuestionCollection(Question::paginate());
            } else{
                $questions = Question::where($filterItems)->paginate();
                return new QuestionCollection($questions->appends($request->query()));
            }
        }
        catch(\Illuminate\Database\QueryException $e){
            //greska u upitu
            return response()->json([
            'success' => false,
            'message' => 'Database query error',
            'error' => 'Invalid filter parameters or database error'
        ], 400);
        }
        catch (\Exception $e) {
            // neka druga greska
            return response()->json([
                'success' => false,
                'message' => 'Server error',
                'error' => $e->getMessage()
        ], 500);
    }
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreQuestionRequest $request)
    {
        return new QuestionResource(Question::create($request->all()));
    }

    public function show(Question $question)
    {
        return new QuestionResource($question);
    }

    public function update(UpdateQuestionRequest $request, Question $question)
    {
        $question->update($request->all());
    }

    public function downloadCSV(): StreamedResponse
    {
        $fileName = 'questions-' . date('Y-m-d') . '.csv';
        $questions = Question::select([
            'id',
            'game_id', 
            'question_text',
            'option_a',
            'option_b',
            'option_c',
            'option_d',
            'correct_answer',
            'points'
        ])->get();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$fileName\"",
        ];

        $callback = function() use ($questions) {
            $file = fopen('php://output', 'w');
            
            fputcsv($file, [
                'ID',
                'Game ID', 
                'Question Text',
                'Option A',
                'Option B',
                'Option C',
                'Option D',
                'Correct Answer',
                'Points'
            ]);

            foreach ($questions as $question) {
                fputcsv($file, [
                    $question->id,
                    $question->game_id,
                    $question->question_text,
                    $question->option_a,
                    $question->option_b,
                    $question->option_c,
                    $question->option_d,
                    $question->correct_answer,
                    $question->points
                ]);
            }          
            fclose($file);
        };

        return Response::stream($callback, 200, $headers);
    }

    public function forceDelete($id){
        $question = Question::findOrFail($id);
        $question->delete();
    }



}
