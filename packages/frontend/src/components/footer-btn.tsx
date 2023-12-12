import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// import { cn } from "@/lib/utils";

interface FooterBtnProps {
  cost: string;
  loading: boolean;
}

function FooterBtn({ cost, loading }: FooterBtnProps) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Button type="submit" variant="outline" disabled={loading}>
            {loading ? (
              <Loader2 className={cn("mr-2 h-4 w-4 animate-spin")} />
            ) : (
              ""
            )}
            Generate: {cost} Anlas
          </Button>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default FooterBtn;
