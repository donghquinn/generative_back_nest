import { ValidateError } from "@errors/validate.error";
import { Logger } from "@utilities/logger.util";
import { ChangePasswordRequest } from "types/user.types";
import { z } from "zod";

export const changePasswordValidator = async (request: ChangePasswordRequest) => {
  try {
    const scheme = z.object({ email: z.string(), password: z.string(), newPassword: z.string() });

    const parse = await scheme.parseAsync(request);

    return parse;
  } catch (error) {
    Logger.error('[PASSWORD] Change Password Validator Error: %o', {
      request,
      error: error instanceof Error ? error : new Error(JSON.stringify(error)),
    });

    throw new ValidateError(
      '[PASSWORD] Change Password Error',
      'Change Password Validator Error',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};
