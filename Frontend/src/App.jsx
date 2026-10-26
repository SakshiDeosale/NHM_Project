import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { SidebarProvider } from './context/SidebarContext';

import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AuthLayout from './components/layout/AuthLayout';

import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
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
import Forms from "./pages/Master_Form/Forms";
import NHMForm from "./pages/Master_Form/NHMForm";
import FifteenthFinanceForm from "./pages/Master_Form/FifteenthFinanceForm";
import PMABHIMForm from "./pages/Master_Form/PMABHIMForm";
import PMJVKForm from "./pages/Master_Form/PMJVKForm";
import AYUSHForm from "./pages/Master_Form/AYUSHForm";
import ADBForm from "./pages/Master_Form/ADBForm";
import NDBForm from "./pages/Master_Form/NDBForm";

import Help from './pages/Help';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions'; 
import Logout from './pages/Logout.jsx';
import Login from './pages/Login';

import NotFound from './pages/NotFound';
import ServerError from './pages/ServerError';
import OrganizationStructure from "./pages/OrganizationStructure.jsx";
import SEProtectedRoute from './components/layout/SEProtectedRoute';

export default function App() {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <BrowserRouter>
          <Routes>
            {/* Protected Admin Shell */}
            <Route path="/" element={<ProtectedRoute> <AdminLayout /> </ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="users" element={<Users />} />
             
              <Route path="profile" element={<Profile />} />

              <Route
                path="settings"
                element={
                  <SEProtectedRoute>
                    <Settings />
                  </SEProtectedRoute>
                }
              />

              <Route
                path="setting/circle"
                element={
                  <SEProtectedRoute>
                    <CircleSettings />
                  </SEProtectedRoute>
                }
              />

              <Route
                path="setting/district"
                element={
                  <SEProtectedRoute>
                    <DistrictSettings />
                  </SEProtectedRoute>
                }
              />

              <Route
                path="setting/scheme"
                element={
                  <SEProtectedRoute>
                    <SchemeSettings />
                  </SEProtectedRoute>
                }
              />

              <Route
                path="setting/mla"
                element={
                  <SEProtectedRoute>
                    <MLASettings />
                  </SEProtectedRoute>
                }
              />

              <Route
                path="setting/user"
                element={
                  <SEProtectedRoute>
                    <UserSettings />
                  </SEProtectedRoute>
                }
              />

              <Route
                path="setting/contractor"
                element={
                  <SEProtectedRoute>
                    <ContractorSettings />
                  </SEProtectedRoute>
                }
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
                path="forms/15th-fc"
                element={<FifteenthFinanceForm />}
              />

              <Route
                path="forms/pm-abhim"
                element={<PMABHIMForm />}
              />

              <Route path="forms/pmjvk" element={<PMJVKForm />} />

              <Route path="forms/ayush" element={<AYUSHForm />} />

              <Route path="forms/adb" element={<ADBForm />} />

              <Route path="forms/ndb" element={<NDBForm />} />
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
              {/* <Route path="register" element={<Register />} />
              <Route path="forgot-password" element={<ForgotPassword />} /> */}
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
