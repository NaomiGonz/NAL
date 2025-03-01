import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Welcome from "./pages/Welcome.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true, 
                element: <Welcome />,
            },
        ],
    }
]);