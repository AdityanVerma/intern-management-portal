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
import NewInternsList from "./components/InternsList/NewInternsList.jsx";
import UndergoingInternsList from "./components/InternsList/UndergoingInternsList.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<PublicLayout />}>
        <Route path="login" element={<Login />} />
      </Route>

      <Route path="/user/:userid">
        <Route path="mentor" element={<MentorPage />}>
        <Route path="interns">
            <Route index element={<NewInternsList />} />
            <Route path="new" element={<NewInternsList />} />
            <Route path="undergoing" element={<UndergoingInternsList />} />
            <Route path="completed" element={<NewInternsList />} />
          </Route>
        </Route>
        <Route path="hr" element={<HRPage />}>
          <Route path="interns">
            <Route index element={<NewInternsList />} />
            <Route path="new" element={<NewInternsList />} />
            <Route path="undergoing" element={<UndergoingInternsList />} />
            <Route path="certify" element={<NewInternsList />} />
            <Route path="completed" element={<NewInternsList />} />
          </Route>
        </Route>
      </Route>
    </>
  )
);

export default router;
