import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
//import Dashboard from "../pages/Leads";
import Leads from "../pages/Leads";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
  <Route path="/" element={<Login />} />
  <Route 
    path="/dashboard" 
    element={
      <ProtectedRoute>
        <Leads />
      </ProtectedRoute>
    } 
  />
</Routes>
  );
}
