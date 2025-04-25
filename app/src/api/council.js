import BACKEND_URL from "../utils/config";

const handleAPIError = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

export const TechnicalInfo = async () => {
  const url = `${BACKEND_URL}` + "/api/public/technical";
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
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    throw error;
  }
};


export const AcademicInfo = async () => {
  const url = `${BACKEND_URL}` + "/api/public/academic";
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
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    throw error;
  }
};


export const CulturalInfo = async () => {
  const url = `${BACKEND_URL}` + "/api/public/cultural";
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
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    throw error;
  }
};

export const HostelInfo = async () => {
  const url = `${BACKEND_URL}` + "/api/public/hostel";
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
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    throw error;
  }
};

export const SportsInfo = async () => {
  const url = `${BACKEND_URL}` + "/api/public/sports";
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
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    throw error;
  }
};

export const ResearchInfo = async () => {
  const url = `${BACKEND_URL}` + "/api/public/research";
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
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    throw error;
  }
};

export const PostgraduateInfo = async () => {
  const url = `${BACKEND_URL}` + "/api/public/postgraduate";
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
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    throw error;
  }
};

export const AddClubApi = async (data) => {
  const url = `${BACKEND_URL}` + "/api/user/council/club/add";
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
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    throw error;
  }
};

export const ClubListApi = async () => {
  const url = `${BACKEND_URL}` + "/api/user/council/club/list";
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
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    throw error;
  }
};

export const UpdateClubApi = async (data) => {
  const url = `${BACKEND_URL}` + "/api/user/council/club/update";
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
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    throw error;
  }
};

export const DeleteClubApi = async (data) => {
  const url = `${BACKEND_URL}` + "/api/user/council/club/delete";
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
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    throw error;
  }
};
