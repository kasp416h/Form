interface ActionResponse {
  error?: string;
  success?: string;
  status: number;
  validationErrors?: { path: string[]; message: string }[];
  redirect?: string;
}
