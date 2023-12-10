import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NovelAiApi } from "shared";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

function Home() {
  const [res, setRes] = useState("");

  const initResoArr: NovelAiApi.ImageResolution[] =
    NovelAiApi.ImageResolutions.filter(
      (r) =>
        !r.excludes.includes(NovelAiApi.DefaultAiGenerateImageOptions.model),
    );
  const [resoArr, setResoArr] =
    useState<NovelAiApi.ImageResolution[]>(initResoArr);
  const optionForm = useForm<NovelAiApi.AiGenerateImageRequest>({
    resolver: zodResolver(NovelAiApi.AiGenerateImageRequestSchema),
    defaultValues: NovelAiApi.DefaultAiGenerateImageOptions,
  });

  async function onSubmit(options: NovelAiApi.AiGenerateImageRequest) {
    const response = await fetch(`${process.env.BACKEND}/generate-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(options),
    });

    setRes(JSON.stringify(response.body));
  }

  return (
    <div className={cn("w-full z-11")}>
      <Form {...optionForm}>
        <form onSubmit={optionForm.handleSubmit(onSubmit)}>
          <FormField
            control={optionForm.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>BaseModel</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(val) => {
                      field.onChange(val);
                      setResoArr(
                        NovelAiApi.ImageResolutions.filter(
                          (r) => !r.excludes.includes(val),
                        ),
                      );
                    }}
                    name={field.name}
                    value={field.value}
                    defaultValue={
                      NovelAiApi.DefaultAiGenerateImageOptions.model
                    }
                  >
                    <SelectTrigger className="w-60">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {NovelAiApi.AiGenerateImageModels.filter(
                          (model) =>
                            !model.legacy && model.default && !model.inpainting,
                        ).map((model) => (
                          <SelectItem key={model.name} value={model.name}>
                            {model.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel>----Lagacy Models-----</SelectLabel>
                        {NovelAiApi.AiGenerateImageModels.filter(
                          (model) =>
                            model.legacy && model.default && !model.inpainting,
                        ).map((model) => (
                          <SelectItem key={model.name} value={model.name}>
                            {model.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="md:flex md:flex-row md:justify-center w-full h-96 md:h-60 space-y-10 md:space-y-0 mt-3 mb-6 md:mb-3">
            <FormField
              control={optionForm.control}
              name="input"
              render={({ field }) => (
                <FormItem className={cn("h-40 md:h-5/6 md:w-1/2 md:mx-2")}>
                  <FormLabel>PositivePrompt</FormLabel>
                  <FormControl>
                    <Textarea className={cn("h-full")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={optionForm.control}
              name="parameters.negative_prompt"
              render={({ field }) => (
                <FormItem className={cn("h-40 md:h-5/6 md:w-1/2 md:mx-2")}>
                  <FormLabel>NegativePrompt</FormLabel>
                  <FormControl>
                    <Textarea
                      className={cn("h-full")}
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                      value={field.value}
                      ref={field.ref}
                      name={field.name}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-row justify-start items-end w-full h-fit mb-6 md:mb-3">
            <div>
              <Label htmlFor="resolution_select">Resolution Setting</Label>
              <Select
                onValueChange={(val) => {
                  const resolution: number[] = JSON.parse(val);
                  optionForm.setValue("parameters.width", resolution[0]);
                  optionForm.setValue("parameters.height", resolution[1]);
                }}
                defaultValue={`[${NovelAiApi.DefaultAiGenerateImageParameters.width}, ${NovelAiApi.DefaultAiGenerateImageParameters.height}]`}
              >
                <SelectTrigger id="resolution_select" className="w-60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {resoArr.map((model) => (
                    <SelectItem
                      key={model.name}
                      value={`[${model.width}, ${model.height}]`}
                    >
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-row justify-around items-center h-fit mx-4">
              <FormField
                control={optionForm.control}
                name="parameters.width"
                render={({ field }) => (
                  <FormItem className={cn("max-w-[75px]")}>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <span className={cn("mx-2")}>X</span>
              <FormField
                control={optionForm.control}
                name="parameters.height"
                render={({ field }) => (
                  <FormItem className={cn("max-w-[75px]")}>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex flex-row justify-start items-start w-full h-fit mx-4 space-x-3 mb-4">
            <div>
              <Label htmlFor="qualityToggle">QualityTags</Label>
              <FormField
                control={optionForm.control}
                name="parameters.qualityToggle"
                render={({ field }) => (
                  <FormItem className={cn("w-fit")}>
                    <FormControl>
                      <Switch
                        id="qualityToggle"
                        className={cn("mt-2")}
                        name={field.name}
                        onBlur={field.onBlur}
                        onCheckedChange={field.onChange}
                        checked={field.value}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <Label htmlFor="negative_prompt_preset">
                Negative Prompt Preset
              </Label>
              <FormField
                control={optionForm.control}
                name="parameters.negative_prompt"
                render={({ field }) => (
                  <FormItem className={cn("max-w-[80px]")}>
                    <FormControl>
                      <Select
                        onValueChange={(val) => field.onChange(parseInt(val))}
                        defaultValue={String(
                          NovelAiApi.UCPresetsEnum
                            .Preset_Low_Quality_Bad_Anatomy,
                        )}
                      >
                        <SelectTrigger
                          id="negative_prompt_preset"
                          className="w-70"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(NovelAiApi.UCPresetsEnum).map((key) => (
                            <SelectItem
                              key={key}
                              value={String(
                                NovelAiApi.UCPresetsEnum[
                                  key as keyof NovelAiApi.UCPresets
                                ],
                              )}
                            >
                              {key}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Separator className={cn("mb-4")} />
          <Button type="submit">Generate</Button>
          <p className={cn("my-2")}>{res}</p>
        </form>
      </Form>
    </div>
  );
}

export default Home;
