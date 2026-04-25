// Shared TypeScript types for schedule domain

export interface ScheduleRule {
  id: string;
  day_of_week: number;
  open_time: string;
  close_time: string;
  is_active: boolean;
}

export interface DayOff {
  id: string;
  date: string;
  reason?: string;
}
