import api from "./api";

const TESTIMONIAL_PATH = "/testimonials";
export const submitTestimonial = async (data) => {
  try {
    const response = await api.post(`${TESTIMONIAL_PATH}/submit`, data);
    return response;
  } catch (error) {
    if (error.response.data) {
      return { error: error.response.data.message };
    } else {
      return { error: "Sorry, an unexpected error occurred" };
    }
  }
};

export const getAllTestimonials = async () => {
  try {
    const response = await api.get(`${TESTIMONIAL_PATH}/all`);
    return response;
  } catch (error) {
    if (error.response.data) {
      return { error: error.response.data.message };
    } else {
      return { error: "Sorry, an unexpected error occurred" };
    }
  }
};

export const getApprovedTestimonials = async () => {
  try {
    const response = await api.get(`${TESTIMONIAL_PATH}/approved`);
    return response;
  } catch (error) {
    if (error.response.data) {
      return { error: error.response.data.message };
    } else {
      return { error: "Sorry, an unexpected error occurred" };
    }
  }
};

export const approveTestimonial = async (id) => {
  try {
    const response = await api.patch(`${TESTIMONIAL_PATH}/approve/${id}`);
    return response;
  } catch (error) {
    if (error.response.data) {
      return { error: error.response.data.message };
    } else {
      return { error: "Sorry, an unexpected error occurred" };
    }
  }
};

export const deleteTestimonial = async (id) => {
  try {
    const response = await api.delete(`${TESTIMONIAL_PATH}/delete/${id}`);
    return response;
  } catch (error) {
    if (error.response.data) {
      return { error: error.response.data.message };
    } else {
      return { error: "Sorry, an unexpected error occurred" };
    }
  }
};
