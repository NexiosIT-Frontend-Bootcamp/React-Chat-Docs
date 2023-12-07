import { ApiResultBase } from "../types";
import { DEFAULT_ERROR_MESSAGE } from "../vars/messages";

export const DEFAULT_ERROR_RESULT: ApiResultBase = {
  isSuccess: false,
  error: DEFAULT_ERROR_MESSAGE
}