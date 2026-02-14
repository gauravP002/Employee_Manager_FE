
import { takeEvery, takeLatest, call, put, debounce, retry } from 'redux-saga/effects';
import { taskActions } from './taskSlice';
import { taskApi } from './taskApi';

function* fetchTasks(): Generator<any, any, any> {
  try {
    const response = yield retry(3, 1000, taskApi.getTasks);
    yield put(taskActions.fetchTasksSuccess(response));
  } catch (error: any) {
    yield put(taskActions.taskError(error.message));
  }
}

function* fetchTaskById(action: any): Generator<any, any, any> {
  try {
    const response = yield call(taskApi.getTaskById, action.payload);
    yield put(taskActions.fetchTaskByIdSuccess(response));
  } catch (error: any) {
    yield put(taskActions.taskError(error.message));
  }
}

function* handleCreateTask(action: any): Generator<any, any, any> {
  try {
    const response = yield call(taskApi.createTask, action.payload);
    yield put(taskActions.createTaskSuccess(response));
  } catch (error: any) {
    yield put(taskActions.taskError(error.message));
  }
}

function* handleUpdateStatus(action: any): Generator<any, any, any> {
  try {
    const response = yield call(taskApi.updateStatus, action.payload.id, action.payload.status);
    yield put(taskActions.updateTaskStatusSuccess(response));
  } catch (error: any) {
    yield put(taskActions.taskError(error.message));
  }
}

export function* taskSaga() {
  yield takeLatest(taskActions.fetchTasksRequest.type, fetchTasks);
  yield takeLatest(taskActions.fetchTaskByIdRequest.type, fetchTaskById);
  yield takeEvery(taskActions.createTaskRequest.type, handleCreateTask);
  yield takeLatest(taskActions.updateTaskStatusRequest.type, handleUpdateStatus);
  yield debounce(500, taskActions.setSearchQuery.type, fetchTasks);
}
