import {userApi} from "./django.js";
import { BACKEND_URL } from "./urls.js";

export const login = async (email, password) => {
  const payload = { email, password };
  const api = userApi()
  const res = await api.post(BACKEND_URL + "api/user/token/", payload, {});
  const token = res.data.key;
  if (token) {
    localStorage.setItem("userDetails", JSON.stringify(res.data));
  }
  return res.data;
};
