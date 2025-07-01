import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TimesheetLayout from './TimesheetLayout';
import TimesheetPage from './pages/TimesheetPage';
import ApprovalsPage from './pages/ApprovalsPage';

const TimesheetApp = () => {
  return (
    <TimesheetLayout>
      <Routes>
        <Route path="/" element={<TimesheetPage />} />
        <Route path="/approvals" element={<ApprovalsPage />} />
      </Routes>
    </TimesheetLayout>
  );
};

export default TimesheetApp;

