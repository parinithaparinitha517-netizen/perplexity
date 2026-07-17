import { RouterProvider } from "react-router-dom";
import { router } from "./app.routes";
import {useAuth} from "../auth/feautures/hook/use.auth";
import {useEffect} from "react";
function App() {
  const { fetchMe } = useAuth();
  useEffect(() => {
    fetchMe();
  }, [fetchMe]);
  return <RouterProvider router={router} />;
}

export default App;
