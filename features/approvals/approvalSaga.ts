
import { takeLatest, call, put } from 'redux-saga/effects';
import { approvalActions } from './approvalSlice';
import { taskActions } from '../tasks/taskSlice';
import { taskApi } from '../tasks/taskApi';

function* fetchPending() {
  try {
    const tasks: any[] = yield call(taskApi.getTasks);
    // Filter for SUBMITTED status (this matches backend logic for manager inbox)
    const pendingTasks = tasks.filter((t: any) => t.status === 'SUBMITTED');
    yield put(approvalActions.fetchPendingApprovalsSuccess(pendingTasks));
  } catch (e: any) {
    yield put(approvalActions.approvalFailure(e.message));
  }
}

function* handleApprove(action: any) {
  try {
    yield call(taskApi.updateStatus, action.payload.taskId, 'APPROVED');
    yield put(approvalActions.approvalComplete(action.payload.taskId));
    yield put(taskActions.fetchTasksRequest()); // Refresh general task list if needed
  } catch (e: any) {
    yield put(approvalActions.approvalFailure(e.message));
  }
}

function* handleReject(action: any) {
  try {
    yield call(taskApi.updateStatus, action.payload.taskId, 'REJECTED');
    yield put(approvalActions.approvalComplete(action.payload.taskId));
    yield put(taskActions.fetchTasksRequest()); // Refresh general task list if needed
  } catch (e: any) {
    yield put(approvalActions.approvalFailure(e.message));
  }
}

export function* approvalSaga() {
  yield takeLatest(approvalActions.fetchPendingApprovalsRequest.type, fetchPending);
  yield takeLatest(approvalActions.approveTaskRequest.type, handleApprove);
  yield takeLatest(approvalActions.rejectTaskRequest.type, handleReject);
}
