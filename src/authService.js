import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://ssise-cosit.com/",
  headers: {
    "Content-Type": "application/json",
  },
});
