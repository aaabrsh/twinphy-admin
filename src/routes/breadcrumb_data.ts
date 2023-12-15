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
  report: {
    title: "Reported Posts",
    path: [
      { isLink: true, to: "/dashboard", text: "Home" },
      { isLink: false, text: "Reported" },
    ],
  },
  privacyPolicy: {
    title: "Privacy Policy",
    path: [
      { isLink: true, to: "/dashboard", text: "Home" },
      { isLink: false, text: "Static pages" },
      { isLink: false, text: "Privacy Policy" },
    ],
  },
  termsAndConditions: {
    title: "Terms and Conditions",
    path: [
      { isLink: true, to: "/dashboard", text: "Home" },
      { isLink: false, text: "Static pages" },
      { isLink: false, text: "Terms and Conditions" },
    ],
  },
  competition: {
    title: "Competitions",
    path: [
      { isLink: true, to: "/dashboard", text: "Home" },
      { isLink: false, text: "Competitions" },
    ],
  },
  competition_form: {
    title: "Competition Form",
    path: [
      { isLink: true, to: "/dashboard", text: "Home" },
      { isLink: true, to: "/competition", text: "Competitions" },
      { isLink: false, text: "form" },
    ],
  },
  competitors: {
    title: "Competitors",
    path: [
      { isLink: true, to: "/dashboard", text: "Home" },
      { isLink: true, to: "/competition", text: "Competitions" },
      { isLink: false, text: "competitors" },
    ],
  },
  self_profile: {
    title: "Profile",
    path: [
      { isLink: true, to: "/dashboard", text: "Home" },
      { isLink: false, text: "Edit Profile" },
    ],
  },
  sticker: {
    title: "Stickers",
    path: [
      { isLink: true, to: "/dashboard", text: "Home" },
      { isLink: false, text: "Stickers" },
    ],
  },
  configuration: {
    title: "Configurations",
    path: [
      { isLink: true, to: "/dashboard", text: "Home" },
      { isLink: false, text: "Configuration" },
    ],
  },
};
