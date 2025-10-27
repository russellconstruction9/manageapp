import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
// FIX: Added PunchListItem and ProjectPhoto to imports to support new features.
import { Project, Task, User, TimeLog, TaskStatus, Location, PunchListItem, ProjectPhoto } from '../types';

interface DataContextType {
  users: User[];
  projects: Project[];
  tasks: Task[];
  timeLogs: TimeLog[];
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  // FIX: Updated addUser to include hourlyRate, matching the User type.
  addUser: (user: { name: string; role: string; hourlyRate: number; }) => void;
  // FIX: Updated addProject to reflect that punchList and photos are initialized internally.
  addProject: (project: Omit<Project, 'id' | 'currentSpend' | 'punchList' | 'photos'>) => void;
  addTask: (task: Omit<Task, 'id' | 'status'>) => void;
  updateTaskStatus: (taskId: number, status: TaskStatus) => void;
  toggleClockInOut: (projectId?: number) => void;
  addPunchListItem: (projectId: number, text: string) => void;
  togglePunchListItem: (projectId: number, itemId: number) => void;
  addPhoto: (projectId: number, imageDataUrl: string, description: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (users.length > 0 && !currentUser) {
        setCurrentUser(users[0]);
    }
    if (users.length === 0 && currentUser) {
        setCurrentUser(null);
    }
  }, [users, currentUser]);

  // FIX: Added hourlyRate to function signature and newUser object to resolve the type error.
  const addUser = ({ name, role, hourlyRate }: { name: string; role: string; hourlyRate: number; }) => {
    const newUser: User = {
      id: Math.max(0, ...users.map(u => u.id)) + 1,
      name,
      role,
      hourlyRate,
      avatarUrl: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2E5YTlhOSI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTguNjg1IDE5LjA5N0E5LjcyMyA5LjcyMyAwIDAwMjEuNzUgMTJjMC01LjM4NS00LjM2NS05Ljc1LTkuNzUtOS43NVMxLjI1IDYuNjE1IDEuMjUgMTJhOS43MjMgOS43MjMgMCAwMDMuMDY1IDcuMDk3QTkuNzE2IDkuNzE2IDAgMDAxMiAyMS43NWE5LjcxNiA5LjcxNiAwIDAwNi42ODUtMi42NTN6bS0xMi41NC0xLjI4NUE3LjQ4NiA3LjQ4NiAwIDAxMTIgMTVhNy40ODYgNy40ODYgMCAwMTUuODU1IDIuODEyQTguMjI0IDguMjI0IDAgMDExMiAyMC4yNWE4LjIyNCA4LjIyNCAwIDAxLTUuODU1LTIuNDM4ek0xNS43NSA5YTMuNzUgMy43NSAwIDExLTcuNSAwIDMuNzUgMy43NSAwIDAxNy41IDB6IiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIC8+PC9zdmc+`,
      isClockedIn: false,
    };
    setUsers(prev => [...prev, newUser]);
  };

  // FIX: Initialized punchList and photos to fix a silent type error where new projects were missing required properties.
  const addProject = (projectData: Omit<Project, 'id' | 'currentSpend' | 'punchList' | 'photos'>) => {
    const newProject: Project = {
        ...projectData,
        id: Math.max(0, ...projects.map(p => p.id)) + 1,
        currentSpend: 0,
        punchList: [],
        photos: [],
    };
    setProjects(prev => [...prev, newProject]);
  };

  const addTask = (taskData: Omit<Task, 'id' | 'status'>) => {
    const newTask: Task = {
        ...taskData,
        id: Math.max(0, ...tasks.map(t => t.id)) + 1,
        status: TaskStatus.ToDo,
    };
    setTasks(prev => [...prev, newTask]);
  }

  const updateTaskStatus = (taskId: number, status: TaskStatus) => {
    setTasks(prev => prev.map(task => task.id === taskId ? { ...task, status } : task));
  };

  const toggleClockInOut = (projectId?: number) => {
    if (!currentUser) return;

    const getCurrentLocation = (): Promise<Location | undefined> => {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                resolve(undefined);
            }
            navigator.geolocation.getCurrentPosition(
                (position) => resolve({ lat: position.coords.latitude, lng: position.coords.longitude }),
                () => resolve(undefined) // Handle error or permission denial
            );
        });
    };


    if (currentUser.isClockedIn) {
      // Clocking out
      const clockInTime = currentUser.clockInTime;
      if (!clockInTime) return;
      
      const existingLogIndex = timeLogs.findIndex(log => log.userId === currentUser.id && !log.clockOut);

      if (existingLogIndex === -1) return; // Should not happen if user is clocked in

      getCurrentLocation().then(location => {
          const now = new Date();
          const durationMs = now.getTime() - clockInTime.getTime();
          // FIX: Added cost calculation and project spend update based on user's hourly rate.
          const hoursWorked = durationMs / (1000 * 60 * 60);
          const cost = hoursWorked * currentUser.hourlyRate;
          
          const updatedLog: TimeLog = {
            ...timeLogs[existingLogIndex],
            clockOut: now,
            durationMs,
            cost,
            clockOutLocation: location,
          };
          
          const newTimeLogs = [...timeLogs];
          newTimeLogs[existingLogIndex] = updatedLog;

          setTimeLogs(newTimeLogs.sort((a, b) => b.clockIn.getTime() - a.clockIn.getTime()));
          
          const updatedUser = { ...currentUser, isClockedIn: false, clockInTime: undefined, currentProjectId: undefined };
          setCurrentUser(updatedUser);
          setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));

          // Update project's current spend
          const clockedOutProjectId = timeLogs[existingLogIndex].projectId;
          setProjects(prev => prev.map(p => 
              p.id === clockedOutProjectId 
              ? { ...p, currentSpend: p.currentSpend + cost }
              : p
          ));
      });

    } else {
      // Clocking in
      if (!projectId) return;
      
      getCurrentLocation().then(location => {
          const clockInTime = new Date();
          const updatedUser = { ...currentUser, isClockedIn: true, clockInTime, currentProjectId: projectId };
          
          const newLog: TimeLog = {
            id: Math.max(0, ...timeLogs.map(l => l.id)) + 1,
            userId: currentUser.id,
            projectId: projectId,
            clockIn: clockInTime,
            clockInLocation: location
          };
          setTimeLogs(prev => [newLog, ...prev]);

          setCurrentUser(updatedUser);
          setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
      });
    }
  };

  const addPunchListItem = (projectId: number, text: string) => {
    setProjects(prevProjects => {
      return prevProjects.map(p => {
        if (p.id === projectId) {
          const newItem: PunchListItem = {
            id: Math.max(0, ...p.punchList.map(item => item.id)) + 1,
            text,
            isComplete: false,
          };
          return { ...p, punchList: [...p.punchList, newItem] };
        }
        return p;
      });
    });
  };

  const togglePunchListItem = (projectId: number, itemId: number) => {
    setProjects(prevProjects => {
      return prevProjects.map(p => {
        if (p.id === projectId) {
          const updatedPunchList = p.punchList.map(item =>
            item.id === itemId ? { ...item, isComplete: !item.isComplete } : item
          );
          return { ...p, punchList: updatedPunchList };
        }
        return p;
      });
    });
  };

  const addPhoto = (projectId: number, imageDataUrl: string, description: string) => {
    setProjects(prevProjects => {
      return prevProjects.map(p => {
        if (p.id === projectId) {
          const newPhoto: ProjectPhoto = {
            id: Math.max(0, ...p.photos.map(photo => photo.id)) + 1,
            imageDataUrl,
            description,
            dateAdded: new Date(),
          };
          // Add to the beginning of the array to show newest first
          return { ...p, photos: [newPhoto, ...p.photos] };
        }
        return p;
      });
    });
  };


  const value = {
    users,
    projects,
    tasks,
    timeLogs,
    currentUser,
    setCurrentUser,
    addUser,
    addProject,
    addTask,
    updateTaskStatus,
    toggleClockInOut,
    addPunchListItem,
    togglePunchListItem,
    addPhoto,
  };

  return React.createElement(DataContext.Provider, { value }, children);
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
