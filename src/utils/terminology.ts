// Terminology mapping based on organization type
export interface TerminologyMap {
  admin: string;
  teacher: string;
  student: string;
  adminPlural: string;
  teacherPlural: string;
  studentPlural: string;
}

export const getTerminology = (organizationType: string): TerminologyMap => {
  if (organizationType === 'company') {
    return {
      admin: 'Manager',
      teacher: 'Co-Manager',
      student: 'Worker',
      adminPlural: 'Managers',
      teacherPlural: 'Co-Managers',
      studentPlural: 'Workers',
    };
  }
  
  // Default to school terminology
  return {
    admin: 'Principal',
    teacher: 'Teacher',
    student: 'Student',
    adminPlural: 'Principals',
    teacherPlural: 'Teachers',
    studentPlural: 'Students',
  };
};

export const useTerminology = (adminData: any): TerminologyMap => {
  const organizationType = adminData?.type || 'school';
  return getTerminology(organizationType);
};