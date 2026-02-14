
import { all, fork } from 'redux-saga/effects';
import { authSaga } from '../features/auth/authSaga';
import { taskSaga } from '../features/tasks/taskSaga';
import { approvalSaga } from '../features/approvals/approvalSaga';
import { notificationSaga } from '../features/notifications/notificationSaga';

export default function* rootSaga() {
  yield all([
    fork(authSaga),
    fork(taskSaga),
    fork(approvalSaga),
    fork(notificationSaga),
  ]);
}
