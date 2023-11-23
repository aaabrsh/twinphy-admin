import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { isLoggedIn } from "../services/auth";
import NotFound from "../pages/NotFound";
import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import { Layout } from "../layout";
import { breadcrumb } from "./breadcrumb_data";
import UsersList from "../pages/users/UsersList";
import Profile from "../pages/users/Profile";
import Post from "../pages/post/Post";
import Reported from "../pages/reported/Reported";
import StaticPages from "../pages/static pages/StaticPages";
import Competitions from "../pages/competitions/Competitions";
import CompetitionPosts from "../pages/competitions/CompetitionPosts";

export default function Router() {
  let loggedIn = isLoggedIn();

  useEffect(() => {
    loggedIn = isLoggedIn();
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
                  <Layout
                    breadcrumb={breadcrumb.dashboard}
                    activeLinks={["dashboard"]}
                  >
                    <Dashboard />
                  </Layout>
                }
              />
              <Route
                path="/user/list"
                element={
                  <Layout
                    breadcrumb={breadcrumb.users}
                    activeLinks={["user", "appUser"]}
                  >
                    <UsersList />
                  </Layout>
                }
              />
              <Route
                path="/user/:username"
                element={
                  <Layout
                    breadcrumb={breadcrumb.profile}
                    activeLinks={["user", "appUser"]}
                  >
                    <Profile />
                  </Layout>
                }
              />
              <Route
                path="/user/:username/post/:postId"
                element={
                  <Layout
                    breadcrumb={breadcrumb.post}
                    activeLinks={["user", "appUser"]}
                  >
                    <Post />
                  </Layout>
                }
              />
              <Route
                path="/report/list"
                element={
                  <Layout
                    breadcrumb={breadcrumb.report}
                    activeLinks={["report"]}
                  >
                    <Reported />
                  </Layout>
                }
              />
              <Route
                path="/static-page/privacy-policy"
                element={
                  <Layout
                    breadcrumb={breadcrumb.privacyPolicy}
                    activeLinks={["static-pages", "privacy-policy"]}
                  >
                    <StaticPages pageKey="privacy-policy" />
                  </Layout>
                }
              />
              <Route
                path="/static-page/terms-and-conditions"
                element={
                  <Layout
                    breadcrumb={breadcrumb.termsAndConditions}
                    activeLinks={["static-pages", "terms-and-conditions"]}
                  >
                    <StaticPages pageKey="terms-and-conditions" />
                  </Layout>
                }
              />
              <Route
                path="/competition"
                element={
                  <Layout
                    breadcrumb={breadcrumb.competition}
                    activeLinks={["competition"]}
                  >
                    <Competitions />
                  </Layout>
                }
              />
              <Route
                path="/competition/:id/posts"
                element={
                  <Layout
                    breadcrumb={breadcrumb.competition}
                    activeLinks={["competition"]}
                  >
                    <CompetitionPosts />
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
