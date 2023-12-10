import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm, useWatch } from "react-hook-form";
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
import { Slider } from "@/components/ui/slider";
import { CaluculateCost } from "shared";

function Home() {
  const [res, setRes] = useState("");
  const [cost, setCost] = useState("");

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
  const watcher = optionForm.watch(["model", "parameters"]);

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

  function WatchValue(name: string) {
    const val = useWatch({ name: name });
    return <span>{val}</span>;
  }

  function WatchValueRaw(name: string) {
    const val = useWatch({ name: name });
    return val;
  }

  useEffect(() => {
    const model = NovelAiApi.AiGenerateImageModels.find(
      (el) => el.name === watcher[0],
    );
    if (!model) {
      setCost("err");
      return;
    }
    // TODO 計算見直し
    const cost = CaluculateCost.default(true, model.version, watcher[1]);
    setCost(String(cost));
  }, [watcher]);

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
          <div className="flex flex-row justify-start items-start w-full h-fit space-x-3 mb-4">
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
                          NovelAiApi.DefaultAiGenerateImageParameters.ucPreset,
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
          <div className={cn("flex flex-wrap w-full h-fit mb-4")}>
            <div className="flexx flex-col w-full md:w-[45%] h-fit">
              <FormField
                control={optionForm.control}
                name="parameters.steps"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Steps: {WatchValue("parameters.steps")}
                    </FormLabel>
                    <FormControl>
                      <Slider
                        name={field.name}
                        defaultValue={[
                          NovelAiApi.DefaultAiGenerateImageParameters.steps,
                        ]}
                        onValueChange={(val) => field.onChange(val[0])}
                        onBlur={field.onBlur}
                        ref={field.ref}
                        value={[field.value]}
                        min={0}
                        max={50}
                        step={1}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={optionForm.control}
                name="parameters.scale"
                render={({ field }) => (
                  <FormItem className={cn("mt-3")}>
                    <FormLabel>
                      Guidance Scale: {WatchValue("parameters.scale")}
                    </FormLabel>
                    <FormControl>
                      <Slider
                        name={field.name}
                        defaultValue={[
                          NovelAiApi.DefaultAiGenerateImageParameters.scale,
                        ]}
                        onValueChange={(val) => field.onChange(val[0])}
                        onBlur={field.onBlur}
                        ref={field.ref}
                        value={[field.value]}
                        min={0}
                        max={10}
                        step={0.1}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div
                className={cn(
                  "flex flex-row w-full h-fit mt-3 justify-start items-start space-x-3",
                )}
              >
                <FormField
                  control={optionForm.control}
                  name="parameters.dynamic_thresholding"
                  render={({ field }) => (
                    <FormItem className={cn("max-w-[70px]")}>
                      <FormLabel>Descrisper</FormLabel>
                      <FormControl>
                        <Switch
                          id="dynamic_thresholding"
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
                <FormField
                  control={optionForm.control}
                  name="parameters.seed"
                  render={({ field }) => (
                    <FormItem className={cn("max-w-[130px] min-w-[100px]")}>
                      <FormLabel>Seed</FormLabel>
                      <FormControl>
                        <Input
                          id="seed"
                          type="number"
                          max="9999999999"
                          min="0"
                          name={field.name}
                          value={field.value}
                          ref={field.ref}
                          onBlur={field.onBlur}
                          onChange={(el) => {
                            let value = parseInt(el.currentTarget.value);
                            if (value < parseInt(el.currentTarget.min))
                              value = 0;
                            if (value > parseInt(el.currentTarget.max))
                              value = parseInt(
                                el.currentTarget.value.slice(0, 10),
                              );
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div
                className={cn(
                  "flex flex-row w-full h-fit justify-start items-start space-x-3",
                )}
              >
                <FormField
                  control={optionForm.control}
                  name="parameters.sampler"
                  render={({ field }) => (
                    <FormItem className={cn("w-fi")}>
                      <FormLabel>Sampler</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={String(
                            NovelAiApi.DefaultAiGenerateImageParameters.sampler,
                          )}
                        >
                          <SelectTrigger id="sampler" className="w-150">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(NovelAiApi.ImageSamplersEnum).map(
                              (val) => (
                                <SelectItem
                                  key={NovelAiApi.ImageSamplersEnum[val]}
                                  value={val}
                                >
                                  {NovelAiApi.ImageSamplersEnum[val]}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={optionForm.control}
                  name="parameters.sm"
                  render={({ field }) => (
                    <FormItem className={cn("max-w-[70px] mt-2")}>
                      <FormLabel>SMEA</FormLabel>
                      <FormControl>
                        <Switch
                          id="sm"
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
                <FormField
                  control={optionForm.control}
                  name="parameters.sm_dyn"
                  render={({ field }) => (
                    <FormItem className={cn("max-w-[70px] mt-2")}>
                      <FormLabel>DYN</FormLabel>
                      <FormControl>
                        <Switch
                          id="sm_dyn"
                          name={field.name}
                          onBlur={field.onBlur}
                          onCheckedChange={field.onChange}
                          checked={field.value}
                          ref={field.ref}
                          disabled={!WatchValueRaw("parameters.sm")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={optionForm.control}
                name="parameters.uncond_scale"
                render={({ field }) => (
                  <FormItem className={cn("mt-3")}>
                    <FormLabel>
                      Undesired Content Strength:{" "}
                      {Math.floor(
                        parseFloat(WatchValueRaw("parameters.uncond_scale")) *
                          100,
                      )}
                      %
                    </FormLabel>
                    <FormControl>
                      <Slider
                        name={field.name}
                        defaultValue={[
                          NovelAiApi.DefaultAiGenerateImageParameters
                            .uncond_scale,
                        ]}
                        onValueChange={(val) => field.onChange(val[0])}
                        onBlur={field.onBlur}
                        ref={field.ref}
                        value={[field.value]}
                        min={0}
                        max={1.5}
                        step={0.05}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={optionForm.control}
                name="parameters.cfg_rescale"
                render={({ field }) => (
                  <FormItem className={cn("mt-3")}>
                    <FormLabel>
                      Prompt Guidamce Rescale:{" "}
                      {WatchValue("parameters.cfg_rescale")}
                    </FormLabel>
                    <FormControl>
                      <Slider
                        name={field.name}
                        defaultValue={[
                          NovelAiApi.DefaultAiGenerateImageParameters
                            .cfg_rescale,
                        ]}
                        onValueChange={(val) => field.onChange(val[0])}
                        onBlur={field.onBlur}
                        ref={field.ref}
                        value={[field.value]}
                        min={0}
                        max={1}
                        step={0.02}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className={cn("mt-4")}>
                <Label htmlFor="noise_schedule">Noise Schedule</Label>
                <FormField
                  control={optionForm.control}
                  name="parameters.noise_schedule"
                  render={({ field }) => (
                    <FormItem className={cn("max-w-[200px]")}>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={
                            NovelAiApi.DefaultAiGenerateImageParameters
                              .noise_schedule
                          }
                        >
                          <SelectTrigger id="noise_schedule" className="w-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(NovelAiApi.NoiseScheduleEnum).map(
                              (val) => (
                                <SelectItem
                                  key={NovelAiApi.NoiseScheduleEnum[val]}
                                  value={val}
                                >
                                  {NovelAiApi.NoiseScheduleEnum[val]}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          <Separator className={cn("mb-4")} />
          <Button type="submit">Generate: {cost} Anlas</Button>
          <p className={cn("my-2")}>{res}</p>
        </form>
      </Form>
    </div>
  );
}

export default Home;
