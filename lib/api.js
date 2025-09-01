import axios from "axios";

const api = axios.create({
  baseURL: "http://10.0.2.2:8000/api", // ganti IP kalau pakai device real
});

export default api;
