
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { taskActions } from '../features/tasks/taskSlice';
import { RootState } from '../app/store';

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch();
  // Initialize navigate using useNavigate hook
  const navigate = useNavigate();
  const { items, loading } = useSelector((state: RootState) => state.tasks);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if(items.length == 0) {
    dispatch(taskActions.fetchTasksRequest());
    }
  }, [dispatch]);

  const stats = [
    { label: 'Total Tasks', count: items.length, color: 'bg-indigo-500', icon: 'fa-list-check' },
    { label: 'Pending', count: items.filter(t => t.status === 'SUBMITTED').length, color: 'bg-amber-500', icon: 'fa-clock' },
    { label: 'Approved', count: items.filter(t => t.status === 'APPROVED').length, color: 'bg-emerald-500', icon: 'fa-circle-check' },
    { label: 'Rejected', count: items.filter(t => t.status === 'REJECTED').length, color: 'bg-rose-500', icon: 'fa-circle-xmark' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user?.name}!</h1>
        <p className="text-slate-500">Here's what's happening in your workflow today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg`}>
              <i className={`fas ${stat.icon} text-xl`}></i>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{loading ? '...' : stat.count}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Recent Activity</h3>
            <button className="text-indigo-600 text-sm font-bold">View All</button>
          </div>
          <div className="p-6">
             {items.slice(0, 5).map(task => (
               <div key={task.id} className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0">
                 <div className="flex items-center space-x-4">
                   <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                     <i className="fas fa-file-invoice"></i>
                   </div>
                   <div>
                     <p className="font-semibold text-slate-800">{task.title}</p>
                     <p className="text-xs text-slate-500">{new Date(task.createdAt).toLocaleDateString()}</p>
                   </div>
                 </div>
                 <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                   task.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700' :
                   task.status === 'REJECTED' ? 'bg-rose-50 text-rose-700' :
                   task.status === 'SUBMITTED' ? 'bg-amber-50 text-amber-700' : 'bg-slate-50 text-slate-700'
                 }`}>
                   {task.status}
                 </span>
               </div>
             ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-bold text-slate-800 mb-6">Action Needed</h3>
          <div className="space-y-4">
            {items.filter(t => t.status === 'DRAFT').length > 0 ? (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                <p className="text-sm text-amber-800 font-medium">You have {items.filter(t => t.status === 'DRAFT').length} draft tasks to submit.</p>
                <button onClick={() => navigate('/tasks')} className="mt-2 text-amber-700 text-xs font-bold underline">Review Tasks</button>
              </div>
            ) : (
              <p className="text-center py-8 text-slate-400 text-sm">No pending actions.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;