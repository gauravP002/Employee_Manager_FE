
import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { taskActions } from '../features/tasks/taskSlice';
import { RootState } from '../app/store';

const TaskDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentTask, loading } = useSelector((state: RootState) => state.tasks);

  useEffect(() => {
    if (id) {
      dispatch(taskActions.fetchTaskByIdRequest(id));
    }
  }, [id, dispatch]);

  const handleSubmit = () => {
    if (id) {
      dispatch(taskActions.updateTaskStatusRequest({ id, status: 'SUBMITTED' }));
    }
  };

  if (loading) return <div className="text-center py-20">Loading task details...</div>;
  if (!currentTask) return <div className="text-center py-20 text-slate-500">Task not found.</div>;

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'APPROVED': return 'bg-emerald-500 text-white';
      case 'REJECTED': return 'bg-rose-500 text-white';
      case 'SUBMITTED': return 'bg-amber-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center space-x-4">
        <Link to="/tasks" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors">
          <i className="fas fa-arrow-left"></i>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{currentTask.title}</h1>
          <p className="text-slate-500">Ref ID: {currentTask.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-50 pb-4">Task Description</h3>
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
              {currentTask.description || "No description provided."}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-50 pb-4">Activity Logs</h3>
            <div className="space-y-6 mt-4">
              <div className="relative pl-8 pb-4">
                <div className="absolute left-0 top-0 w-2 h-2 rounded-full bg-indigo-500 ring-4 ring-indigo-50 z-10"></div>
                <div className="absolute left-1 top-0 w-px h-full bg-slate-100"></div>
                <p className="text-sm font-bold text-slate-800">Task Created</p>
                <p className="text-xs text-slate-400">{new Date(currentTask.createdAt).toLocaleString()}</p>
              </div>
              {currentTask.status !== 'DRAFT' && (
                <div className="relative pl-8">
                  <div className="absolute left-0 top-0 w-2 h-2 rounded-full bg-indigo-500 ring-4 ring-indigo-50 z-10"></div>
                  <p className="text-sm font-bold text-slate-800">Status changed to {currentTask.status}</p>
                  <p className="text-xs text-slate-400">{new Date(currentTask.updatedAt).toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6">Workflow Status</h3>
            <div className="flex items-center justify-between mb-8">
               <span className="text-sm text-slate-500 font-medium">Current Status</span>
               <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${getStatusStyle(currentTask.status)}`}>
                 {currentTask.status}
               </span>
            </div>

            {currentTask.status === 'DRAFT' && (
              <button 
                onClick={handleSubmit}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center"
              >
                <i className="fas fa-paper-plane mr-2"></i> Submit for Approval
              </button>
            )}

            <div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
               <div>
                  <p className="text-xs text-slate-400 uppercase font-bold mb-1">Creator</p>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-[10px] text-indigo-600 font-bold">U</div>
                    <span className="text-sm font-medium text-slate-700">User {currentTask.createdBy.name}</span>
                  </div>
               </div>
               <div>
                  <p className="text-xs text-slate-400 uppercase font-bold mb-1">Created At</p>
                  <p className="text-sm font-medium text-slate-700">{new Date(currentTask.createdAt).toLocaleDateString()}</p>
               </div>
            </div>
          </div>

          <div className="bg-indigo-900 rounded-2xl p-6 text-white shadow-xl">
             <h4 className="font-bold mb-2">Need Help?</h4>
             <p className="text-indigo-200 text-xs mb-4">Contact your department manager for assistance regarding workflow approvals.</p>
             <button className="w-full py-2 bg-indigo-800 hover:bg-indigo-700 rounded-lg text-xs font-bold transition-all">Open Support Ticket</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPage;
