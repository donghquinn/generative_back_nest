export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LogoutRequest {
  userUuid: string;
}

/**
 * uuid: user uuid
 * token: email Token
 * password: encoded Password
 */
export interface ClientLoginItem {
  uuid: string;
  token: string;
  password: string;
}

export interface ValidateKeyItem {
  email: string;
  token: string;
  password: string;
}

export interface ValidatePasswordKeyRequest {
  tempKey: string;
}

export interface ValidateKeyItem {
  email: string;
  password: string;
  token: string;
}


export interface SearchEmailRequest {
  name: string;
}

export interface SearchPasswordRequest {
  email: string;
  name: string;
}


export interface ChangePasswordRequest {
  email: string;
  password: string;
  newPassword: string;
}

export interface ChangeTitleRequest {
  email: string;
  title: string;
}
