import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Leads from "./pages/Leads";
import Documents from "./pages/Documents";
import FollowUps from "./pages/FollowUps";
import Login from "./pages/Login";
import CustomerProfile from "./pages/CustomerProfile";
function App() {
  const token = localStorage.getItem("token");

  if (!token) {
    return (
      <BrowserRouter>
        <Routes>
          <Route
            path="*"
            element={<Login />}
          />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <div className="flex">

        <Sidebar />

        <div className="flex-1 p-8">

          <Routes>

            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/customers"
              element={<Customers />}
            />

            <Route
              path="/leads"
              element={<Leads />}
            />

            <Route
              path="/followups"
              element={<FollowUps />}
            />

            <Route
              path="/documents"
              element={<Documents />}
            />

            <Route
              path="*"
              element={<Navigate to="/" />}
            />
		<Route
  path="/customers/:id"
  element={<CustomerProfile />}
/>
          </Routes>

        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;
