export interface IUser {
  id: string;
  name: string;
  email: string;
  role: ERole;
  iat?: number;
  exp?: number;
}

export enum ERole {
  admin = "admin",
  manager = "manager",
  member = "member",
}
