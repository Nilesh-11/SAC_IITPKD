import BACKEND_URL from "./../utils/config";

const handleAPIError = () => {
  localStorage.removeItem("token");
  window.location.href = "/login"; // Use navigate only inside React component
};

const getAnnouncementsList = async () => {
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
      console.log(responseData);
      return responseData.content.announcements;
    } else {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error in AuthApi:", error);
    throw error;
  }
};

export default getAnnouncementsList;
