import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { SidebarProvider } from './context/SidebarContext';

import AdminLayout from './components/layout/AdminLayout';
import AuthLayout from './components/layout/AuthLayout';

import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import UserDetails from './pages/UserDetails';
import CreateAgent from './pages/CreateAgent';
import Profile from './pages/Profile';
import Settings from "./pages/Settings/Settings.jsx";
import CircleSettings from './pages/Settings/CircleSettings';
import DistrictSettings from './pages/Settings/DistrictSettings';
import SchemeSettings from './pages/Settings/SchemeSettings';
import MLASettings from './pages/Settings/MLASettings';
import UserSettings from './pages/Settings/UserSettings';
import ContractorSettings from './pages/Settings/ContractorSettings';
import Charts from './pages/Charts';
import Report from './pages/Report';
import ReportSchemes from './pages/ReportSchemes';
import SchemeReports from './pages/SchemeReports';
import Forms from "./pages/Master_Form/Forms.jsx";
import NHMForm from "./pages/Master_Form/NHMForm.jsx";
// import ComponentsPage from './pages/ComponentsPage';
import Help from './pages/Help';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions'; 
import Logout from './pages/Logout.jsx';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import NotFound from './pages/NotFound';
import ServerError from './pages/ServerError';
import OrganizationStructure from "./pages/OrganizationStructure.jsx";

export default function App() {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <BrowserRouter>
          <Routes>
            {/* Protected Admin Shell */}
            <Route path="/" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="users" element={<Users />} />
             
              <Route path="user-details" element={<UserDetails />} />
              <Route path="create-agent" element={<CreateAgent />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
              <Route path="setting/circle" element={<CircleSettings />} />

              <Route
                path="setting/district"
                element={<DistrictSettings />}
              />
              <Route
                path="setting/scheme"
                element={<SchemeSettings />}
              />
              <Route
                path="setting/mla"
                element={<MLASettings />}
              />
              <Route
                path="setting/user"
                element={<UserSettings />}
              />
              <Route
                path="setting/contractor"
                element={<ContractorSettings />}
              />
              <Route path="charts" element={<Charts />} />
              <Route path="report" element={<Report />} />
              <Route path="report/:category" element={<ReportSchemes />} />
              <Route
                path="report/:category/:scheme"
                element={<SchemeReports />}
              />
              <Route path="forms" element={<Forms />} />
              <Route path="forms/nhm" element={<NHMForm />} />
              <Route
                path="organization-structure"
                element={<OrganizationStructure />}
              />
              <Route path="help" element={<Help />} />
              <Route path="privacy-policy" element={<PrivacyPolicy />} />
              <Route path="terms-conditions" element={<TermsConditions />} />
              <Route path="logout" element={< Logout />} />
            </Route>

            {/* Auth Shell */}
            <Route element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
            </Route>

            {/* Errors */}
            <Route path="500" element={<ServerError />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SidebarProvider>
    </ThemeProvider>
  );
}
