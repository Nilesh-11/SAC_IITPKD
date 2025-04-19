import BACKEND_URL from "./../utils/config";

const handleAPIError = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

export const JoinClub = async ({ club_id }) => {
  const url = `${BACKEND_URL}` + "/api/user/student/club/join";
  console.log(club_id)
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
      body: JSON.stringify({'club_id': club_id}),
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

export const getClubInfo = async ({ club_id }) => {
  const url = `${BACKEND_URL}` + "/api/user/student/club/info";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
      body: JSON.stringify({'club_id': club_id}),
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
      if (responseData?.content?.type == "ok"){
        console.log(responseData);
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
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error in fetching events list:", error);
    throw error;
  }
};