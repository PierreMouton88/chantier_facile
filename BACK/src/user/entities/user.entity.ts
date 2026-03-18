import { userRole as Role } from '../enum/role.enum';

export class User {
  id: number;
  email: string;
  password: string;
  role: Role;
  created_at: Date;
  updated_at: Date;

  //Relations can be added here in the future
}
