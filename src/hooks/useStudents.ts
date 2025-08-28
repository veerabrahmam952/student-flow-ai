import { useState, useEffect } from 'react';
import { Student, StudentFormData } from '@/types/student';

const STORAGE_KEY = 'students-data';

// Mock initial data
const mockStudents: Student[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '+1234567890',
    dateOfBirth: '1995-05-15',
    address: '123 Main St, City, State 12345',
    course: 'Computer Science',
    enrollmentDate: '2023-09-01',
    status: 'active',
    gpa: 3.8,
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@email.com',
    phone: '+1234567891',
    dateOfBirth: '1996-08-22',
    address: '456 Oak Ave, City, State 12345',
    course: 'Business Administration',
    enrollmentDate: '2023-09-01',
    status: 'active',
    gpa: 3.9,
  },
  {
    id: '3',
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike.johnson@email.com',
    phone: '+1234567892',
    dateOfBirth: '1994-12-10',
    address: '789 Pine St, City, State 12345',
    course: 'Engineering',
    enrollmentDate: '2023-01-15',
    status: 'graduated',
    gpa: 3.7,
  },
];

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // Load students from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setStudents(JSON.parse(stored));
    } else {
      setStudents(mockStudents);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockStudents));
    }
    setLoading(false);
  }, []);

  // Save to localStorage whenever students change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    }
  }, [students, loading]);

  const addStudent = (studentData: StudentFormData): Student => {
    const newStudent: Student = {
      ...studentData,
      id: Date.now().toString(),
    };
    setStudents(prev => [...prev, newStudent]);
    return newStudent;
  };

  const updateStudent = (id: string, studentData: StudentFormData): Student | null => {
    const updatedStudent: Student = { ...studentData, id };
    setStudents(prev => 
      prev.map(student => 
        student.id === id ? updatedStudent : student
      )
    );
    return updatedStudent;
  };

  const deleteStudent = (id: string): boolean => {
    setStudents(prev => prev.filter(student => student.id !== id));
    return true;
  };

  const getStudent = (id: string): Student | undefined => {
    return students.find(student => student.id === id);
  };

  const getStats = () => {
    const total = students.length;
    const active = students.filter(s => s.status === 'active').length;
    const graduated = students.filter(s => s.status === 'graduated').length;
    const avgGpa = students.reduce((sum, s) => sum + (s.gpa || 0), 0) / total || 0;

    return {
      total,
      active,
      graduated,
      avgGpa: avgGpa.toFixed(2),
    };
  };

  return {
    students,
    loading,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudent,
    getStats,
  };
};