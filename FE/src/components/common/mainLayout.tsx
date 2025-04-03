import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const MainLayout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:9000/api/v1/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="relative container h-full mx-auto bg-neutral-100 shadow-xl shadow-neutral-300">
      {/* Top Header Bar */}
      <div className="h-[100px] bg-primary flex items-center justify-between px-6 text-white">
        <h1 className="text-2xl font-bold">Event Manager</h1>
        <Button variant="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {/* Page Content */}
      <div className="px-4 h-full">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
