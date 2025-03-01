import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Welcome from "./pages/Welcome.jsx";
import Resource from "./pages/Resource.jsx";
import About from "./pages/About.jsx";
import Quiz from "./pages/Quiz.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true, 
                element: <Welcome />,
            },
            {
                path: "about", 
                element: <About />,
            },
            {
                path: "quiz", 
                element: <Quiz />,
            },
            {
                path: "resources", 
                element: <Resource />,
            },
        ],
    }
]);

export default router;