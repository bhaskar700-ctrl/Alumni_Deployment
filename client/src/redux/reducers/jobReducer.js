// jobReducer.js
import { FETCH_JOBS_START, FETCH_JOBS_SUCCESS, FETCH_JOBS_FAIL } from '../actions/actionTypes.js';

const initialState = {
  jobs: [],
  loading: false,
  error: null,
};

const jobReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_JOBS_START:
      return { ...state, loading: true, error: null };
    case FETCH_JOBS_SUCCESS:
      return { ...state, loading: false, jobs: action.payload };
    case FETCH_JOBS_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default jobReducer;
