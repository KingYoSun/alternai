import { ThemeProvider } from "@/components/theme-provider";
import CustomHeader from "@/components/header";
import { Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

function App() {
  const location = useLocation();

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className={cn("relative max-w-screen-lg mx-auto")}>
        <div className={cn("fixed inset-0 m-auto max-w-screen-lg h-full py-2")}>
          <CustomHeader currentPath={location.pathname} />
        </div>

        <div className={cn("flex justify-center w-full px-3 py-2 mt-16")}>
          <Outlet />
        </div>
        <div className={cn("h-screen my-10")} />
      </div>
    </ThemeProvider>
  );
}

export default App;
