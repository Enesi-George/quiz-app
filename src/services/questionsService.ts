import type { CreateQuestionRequest, QuizQuestion, UpdateQuestionRequest } from '../types';
import { api } from './api';

export const questionsService = {
  async getQuestions(): Promise<QuizQuestion[]> {
    const response = await api.get('/quiz/start');
    return response.data;
  },

  async createQuestion(questionData: CreateQuestionRequest): Promise<QuizQuestion> {
    const response = await api.post('/questions', questionData);
    return response.data;
  },

  async updateQuestion(id: number, questionData: UpdateQuestionRequest): Promise<QuizQuestion> {
    const response = await api.put(`/questions/${id}`, questionData);
    return response.data;
  },

  async deleteQuestion(id: number): Promise<{ message: string }> {
    const response = await api.delete(`/questions/${id}`);
    return response.data;
  },
};
