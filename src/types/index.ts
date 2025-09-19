// User and Authentication Types
export interface User {
  id: number;
  full_name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Question Types
export interface QuizQuestion {
  id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: 'A' | 'B' | 'C' | 'D';
  created_at: string;
  updated_at: string;
  created_by?: number;
}

export interface CreateQuestionRequest {
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: 'A' | 'B' | 'C' | 'D';
}

export type UpdateQuestionRequest = CreateQuestionRequest;

// Quiz Types
export interface QuizStartResponse {
  questions: Omit<QuizQuestion, 'correct_answer' | 'created_by'>[];
}

export interface QuizAnswer {
  question_id: number;
  selected_answer: 'A' | 'B' | 'C' | 'D';
}

export interface QuizSubmissionRequest {
  answers: QuizAnswer[];
  time_taken: string;
}

export interface QuizResult {
  question_id: number;
  selected_answer: 'A' | 'B' | 'C' | 'D';
  correct_answer: 'A' | 'B' | 'C' | 'D';
  is_correct: boolean;
}

export interface QuizSubmissionResponse {
  total_questions: number;
  correct_answers: number;
  score: number;
  time_taken: string;
  results: QuizResult[];
}

// API Response Types
export interface ApiError {
  error?: string;
  message?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Component Props Types
export interface QuestionFormData {
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: 'A' | 'B' | 'C' | 'D';
}

export interface QuizState {
  questions: Omit<QuizQuestion, 'correct_answer' | 'created_by'>[];
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  startTime: Date | null;
  isSubmitting: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

