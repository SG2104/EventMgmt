import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

export default function NotFound() {
  const navigate = useNavigate();

  //  *** Go to previous visited route ***  //
  const handleGoBack = () => {
    navigate(-1);
  };
  return (
    <div className="flex items-center min-h-screen px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <div className="w-full space-y-6 text-center">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl lg:text-[88px] animate-bounce text-primary">
            404
          </h1>
          <p className="text-gray-500 text-lg">
            We couldn’t find the page you’re looking for. It might have been
            moved, deleted, or perhaps the URL is incorrect.
          </p>
        </div>
        <Button
          onClick={handleGoBack}
          className="inline-flex h-10 items-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
        >
          Return Back
        </Button>
      </div>
    </div>
  );
}
