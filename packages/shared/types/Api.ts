export interface ApiResponseBody {
  status: number;
  message: string;
}

export interface SaveOptions {
  autoSave?: boolean;
  local?: boolean;
}
