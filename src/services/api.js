const API_BASE_URL = "http://your-api-server.com/api";

export const fetchData = async (endpoint, method = "GET", body = null) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : null,
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
