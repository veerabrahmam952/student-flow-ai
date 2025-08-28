export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  course: string;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'graduated';
  gpa?: number;
  profileImage?: string;
}

export type StudentFormData = Omit<Student, 'id'>;