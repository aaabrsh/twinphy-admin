export const setUserId = (id: string) => {
  sessionStorage.setItem("userId", JSON.stringify(id));
  localStorage.setItem("userId", JSON.stringify(id));
};

export const getUserId = () => {
  if (sessionStorage.getItem("userId")) {
    return JSON.parse(sessionStorage.getItem("userId") ?? "");
  }

  if (localStorage.getItem("userId")) {
    return JSON.parse(localStorage.getItem("userId") ?? "");
  }

  return null;
};

export const setUser = (user: any) => {
  sessionStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("user", JSON.stringify(user));
};

export const getUser = () => {
  if (sessionStorage.getItem("user")) {
    return JSON.parse(sessionStorage.getItem("user") ?? "");
  }

  if (localStorage.getItem("user")) {
    return JSON.parse(localStorage.getItem("user") ?? "");
  }

  return null;
};

export const isLoggedIn = () => {
  return getUserId() !== null && getUser() !== null;
};

export const clearAuth = () => {
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("userId");
  localStorage.removeItem("user");
  localStorage.removeItem("userId");
};
