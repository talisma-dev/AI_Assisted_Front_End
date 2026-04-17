import { getStudentProfileDetails } from '@api/getStudentProfileDetails';
import {
  fetchProfileStart,
  fetchProfileSuccess,
  fetchProfileFailure,
} from './studentProfileSlice';

export const fetchStudentProfile = () => async (dispatch, getState) => {
  const { studentProfile } = getState();

  if (studentProfile.profile && studentProfile.isInitialized) {
    return { data: studentProfile.profile, fromCache: true };
  }

  if (studentProfile.isLoading) {
    return { data: null, loading: true };
  }

  try {
    dispatch(fetchProfileStart());
    const data = await getStudentProfileDetails();
    dispatch(fetchProfileSuccess(data));
    return { data, fromCache: false };
  } catch (error) {
    const errorMessage = error.message || 'Failed to fetch student profile';
    dispatch(fetchProfileFailure(errorMessage));
    throw error;
  }
};
