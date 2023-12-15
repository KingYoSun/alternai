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

function CustomHeader({ currentPath }: HeaderProps) {
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
      <div className={cn("absolute right-7")}>
        <ThemeToggle />
      </div>
    </NavigationMenu>
  );
}

export default CustomHeader;
