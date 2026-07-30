import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-sm">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent mb-3">
          Ticket Not Found
        </p>
        <h1 className="text-6xl font-display font-extrabold text-foreground mb-4">404</h1>
        <p className="text-muted-foreground mb-6 font-mono text-sm break-all">
          No record at <span className="text-foreground">{location.pathname}</span>
        </p>
        <a
          href="/"
          className="inline-block bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-2.5 font-medium transition-colors"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;