
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from './features/auth/authSlice';
import { RootState } from './app/store';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import TaskDetailPage from './pages/TaskDetailPage';
import ApprovalsPage from './pages/ApprovalsPage';
import ProfilePage from './pages/ProfilePage';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const {accessToken} = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Attempt to hydrate auth state from storage
   
    if (accessToken) {
      dispatch(authActions.getCurrentUserRequest());
    }
  }, [dispatch]);

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
        
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/tasks/:id" element={<TaskDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          
          {/* Manager Only Routes */}
          <Route element={<RoleRoute allowedRoles={['MANAGER']} />}>
            <Route path="/approvals" element={<ApprovalsPage />} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
