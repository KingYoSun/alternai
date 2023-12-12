import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NovelAiApi, CaluculateCost } from "shared";
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
import Tokenizer from "@/lib/Tokenizer";
import FooterBtn from "@/components/footer-btn";
import { Image } from "lucide-react";
import { Loader2 } from "lucide-react";

const MAX_TOKEN_SIZE = 225;

function Home() {
  const [res, setRes] = useState("");
  const [cost, setCost] = useState("");
  const [enableSmea, setEnableSmea] = useState(false);
  const [enableSmeaDyn, setEnableSmeaDyn] = useState(false);
  const [posTokenSize, setPosTokenSize] = useState(0);
  const [negTokenSize, setNegTokenSize] = useState(0);
  const [enableRandomSeed, setEnableRandomSeed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [base64Image, setBase64Image] = useState<string>("");

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
  const watcher = optionForm.watch(["input", "model", "parameters"]);

  async function onSubmit(options: NovelAiApi.AiGenerateImageRequest) {
    if (enableRandomSeed)
      optionForm.setValue(
        "parameters.seed",
        Math.floor(Math.random() * 10000000000),
      );

    setLoading(true);
    const backendHost = import.meta.env.VITE_BACKEND_HOST;
    const response = await fetch(`${backendHost}/generate-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(options),
    });

    const body = await response.text();

    if (body && body.startsWith("data:image/png;base64,")) {
      setBase64Image(body);
    } else {
      setRes("error: ");
    }
    setLoading(false);
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
    // load model and params
    const input = watcher[0];
    const model = NovelAiApi.AiGenerateImageModels[watcher[1]];
    const params = watcher[2];
    if (!model) {
      setCost("err");
      return;
    }

    // caluculate const and set
    const cost = CaluculateCost.default(true, model.version, params);
    setCost(String(cost));

    // enable smea & dyn setting
    const samplerObj = Object.values(NovelAiApi.ImageSamplers).find(
      (sampler) => sampler.name === params.sampler,
    );
    const smeaEnabled = Boolean(samplerObj?.smea);
    const dynEnabled = Boolean(smeaEnabled && samplerObj?.smea_dyn);

    setEnableSmea(smeaEnabled);
    setEnableSmeaDyn(dynEnabled);

    // tokenize prompts
    // token size is 2 when empty input
    Tokenizer(input).then((tokenized) => {
      setPosTokenSize(
        tokenized.input_ids.size - 2 + (params.qualityToggle ? 5 : 0),
      );
    });
    Tokenizer(params.negative_prompt).then((tokenized) => {
      let additionalTokens = 0;
      switch (params.ucPreset) {
        case 0:
          additionalTokens = 48;
          break;
        case 1:
          additionalTokens = 31;
          break;
        default:
          additionalTokens = 0;
      }
      setNegTokenSize(tokenized.input_ids.size - 2 + additionalTokens);
    });
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
                        {Object.values(NovelAiApi.AiGenerateImageModels)
                          .filter(
                            (model) =>
                              !model.legacy &&
                              model.default &&
                              !model.inpainting,
                          )
                          .map((model) => (
                            <SelectItem key={model.name} value={model.name}>
                              {model.label}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel>----Lagacy Models-----</SelectLabel>
                        {Object.values(NovelAiApi.AiGenerateImageModels)
                          .filter(
                            (model) =>
                              model.legacy &&
                              model.default &&
                              !model.inpainting,
                          )
                          .map((model) => (
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
          <div className="md:flex md:flex-row md:justify-center w-full h-96 md:h-60 mt-3 mb-6 md:mb-3">
            <FormField
              control={optionForm.control}
              name="input"
              render={({ field }) => (
                <FormItem className={cn("h-40 md:h-5/6 md:w-1/2 md:mr-2")}>
                  <FormLabel>
                    PositivePrompt {posTokenSize}/{MAX_TOKEN_SIZE}
                  </FormLabel>
                  <Slider
                    className={cn("mt-4 mb-2")}
                    name="posTokensCount"
                    defaultValue={[0]}
                    value={[posTokenSize]}
                    min={0}
                    max={MAX_TOKEN_SIZE}
                    step={1}
                  />
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
                <FormItem
                  className={cn("h-40 md:h-5/6 md:w-1/2 md:ml-2 mt-10 md:mt-0")}
                >
                  <FormLabel>
                    NegativePrompt {negTokenSize}/{MAX_TOKEN_SIZE}{" "}
                  </FormLabel>
                  <Slider
                    className={cn("mt-4 mb-2")}
                    name="negTokensCount"
                    defaultValue={[0]}
                    value={[negTokenSize]}
                    min={0}
                    max={MAX_TOKEN_SIZE}
                    step={1}
                  />
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-fit mb-6 md:mb-3">
            <div className="grid-item col-span-1 h-fit">
              <div
                className={cn(
                  "flex flex-row justify-start items-end w-full h-fit mb-4",
                )}
              >
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
                  <Label htmlFor="ucPreset">Negative Prompt Preset</Label>
                  <FormField
                    control={optionForm.control}
                    name="parameters.ucPreset"
                    render={({ field }) => (
                      <FormItem className={cn("max-w-[80px]")}>
                        <FormControl>
                          <Select
                            onValueChange={(val) =>
                              field.onChange(parseInt(val))
                            }
                            defaultValue={String(
                              NovelAiApi.DefaultAiGenerateImageParameters
                                .ucPreset,
                            )}
                          >
                            <SelectTrigger id="ucPreset" className="w-70">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(NovelAiApi.UCPresetsEnum)
                                .filter(
                                  (key) =>
                                    NovelAiApi.UCPresetsEnum[
                                      key as keyof NovelAiApi.UCPresets
                                    ] < 3,
                                )
                                .map((key) => (
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
                <div className={cn("flex flex-col w-60 mt-2")}>
                  <Label htmlFor="enable-random-seed">Random Seed</Label>
                  <Switch
                    className={cn("mt-2")}
                    id="enable-random-seed"
                    name="enableRandomSeed"
                    checked={enableRandomSeed}
                    onCheckedChange={(val) => setEnableRandomSeed(val)}
                  />
                </div>
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
                            <SelectGroup>
                              <SelectLabel>----Recommend----</SelectLabel>
                              {Object.keys(NovelAiApi.ImageSamplers)
                                .filter((key) => {
                                  const model_key: string =
                                    WatchValueRaw("model");
                                  if (!model_key) return false;

                                  const model =
                                    NovelAiApi.AiGenerateImageModels[model_key];
                                  return model.samplers_recommend.includes(
                                    NovelAiApi.ImageSamplers[key],
                                  );
                                })
                                .map((key) => (
                                  <SelectItem
                                    key={NovelAiApi.ImageSamplers[key].name}
                                    value={NovelAiApi.ImageSamplers[key].name}
                                  >
                                    {key}
                                  </SelectItem>
                                ))}
                            </SelectGroup>
                            <SelectGroup>
                              <SelectLabel>----Other----</SelectLabel>
                              {Object.keys(NovelAiApi.ImageSamplers)
                                .filter((key) => {
                                  const model_key: string =
                                    WatchValueRaw("model");
                                  if (!model_key) return false;

                                  const model =
                                    NovelAiApi.AiGenerateImageModels[model_key];
                                  return model.samplers.includes(
                                    NovelAiApi.ImageSamplers[key],
                                  );
                                })
                                .map((key) => (
                                  <SelectItem
                                    key={NovelAiApi.ImageSamplers[key].name}
                                    value={NovelAiApi.ImageSamplers[key].name}
                                  >
                                    {key}
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
                          onCheckedChange={(checked) => {
                            if (!checked)
                              optionForm.setValue("parameters.sm_dyn", false);
                            field.onChange(checked);
                          }}
                          checked={field.value}
                          ref={field.ref}
                          disabled={!enableSmea}
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
                          disabled={!enableSmeaDyn}
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
            <div className={cn("grid-item col-span-1 h-full")}>
              {base64Image.length > 0 ? (
                <img
                  src={base64Image}
                  className={cn("object-contain w-full h-fit")}
                />
              ) : (
                <div
                  className={cn(
                    "relative w-full h-[600px] md:h-full rounded-2xl border-solid border-4 border-slate-500",
                  )}
                >
                  {loading ? (
                    <Loader2
                      className={cn(
                        "h-12 w-12 animate-spin absolute inset-0 m-auto",
                      )}
                    />
                  ) : (
                    <Image
                      className={cn("h-12 w-12 absolute inset-0 m-auto")}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
          <Separator className={cn("mb-4")} />
          <p className={cn("my-2")}>
            {res}, {JSON.stringify(optionForm.formState.errors)}
          </p>
          <div
            className={cn("fixed bottom-0 mx-auto max-w-screen-lg h-fit py-2")}
          >
            <FooterBtn cost={cost} loading={loading} />
          </div>
        </form>
      </Form>
    </div>
  );
}

export default Home;
