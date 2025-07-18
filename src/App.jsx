import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ProjectsApp from './apps/ProjectsApp';
import TimesheetApp from './apps/TimesheetApp';
import PeopleApp from './apps/PeopleApp';
import KanbanApp from './apps/KanbanApp';
import SecurityApp from './apps/SecurityApp';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Página de login */}
          <Route path="/login" element={<Login />} />
          
          {/* Dashboard principal - protegido */}
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          {/* Apps modulares - todos protegidos */}
          <Route path="/projects/*" element={
            <ProtectedRoute>
              <ProjectsApp />
            </ProtectedRoute>
          } />
          <Route path="/timesheet/*" element={
            <ProtectedRoute>
              <TimesheetApp />
            </ProtectedRoute>
          } />
          <Route path="/people/*" element={
            <ProtectedRoute>
              <PeopleApp />
            </ProtectedRoute>
          } />
          <Route path="/kanban/*" element={
            <ProtectedRoute>
              <KanbanApp />
            </ProtectedRoute>
          } />
          <Route path="/security/*" element={
            <ProtectedRoute>
              <SecurityApp />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

