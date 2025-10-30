import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

import axiosClient from "./axiosClient";

export const postData = async (url, formData) => {
  try {
    const res = await fetch(apiUrl + url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      const errorData = await res.json();
      return errorData;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const fetchDataFromApi = async (url) => {
  try {
    const { data } = await axios.get(
      apiUrl + url,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const getDataFromApi = async (url) => {
  try {
    const { data } = await axios.get(apiUrl + url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
    });
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const uploadImage = async (url, updatedData) => {
  try {
    const params = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        // "Content-Type": "multipart/form-data",
      },
    };

    var response;
    await axios.put(apiUrl + url, updatedData, params).then((res) => {
      response = res;
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const editData = async (url, updatedData) => {
  try {
    const params = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
    };

    var response;
    await axios.put(apiUrl + url, updatedData, params).then((res) => {
      response = res;
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const deleteData = async (url) => {
  try {
    const res = await axios.delete(apiUrl + url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    return {
      error: true,
      message:
        error?.response?.data?.message || error.message || "Request failed",
      status: error?.response?.status,
      data: error?.response?.data,
    };
  }
};

export const postFormData = async (url, formData) => {
  try {
    const res = await axios.post(import.meta.env.VITE_API_URL + url, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Upload error:", error);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Lỗi khi gửi FormData",
    };
  }
};
