import { Axios } from "axios";
import axios from 'axios';

const instance: Axios = axios.create({
  baseURL: 'http://localhost:3000',
});

export default instance;