import axios from "axios";
import { getCookie } from "./cookies";

export const login = async (email, password) => {
  const csrftoken = getCookie("csrftoken");
  const payload = { email, password };
  const headers = {
    "Content-Type": "application/json",
    "X-CSRFToken": csrftoken,
  };
  const res = await axios.post("api/user/token/", payload, {
    headers: headers,
  });
  const token = res.data.key;
  if (token) {
    localStorage.setItem("user", JSON.stringify(res.data));
  }
  return res.data
};

export const isAuthenticated = () => {
  const user = localStorage.getItem('user');
  if (!user) {
    return {}
  }
  return JSON.parse(user);
};
