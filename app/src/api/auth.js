import BACKEND_URL from './../utils/config'

const handleAPIError = () => {
  localStorage.removeItem("token");
  window.location.href = "/login"; // Use navigate only inside React component
};

const Api = async (path, { data }) => {
  const url = `${BACKEND_URL}` + path;
  console.log(url)
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    console.log(responseData);
    if (
      responseData?.content?.type === "error" &&
      (responseData.content.details === "JWTExpired" || responseData.content.details === "JWTInvalid")
    ) {
      handleAPIError();
      return;
    }
    if (response.ok) {
      return responseData;
    } else {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error in AuthApi:", error);
    throw error;
  }
};

export const verifyToken = async () => {
    try {
        const res = await Api(`${BACKEND_URL}/api/verify-token`, {
            body: {},
        });
        return res;
    } catch (error) {
        console.error("Token verification failed:", error);
        throw error;
    }
};

export default Api;