import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
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
          toast.success("Authorized");
        } else {
          setAuthorized(false);
          toast.error("Unauthorized access");
        }
      } catch (error) {
        console.log("Auth check error", error)
        setAuthorized(false);
        toast.error("Failed to verify authentication");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>;
  //authentication bypass
  if (!authorized) return <Navigate to="/" />;

  return children;
}
