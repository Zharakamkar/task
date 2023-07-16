import axios from "axios";

export const request = axios.create({
  baseURL: "https://rezayari.ir:8000/api",
});
