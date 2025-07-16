export interface UserFormData {
  password: string;
  fullName: string;
  username: string;
  email: string;
}

export interface AuthUser {
  accessToken?: string;
  displayName: string;
  username?: string;
  email: string;
  uid: string;
}
