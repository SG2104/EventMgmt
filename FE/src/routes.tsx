import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout from "./components/common/mainLayout";
import { SignInForm } from "./auth/signInForm";
import PrivateRoute from "./auth/privateRoute";
import PublicRoute from "./auth/publicRoute";

const EventPage = lazy(() => import("./modules/events"));
const NotFound = lazy(() => import("./components/common/notFound"));

const AppRoutes = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Public Route */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <SignInForm />
              </PublicRoute>
            }
          />

          {/* Protected Route */}
          <Route
            path="/events"
            element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<EventPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRoutes;
