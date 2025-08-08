import { ApiUrl } from "@app/config/ApiUrl";

export const loginWidgetbot = async (appPubKey, idToken, widgetbotJWT) => {
  try {
    const response = await fetch(ApiUrl.WIDGETBOT_LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: "Bearer " + idToken,
      },
      body: JSON.stringify({
        appPubKey,
        widgetbotJWT,
      }),
    });

    const resp = await response.json();
    if (resp.Success === false) {
      throw new Error(resp.Message);
    }
    return resp;
  } catch (error) {
    console.error('Error logging in widgetbot:', error);
    throw error;
  }
};
export const sendWidgetbotMessage = async (appPubKey, idToken, loginToken, channelId, threadId, message, fileName, fileData) => {
  try {
    const body = {
      appPubKey,
      loginToken,
      channelId,
      threadId,
      message,
    }
    if (!loginToken) {
      throw new Error("Login token is required");
    }
    const response = await fetch(ApiUrl.WIDGETBOT_MESSAGE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: "Bearer " + idToken,
      },
      body: JSON.stringify({
        appPubKey,
        loginToken,
        channelId,
        threadId: threadId || undefined,
        message,
        fileName,
        fileData
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending widgetbot message:', error);
    return null;
  }
};
export const getChannelMessages = async (appPubKey, idToken, loginToken, channelId, threadId) => {
  try {
    const response = await fetch(ApiUrl.WIDGETBOT_GET_MESSAGES, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Authorization: "Bearer " + idToken,
      },
      body: JSON.stringify({
        // appPubKey,
        loginToken,
        channelId,
        threadId: threadId || undefined
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get message');
    }

    const resp = await response.json();
    if (resp.Success === false) {
      throw new Error(resp.Message);
    }
    return resp;
  } catch (error) {
    console.error('Error getting widgetbot message:', error);
    throw error;
  }
};

export const generateUserColor = (username) => {
  // Generate a unique color by hashing username into RGB components
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Get separate RGB values from hash
  const r = (hash & 0xFF0000) >> 16;
  const g = (hash & 0x00FF00) >> 8;
  const b = hash & 0x0000FF;

  // Ensure minimum brightness for readability on dark bg
  const minBrightness = 150;
  const brightenedR = Math.min(255, Math.max(minBrightness, r));
  const brightenedG = Math.min(255, Math.max(minBrightness, g));
  const brightenedB = Math.min(255, Math.max(minBrightness, b));

  return `rgb(${brightenedR}, ${brightenedG}, ${brightenedB})`;
};


export const processUserName = (username) => {
  if (username.includes("td_artist_community")) {
    return "Manager";
  }
  return username;
}

