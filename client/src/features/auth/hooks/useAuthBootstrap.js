import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useRefreshMutation } from '../api/authApi.js';
import {
  authBootstrapStarted,
  clearCredentials,
  selectAuthBootstrapStatus,
} from '../authSlice.js';

export function useAuthBootstrap() {
  const dispatch = useDispatch();
  const refreshToken = useSelector((state) => state.auth.refreshToken);
  const authBootstrapStatus = useSelector(selectAuthBootstrapStatus);
  const [refresh] = useRefreshMutation();

  useEffect(() => {
    if (!refreshToken || authBootstrapStatus !== 'pending') {
      return;
    }

    let isCurrent = true;

    dispatch(authBootstrapStarted());

    refresh({ refreshToken })
      .unwrap()
      .catch(() => {
        if (isCurrent) {
          dispatch(clearCredentials());
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [authBootstrapStatus, dispatch, refresh, refreshToken]);
}
