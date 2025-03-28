// This file returns mock data in development mode.
// In production, actual API calls should be made.

export const BASE_URL = "https://api.example.com"; // Placeholder base URL

export type MockMethod = "GET" | "POST";

export interface MockRequest {
  url: string;
  method: MockMethod;
  body?: Record<string, unknown>;
}

export async function mockFetch({ url, method, body }: MockRequest) {
  // Delay to simulate network latency
  // await new Promise((resolve) => setTimeout(resolve, 4000));

  // Mock for onboarding a user
  if (url.endsWith("/protected/onboard") && method === "POST") {
    return {
      userId: "97fffc35b648278c",
      referralCode: "MOCKREFCODE",
      clientId: body?.clientId,
    };
  }

  // Mock for fetching user transaction information
  if (url.endsWith("/protected/transaction/info") && method === "POST") {
    return {
      totalCash: 100,
      totalCashSpent: 20,
      totalPoints: 500,
      totalPointsSpent: 50,
      totalCashEarned: 120,
      totalPointsEarned: 550,
      bonusCash: 10,
      bonusPoints: 50,
    };
  }

  // Mock for sharing points
  if (url.endsWith("/protected/transaction/sharePoints") && method === "POST") {
    const { amount, recipientUsername } = body as { amount: number; recipientUsername: string };

    // In a real API, this would create a transaction record for both sender and recipient
    // Here we just return success, and our mock transaction history will simulate the result
    console.log(`Sharing ${amount} points with ${recipientUsername}`);

    return { message: "successful" };
  }

  // Mock for withdrawing cash
  if (url.endsWith("/protected/transaction/withdrawCash") && method === "POST") {
    const { amount, upiId } = body as { amount: number; upiId: string };

    // Log the withdrawal for debugging
    console.log(`Withdrawing ₹${amount} to UPI: ${upiId}`);

    return { message: "success" };
  }

  // Mock for fetching sent rewards from contact list
  if (url.includes("/protected/transaction/contactListSentRewards/") && method === "GET") {
    return ["Reward A", "Reward B", "Reward C"];
  }

  // Mock for fetching user information for the landing page
  if (url.includes("protected/refluent/userinfo/") && method === "GET") {
    return {
      totalCash: 300,
      totalPoints: 1000,
      sucessfulReferralCount: 7,
      badgeUrl: "https://example.com/badge.png",
      username: "MockUser",
    };
  }

  // Mock for tracking referrals
  if (url.includes("/protected/referral/trackReferrals/") && method === "GET") {
    return [
      { status: "successful", username: "Friend1" },
      { status: "pending", username: "Friend2" },
      { status: "successful", username: "Friend3" },
      { status: "pending", username: "Friend4" },
    ];
  }

  // Mock for getting transaction history for a user
  if (url.includes("/protected/transaction/transactionHistory/") && method === "GET") {
    return [
      { username: "Friend1", amount: 50, type: "Cash" },
      { username: "Friend2", amount: -20, type: "Cash" },
      { username: "Store", amount: 100, type: "Points" },
      { username: "Friend3", amount: -30, type: "Points" },
    ];
  }

  // Mock for getting specific transaction history
  if (url.endsWith("/protected/transaction/transactionHistory") && method === "POST") {
    const transactionType = (body?.type as string) || "all";

    const allTransactions = [
      { username: "Friend1", amount: 50, type: "Cash" },
      { username: "Friend2", amount: -20, type: "Cash" },
      { username: "Store", amount: 100, type: "Points" },
      { username: "Friend3", amount: -30, type: "Points" },
    ];

    if (transactionType === "all") {
      return allTransactions;
    } else {
      return allTransactions.filter((transaction) => transaction.type === transactionType);
    }
  }

  // Fallback if no mock matches
  throw new Error(`No mock handler for ${method} ${url}`);
}

//reference

/*
1. Onboard User

Route: POST /protected/onboard

Description: This endpoint allows onboarding of a new user.

Request Body:

json

{
  "clientId": "string",
  "phoneNumber": "string",
  "username": "string"
}

    clientId (string): The ID of the client initiating the request.

    phoneNumber (string): The phone number of the user.

    username (string): The username of the user.

Response:

json

{
  "userId": "string",
  "referralCode": "string",
  "clientId": "string"
}

    userId (string): Unique ID of the onboarded user.

    referralCode (string): Referral code for the user.

    clientId (string): Client ID associated with the user.

2. Get User Transaction Information

Route: POST /protected/transaction/info

Description: Fetch transaction information for a user.

Request Body:

json

{
  "userId": "string"
}

    userId (string): The ID of the user whose transaction information is being requested.

Response:

json

{
  "totalCash": 0,
  "totalCashSpent": 0,
  "totalPoints": 0,
  "totalPointsSpent": 0,
  "totalCashEarned": 0,
  "totalPointsEarned": 0,
  "bonusCash": 0,
  "bonusPoints": 0
}

    totalCash (int): Total amount of cash available for the user.

    totalCashSpent (int): Total cash spent by the user.

    totalPoints (int): Total points available for the user.

    totalPointsSpent (int): Total points spent by the user.

    totalCashEarned (int): Total cash earned by the user.

    totalPointsEarned (int): Total points earned by the user.

    bonusCash (int): Total bonus cash earned.

    bonusPoints (int): Total bonus points earned.

3. Share Points

Route: POST /protected/transaction/sharePoints

Description: Allows a user to share points with another user.

Request Body:

json

{
  "userId": "string",
  "clientId": "string",
  "amount": 0
}

    userId (string): The ID of the user sharing the points.

    clientId (string): The ID of the client.

    amount (int): The amount of points to share.

Response:

json

{
  "message": "successful"
}

    message (string): Status message indicating the outcome of the request.

4. Withdraw Cash

Route: POST /protected/transaction/withdrawCash

Description: Withdraw cash for a user.

Request Body:

json

{
  "userId": "string",
  "amount": 0
}

    userId (string): The ID of the user withdrawing cash.

    amount (int): The amount of cash to withdraw.

Response:

json

{
  "message": "success"
}

    message (string): Status message indicating the success of the withdrawal.

5. Get Sent Rewards from Contact List

Route: GET /protected/transaction/contactListSentRewards/:userId

Description: Fetch rewards sent to a user's contact list.

Response:

json

[
  "string"
]

    The response is an array of strings indicating the rewards sent.

6. Get User Information for Landing Page

Route: GET /refluent/userinfo/:userId

Description: Fetch detailed information about a user for the landing page.

Response:

json

{
  "totalCash": 0,
  "totalPoints": 0,
  "sucessfulReferralCount": 0,
  "badgeUrl": "string",
  "username": "string"
}

    totalCash (int): Total cash available for the user.

    totalPoints (int): Total points available for the user.

    sucessfulReferralCount (int): The number of successful referrals made by the user.

    badgeUrl (string): URL to the user's badge image.

    username (string): The username of the user.

7. Track Referrals

Route: GET /protected/referral/trackReferrals/:userId

Description: Fetch the referral status for a user.

Response:

json

[
  {
    "status": "string",
    "username": "string"
  }
]

    status (string): The referral status (e.g., "successful", "pending").

    username (string): The username of the user who made the referral.
    */
