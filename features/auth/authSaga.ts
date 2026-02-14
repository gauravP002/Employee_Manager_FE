
import { takeLatest, call, put, race, delay, take } from 'redux-saga/effects';
import { authActions } from './authSlice';
import { authApi } from './authApi';

function* handleLogin(action: any): Generator<any, any, any> {
  try {
    const response = yield call(authApi.login, action.payload);
    localStorage.setItem('access_token', response.accessToken);
    localStorage.setItem('refresh_token', response.refreshToken);
    yield put(authActions.loginSuccess(response));
  } catch (error: any) {
    yield put(authActions.loginFailure(error.message || 'Login failed'));
  }
}

function* handleGetCurrentUser(): Generator<any, any, any> {
  try {
    const response = yield call(authApi.me);
    yield put(authActions.loginSuccess({ 
      user: response, 
      accessToken: localStorage.getItem('access_token') || '', 
      refreshToken: localStorage.getItem('refresh_token') || '' 
    }));
  } catch (error) {
    yield put(authActions.logoutSuccess());
  }
}

function* handleLogout(): Generator<any, any, any> {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  yield put(authActions.logoutSuccess());
}

function* watchTokenExpiry() {
  while (true) {
    yield take(authActions.loginSuccess.type);
    const { expired } = yield race({
      expired: delay(3600 * 1000),
      logout: take(authActions.logoutRequest.type)
    });
    if (expired) {
      console.log("Token expired");
    }
  }
}

export function* authSaga() {
  yield takeLatest(authActions.loginRequest.type, handleLogin);
  yield takeLatest(authActions.getCurrentUserRequest.type, handleGetCurrentUser);
  yield takeLatest(authActions.logoutRequest.type, handleLogout);
  yield watchTokenExpiry();
}
