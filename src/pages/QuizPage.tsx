import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { quizService } from '../services/quizService';
import { useQuizStore } from '../stores/quizStore';
import { useAuthStore } from '../stores/authStore';
import type { AxiosError } from 'axios';

export const QuizPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const {
    questions,
    currentQuestionIndex,
    answers,
    isSubmitting,
    lastQuizResult,
    setQuestions,
    startQuiz,
    resetQuiz,
    goToQuestion,
    nextQuestion,
    previousQuestion,
    setAnswer,
    getAnswerForQuestion,
    setSubmitting,
    setQuizResult,
    incrementElapsedTime,
    isQuizComplete,
    getFormattedElapsedTime,
  } = useQuizStore();

  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Fetch questions for quiz
  const { data: quizQuestions, isLoading, refetch } = useQuery({
    queryKey: ['quiz-start'],
    queryFn: quizService.startQuiz,
    enabled: false, // Only fetch when is triggered
  });

  // Submit quiz mutation
  const submitMutation = useMutation({
    mutationFn: quizService.submitQuiz,
    onSuccess: (result) => {
      setQuizResult(result);
      setShowResults(true);
      toast.success('Quiz submitted successfully!');
    },
    onError: (error: AxiosError<{ error?: string }>) => {
      console.log(error);     
      setSubmitting(false);
    },
  });

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isQuizStarted && !showResults && !isSubmitting) {
      interval = setInterval(() => {
        incrementElapsedTime();
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isQuizStarted, showResults, isSubmitting, incrementElapsedTime]);

  // Initialize quiz questions
  useEffect(() => {
    if (quizQuestions) {
      setQuestions(quizQuestions);
    }
  }, [quizQuestions, setQuestions]);

  const handleStartQuiz = async () => {
    try {
      await refetch();
      startQuiz();
      setIsQuizStarted(true);
      setShowResults(false);
    } catch (error) {
      console.log('Failed to start quiz:', error);
      toast.error('Failed to start quiz');
    }
  };

  const handleAnswerSelect = (questionId: number, selectedAnswer: 'A' | 'B' | 'C' | 'D') => {
    setAnswer(questionId, selectedAnswer);
  };

  const handleSubmitQuiz = () => {
    if (!isQuizComplete()) {
      toast.error('Please answer all questions before submitting');
      return;
    }

    const timeFormatted = getFormattedElapsedTime();
    
    setSubmitting(true);
    submitMutation.mutate({
      answers,
      time_taken: timeFormatted,
    });
  };

  const handleRestartQuiz = () => {
    resetQuiz();
    setIsQuizStarted(false);
    setShowResults(false);
  };

  const handleBackToQuestions = () => {
    if (isAuthenticated) {
      navigate('/questions');
    } else {
      navigate('/auth');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show results page
  if (showResults && lastQuizResult) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Quiz Results</h1>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{lastQuizResult.score}%</div>
                  <div className="text-sm text-gray-600">Final Score</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{lastQuizResult.correct_answers}</div>
                  <div className="text-sm text-gray-600">Correct Answers</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{lastQuizResult.total_questions}</div>
                  <div className="text-sm text-gray-600">Total Questions</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{lastQuizResult.time_taken}</div>
                  <div className="text-sm text-gray-600">Time Taken</div>
                </div>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900">Question Review</h2>
              {lastQuizResult.results.map((result, index) => {
                const question = questions.find(q => q.id === result.question_id);
                return (
                  <div
                    key={result.question_id}
                    className={`p-4 rounded-lg border-2 ${
                      result.is_correct ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">Question {index + 1}</h3>
                      <span
                        className={`px-2 py-1 rounded text-sm font-medium ${
                          result.is_correct
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {result.is_correct ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>
                    <p className="text-gray-800 mb-3">{question?.question_text}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium">Your Answer: </span>
                        <span className={result.is_correct ? 'text-green-600' : 'text-red-600'}>
                          Option {result.selected_answer}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Correct Answer: </span>
                        <span className="text-green-600">Option {result.correct_answer}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={handleRestartQuiz}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium"
              >
                Take Quiz Again
              </button>
              <button
                onClick={handleBackToQuestions}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md font-medium"
              >
                {isAuthenticated ? 'Back to Questions' : 'Login to Manage Questions'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show quiz interface
  if (isQuizStarted && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    const currentAnswer = getAnswerForQuestion(currentQuestion.id);
    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with timer and progress */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </h1>
              </div>
              <div className="text-right">
                <div className="text-2xl font-mono font-bold text-blue-600">
                  {getFormattedElapsedTime()}
                </div>
                <div className="text-sm text-gray-600">Elapsed Time</div>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {currentQuestion.question_text}
            </h2>

            <div className="space-y-4">
              {[
                { key: 'A', text: currentQuestion.option_a },
                { key: 'B', text: currentQuestion.option_b },
                { key: 'C', text: currentQuestion.option_c },
                { key: 'D', text: currentQuestion.option_d },
              ].map((option) => (
                <label
                  key={option.key}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    currentAnswer === option.key
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={option.key}
                    checked={currentAnswer === option.key}
                    onChange={() => handleAnswerSelect(currentQuestion.id, option.key as 'A' | 'B' | 'C' | 'D')}
                    className="mr-4 h-4 w-4 text-blue-600"
                  />
                  <span className="font-medium text-gray-900 mr-3">{option.key}.</span>
                  <span className="text-gray-800">{option.text}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center">
              <button
                onClick={previousQuestion}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 bg-gray-600 text-white rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
              >
                Previous
              </button>

              <div className="flex space-x-2">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToQuestion(index)}
                    className={`w-10 h-10 rounded-full font-medium ${
                      index === currentQuestionIndex
                        ? 'bg-blue-600 text-white'
                        : getAnswerForQuestion(questions[index].id)
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              {isLastQuestion ? (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                </button>
              ) : (
                <button
                  onClick={nextQuestion}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show start quiz screen
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Ready to Take the Quiz?</h1>
          <p className="text-gray-600 mb-8">
            Test your knowledge with our quiz. You'll have unlimited time to complete all questions.
          </p>
          <div className="space-y-4">
            <button
              onClick={handleStartQuiz}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md font-medium text-lg"
            >
              Start Quiz
            </button>
            {isAuthenticated ? (
              <button
                onClick={handleBackToQuestions}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-md font-medium"
              >
                Back to Questions
              </button>
            ) : (
              <button
                onClick={handleBackToQuestions}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-md font-medium"
              >
                Login to Manage Questions
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
