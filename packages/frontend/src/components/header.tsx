import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { Link } from "react-router-dom";
interface RadixLinkProps {
  name: string;
  href: string;
  isActive: boolean;
}

import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { useContext, useEffect, useState } from "react";
import { UserDataContext } from "@/contexts/user-data";
import { UserAccountDataResponse } from "shared/types/NovelAiApi/UserData";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const RadixLink = (props: RadixLinkProps) => {
  return (
    <NavigationMenuLink
      asChild
      className={navigationMenuTriggerStyle()}
      active={props.isActive}
    >
      <Link to={props.href}>{props.name}</Link>
    </NavigationMenuLink>
  );
};

export interface HeaderProps {
  currentPath: string;
}
const backendHost = import.meta.env.VITE_BACKEND_HOST;

function CustomHeader({ currentPath }: HeaderProps) {
  const { userData, dispatchUserData } = useContext(UserDataContext);
  const [fetchFailed, setFetchFailed] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch(`${backendHost}/user-data`);
      if (res.status !== 200) {
        setFetchFailed(true);
        console.log(
          `Fetch UserData failed: ${res.status}: ${await res.text()}`,
        );
      } else {
        const data: UserAccountDataResponse = await res.json();
        dispatchUserData({
          type: "set",
          payload: data,
        });
        setFetchFailed(false);
      }
    })();
  }, [dispatchUserData]);

  const links: Array<RadixLinkProps> = [
    {
      name: "Home",
      href: "/",
      isActive: currentPath === "/",
    },
    {
      name: "Settings",
      href: "/settings",
      isActive: currentPath === "/settings",
    },
  ];

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {links.map((link) => (
          <NavigationMenuItem key={link.name}>
            <RadixLink
              name={link.name}
              href={link.href}
              isActive={link.isActive}
            />
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
      <div
        className={cn(
          "flex flex-row absolute content-center right-7 space-x-2",
        )}
      >
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary">
              Anlas:{" "}
              {fetchFailed
                ? "FetchFailed"
                : (userData?.subscription.trainingStepsLeft
                    .fixedTrainingStepsLeft ?? 0) +
                  (userData?.subscription.trainingStepsLeft
                    .purchasedTrainingSteps ?? 0)}
            </Button>
          </DialogTrigger>
          <DialogContent>
            {fetchFailed ? (
              <p>"Failed to fetch novelai"</p>
            ) : (
              <div>
                <p>
                  Subscription Anlas:{" "}
                  {userData?.subscription.trainingStepsLeft
                    .fixedTrainingStepsLeft ?? 0}
                </p>
                <p>
                  Paid Anlas:{" "}
                  {userData?.subscription.trainingStepsLeft
                    .purchasedTrainingSteps ?? 0}
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>
        <ThemeToggle />
      </div>
    </NavigationMenu>
  );
}

export default CustomHeader;
