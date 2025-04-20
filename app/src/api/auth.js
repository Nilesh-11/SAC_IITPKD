import BACKEND_URL from './../utils/config'

const handleAPIError = () => {
  localStorage.removeItem("token");
  window.location.href = "/login"; // Use navigate only inside React component
};

const Api = async (path, { data }) => {
  const url = `${BACKEND_URL}` + path;
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

export const ForgotPasswordApi = async ({email}) => {
  const url = `${BACKEND_URL}` + "/api/auth/forgot-password";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({"email": email}),
    });
    const responseData = await response.json();
    if (response.ok) {
      if (responseData?.content?.type == "ok"){
        return responseData.content;
      }
      else{
        if (responseData?.content?.type){
          return responseData?.content
        }
        else{
          return {'type': "error", 'details': "An error occurred"};
        }
      }
    } else {
      console.log(response);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error in fetching events list:", error);
    throw error;
  }
};

export const ResetPasswordApi = async ({new_password, token}) => {
  const url = `${BACKEND_URL}` + "/api/auth/reset-password";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({"new_password": new_password, "token": token}),
    });
    const responseData = await response.json();
    if (response.ok) {
      if (responseData?.content?.type == "ok"){
        return responseData.content;
      }
      else{
        if (responseData?.content?.type){
          return responseData?.content
        }
        else{
          return {'type': "error", 'details': "An error occurred"};
        }
      }
    } else {
      console.log(response);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error in fetching events list:", error);
    throw error;
  }
};


export default Api;