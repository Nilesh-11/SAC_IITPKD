import BACKEND_URL from "./../utils/config";

const handleAPIError = () => {
  localStorage.removeItem("token");
  window.location.href = "/login"; // Use navigate only inside React component
};

const getProjectsList = async () => {
  const url = `${BACKEND_URL}` + "/api/projects/list";
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
      return responseData.content.projects;
    } else {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error in AuthApi:", error);
    throw error;
  }
};

export default getProjectsList;
