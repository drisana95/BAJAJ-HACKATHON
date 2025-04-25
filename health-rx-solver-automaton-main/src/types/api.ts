
export interface User {
  id: number;
  name: string;
  follows: number[];
}

export interface WebhookRequest {
  name: string;
  regNo: string;
  email: string;
}

export interface WebhookResponse {
  webhook: string;
  accessToken: string;
  data: {
    users: User[];
  } | {
    users: {
      n: number;
      findId: number;
      users: User[];
    };
  };
  question?: number;
}

export interface MutualFollowersResult {
  regNo: string;
  outcome: number[][];
}

export interface NthLevelFollowersResult {
  regNo: string;
  outcome: number[];
}

export interface ProcessingStatus {
  step: 'init' | 'fetching' | 'processing' | 'submitting' | 'completed' | 'error';
  message: string;
  details?: string;
  retryCount?: number;
}
