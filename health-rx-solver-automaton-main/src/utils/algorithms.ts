import { User } from "@/types/api";

// Question 1: Find mutual followers
export function findMutualFollowers(users: User[]): number[][] {
  const mutualFollowers: number[][] = [];
  const userMap = new Map<number, Set<number>>();
  
  // Build a map of who each user follows
  users.forEach(user => {
    userMap.set(user.id, new Set(user.follows));
  });
  
  // Check for mutual follows
  users.forEach(user => {
    const userFollows = user.follows;
    
    userFollows.forEach(followId => {
      // Skip if we've already processed this pair
      if (user.id >= followId) return;
      
      // Check if the followId follows the current user
      const follows = userMap.get(followId);
      if (follows && follows.has(user.id)) {
        // Sort by ID to avoid duplicates
        mutualFollowers.push([user.id, followId]);
      }
    });
  });
  
  // Sort by first ID for consistent output
  return mutualFollowers.sort((a, b) => a[0] - b[0]);
}

// Question 2: Find Nth-level followers
export function findNthLevelFollowers(
  users: User[], 
  startId: number, 
  n: number
): number[] {
  // Map of user ID to their follows
  const followsMap = new Map<number, number[]>();
  users.forEach(user => {
    followsMap.set(user.id, user.follows);
  });
  
  // Set to keep track of visited users
  const visited = new Set<number>();
  visited.add(startId);
  
  // Current level followers
  let currentLevel = [startId];
  let level = 0;
  
  // BFS to find nth level followers
  while (level < n && currentLevel.length > 0) {
    level++;
    const nextLevel: number[] = [];
    
    for (const userId of currentLevel) {
      const follows = followsMap.get(userId) || [];
      for (const followId of follows) {
        if (!visited.has(followId)) {
          visited.add(followId);
          nextLevel.push(followId);
        }
      }
    }
    
    currentLevel = nextLevel;
  }
  
  // Return sorted list of nth level followers
  return currentLevel.sort((a, b) => a - b);
}
