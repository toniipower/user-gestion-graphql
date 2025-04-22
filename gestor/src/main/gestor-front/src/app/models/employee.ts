import { Role } from './role';

export interface Employee {
  id: number;
  name: string;
  lastName: string;
  dni: string;
  address: string;
  departmentId: number;
  role: Role;
}