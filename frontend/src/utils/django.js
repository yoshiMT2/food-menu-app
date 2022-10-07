import axios from "axios";
import { getCookie } from "./cookies";

const csrftoken = getCookie("csrftoken");

export const userApi = () => {
  return axios.create({
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
  });
};

export const productApi = (token) => {
  return axios.create({
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
      "authorization": `Token ${token}`,
    },
  });
};
// export const registerUrl = async (url) => {
//   const res = await axios.post("api/product/products/", { url }, {
//     headers: {
//       "Content-Type": "application/json",
//       "X-CSRFToken": csrftoken,
//       "authorization": `Token ${token}`
//     },
//   });
//   return res.data;
// };
