import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Project, Task, User, TimeLog, TaskStatus, Location, PunchListItem, ProjectPhoto, Company } from '../types';
import { supabase } from '../supabase/config';

interface DataContextType {
  companies: Company[];
  users: User[];
  projects: Project[];
  tasks: Task[];
  timeLogs: TimeLog[];
  currentUser: User | null;
  currentCompany: Company | null;
  setCurrentUser: (user: User | null) => void;
  setCurrentCompany: (company: Company | null) => void;
  addCompany: (name: string) => Promise<void>;
  addUser: (user: { name: string; role: string; hourlyRate: number; }) => Promise<void>;
  addProject: (project: Omit<Project, 'id' | 'currentSpend' | 'punchList' | 'photos'>) => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'status'>) => Promise<void>;
  updateTaskStatus: (taskId: string, status: TaskStatus) => Promise<void>;
  toggleClockInOut: (projectId?: string) => Promise<void>;
  addPunchListItem: (projectId: string, text: string) => Promise<void>;
  togglePunchListItem: (projectId: string, itemId: string) => Promise<void>;
  addPhoto: (projectId: string, imageDataUrl: string, description: string) => Promise<void>;
  currentLocation: Location | null;
  setCurrentLocation: (location: Location | null) => void;
  loading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);

  // Load data from Supabase on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load companies first
        const { data: companiesData } = await supabase.from('companies').select('*').order('created_at', { ascending: false });
        if (companiesData) {
          const convertedCompanies = companiesData.map(c => ({
            id: c.id,
            name: c.name,
          }));
          setCompanies(convertedCompanies);
          if (convertedCompanies.length > 0 && !currentCompany) {
            setCurrentCompany(convertedCompanies[0]);
          }
        }

        // Load users (will be filtered by company later if company is selected)
        const { data: usersData } = await supabase.from('users').select('*').order('created_at', { ascending: false });
        if (usersData) {
          const convertedUsers = usersData.map(u => ({
            id: u.id,
            name: u.name,
            role: u.role,
            avatarUrl: u.avatar_url || '',
            isClockedIn: u.is_clocked_in,
            hourlyRate: u.hourly_rate,
            clockInTime: u.clock_in_time ? new Date(u.clock_in_time) : undefined,
            currentProjectId: u.current_project_id || undefined,
            companyId: u.company_id || undefined,
          }));
          setUsers(convertedUsers);
          if (convertedUsers.length > 0) {
            setCurrentUser(convertedUsers[0]);
          }
        }

        // Load projects
        const { data: projectsData } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
        if (projectsData) {
          const { data: punchListData } = await supabase.from('punch_list_items').select('*');
          const { data: photosData } = await supabase.from('project_photos').select('*');
          
          const projectsWithRelations = projectsData.map(p => {
            const punchListItems = punchListData?.filter(item => item.project_id === p.id).map(item => ({
              id: item.id,
              text: item.text,
              isComplete: item.is_complete,
            })) || [];
            
            const photos = photosData?.filter(photo => photo.project_id === p.id).map(photo => ({
              id: photo.id,
              imageDataUrl: photo.image_data_url,
              description: photo.description,
              dateAdded: new Date(photo.date_added),
            })) || [];

            return {
              id: p.id,
              name: p.name,
              address: p.address,
              type: p.type as any,
              status: p.status as any,
              startDate: new Date(p.start_date),
              endDate: new Date(p.end_date),
              budget: p.budget,
              currentSpend: p.current_spend,
              companyId: p.company_id || undefined,
              punchList: punchListItems,
              photos,
            };
          });
          setProjects(projectsWithRelations);
        }

        // Load tasks
        const { data: tasksData } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
        if (tasksData) {
          const convertedTasks = tasksData.map(t => ({
            id: t.id,
            title: t.title,
            description: t.description || '',
            projectId: t.project_id,
            assigneeId: t.assignee_id,
            dueDate: new Date(t.due_date),
            status: t.status as TaskStatus,
          }));
          setTasks(convertedTasks);
        }

        // Load time logs
        const { data: timeLogsData } = await supabase.from('time_logs').select('*').order('clock_in', { ascending: false });
        if (timeLogsData) {
          const convertedTimeLogs = timeLogsData.map(l => ({
            id: l.id,
            userId: l.user_id,
            projectId: l.project_id,
            clockIn: new Date(l.clock_in),
            clockOut: l.clock_out ? new Date(l.clock_out) : undefined,
            durationMs: l.duration_ms || undefined,
            cost: l.cost || undefined,
            clockInLocation: l.clock_in_location as Location | undefined,
            clockOutLocation: l.clock_out_location as Location | undefined,
          }));
          setTimeLogs(convertedTimeLogs);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (users.length > 0 && !currentUser) {
      setCurrentUser(users[0]);
    }
    if (users.length === 0 && currentUser) {
      setCurrentUser(null);
    }
  }, [users, currentUser]);

  useEffect(() => {
    if (companies.length > 0 && !currentCompany) {
      setCurrentCompany(companies[0]);
    }
  }, [companies, currentCompany]);

  const addCompany = async (name: string) => {
    try {
      const { data, error } = await supabase.from('companies').insert({
        name,
      }).select().single();

      if (error) throw error;
      if (data) {
        const newCompany: Company = {
          id: data.id,
          name: data.name,
        };
        setCompanies(prev => [...prev, newCompany]);
        if (!currentCompany) {
          setCurrentCompany(newCompany);
        }
      }
    } catch (error) {
      console.error('Error adding company:', error);
    }
  };

  const addUser = async ({ name, role, hourlyRate }: { name: string; role: string; hourlyRate: number; }) => {
    if (!currentCompany) {
      console.error('No company selected. Please select or create a company first.');
      return;
    }

    try {
      const { data, error } = await supabase.from('users').insert({
        name,
        role,
        hourly_rate: hourlyRate,
        company_id: currentCompany.id,
        avatar_url: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2E5YTlhOSI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTguNjg1IDE5LjA5N0E5LjcyMyA5LjcyMyAwIDAwMjEuNzUgMTJjMC01LjM4NS00LjM2NS05Ljc1LTkuNzUtOS43NVMxLjI1IDYuNjE1IDEuMjUgMTJhOS43MjMgOS43MjMgMCAwMDMuMDY1IDcuMDk3QTkuNzE2IDkuNzE2IDAgMDAxMiAyMS43NWE5LjcxNiA5LjcxNiAwIDAwNi42ODUtMi42NTN6bS0xMi41NC0xLjI4NUE3LjQ4NiA3LjQ4NiAwIDAxMTIgMTVhNy40ODYgNy40ODYgMCAwMTUuODU1IDIuODEyQTguMjI0IDguMjI0IDAgMDExMiAyMC4yNWE4LjIyNCA4LjIyNCAwIDAxLTUuODU1LTIuNDM4ek0xNS43NSA5YTMuNzUgMy43NSAwIDExLTcuNSAwIDMuNzUgMy43NSAwIDAxNy41IDB6IiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIC8+PC9zdmc+`,
        is_clocked_in: false,
      }).select().single();

      if (error) throw error;
      if (data) {
        const newUser: User = {
          id: data.id,
          name: data.name,
          role: data.role,
          avatarUrl: data.avatar_url || '',
          isClockedIn: data.is_clocked_in,
          hourlyRate: data.hourly_rate,
          companyId: data.company_id,
        };
        setUsers(prev => [...prev, newUser]);
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const addProject = async (projectData: Omit<Project, 'id' | 'currentSpend' | 'punchList' | 'photos'>) => {
    if (!currentCompany) {
      console.error('No company selected. Please select or create a company first.');
      return;
    }

    try {
      const { data, error } = await supabase.from('projects').insert({
        name: projectData.name,
        address: projectData.address,
        type: projectData.type,
        status: projectData.status,
        start_date: projectData.startDate.toISOString().split('T')[0],
        end_date: projectData.endDate.toISOString().split('T')[0],
        budget: projectData.budget,
        company_id: currentCompany.id,
        current_spend: 0,
      }).select().single();

      if (error) throw error;
      if (data) {
        const newProject: Project = {
          id: data.id,
          name: data.name,
          address: data.address,
          type: data.type as any,
          status: data.status as any,
          startDate: new Date(data.start_date),
          endDate: new Date(data.end_date),
          budget: data.budget,
          currentSpend: data.current_spend,
          companyId: data.company_id,
          punchList: [],
          photos: [],
        };
        setProjects(prev => [...prev, newProject]);
      }
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'status'>) => {
    try {
      const { data, error } = await supabase.from('tasks').insert({
        title: taskData.title,
        description: taskData.description,
        project_id: taskData.projectId,
        assignee_id: taskData.assigneeId || null,
        due_date: taskData.dueDate.toISOString().split('T')[0],
        status: TaskStatus.ToDo,
      }).select().single();

      if (error) throw error;
      if (data) {
        const newTask: Task = {
          id: data.id,
          title: data.title,
          description: data.description || '',
          projectId: data.project_id,
          assigneeId: data.assignee_id,
          dueDate: new Date(data.due_date),
          status: TaskStatus.ToDo,
        };
        setTasks(prev => [...prev, newTask]);
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const updateTaskStatus = async (taskId: string, status: TaskStatus) => {
    try {
      const { error } = await supabase.from('tasks').update({ status }).eq('id', taskId);
      if (error) throw error;
      setTasks(prev => prev.map(task => task.id === taskId ? { ...task, status } : task));
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const toggleClockInOut = async (projectId?: string) => {
    if (!currentUser) return;

    const getCurrentLocation = (): Promise<Location | undefined> => {
      return new Promise((resolve) => {
        if (!navigator.geolocation) { resolve(undefined); }
        navigator.geolocation.getCurrentPosition(
          (position) => resolve({ lat: position.coords.latitude, lng: position.coords.longitude }),
          () => resolve(undefined)
        );
      });
    };

    if (currentUser.isClockedIn) {
      getCurrentLocation().then(async (location) => {
        const clockInTime = currentUser.clockInTime;
        if (!clockInTime) return;
        const existingLogIndex = timeLogs.findIndex(log => log.userId === currentUser.id && !log.clockOut);
        if (existingLogIndex === -1) return;

        const now = new Date();
        const durationMs = now.getTime() - clockInTime.getTime();
        const hoursWorked = durationMs / (1000 * 60 * 60);
        const cost = hoursWorked * currentUser.hourlyRate;

        const logToUpdate = timeLogs[existingLogIndex];
        const { error } = await supabase.from('time_logs').update({
          clock_out: now.toISOString(),
          duration_ms: durationMs,
          cost,
          clock_out_location: location,
        }).eq('id', logToUpdate.id);

        if (error) {
          console.error('Error updating time log:', error);
          return;
        }

        const updatedLog: TimeLog = { ...logToUpdate, clockOut: now, durationMs, cost, clockOutLocation: location };
        const newTimeLogs = [...timeLogs];
        newTimeLogs[existingLogIndex] = updatedLog;

        setTimeLogs(newTimeLogs.sort((a, b) => b.clockIn.getTime() - a.clockIn.getTime()));

        const updatedUser = { ...currentUser, isClockedIn: false, clockInTime: undefined, currentProjectId: undefined };
        setCurrentUser(updatedUser);
        setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));

        // Update user in database
        await supabase.from('users').update({
          is_clocked_in: false,
          clock_in_time: null,
          current_project_id: null,
        }).eq('id', currentUser.id);

        // Update project's current spend
        const clockedOutProjectId = timeLogs[existingLogIndex].projectId;
        const project = projects.find(p => p.id === clockedOutProjectId);
        if (project) {
          const newSpend = project.currentSpend + cost;
          await supabase.from('projects').update({ current_spend: newSpend }).eq('id', clockedOutProjectId);
          setProjects(prev => prev.map(p => p.id === clockedOutProjectId ? { ...p, currentSpend: newSpend } : p));
        }
      });
    } else {
      if (!projectId) return;
      getCurrentLocation().then(async (location) => {
        const clockInTime = new Date();
        const updatedUser = { ...currentUser, isClockedIn: true, clockInTime, currentProjectId: projectId };

        const { data, error } = await supabase.from('time_logs').insert({
          user_id: currentUser.id,
          project_id: projectId,
          clock_in: clockInTime.toISOString(),
          clock_in_location: location,
        }).select().single();

        if (error) {
          console.error('Error creating time log:', error);
          return;
        }

        if (data) {
          const newLog: TimeLog = {
            id: data.id,
            userId: data.user_id,
            projectId: data.project_id,
            clockIn: new Date(data.clock_in),
            clockInLocation: data.clock_in_location as Location,
          };
          setTimeLogs(prev => [newLog, ...prev]);
        }

        setCurrentUser(updatedUser);
        setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));

        // Update user in database
        await supabase.from('users').update({
          is_clocked_in: true,
          clock_in_time: clockInTime.toISOString(),
          current_project_id: projectId,
        }).eq('id', currentUser.id);
      });
    }
  };

  const addPunchListItem = async (projectId: string, text: string) => {
    try {
      const { data, error } = await supabase.from('punch_list_items').insert({
        project_id: projectId,
        text,
        is_complete: false,
      }).select().single();

      if (error) throw error;
      if (data) {
        const newItem: PunchListItem = {
          id: data.id,
          text: data.text,
          isComplete: data.is_complete,
        };
        setProjects(prev => prev.map(p => p.id === projectId ? { ...p, punchList: [...p.punchList, newItem] } : p));
      }
    } catch (error) {
      console.error('Error adding punch list item:', error);
    }
  };

  const togglePunchListItem = async (projectId: string, itemId: string) => {
    try {
      const item = projects.find(p => p.id === projectId)?.punchList.find(i => i.id === itemId);
      if (!item) return;

      const { error } = await supabase.from('punch_list_items').update({
        is_complete: !item.isComplete,
      }).eq('id', itemId);

      if (error) throw error;
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, punchList: p.punchList.map(i => i.id === itemId ? { ...i, isComplete: !i.isComplete } : i) } : p));
    } catch (error) {
      console.error('Error toggling punch list item:', error);
    }
  };

  const addPhoto = async (projectId: string, imageDataUrl: string, description: string) => {
    try {
      const { data, error } = await supabase.from('project_photos').insert({
        project_id: projectId,
        image_data_url: imageDataUrl,
        description,
        date_added: new Date().toISOString(),
      }).select().single();

      if (error) throw error;
      if (data) {
        const newPhoto: ProjectPhoto = {
          id: data.id,
          imageDataUrl: data.image_data_url,
          description: data.description,
          dateAdded: new Date(data.date_added),
        };
        setProjects(prev => prev.map(p => p.id === projectId ? { ...p, photos: [newPhoto, ...p.photos] } : p));
      }
    } catch (error) {
      console.error('Error adding photo:', error);
    }
  };

  const value = { companies, currentCompany, setCurrentCompany, addCompany, users, projects, tasks, timeLogs, currentUser, setCurrentUser, addUser, addProject, addTask, updateTaskStatus, toggleClockInOut, addPunchListItem, togglePunchListItem, addPhoto, currentLocation, setCurrentLocation, loading };

  return React.createElement(DataContext.Provider, { value }, children);
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) { throw new Error('useData must be used within a DataProvider'); }
  return context;
};
