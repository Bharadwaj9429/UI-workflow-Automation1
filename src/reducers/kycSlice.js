import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getKycStatus as fetchStatus, submitKycData as postData } from '~/modules/kyc/httpServices';

export const getKycStatus = createAsyncThunk('kyc/getStatus', async (_, { rejectWithValue }) => {
  return new Promise((resolve, reject) => {
    fetchStatus(
      (response) => resolve(response),
      (error) => reject(rejectWithValue(error))
    );
  });
});

export const submitKycData = createAsyncThunk('kyc/submitData', async (formData, { rejectWithValue }) => {
  return new Promise((resolve, reject) => {
    postData(
      formData,
      (response) => resolve(response),
      (error) => reject(rejectWithValue(error))
    );
  });
});

const initialState = {
  status: 'Not Verified', // 'Not Verified', 'Pending', 'Verified', 'Rejected'
  details: null,
  loading: false,
  error: null,
};

const kycSlice = createSlice({
  name: 'kyc',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getKycStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getKycStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.details = action.payload.details;
      })
      .addCase(getKycStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(submitKycData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitKycData.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'Pending'; // After submission, status becomes Pending
        state.details = action.payload.details;
      })
      .addCase(submitKycData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default kycSlice.reducer;
