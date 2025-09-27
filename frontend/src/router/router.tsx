import { createBrowserRouter } from "react-router-dom";
import { StudentLoginPage } from "../pages/auth/student-login.page";
import { HomePage } from "@/pages/home/home.page";

export const ROUTER = createBrowserRouter([
    {
        path: "/", children: [
            { path: "", element: <HomePage /> },
            { path: "login/student", element: <StudentLoginPage /> }
        ]
    }
])