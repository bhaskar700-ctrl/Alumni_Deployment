import { combineReducers } from 'redux';
import jobReducer from './jobReducer';
// Import other reducers as needed

const rootReducer = combineReducers({
  job: jobReducer,
  // other reducers
});

export default rootReducer;
