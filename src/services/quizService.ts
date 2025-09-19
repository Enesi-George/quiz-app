import type { QuizQuestion, QuizSubmissionRequest, QuizSubmissionResponse } from '../types';
import { api, publicApi } from './api';

export const quizService = {
  async startQuiz(): Promise<Omit<QuizQuestion, 'correct_answer' | 'created_by'>[]> {
    const response = await publicApi.get('/public/quiz/start');
    return response.data;
  },

  async submitQuiz(submission: QuizSubmissionRequest): Promise<QuizSubmissionResponse> {
    const response = await publicApi.post('/public/quiz/submit', submission);
    return response.data;
  },

  async getQuizHistory() {
    const response = await api.get('/quiz/history');
    return response.data;
  },
};
