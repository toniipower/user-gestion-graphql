export interface Role {
  id: number;
  erole: string;
}

export interface Department {
  id: number;
  name: string;
}

export interface Employee {
  id: number;
  name: string;
  lastname: string;
  dni: string;
  email: string;
  role: Role;
  department: Department | null;
}