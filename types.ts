export enum TaskStatus {
  ToDo = 'To Do',
  InProgress = 'In Progress',
  Done = 'Done',
}

export enum ProjectType {
  NewConstruction = "New Construction",
  Renovation = "Renovation",
  Demolition = "Demolition",
  InteriorFitOut = "Interior Fit-Out",
}

export interface Location {
  lat: number;
  lng: number;
}

export interface Company {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  isClockedIn: boolean;
  hourlyRate: number;
  clockInTime?: Date;
  currentProjectId?: string;
  companyId?: string;
}

export interface PunchListItem {
  id: string;
  text: string;
  isComplete: boolean;
}

export interface ProjectPhoto {
  id: string;
  imageDataUrl: string;
  description: string;
  dateAdded: Date;
}

export interface Project {
  id: string;
  name: string;
  address: string;
  type: ProjectType;
  status: 'In Progress' | 'Completed' | 'On Hold';
  startDate: Date;
  endDate: Date;
  budget: number;
  currentSpend: number;
  companyId?: string;
  punchList: PunchListItem[];
  photos: ProjectPhoto[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  assigneeId: string;
  dueDate: Date;
  status: TaskStatus;
}

export interface TimeLog {
  id: string;
  userId: string;
  projectId: string;
  clockIn: Date;
  clockOut?: Date;
  durationMs?: number;
  cost?: number;
  clockInLocation?: Location;
  clockOutLocation?: Location;
}
