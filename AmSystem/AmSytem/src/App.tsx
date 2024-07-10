import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Input } from "./components/ui/input";
import { Sidebar } from "./components/sidebar";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-row">
      <Sidebar />
      <div className="p-4 w-full">
        <Outlet />
        <Toaster richColors />
      </div>
    </div>
  );
}

export default App;
