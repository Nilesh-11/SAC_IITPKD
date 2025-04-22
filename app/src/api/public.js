import BACKEND_URL from './../utils/config'

const handleAPIError = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

export const StatusApi = async () => {
  const url = `${BACKEND_URL}` + "/api/public/status";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    const responseData = await response.json();
    if (response.ok) {
      if (responseData?.content?.type === "ok"){
        return responseData.content.status;
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

export const ClubsListApi = async () => {
  const url = `${BACKEND_URL}` + "/api/public/clubs/list";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    const responseData = await response.json();
    if (response.ok) {
      if (responseData?.content?.type === "ok"){
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