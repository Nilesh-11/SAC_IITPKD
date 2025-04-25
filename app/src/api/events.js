import BACKEND_URL from "./../utils/config";

const handleAPIError = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

export const getEventsList = async () => {
  const url = `${BACKEND_URL}/api/public/events/list`;
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
    if (
      responseData?.content?.type === "error" &&
      (responseData.content.details === "JWTExpired" ||
        responseData.content.details === "JWTInvalid")
    ) {
      handleAPIError();
      return;
    }
    if (response.ok) {
      return responseData.content.events;
    } else {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    throw error;
  }
};

export const AddEventApi = async (data) => {
  const url = `${BACKEND_URL}/api/events/add`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    if (
      responseData?.content?.type === "error" &&
      (responseData.content.details === "JWTExpired" ||
        responseData.content.details === "JWTInvalid")
    ) {
      handleAPIError();
      return;
    }
    if (response.ok) {
      return responseData.content;
    } else {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    throw error;
  }
};

export const MyEventsApi = async () => {
  const url = `${BACKEND_URL}/api/events/my`;
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
    if (
      responseData?.content?.type === "error" &&
      (responseData.content.details === "JWTExpired" ||
        responseData.content.details === "JWTInvalid")
    ) {
      handleAPIError();
      return;
    }
    if (response.ok) {
      return responseData.content;
    } else {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    throw error;
  }
};

export const UpdateEventApi = async (data) => {
  const url = `${BACKEND_URL}/api/events/update`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    if (
      responseData?.content?.type === "error" &&
      (responseData.content.details === "JWTExpired" ||
        responseData.content.details === "JWTInvalid")
    ) {
      handleAPIError();
      return;
    }
    if (response.ok) {
      return responseData.content;
    } else {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    throw error;
  }
};

export const DeleteEventApi = async (data) => {
  const url = `${BACKEND_URL}/api/events/delete`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    if (
      responseData?.content?.type === "error" &&
      (responseData.content.details === "JWTExpired" ||
        responseData.content.details === "JWTInvalid")
    ) {
      handleAPIError();
      return;
    }
    if (response.ok) {
      return responseData.content;
    } else {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    throw error;
  }
};
