import { ThemeProvider } from "@/components/theme-provider";
import CustomHeader from "@/components/header";
import { Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

function App() {
  const location = useLocation();

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className={cn("relative")}>
        <div
          className={cn("fixed top-0 left-0 right-0 w-screen h-full px-3 py-2")}
        >
          <CustomHeader currentPath={location.pathname} />
        </div>

        <div className={cn("w-screen px-3 py-2 mt-16 md:mx-10 mx-2")}>
          <Outlet />
        </div>
        <div className={cn("h-screen my-10")} />
      </div>
    </ThemeProvider>
  );
}

export default App;
