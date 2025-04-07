// import React from 'react';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import './App.css';
// import Home from './components/home';
// import Test from './components/test';
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import 'swiper/css';

// const  App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Navigate to="/home" />} />
//         <Route path="/home" element={<Home />} />
//         <Route path="/test" element={<Test />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import AppRoutes from "./routes/AppRoutes";

function App() {
  return <AppRoutes />;
}

export default App;

