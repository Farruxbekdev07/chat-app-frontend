export interface UserFormData {
  password: string;
  fullName: string;
  username: string;
  email: string;
}

export interface AuthUser {
  displayName: string | null;
  accessToken?: string;
  username?: string;
  email: string;
  uid: string;
}
