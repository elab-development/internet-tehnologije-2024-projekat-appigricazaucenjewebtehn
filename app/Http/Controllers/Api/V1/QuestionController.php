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

class QuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
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
     * Show the form for creating a new resource.
     */

   

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreQuestionRequest $request)
    {
        return new QuestionResource(Question::create($request->all()));
    }

    /**
     * Display the specified resource.
     */
    public function show(Question $question)
    {
        return new QuestionResource($question);
    }

    /**
     * Show the form for editing the specified resource.
     */
    

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateQuestionRequest $request, Question $question)
    {
        $question->update($request->all());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Question $question)
    {
        //
    }
}
