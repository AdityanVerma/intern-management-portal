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
import CompletedInternsList from "./components/InternsList/CompletedInternsList.jsx";
import CertifiedInternsList from "./components/InternsList/CertifiedInternsList.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Navigate to="login" replace />} />
        <Route path="login" element={<Login />} />
      </Route>


      <Route path="/user/:userid">
        <Route path="mentor" element={<MentorPage />}>
        <Route path="interns">
            <Route index element={<NewInternsList />} />
            <Route path="new" element={<NewInternsList />} />
            <Route path="undergoing" element={<UndergoingInternsList />} />
            <Route path="completed" element={<CompletedInternsList />} />
          </Route>
        </Route>
        <Route path="hr" element={<HRPage />}>
          <Route path="interns">
            <Route index element={<NewInternsList />} />
            <Route path="new" element={<NewInternsList />} />
            <Route path="undergoing" element={<UndergoingInternsList />} />
            <Route path="completed" element={<CompletedInternsList />} />
            <Route path="certify" element={<CertifiedInternsList />} />
          </Route>
        </Route>
      </Route>
    </>
  )
);

export default router;
