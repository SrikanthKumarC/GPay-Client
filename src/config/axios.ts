import { Axios } from "axios";
import axios from "axios";

const instance: Axios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export default instance;
