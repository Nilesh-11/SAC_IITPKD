import React from "react";
import ReactDOM from "react-dom";
import ProjectInfo from "./user/projectinfo";

const projectData = {
  title: "AI Research Initiative",
  club: "Tech Innovators",
  projectIncharge: ["Alice", "Bob"],
  contact: { mail: "contact@example.com", phone: "+123456789" },
  members: ["Charlie", "David"],
  skills: ["Machine Learning", "Data Science"],
  description: "An exciting AI project focused on deep learning models. An exciting AI project focused on deep learning models. An exciting AI project focused on deep learning models. An exciting AI project focused on deep learning models. An exciting AI project focused on deep learning models. An exciting AI project focused on deep learning models.An exciting AI project focused on deep learning models.An exciting AI project focused on deep learning models.v An exciting AI project focused on deep learning models. vAn exciting AI project focused on deep learning models. An exciting AI project focused on deep learning models.An exciting AI project focused on deep learning models.An exciting AI project focused on deep learning models.An exciting AI project focused on deep learning models.",
  image: "/clubs/yacc/grd.jpg",
  status: "Ongoing",
};

function App() {
  return <ProjectInfo {...projectData} />;
}

export default App;
