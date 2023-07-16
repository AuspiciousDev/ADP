import axios from "axios";
// const BASE_URL = "https://adp-enrollment-api.onrender.com";
const BASE_URL = "http://localhost:4600";
export default axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
