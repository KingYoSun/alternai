import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SettingsRequestSchema,
  type Settings,
  DefaultSettings,
} from "shared/types/Settings";
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function Settings() {
  const [res, setRes] = useState("");
  const [loading, setLoading] = useState(false);

  const backendHost = import.meta.env.VITE_BACKEND_HOST;

  const settingsForm = useForm<Settings>({
    resolver: zodResolver(SettingsRequestSchema),
    defaultValues: DefaultSettings,
  });

  async function onSubmit(settings: Settings) {
    setLoading(true);
    const putRes = await fetch(`${backendHost}/settings`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
    });

    const putBody = await putRes.json();

    if (!putBody) {
      setRes("error: empty body");
    }
    setLoading(false);
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      const getRes = await fetch(`${backendHost}/settings`);

      if (getRes.status === 200) {
        const getBody = await getRes.json();
        Object.keys(getBody).map((key) => {
          settingsForm.setValue(key as keyof Settings, getBody[key]);
        });
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cn("w-full z-11")}>
      <Form {...settingsForm}>
        <form onSubmit={settingsForm.handleSubmit(onSubmit)}>
          <FormField
            control={settingsForm.control}
            name="NAI_API_TOKEN"
            render={({ field }) => (
              <FormItem className={cn("max-w-[600px]")}>
                <FormLabel>NAI API TOKEN</FormLabel>
                <FormControl>
                  <Input disabled={loading} type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator className={cn("my-5")} />
          <FormField
            control={settingsForm.control}
            name="NEXTCLOUD_URL"
            render={({ field }) => (
              <FormItem className={cn("max-w-[600px]")}>
                <FormLabel>NEXTCLOUD_URL</FormLabel>
                <FormControl>
                  <Input disabled={loading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={settingsForm.control}
            name="NEXTCLOUD_USER"
            render={({ field }) => (
              <FormItem className={cn("max-w-[600px]")}>
                <FormLabel>NEXTCLOUD USER</FormLabel>
                <FormControl>
                  <Input disabled={loading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={settingsForm.control}
            name="NEXTCLOUD_PASS"
            render={({ field }) => (
              <FormItem className={cn("max-w-[600px]")}>
                <FormLabel>NEXTCLOUD PASSWORD</FormLabel>
                <FormControl>
                  <Input type="password" disabled={loading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={settingsForm.control}
            name="NEXTCLOUD_LOC"
            render={({ field }) => (
              <FormItem className={cn("max-w-[600px]")}>
                <FormLabel>NEXTCLOUD SAVE LOCATION</FormLabel>
                <FormControl>
                  <Input disabled={loading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            variant="outline"
            disabled={loading}
            className={cn("mt-8")}
          >
            {loading ? (
              <Loader2 className={cn("mr-2 h-4 w-4 animate-spin")} />
            ) : (
              ""
            )}
            Save Settings
          </Button>
          <Separator className={cn("my-4")} />
          <p className={cn("my-2")}>
            {res}, {JSON.stringify(settingsForm.formState.errors)}
          </p>
        </form>
      </Form>
    </div>
  );
}
