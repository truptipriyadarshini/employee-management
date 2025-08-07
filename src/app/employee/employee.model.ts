export interface Employee {
  id: number;
  name: string;
  department: string;
  email: string;
  dateOfJoining: string; // Use string because Angular handles date as ISO string
}
