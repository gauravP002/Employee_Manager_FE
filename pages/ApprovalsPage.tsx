
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { approvalActions } from '../features/approvals/approvalSlice';
import { RootState } from '../app/store';

const ApprovalsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { pendingTasks, loading } = useSelector((state: RootState) => state.approvals);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    dispatch(approvalActions.fetchPendingApprovalsRequest());
  }, [dispatch]);

  const handleAction = (type: 'APPROVE' | 'REJECT') => {
    if (!selectedTask) return;
    if (type === 'APPROVE') {
      dispatch(approvalActions.approveTaskRequest({ taskId: selectedTask.id, comment }));
    } else {
      dispatch(approvalActions.rejectTaskRequest({ taskId: selectedTask.id, comment }));
    }
    setSelectedTask(null);
    setComment('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Pending Approvals</h1>
        <p className="text-slate-500">Review and decide on tasks submitted by your team.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading && pendingTasks.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-100">
            <i className="fas fa-circle-notch fa-spin text-indigo-500 text-3xl mb-4"></i>
            <p className="text-slate-500 font-medium">Loading approval requests...</p>
          </div>
        ) : pendingTasks.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-100">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-check text-slate-300 text-2xl"></i>
             </div>
            <p className="text-slate-500 font-bold">Inbox is empty!</p>
            <p className="text-slate-400 text-sm">No tasks are currently waiting for your approval.</p>
          </div>
        ) : pendingTasks.map(task => (
          <div key={task.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded uppercase">Submitted Task</span>
                  <span className="text-xs text-slate-400">ID: {task.id}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{task.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">{task.description}</p>
                <div className="flex items-center space-x-6">
                   <div className="flex items-center text-xs text-slate-500">
                      <i className="far fa-user mr-1.5"></i>
                      Submitted by: <span className="font-bold ml-1">User {task.createdBy}</span>
                   </div>
                   <div className="flex items-center text-xs text-slate-500">
                      <i className="far fa-calendar-alt mr-1.5"></i>
                      {new Date(task.createdAt).toLocaleDateString()}
                   </div>
                </div>
              </div>
              
              <div className="flex md:flex-col gap-3">
                <button 
                  onClick={() => setSelectedTask(task)}
                  className="flex-1 md:flex-none px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-sm shadow-lg shadow-emerald-50 transition-all"
                >
                  Decide
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Approval Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Review Request</h2>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mt-1">Ref: {selectedTask.id}</p>
              </div>
              <button onClick={() => setSelectedTask(null)} className="text-slate-400 hover:text-slate-600">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                 <h4 className="text-sm font-bold text-slate-800 mb-1">{selectedTask.title}</h4>
                 <p className="text-xs text-slate-500 line-clamp-2">{selectedTask.description}</p>
              </div>
              
              <label className="block text-sm font-semibold text-slate-700 mb-2">Reviewer Comments (Optional)</label>
              <textarea 
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add reasoning for your decision..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-50 mb-6"
              />

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => handleAction('REJECT')}
                  className="py-3 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold rounded-xl transition-all"
                >
                  <i className="fas fa-times-circle mr-2"></i> Reject
                </button>
                <button 
                  onClick={() => handleAction('APPROVE')}
                  className="py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-100 transition-all"
                >
                  <i className="fas fa-check-circle mr-2"></i> Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalsPage;
