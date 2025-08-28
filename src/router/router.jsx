import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home";
import ErrorPage from "../pages/ErrorPage";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardPage from "../pages/dashbaordPages/DashboardPage";
import ClassSchedule from "../pages/dashbaordPages/ClassSchedule";
import BudgetTracker from "../pages/dashbaordPages/BudgetTracker";
import StudyPlanner from "../pages/dashbaordPages/StudyPlanner";
import QAGenarator from "../pages/dashbaordPages/QAGenarator";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
    ],
  },
  {
    path: "auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "sign-up", element: <Register /> },
    ],
  },
  {
    path: "dashboard",
    element: <DashboardLayout />,
    children: [
      { path: "dashboardpage", element: <DashboardPage /> },
      { path: "schedule", element: <ClassSchedule /> },
      { path: "budget", element: <BudgetTracker /> },
      { path: "planner", element: <StudyPlanner /> },
      { path: "qa", element: <QAGenarator /> },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

export default router;
