// Database types for Supabase
// These types match the database schema

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

// Database types (snake_case)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          role: string;
          hourly_rate: number;
          avatar_url: string | null;
          is_clocked_in: boolean;
          clock_in_time: string | null;
          current_project_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          role: string;
          hourly_rate: number;
          avatar_url?: string | null;
          is_clocked_in?: boolean;
          clock_in_time?: string | null;
          current_project_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          role?: string;
          hourly_rate?: number;
          avatar_url?: string | null;
          is_clocked_in?: boolean;
          clock_in_time?: string | null;
          current_project_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          name: string;
          address: string;
          type: string;
          status: string;
          start_date: string;
          end_date: string;
          budget: number;
          current_spend: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          address: string;
          type: string;
          status: string;
          start_date: string;
          end_date: string;
          budget: number;
          current_spend?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          address?: string;
          type?: string;
          status?: string;
          start_date?: string;
          end_date?: string;
          budget?: number;
          current_spend?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          project_id: string;
          assignee_id: string;
          due_date: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          project_id: string;
          assignee_id: string;
          due_date: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          project_id?: string;
          assignee_id?: string;
          due_date?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      time_logs: {
        Row: {
          id: string;
          user_id: string;
          project_id: string;
          clock_in: string;
          clock_out: string | null;
          duration_ms: number | null;
          cost: number | null;
          clock_in_location: Location | null;
          clock_out_location: Location | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          project_id: string;
          clock_in: string;
          clock_out?: string | null;
          duration_ms?: number | null;
          cost?: number | null;
          clock_in_location?: Location | null;
          clock_out_location?: Location | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          project_id?: string;
          clock_in?: string;
          clock_out?: string | null;
          duration_ms?: number | null;
          cost?: number | null;
          clock_in_location?: Location | null;
          clock_out_location?: Location | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      punch_list_items: {
        Row: {
          id: string;
          project_id: string;
          text: string;
          is_complete: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          text: string;
          is_complete?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          text?: string;
          is_complete?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      project_photos: {
        Row: {
          id: string;
          project_id: string;
          image_data_url: string;
          description: string;
          date_added: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          image_data_url: string;
          description: string;
          date_added?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          image_data_url?: string;
          description?: string;
          date_added?: string;
          created_at?: string;
        };
      };
    };
  };
}

