import { ThemeProvider } from "@/components/theme-provider";
import CustomHeader from "@/components/header";
import { Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import UserDataProvider from "./contexts/user-data";

function App() {
  const location = useLocation();

  return (
    <UserDataProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className={cn("relative max-w-screen-lg mx-auto")}>
          <div
            className={cn("fixed inset-0 mx-auto max-w-screen-lg h-fit py-2")}
          >
            <CustomHeader currentPath={location.pathname} />
          </div>

          <div className={cn("flex justify-center w-full px-3 py-2 mt-16")}>
            <Outlet />
          </div>
        </div>
      </ThemeProvider>
    </UserDataProvider>
  );
}

export default App;
