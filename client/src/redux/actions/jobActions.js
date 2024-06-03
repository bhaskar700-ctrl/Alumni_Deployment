// jobActions.js
import axios from 'axios';
import { FETCH_JOBS_START, FETCH_JOBS_SUCCESS, FETCH_JOBS_FAIL } from './actionTypes.js';

export const fetchJobs = () => async (dispatch) => {
  dispatch({ type: FETCH_JOBS_START });
  try {
    const response = await axios.get('/api/jobs/all');
    dispatch({ type: FETCH_JOBS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_JOBS_FAIL, payload: error.response.data.message });
  }
};
