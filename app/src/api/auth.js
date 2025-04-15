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
    if ( responseData?.content?.type === "error" && (responseData.content.details === "JWTExpired" || responseData.content.details === "JWTInvalid")) {
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
    const res = await Api("/api/verify-token", {
      data: {},
    });

    const content = res?.content;

    if (
      content?.type === "error" &&
      (content.details === "JWTExpired" || content.details === "JWTInvalid")
    ) {
      return { valid: false, reason: content.details };
    }
    return { valid: true };
  } catch (error) {
    console.error("Token verification failed:", error);
    return { valid: false, reason: "NetworkError" };
  }
};

export default Api;