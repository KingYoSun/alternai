import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [isRevealPassword, setIsRevealPassword] = React.useState(false);
    const [inputType, setInputType] = React.useState(type);

    React.useEffect(() => {
      if (type === "password") {
        setInputType(isRevealPassword ? "text" : "password");
      }
    }, [type, isRevealPassword]);

    const toggeleRevealPassword = () => {
      setIsRevealPassword((prevState) => !prevState);
    };

    return (
      <div className={cn("relative")}>
        <input
          type={inputType}
          className={cn(
            `flex h-10 w-full rounded-md border border-input bg-background pl-3 ${
              type === "password" ? "pr-9" : "pr-3"
            } py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`,
            className,
          )}
          ref={ref}
          {...props}
        />
        {type === "password" ? (
          <span
            onClick={toggeleRevealPassword}
            role="presentation"
            className={cn("absolute top-2.5 right-3 w-fit h-fit")}
          >
            {isRevealPassword ? (
              <Eye className={cn("w-5 h-5")} />
            ) : (
              <EyeOff className={cn("w-5 h-5")} />
            )}
          </span>
        ) : (
          <></>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
