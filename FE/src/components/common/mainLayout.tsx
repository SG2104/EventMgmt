import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const MainLayout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:9000/api/v1/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.message || "Logout failed ❌");
        return;
      }

      toast.success("Logged out successfully 👋");
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Something went wrong during logout.");
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
