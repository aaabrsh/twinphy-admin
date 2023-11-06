export const breadcrumb = {
  dashboard: {
    title: "Dashboard",
    path: [
      { isLink: true, to: "/dashboard", text: "Home" },
      { isLink: false, text: "Dashboard" },
    ],
  },
  users: {
    title: "Users",
    path: [
      { isLink: true, to: "/dashboard", text: "Home" },
      { isLink: false, text: "Users" },
    ],
  },
  profile: {
    title: "Profile",
    path: [
      { isLink: true, to: "/dashboard", text: "Home" },
      { isLink: true, to: "/user/list", text: "Users" },
      { isLink: false, text: "Profile" },
    ],
  },
  post: {
    title: "Post",
    path: [
      { isLink: true, to: "/dashboard", text: "Home" },
      { isLink: true, to: "/user/list", text: "Users" },
      { isLink: false, text: "Profile" },
      { isLink: false, text: "Post" },
    ],
  },
};
