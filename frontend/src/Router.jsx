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
        <Route path="interns">
            <Route index element={<InternList status="new" />} />
            <Route path="new" element={<InternList status="new" />} />
            <Route path="undergoing" element={<InternList status="undergoing" />} />
            <Route path="completed" element={<InternList status="completed" />} />
          </Route>
        </Route>
        <Route path="hr" element={<HRPage />}>
          <Route path="interns">
            <Route index element={<InternList status="new" />} />
            <Route path="new" element={<InternList status="new" />} />
            <Route path="undergoing" element={<InternList status="undergoing" />} />
            <Route path="certify" element={<InternList status="certify" />} />
            <Route path="completed" element={<InternList status="completed" />} />
          </Route>
        </Route>
      </Route>
    </>
  )
);

export default router;
