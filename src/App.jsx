import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ProjectsApp from './apps/ProjectsApp';
import TimesheetApp from './apps/TimesheetApp';
import PeopleApp from './apps/PeopleApp';
import KanbanApp from './apps/KanbanApp';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Dashboard principal - sem sidebar */}
          <Route path="/" element={<Dashboard />} />
          
          {/* Apps modulares - cada um com seu próprio layout */}
          <Route path="/projects/*" element={<ProjectsApp />} />
          <Route path="/timesheet/*" element={<TimesheetApp />} />
          <Route path="/people/*" element={<PeopleApp />} />
          <Route path="/kanban/*" element={<KanbanApp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

