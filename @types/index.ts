
export interface Challenge {
  id: string;
  title: string;
  description: string;
  hint?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
  setup?: {
    files?: Record<string, string>;
    directories?: string[];
    commands?: string[];
  };
  validation: {
    type: 'output' | 'file_content' | 'file_exists' | 'custom';
    expected?: string | string[];
    validator?: string; 
    files?: string[];
  };
  category?: string;
}

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTime: number;
}