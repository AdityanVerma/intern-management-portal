import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import PublicLayout from "./PublicLayout.jsx";
import Login from "./pages/Login/Login.jsx";
import HRPage from "./pages/HRPage/HRPage.jsx";
import MentorPage from "./pages/MentorPage/MentorPage.jsx";
import InternList from "./components/InternList/InternList.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<PublicLayout />}>
        <Route path="login" element={<Login />} />
      </Route>

      <Route path="/user/:userid">
        <Route path="mentor" element={<MentorPage />}>
          <Route path="interns" element={<InternList />} />
        </Route>
        <Route path="hr" element={<HRPage />}>
          <Route path="interns" element={<InternList />} />
        </Route>
      </Route>
    </>
  )
);

export default router;
