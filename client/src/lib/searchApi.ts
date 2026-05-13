import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const searchApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SEARCH_SERVICE, // http://localhost:4000
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];

const subscribeTokenRefresh = (callback: () => void) => {
  refreshSubscribers.push(callback);
};

const onRefreshSuccess = () => {
  refreshSubscribers.forEach((callback) => callback());
  refreshSubscribers = [];
};

searchApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh(() => resolve(searchApi(originalRequest)));
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // 🔥 Call AUTH service to refresh token
        await axios.post(
          `${process.env.NEXT_PUBLIC_AUTH_SERVICE}/api/refresh-token`,
          {},
          { withCredentials: true }
        );

        isRefreshing = false;
        onRefreshSuccess();

        return searchApi(originalRequest);
      } catch (err) {
        isRefreshing = false;
        refreshSubscribers = [];

        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default searchApi;
