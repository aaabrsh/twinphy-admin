import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { isLoggedIn } from "../services/auth";
import NotFound from "../pages/NotFound";
import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import { Layout } from "../layout";

export default function Router() {
  // TODO: uncomment the following line after adding auth
  // let loggedIn = isLoggedIn();
  let loggedIn = true;

  useEffect(() => {
    // TODO: uncomment the following line after adding auth
    // loggedIn = isLoggedIn();
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="auth/">
            <Route index element={<Navigate to="login" />} />
            <Route path="login/">
              <Route index element={<Login />} />
              {/* <Route path="successfull" element={<SuccessCallback />} /> */}
            </Route>
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" />}></Route>

          {/* Private Routes */}
          {loggedIn ? (
            <>
              <Route
                path="/dashboard"
                element={
                  <Layout>
                    <Dashboard />
                  </Layout>
                }
              />

              <Route path="*" element={<NotFound />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/auth/login" replace />} />
          )}
        </Routes>
      </BrowserRouter>
    </>
  );
}
