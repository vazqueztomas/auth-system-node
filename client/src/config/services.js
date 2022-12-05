import axios from 'axios';

const OPTIONS = {
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
};

// export function setupServices() {
//   const devUriBase = "http://localhost:8080";
//   const prodUriBase = "https://prodUri.com";
//   const railwayUriBase = "https://railway.railway.app";
//   let getBaseUri = () => window.location.host.includes("localhost") ? devUriBase : prodUriBase;
//   axios.interceptors.request.use((req) => {
//     return { ...req, url: getBaseUri() + req.url };
//   }, null, { synchronous: true });
// }

export const userSignup = async (userInfo) => {
  const response = await axios.post('/auth/signup', userInfo, OPTIONS);
  return response.data;
};

export const userLogin = async (userInfo) => {
  const response = await axios.post('/auth/login', userInfo, OPTIONS);
  return response.data;
};