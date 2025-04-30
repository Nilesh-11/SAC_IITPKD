import BACKEND_URL from './../utils/config'

const handleAPIError = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

export const Api = async (path, { data }) => {
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
    if ( responseData?.type === "error" && (responseData.details === "JWTExpired" || responseData.details === "JWTInvalid")) {
      handleAPIError();
      return;
    }
    if (response.ok) {
      return responseData;
    } else {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    throw error;
  }
};

export const verifyToken = async () => {
  try {
    const content = await Api("/api/verify-token", {
      data: {},
    });

    if (content.type === "error" &&
      (content.details === "JWTExpired" || content.details === "JWTInvalid")
    ) {
      return { valid: false, reason: content.details };
    }
    return { valid: true };
  } catch (error) {
    return { valid: false, reason: "NetworkError" };
  }
};

export const ForgotPasswordApi = async ({email}) => {
  const url = `${BACKEND_URL}/api/auth/forgot-password`;
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
      if (responseData?.type === "ok"){
        return responseData;
      }
      else{
        if (responseData?.type){
          return responseData;
        }
        else{
          return {'type': "error", 'details': "An error occurred"};
        }
      }
    } else {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    throw error;
  }
};

export const ResetPasswordApi = async ({new_password, token}) => {
  const url = `${BACKEND_URL}/api/auth/reset-password`;
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
      if (responseData?.type === "ok"){
        return responseData;
      }
      else{
        if (responseData?.type){
          return responseData;
        }
        else{
          return {'type': "error", 'details': "An error occurred"};
        }
      }
    } else {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    throw error;
  }
};

export const getUsername = async () => {
  const url = `${BACKEND_URL}/api/user/username`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
      body: JSON.stringify({}),
    });
    const responseData = await response.json();
    if (response.ok) {
      if (responseData?.type === "ok"){
        return responseData;
      }
      else{
        if (responseData?.type){
          return responseData;
        }
        else{
          return {'type': "error", 'details': "An error occurred"};
        }
      }
    } else {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    throw error;
  }
};

export const LoginUserApi = async (userType, data) => {
  const url = `${BACKEND_URL}/api/auth/${userType}/login`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    if (response.ok) {
      if (responseData?.type === "ok"){
        return responseData;
      }
      else{
        if (responseData?.type){
          return responseData;
        }
        else{
          return {'type': "error", 'details': "An error occurred"};
        }
      }
    } else {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    throw error;
  }
};