export interface RegisterUserDTO {
  username: string;
  email: string;
  password: string;
}

export interface RegisterUserResponseDTO {
  id: string;
  username: string;
  email: string;
  token: string;
  message: string;
}
