import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '~/reducers/authSlice';
import kycReducer from '~/reducers/kycSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  kyc: kycReducer,
  // other reducers...
});

export default rootReducer;
