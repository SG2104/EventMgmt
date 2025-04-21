import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

export default function PublicRoute({ children }: { children: JSX.Element }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:9000/api/v1/auth/me", {
          credentials: "include",
        });
        if (res.ok) {
          setAuthorized(true);
          toast.info("You're already logged in");
        } else {
          setAuthorized(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        toast.error("Error checking authentication");
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (authorized) return <Navigate to="/events" />;

  return children;
}
