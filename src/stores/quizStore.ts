import { create } from 'zustand';
import type { QuizAnswer, QuizQuestion, QuizSubmissionResponse } from '../types';

interface QuizState {
  // Quiz taking state
  questions: Omit<QuizQuestion, 'correct_answer' | 'created_by'>[];
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  startTime: Date | null;
  isSubmitting: boolean;
  
  // Quiz results state
  lastQuizResult: QuizSubmissionResponse | null;
  
  // Timer state
  elapsedTime: number; // in seconds
}

interface QuizActions {
  // Quiz setup actions
  setQuestions: (questions: Omit<QuizQuestion, 'correct_answer' | 'created_by'>[]) => void;
  startQuiz: () => void;
  resetQuiz: () => void;
  
  // Navigation actions
  goToQuestion: (index: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  
  // Answer actions
  setAnswer: (questionId: number, answer: 'A' | 'B' | 'C' | 'D') => void;
  getAnswerForQuestion: (questionId: number) => 'A' | 'B' | 'C' | 'D' | null;
  
  // Submission actions
  setSubmitting: (submitting: boolean) => void;
  setQuizResult: (result: QuizSubmissionResponse) => void;
  
  // Timer actions
  setElapsedTime: (time: number) => void;
  incrementElapsedTime: () => void;
  
  // Utility actions
  isQuizComplete: () => boolean;
  getFormattedElapsedTime: () => string;
}

export const useQuizStore = create<QuizState & QuizActions>((set, get) => ({
  // Initial state
  questions: [],
  currentQuestionIndex: 0,
  answers: [],
  startTime: null,
  isSubmitting: false,
  lastQuizResult: null,
  elapsedTime: 0,

  // Quiz setup actions
  setQuestions: (questions) => {
    set({ questions, currentQuestionIndex: 0, answers: [] });
  },

  startQuiz: () => {
    set({
      startTime: new Date(),
      currentQuestionIndex: 0,
      answers: [],
      elapsedTime: 0,
      lastQuizResult: null,
    });
  },

  resetQuiz: () => {
    set({
      questions: [],
      currentQuestionIndex: 0,
      answers: [],
      startTime: null,
      isSubmitting: false,
      lastQuizResult: null,
      elapsedTime: 0,
    });
  },

  // Navigation actions
  goToQuestion: (index) => {
    const { questions } = get();
    if (index >= 0 && index < questions.length) {
      set({ currentQuestionIndex: index });
    }
  },

  nextQuestion: () => {
    const { currentQuestionIndex, questions } = get();
    if (currentQuestionIndex < questions.length - 1) {
      set({ currentQuestionIndex: currentQuestionIndex + 1 });
    }
  },

  previousQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      set({ currentQuestionIndex: currentQuestionIndex - 1 });
    }
  },

  // Answer actions
  setAnswer: (questionId, selectedAnswer) => {
    const { answers } = get();
    const existingAnswerIndex = answers.findIndex(
      (answer) => answer.question_id === questionId
    );

    if (existingAnswerIndex >= 0) {
      // Update existing answer
      const newAnswers = [...answers];
      newAnswers[existingAnswerIndex] = { question_id: questionId, selected_answer: selectedAnswer };
      set({ answers: newAnswers });
    } else {
      // Add new answer
      set({
        answers: [...answers, { question_id: questionId, selected_answer: selectedAnswer }],
      });
    }
  },

  getAnswerForQuestion: (questionId) => {
    const { answers } = get();
    const answer = answers.find((answer) => answer.question_id === questionId);
    return answer ? answer.selected_answer : null;
  },

  // Submission actions
  setSubmitting: (submitting) => {
    set({ isSubmitting: submitting });
  },

  setQuizResult: (result) => {
    set({ lastQuizResult: result, isSubmitting: false });
  },

  // Timer actions
  setElapsedTime: (time) => {
    set({ elapsedTime: time });
  },

  incrementElapsedTime: () => {
    set({ elapsedTime: get().elapsedTime + 1 });
  },

  // Utility actions
  isQuizComplete: () => {
    const { questions, answers } = get();
    return answers.length === questions.length && questions.length > 0;
  },

  getFormattedElapsedTime: () => {
    const { elapsedTime } = get();
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  },
}));
