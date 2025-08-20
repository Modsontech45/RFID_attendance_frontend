// Terminology mapping based on organization type

import { useIntl as useLocalIntl } from "../context/IntlContext";
export interface TerminologyMap {
  admin: string;
  teacher: string;
  student: string;
  adminPlural: string;
  teacherPlural: string;
  studentPlural: string;
  add: string;
  company: string;
  management: string;
  studentloading: string;
  companymanagement: string;
  devicemanagement: string;
  deviceMonetization: string;
  monitordevice: string;
  allRegisteredWorkers: string;
  manageWorkers: string;
  workersAnalytics: string;
  male: string;
  female: string;
  monitorAttendance: string;
  loadingReports: string;
  companyInfo: string;
  companyName: string;
  loading: string;
  AddCoManager: string;
  coManagerEmail: string;
  coManager: string;
  receiveEmail: string;
  searchWorkers: string;
  workerUsername: string;
  teacherNotFound: string;
  goHome: string;
  deleteTeacher: string;
  warning: string;
  cancel: string;
  delete: string;
  joined: string;
  noBio: string;
  accessAccount: string;
  coWorkerLogin: string;
  note: string;
  workerDirectory: string;
  workerManagement: string;
  criteria: string;
  workerNotFound: string;
  noAttendanceRecords: string;
  workerPortal: string;
  workerBoard: string;


 }
export const getTerminology = (organizationType: string): TerminologyMap => {
   const { locale, } = useLocalIntl();
  if (organizationType === 'company' && locale === 'en') {
    return {
      workerBoard: 'Co-Manager or Teacher Board',
      workerPortal: 'Co-Manager or Teacher Portal',
      noAttendanceRecords: 'No attendance records found',
      workerNotFound: 'Worker not found',
      criteria: 'Try adjusting your search or filter criteria',
      workerDirectory: 'Worker Directory',
      workerManagement: 'View and monitor all registered employees in your institution',
      note: 'Only registered  co-managers can access this portal. Contact your administrator if you need assistance.',
      accessAccount: 'Enter your email address to access your account',
      coWorkerLogin: 'Co-Worker/Teacher Login',
      joined: 'Joined',
      noBio: 'No bio available.',
      cancel: 'Cancel',
      delete: 'Delete',
      warning: 'Are you sure you want to delete this co-manager? This action cannot be undone.',
      deleteTeacher: 'Delete Co-Manager',
      goHome: 'Go Home',
      teacherNotFound: 'Co-Manager not found',
      workerUsername: 'Worker Username (Not edited)',
      searchWorkers: 'Search Co-Managers',
      receiveEmail: 'The co-manager will receive an email invitation to join',
      coManager: 'Co-Manager Email Address',
      coManagerEmail: 'Enter the email address of the co-manager you want to add',
      AddCoManager: 'Add New Co-Manager',
      loading: 'Loading...',
      companyName: 'Company Name',
      companyInfo: 'Company Information',
      loadingReports: 'Loading Reports...',
      monitorAttendance: 'Monitor and analyze employee attendance with real-time insights and comprehensive reporting',
      workersAnalytics: 'Employee Attendance Analytics',
      male: 'Male employee',
      female: 'Female employee',
      manageWorkers: 'Manage and monitor your employee database with comprehensive tools',
      allRegisteredWorkers: 'All Registered Workers',
      monitordevice: 'Monitor your company\'s RFID scanning devices',
      deviceMonetization: 'Monitor and manage your company\'s RFID devices with real-time scanning capabilities',
      devicemanagement: 'Company Device Management',
      companymanagement: 'Company Management',
      studentloading: 'Loading Workers...',
      management: 'Management',
      company: 'Company',
      admin: 'Manager',
      teacher: 'Co-Manager',
      student: 'Worker',
      adminPlural: 'Managers',
      teacherPlural: 'Co-Managers',
      studentPlural: 'Workers',
      add: 'Add ',
    };
  }
  
  // Default to school terminology
  if (organizationType === 'school' && locale === 'en') {
    return {
      workerBoard: 'Co-Manager or Teacher Board',
      workerPortal: 'Co-Manager or Teacher Portal',
      noAttendanceRecords: 'No attendance records found',
      workerNotFound: 'Student not found',
      criteria: 'Try adjusting your search or filter criteria',
      workerDirectory: 'Worker Directory',
      workerManagement: 'View and monitor all registered employees in your institution',
      note: 'Only registered teacher members can access this portal. Contact your administrator if you need assistance.',
      accessAccount: 'Enter your email address to access your account',
      coWorkerLogin: 'Co-Worker/Teacher Login',
      joined: 'Joined',
      noBio: 'No bio available.',
      cancel: 'Cancel',
      delete: 'Delete',
      warning: 'Are you sure you want to delete this teacher? This action cannot be undone.',
      deleteTeacher: 'Delete Teacher',
      goHome: 'Go back',
      teacherNotFound: 'Teacher not found',
      workerUsername: 'Teacher Username (Not edited)',
      searchWorkers: 'Search Teachers',
      receiveEmail: 'The teacher will receive an email invitation to join',
      coManager: 'Teacher Email Address',
      coManagerEmail: 'Enter the email address of the teacher you want to add',
      AddCoManager: 'Add New Teacher',
      loading: 'Loading...',
      companyName: 'School Name',
      companyInfo: 'School Information',
      loadingReports: 'Loading Reports...',
      monitorAttendance: 'Monitor and analyze student attendance with real-time insights and comprehensive reporting',
      workersAnalytics: 'Student Attendance Analytics',
      male: 'Male student',
      female: 'Female student',
      manageWorkers: 'Manage and monitor your student database with comprehensive tools',
      allRegisteredWorkers: 'All Registered Students',
      monitordevice: 'Monitor your school\'s RFID scanning devices',
      deviceMonetization: 'Monitor and manage your school\'s RFID devices with real-time scanning capabilities',
      devicemanagement: 'School Device Management',
      companymanagement: 'School Management',
      studentloading: 'Loading Students...',
      management: 'Management',
      company: 'School',
      admin: 'Principal',
      teacher: 'Teacher',
      student: 'Student',
      adminPlural: 'Principals',
      teacherPlural: 'Teachers',
      studentPlural: 'Students',
      add: 'Add ',
    };
  }

  if (organizationType === 'school' && locale === 'fr') {
    return {
      workerBoard: 'Tableau des Co-Managers ou Professeurs',
      workerPortal: 'Portail des Co-Managers ou Professeurs',
      noAttendanceRecords: 'Aucun enregistrement de présence trouvé',
      workerNotFound: 'Étudiant non trouvé',
      criteria: 'Essayez d\'ajuster vos critères de recherche ou de filtrage',
      workerDirectory: 'Annuaire des étudiants',
      workerManagement: 'Voir et surveiller tous les étudiants enregistrés dans votre établissement',
      note: 'Seuls les membres enseignants enregistrés peuvent accéder à ce portail. Contactez votre administrateur si vous avez besoin d\'aide.',
      accessAccount: 'Entrez votre adresse e-mail pour accéder à votre compte',
      coWorkerLogin: 'Connexion Co-Worker/Professeur',
      joined: 'Rejoint',
      noBio: 'Aucune bio disponible.',
      cancel: 'Annuler',
      delete: 'Supprimer',
      warning: 'Êtes-vous sûr de vouloir supprimer ce professeur ? Cette action ne peut pas être inversée.',
      deleteTeacher: 'Supprimer le Professeur',
      goHome: 'Retourner',
      teacherNotFound: 'Professeur non trouvé',
      workerUsername: 'Nom d\'Utilisateur du Professeur (Non modifié)',
      searchWorkers: 'Rechercher des Professeurs',
      receiveEmail: 'Le professeur recevra une invitation par e-mail pour rejoindre',
      coManager: 'Adresse e-mail du professeur',
      coManagerEmail: 'Entrez l\'adresse e-mail du professeur que vous souhaitez ajouter',
      AddCoManager: 'Ajouter un Nouveau Professeur',
      loading: 'Chargement...',
      companyName: 'Nom de l\'École',
      companyInfo: 'Informations sur l\'École',
      loadingReports: 'Chargement des Rapports...',
      monitorAttendance: 'Surveillez et analysez la présence des étudiants avec des informations en temps réel et des rapports complets',
      workersAnalytics: 'Analyse de la Présence des Étudiants',
      male: 'Élève Masculin',
      female: 'Élève Féminin',
      manageWorkers: 'Gérer et surveiller votre base de données d\'étudiants avec des outils complets',
      allRegisteredWorkers: 'Tous les Étudiants Enregistrés',
      monitordevice: 'Surveillez les appareils de numérisation RFID de votre école',
      deviceMonetization: 'Surveillez et gérez les appareils RFID de votre école avec des capacités de numérisation en temps réel',
      devicemanagement: 'Gestion des Appareils Scolaires',
      companymanagement: 'Gestion de l\'École',
      studentloading: 'Chargement des Étudiants...',
      management: 'Gestion des',
      company: 'École',
      admin: 'Principal',
      teacher: 'Professeur',
      student: 'Étudiant',
      adminPlural: 'Principaux',
      teacherPlural: 'Professeurs',
      studentPlural: 'Étudiants',
      add: 'Ajouter ',
    };
  }
  if (organizationType === 'company' && locale === 'fr') {
    return {
      workerPortal: 'Portail des Co-Managers ou Professeurs',
      workerBoard: 'Tableau des Co-Managers ou Professeurs',
      noAttendanceRecords: 'Aucun enregistrement de présence trouvé',
      workerNotFound: 'Employé non trouvé',
      criteria: 'Essayez d\'ajuster vos critères de recherche ou de filtrage',
      workerDirectory: 'Annuaire des employés',
      workerManagement: 'Voir et surveiller tous les employés enregistrés dans votre établissement',
      note: 'Seuls les membres Co-Manager enregistrés peuvent accéder à ce portail. Contactez votre administrateur si vous avez besoin d\'aide.',
      accessAccount: 'Entrez votre adresse e-mail pour accéder à votre compte',
      coWorkerLogin: 'Connexion Co-Worker/Professeur',
      joined: 'Rejoint',
      noBio: 'Aucune bio disponible.',
      cancel: 'Annuler',
      delete: 'Supprimer',
      warning: 'Êtes-vous sûr de vouloir supprimer ce Co-Manager ? Cette action ne peut pas être inversée.',
      deleteTeacher: 'Supprimer le Co-Manager',
      goHome: 'Retourner',
      teacherNotFound: 'Co-Manager non trouvé',
      workerUsername: 'Nom d\'Utilisateur du Co-Manager (Non modifié)',
      searchWorkers: 'Rechercher des Co-Managers',
      receiveEmail: 'Le Co-manager recevra une invitation par e-mail pour rejoindre',
      coManager: 'Adresse e-mail du co-manager',
      coManagerEmail: 'Entrez l\'adresse e-mail du co-manager que vous souhaitez ajouter',
      AddCoManager: 'Ajouter un Nouveau Co-Manager',
      loading: 'Chargement...',
      companyName: 'Nom de l\'Entreprise',
      companyInfo: 'Informations sur l\'Entreprise',
      loadingReports: 'Chargement des Rapports...',
      monitorAttendance: 'Surveillez et analysez la présence des employés avec des informations en temps réel et des rapports complets',
      workersAnalytics: 'Analyse de la Présence des Employés',
      male: 'Employé Masculin',
      female: 'Employé Féminin',
      manageWorkers: 'Gérer et surveiller votre base de données d\'employés avec des outils complets',
      allRegisteredWorkers: 'Tous les Employés Enregistrés',
      monitordevice: 'Surveillez les appareils de numérisation RFID de votre entreprise',
      deviceMonetization: 'Surveillez et gérez les appareils RFID de votre entreprise avec des capacités de numérisation en temps réel',
      devicemanagement: 'Gestion des Appareils de l\'Entreprise',
      companymanagement: 'Gestion de l\'Entreprise',
      studentloading: 'Chargement des Employés...',
      management: 'Gestion des',
      company: 'Entreprise',
      admin: 'Manager',
      teacher: 'Co-Manager',
      student: 'Employé',
      adminPlural: 'Managers',
      teacherPlural: 'Co-Managers',
      studentPlural: 'Employés',
      add: 'Ajouter ',
    };
  }
  

  return {
    workerBoard: 'Co-Manager or Teacher Board',
    workerPortal: 'Co-Manager or Teacher Portal',
    noAttendanceRecords: 'No Attendance Records Found',
    workerNotFound: 'Student not found',
    criteria: 'Try adjusting your search or filter criteria',
    workerDirectory: 'Student Directory',
    workerManagement: 'View and monitor all registered students in your institution',
    note: 'Only registered teacher members can access this portal. Contact your administrator if you need assistance.',
    accessAccount: 'Enter your email address to access your account',
    coWorkerLogin: 'Co-Worker/Teacher Login',
    joined: 'Joined',
    noBio: 'No bio available.',
    cancel: 'Cancel',
    delete: 'Delete',
    warning: 'Are you sure you want to delete this teacher? This action cannot be undone.',
    deleteTeacher: 'Delete Teacher',
    goHome: 'Return',
    teacherNotFound: 'Teacher not found',
    workerUsername: 'Teacher Username (Not edited)',
    searchWorkers: 'Search Teachers',
    receiveEmail: 'The teacher will receive an email invitation to join',
    coManager: 'Teacher Email Address',
    coManagerEmail: 'Enter the email address of the teacher you want to add',
    AddCoManager: 'Add New Teacher',
    loading: 'Loading...',
    companyName: 'School Name',
    companyInfo: 'School Information',
    loadingReports: 'Loading Reports...',
    monitorAttendance: 'Monitor and analyze student attendance with real-time insights and comprehensive reporting',
    workersAnalytics: 'Student Attendance Analytics',
    male: 'Male student',
    female: 'Female student',
    manageWorkers: 'Manage and monitor your student database with comprehensive tools',
    allRegisteredWorkers: 'All Registered Students',
    monitordevice: 'Monitor your school\'s RFID scanning devices',
    deviceMonetization: 'Monitor and manage your school\'s RFID devices with real-time scanning capabilities',
    devicemanagement: 'School device management',
    companymanagement: 'School management',
    studentloading: 'Loading Students...',
    management: 'Management',
    company: 'School',
    admin: 'Principal',
    teacher: 'Teacher',
    student: 'Student',
    adminPlural: 'Principals',
    teacherPlural: 'Teachers',
    studentPlural: 'Students',
    add: 'Add ',
  };
};

export const useTerminology = (adminData: any): TerminologyMap => {
  const organizationType = adminData?.type || 'school';
  console.log('Using terminology for organization type:', organizationType);
  return getTerminology(organizationType);
};