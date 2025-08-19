export interface Employee {
  id: number;              // required for update/delete
  name: string;
  email: string;
  departmentId: number;    // used in add/edit dropdown
  dateOfJoining: string;
  departmentName?: string; // only for display (comes from API)
}
