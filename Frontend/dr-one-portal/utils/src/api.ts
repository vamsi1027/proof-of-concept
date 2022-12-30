import axios from 'axios';
// const api = 'https://sdkv2-uat.imaginationunwired.com:3001';
// export const API_URL = process.env.ENV === 'prod' ? 'https://webapi.digitalreef.com' : 'https://webapi-uat.digitalreef.com';
export const API_URL =
  process.env.REACT_APP_API_BASE_URL ?? 'https://webapi-uatv2.digitalreef.com';

const apiDashboard = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

apiDashboard.interceptors.request.use((config) => {
  const { organizationActive } = JSON.parse(localStorage.getItem('dr-user'));
  const [_, token] = document.cookie.split('t=');
  const headers = {
    ...config.headers,
    Accept: 'application/json',
    'Content-Type': 'application/json',
    // token: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI1YTI5NTBhMDk5M2M4ZjE1NzBjMjU1MTEiLCJlbWFpbCI6ImFkbWluQGl1LmNvbSIsIm9yZ2FuaXphdGlvbklkIjoiNWEyOTRmODE5OTNjOGYxNTcwYzI1NTBkIiwicm9sZXMiOlt7Im5hbWUiOiJBZG1pbmlzdHJhdG9yIiwiaWQiOiI1OWE5MTJjNTQ2ZTBmYjAwMDE3Y2Y5MWEiLCJzaG9ydF9jb2RlIjoiU0EifV0sImNyZWF0ZWRBdCI6IjE2Mjk0MzQ4Mzk4MTQifQ.dQQvqJT1A9FkVVl4oTkApqRps5PKd61Bjg3bClxzb9AH45_l7BZeWfx6rwQLDZuEZoutZuuOpb-VKUuqIkSOlw'
  };

  if (!!token) {
    if (token.includes(';')) {
      const [cleannedToken] = token.split(';');
      headers.Authorization = `Token ${cleannedToken}`;
    } else {
      headers.Authorization = `Token ${token}`;
    }
  }
  if (!!organizationActive) {
    headers.organization = `${organizationActive}`;
  }
  return { ...config, headers };
});

apiDashboard.interceptors.response.use(
  (value) => value,
  (error) => {
    if (
      !!error.response &&
      error.response.status >= 400 &&
      error.response.status <= 410 &&
      !!error.response.data
    ) {
      if (error.response.data?.detail?.includes('token')) {
        document.cookie = `t=; expires=${new Date(1970, 1, 1)}; path=/; secure`;
        document.location.reload();
      }
    }
    return Promise.reject(error);
  }
);

export default apiDashboard;
