
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

const ProfilePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="h-32 bg-slate-900 relative">
          <div className="absolute -bottom-12 left-12">
            <div className="w-24 h-24 rounded-2xl bg-indigo-600 border-4 border-white flex items-center justify-center text-white text-3xl font-bold shadow-xl">
              {user?.name.charAt(0)}
            </div>
          </div>
        </div>
        
        <div className="pt-16 px-12 pb-12">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{user?.name}</h1>
              <p className="text-slate-500 font-medium">{user?.email}</p>
              <div className="flex items-center mt-2 space-x-2">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-100">
                  {user?.role}
                </span>
                <span className="text-slate-400 text-xs">•</span>
                <span className="text-slate-400 text-xs">Employee ID: EMP-1234{user?.id}</span>
              </div>
            </div>
            <button className="px-6 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-all">
              Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
            <div>
              <h3 className="font-bold text-slate-800 mb-4">Personal Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500">Full Name</span>
                  <span className="text-sm font-semibold text-slate-800">{user?.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500">Work Email</span>
                  <span className="text-sm font-semibold text-slate-800">{user?.email}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500">Department</span>
                  <span className="text-sm font-semibold text-slate-800">Operations</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-slate-500">Joined Date</span>
                  <span className="text-sm font-semibold text-slate-800">{new Date(user?.createdAt || '').toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4">Security Settings</h3>
              <div className="space-y-4">
                 <button className="w-full flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl hover:shadow-sm transition-all group">
                    <div className="flex items-center">
                       <i className="fas fa-key w-8 text-indigo-500"></i>
                       <span className="text-sm font-bold text-slate-700">Change Password</span>
                    </div>
                    <i className="fas fa-chevron-right text-slate-300 group-hover:text-indigo-500"></i>
                 </button>
                 <button className="w-full flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl hover:shadow-sm transition-all group">
                    <div className="flex items-center">
                       <i className="fas fa-shield-halved w-8 text-emerald-500"></i>
                       <span className="text-sm font-bold text-slate-700">Two-Factor Auth</span>
                    </div>
                    <i className="fas fa-chevron-right text-slate-300 group-hover:text-emerald-500"></i>
                 </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
