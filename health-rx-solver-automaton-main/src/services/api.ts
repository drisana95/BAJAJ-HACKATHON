
import { toast } from "sonner";
import { WebhookRequest, WebhookResponse, MutualFollowersResult, NthLevelFollowersResult, User, ProcessingStatus } from "@/types/api";
import { findMutualFollowers, findNthLevelFollowers } from "@/utils/algorithms";

// The base URL for the API
// In a real app, we would use actual endpoints
// For this demo, we'll simulate the API
const API_BASE_URL = 'https://bfhldevapigw.healthrx.co.in/hiring';

// Simulate API call for demo purposes
const simulateApiCall = <T>(data: T, delay: number = 1000, shouldFail = false): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error("API call failed"));
      } else {
        resolve(data);
      }
    }, delay);
  });
};

// Generate webhook endpoint
export const generateWebhook = async (request: WebhookRequest, setStatus: (status: ProcessingStatus) => void): Promise<WebhookResponse> => {
  setStatus({ step: 'fetching', message: 'Requesting webhook...' });
  
  try {
    // For demo purposes, we'll simulate the API response
    // In a real app, we would make an actual fetch call
    // const response = await fetch(`${API_BASE_URL}/generateWebhook`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(request)
    // });
    // return await response.json();
    
    // Determine which question to simulate based on the last digit of regNo
    const lastDigit = parseInt(request.regNo.slice(-1));
    const isOdd = lastDigit % 2 !== 0;
    const questionType = isOdd ? 1 : 2;
    
    let simulatedData;
    if (questionType === 1) {
      // Question 1: Mutual Followers
      simulatedData = {
        users: [
          { id: 1, name: "Alice", follows: [2, 3] },
          { id: 2, name: "Bob", follows: [1] },
          { id: 3, name: "Charlie", follows: [4] },
          { id: 4, name: "David", follows: [3] }
        ]
      };
    } else {
      // Question 2: Nth-Level Followers
      simulatedData = {
        users: {
          n: 2,
          findId: 1,
          users: [
            { id: 1, name: "Alice", follows: [2, 3] },
            { id: 2, name: "Bob", follows: [4] },
            { id: 3, name: "Charlie", follows: [4, 5] },
            { id: 4, name: "David", follows: [6] },
            { id: 5, name: "Eva", follows: [6] },
            { id: 6, name: "Frank", follows: [] }
          ]
        }
      };
    }
    
    const simulatedResponse: WebhookResponse = {
      webhook: `${API_BASE_URL}/testWebhook`,
      accessToken: "simulated-jwt-token-" + Math.random().toString(36).substring(2),
      data: simulatedData,
      question: questionType
    };
    
    return await simulateApiCall(simulatedResponse);
  } catch (error) {
    console.error("Error generating webhook:", error);
    setStatus({ 
      step: 'error', 
      message: 'Failed to generate webhook', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
    throw error;
  }
};

// Process the data based on question type
export const processData = async (
  webhookResponse: WebhookResponse, 
  regNo: string,
  setStatus: (status: ProcessingStatus) => void
): Promise<MutualFollowersResult | NthLevelFollowersResult> => {
  setStatus({ step: 'processing', message: 'Processing data...' });
  
  try {
    // Determine which question to process
    const questionType = webhookResponse.question || 
      ('n' in (webhookResponse.data as any).users ? 2 : 1);
    
    let result;
    
    if (questionType === 1) {
      // Question 1: Mutual Followers
      const users = (webhookResponse.data as { users: User[] }).users;
      const mutualFollowersPairs = findMutualFollowers(users);
      result = {
        regNo,
        outcome: mutualFollowersPairs
      };
    } else {
      // Question 2: Nth-Level Followers
      const data = webhookResponse.data as { 
        users: { n: number; findId: number; users: User[] } 
      };
      const { n, findId, users } = data.users;
      const nthLevelFollowers = findNthLevelFollowers(users, findId, n);
      result = {
        regNo,
        outcome: nthLevelFollowers
      };
    }
    
    // Simulate processing delay
    return await simulateApiCall(result as any);
  } catch (error) {
    console.error("Error processing data:", error);
    setStatus({ 
      step: 'error', 
      message: 'Failed to process data', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
    throw error;
  }
};

// Submit results to webhook
export const submitToWebhook = async (
  webhookUrl: string,
  accessToken: string,
  data: MutualFollowersResult | NthLevelFollowersResult,
  setStatus: (status: ProcessingStatus) => void
): Promise<void> => {
  const MAX_RETRIES = 4;
  let retryCount = 0;
  
  const attemptSubmission = async (): Promise<void> => {
    try {
      setStatus({ 
        step: 'submitting', 
        message: retryCount > 0 ? `Retrying submission (${retryCount}/4)...` : 'Submitting results...',
        retryCount
      });
      
      // Simulate random failures for retry testing
      // Higher chance of failure for first few attempts
      const shouldFail = Math.random() < (0.8 - (retryCount * 0.2));
      
      // In a real app, we would make an actual fetch call
      // await fetch(webhookUrl, {
      //   method: 'POST',
      //   headers: { 
      //     'Authorization': accessToken,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(data)
      // });
      
      // Simulate the API call with potential failure
      await simulateApiCall({}, 1000, shouldFail);
      
      setStatus({ step: 'completed', message: 'Results submitted successfully!' });
      toast.success("Results successfully submitted!");
    } catch (error) {
      retryCount++;
      
      if (retryCount < MAX_RETRIES) {
        // Exponential backoff for retries
        const delay = Math.pow(2, retryCount) * 1000;
        toast.error(`Submission failed. Retrying in ${delay/1000} seconds...`);
        
        setTimeout(attemptSubmission, delay);
      } else {
        console.error("Failed to submit after maximum retries:", error);
        setStatus({ 
          step: 'error', 
          message: 'Failed to submit after maximum retries', 
          details: error instanceof Error ? error.message : 'Unknown error',
          retryCount
        });
        toast.error("Failed to submit results after maximum retries.");
      }
    }
  };
  
  await attemptSubmission();
};
