import axios from 'axios';

let cachedResponse: any = null;
let lastRequestTimestamp: number | null = null;

const MONOBANK_TIMEOUT = 60 * 1000; // 1 minute

/**
 * Fetches Monobank data for a specific jar ID and user timestamp.
 * Caches the response and manages request timing to avoid hitting the API too frequently.
 *
 * @param jarId - The ID of the jar to fetch data for.
 * @param userTimestamp - The timestamp provided by the user to check against the last request.
 * @returns An object containing the fetched data and time left until the next request can be made.
 */

export type fetchMonobankDataResponse = {
  data: any;
  timeLeft: number | null;
};

export const fetchMonobankData = async (
  jarId: string,
  userTimestamp: number,
): Promise<fetchMonobankDataResponse> => {
  const nowTimestamp = Date.now();

  // Check if the user's timestamp is earlier than the last request timestamp
  if (
    lastRequestTimestamp &&
    userTimestamp &&
    userTimestamp < lastRequestTimestamp
  ) {
    return {
      data: cachedResponse,
      timeLeft: null,
    };
  }

  // Check if the last request was made less than 1 minute ago
  if (
    lastRequestTimestamp &&
    nowTimestamp - lastRequestTimestamp < MONOBANK_TIMEOUT
  ) {
    const timeLeft =
      MONOBANK_TIMEOUT -
      (nowTimestamp - lastRequestTimestamp);
    return {
      data: null,
      timeLeft: timeLeft,
    };
  }

  // Perform the request
  try {
    const timestamp30daysAgo = Math.floor(
      (nowTimestamp - 30 * 24 * 60 * 60 * 1000) / 1000,
    );
    const url = `https://api.monobank.ua/personal/statement/${jarId}/${timestamp30daysAgo}/${nowTimestamp}`;

    console.log('Sending request to Monobank API:', url);
    const response = await axios.get(url, {
      headers: {
        'X-Token': process.env.MONOBANK_API_TOKEN || '',
      },
    });

    // Cache the response and update the last request timestamp
    cachedResponse = response.data;
    lastRequestTimestamp = nowTimestamp;

    return {
      data: cachedResponse,
      timeLeft: null,
    };
  } catch (error) {
    console.log('Error fetching Monobank data:', error);
    throw new Error(
      'Failed to fetch data from Monobank API.',
    );
  }
};
