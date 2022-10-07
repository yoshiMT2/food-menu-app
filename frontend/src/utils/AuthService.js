import {userApi} from "./django";

export const login = async (email, password) => {
  const payload = { email, password };
  const api = userApi()
  const res = await api.post("api/user/token/", payload, {});
  const token = res.data.key;
  if (token) {
    localStorage.setItem("userDetails", JSON.stringify(res.data));
  }
  return res.data;
};
