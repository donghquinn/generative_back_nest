import { Body, Controller, Post } from '@nestjs/common';
import { searchEmailRequestValidator, searchPasswordRequestValidator, validatePasswordTempKeyRequestValidator } from '@validators/users/search.validator';
import { changePasswordValidator } from '@validators/users/user.validator';
import { SetErrorResponse, SetResponse } from 'dto/response.dto';
import { UserProvider } from 'providers/users/users.pvd';
import { ChangePasswordRequest, LoginRequest, SearchEmailRequest, SearchPasswordRequest, SignupRequest, ValidatePasswordKeyRequest } from 'types/user.types';
import { loginRequestValidator } from 'validators/users/login.validators';
import { signupValidator } from 'validators/users/signup.validators';

@Controller('users')
export class userController {
  constructor(private readonly account: UserProvider) {}

  @Post('/signup')
  async signupController(@Body() request: SignupRequest) {
    try {
      const { email, name, password } = await signupValidator(request);

      const result = await this.account.checkExistingEmailAndCreateUser(email, name, password);

      return new SetResponse(200, { result });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }

  @Post('/login')
  async loginController(@Body() request: LoginRequest) {
    try {
      const { email, password } = await loginRequestValidator(request);

      const result = await this.account.login(email, password);

      return new SetResponse(200, { result });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }

  @Post('/logout')
  async logoutController(@Body() request: LoginRequest) {
    try {
      const { email, password } = await loginRequestValidator(request);

      const result = await this.account.login(email, password);

      return new SetResponse(200, { result });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }
  @Post('search/email')
  async searchEmailController(@Body() request: SearchEmailRequest) {
    try {
      const { name } = await searchEmailRequestValidator(request);

      const email = await this.account.searchEmail(name);

      return new SetResponse(200, { email });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }

  @Post('search/password')
  async searchPasswordController(@Body() request: SearchPasswordRequest) {
    try {
      const { name, email } = await searchPasswordRequestValidator(request);

      const message = await this.account.searchPassword(email, name);

      return new SetResponse(200, { message });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }

  @Post('search/password/validate')
  async validatePasswordTempKeyController(@Body() request: ValidatePasswordKeyRequest) {
    try {
      const { tempKey } = await validatePasswordTempKeyRequestValidator(request);

      const message = await this.account.validateSearchingPasswordKey(tempKey);

      return new SetResponse(200, { message });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }

  @Post('change/password')
  async changePasswordController(@Body() request: ChangePasswordRequest) {
    try {
      const { password, email, newPassword } = await changePasswordValidator(request);

      const message = await this.account.changePassword(email, password, newPassword);

      return new SetResponse(200, { message });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }
}
