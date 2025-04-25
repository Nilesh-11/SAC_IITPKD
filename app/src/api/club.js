import BACKEND_URL from "./../utils/config";

const handleAPIError = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

export const JoinClub = async ({ club_id }) => {
  const url = `${BACKEND_URL}` + "/api/user/student/club/join";
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
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
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


export const DeleteRoleApi = async (data) => {
  const url = `${BACKEND_URL}` + "/api/user/club/role/delete";
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


export const AddRoleApi = async (data) => {
  const url = `${BACKEND_URL}` + "/api/user/club/role/add";
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


export const RolesListApi = async () => {
  const url = `${BACKEND_URL}` + "/api/user/club/role/list";
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

export const UpdateRoleApi = async (data) => {
  const url = `${BACKEND_URL}` + "/api/user/club/role/update";
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

export const MembersListApi = async () => {
  const url = `${BACKEND_URL}` + "/api/user/club/members/list";
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

export const UpdateMembershipApi = async (data) => {
  const url = `${BACKEND_URL}` + "/api/user/club/membership/update";
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

export const MemberInfoApi = async (data) => {
  const url = `${BACKEND_URL}` + "/api/user/club/member/info";
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

export const CoreTeamApi = async (data) => {
  const url = `${BACKEND_URL}` + "/api/user/student/club/coreteam";
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