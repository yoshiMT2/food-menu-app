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
			authorization: `Token ${token}`,
		},
	});
};

export const bulkDelete = async (token, ids) => {
  const resp = await fetch("api/product/products/", {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
      "authorization": `Token ${token}`
    },
    body: ids
  });
  return resp
};
