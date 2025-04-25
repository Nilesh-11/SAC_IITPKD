import BACKEND_URL from "./../utils/config";

const handleAPIError = () => {
  localStorage.removeItem("token");
  window.location.href = "/login"; // Use navigate only inside React component
};

export const getAnnouncementsList = async () => {
  const url = `${BACKEND_URL}` + "/api/public/announcements/list";
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
      return responseData.content.announcements;
    } else {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    throw error;
  }
};

export const AddAnnouncementApi = async (data) => {
  const url = `${BACKEND_URL}` + "/api/user/announcement/add";
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

export const MyAnnouncementListApi = async () => {
  const url = `${BACKEND_URL}` + "/api/user/announcements/my";
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

export const UpdateAnnouncementApi = async (data) => {
  const url = `${BACKEND_URL}` + "/api/user/announcement/update";
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

export const DeleteAnnouncementApi = async (data) => {
  const url = `${BACKEND_URL}` + "/api/user/announcement/delete";
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
