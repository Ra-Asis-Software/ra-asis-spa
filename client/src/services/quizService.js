import api from "./api";

const QUIZ_PATH = "/quizzes";

export const createQuiz = async (data) => {
  try {
    const response = await api.post(`${QUIZ_PATH}`, data);

    return response;
  } catch (error) {
    if (error.response?.data) {
      return {
        error: error.response.data.message,
        status: error.response.status,
      };
    } else {
      return { error: "Sorry, an unexpected error occurred" };
    }
  }
};

export const editQuiz = async (data, id) => {
  try {
    const response = await api.patch(`${QUIZ_PATH}/${id}/edit`, data);
    return response;
  } catch (error) {
    if (error.response.data) {
      return {
        error: error.response.data.message,
        status: error.response.status,
      };
    } else {
      return { error: "Sorry, an unexpected error occurred" };
    }
  }
};

export const startQuiz = async (data) => {
  try {
    const response = await api.post(`${QUIZ_PATH}/start`, data);
    return response;
  } catch (error) {
    if (error.response.data) {
      return {
        error: error.response.data.message,
        status: error.response.status,
      };
    } else {
      return { error: "Sorry, an unexpected error occurred" };
    }
  }
};

export const submitQuiz = async (data, id) => {
  try {
    const response = await api.post(`${QUIZ_PATH}/${id}/submit`, data);
    return response;
  } catch (error) {
    if (error.response.data) {
      return {
        error: error.response.data.message,
        status: error.response.status,
      };
    } else {
      return { error: "Sorry, an unexpected error occurred" };
    }
  }
};

export const getQuizzesForUnit = async (unitId) => {
  try {
    const response = await api.get(`${QUIZ_PATH}/${unitId}/quizzes`);
    return response;
  } catch (error) {
    if (error.response.data) {
      return {
        error: error.response.data.message,
        status: error.response.status,
      };
    } else {
      return { error: "Sorry, an unexpected error occurred" };
    }
  }
};

export const getQuizDetails = async (quizId) => {
  try {
    const response = await api.get(`${QUIZ_PATH}/${quizId}/details`);
    return response;
  } catch (error) {
    if (error.response.data) {
      return {
        error: error.response.data.message,
        status: error.response.status,
      };
    } else {
      return { error: "Sorry, an unexpected error occurred" };
    }
  }
};

export const getSubmissionDetailsForQuiz = async (quizId, submissionId) => {
  try {
    const response = await api.get(
      `${QUIZ_PATH}/${quizId}/submissions/${submissionId}`
    );

    return response;
  } catch (error) {
    if (error.response.data) {
      return {
        error: error.response.data.message,
        status: error.response.status,
      };
    } else {
      return { error: "Sorry, an unexpected error occurred" };
    }
  }
};

export const getSubmissionsForQuiz = async (quizId, page) => {
  try {
    const response = await api.get(
      `${QUIZ_PATH}/${quizId}/submissions?page=${page}&limit=50`
    );
    return response;
  } catch (error) {
    if (error.response.data) {
      return {
        error: error.response.data.message,
        status: error.response.status,
      };
    } else {
      return { error: "Sorry, an unexpected error occurred" };
    }
  }
};
