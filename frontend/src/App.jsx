import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import User from "./pages/User";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/user/:id" element={<User />} />
      </Routes>
    </Router>
  );
}

export default App;
