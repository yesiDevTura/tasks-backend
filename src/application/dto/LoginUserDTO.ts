export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface LoginUserResponseDTO {
  id: string;
  username: string;
  email: string;
  token: string;
  message: string;
}
