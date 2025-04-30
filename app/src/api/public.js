import BACKEND_URL from './../utils/config'

export const StatusApi = async () => {
  const url = `${BACKEND_URL}/api/public/status`;
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
      if (responseData?.type === "ok"){
        return responseData.status;
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

export const ClubsListApi = async () => {
  const url = `${BACKEND_URL}/api/public/clubs/list`;
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