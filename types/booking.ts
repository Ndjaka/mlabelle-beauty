// Shared TypeScript types for booking domain

export interface TimeRange {
  start: Date;
  end: Date;
}

export interface CreateBookingInput {
  service_id: string;
  client_name: string;
  client_email: string;
  client_phone?: string;
  starts_at: Date;
}

export interface BookingResult {
  success: boolean;
  bookingId?: string;
  cancelToken?: string;
  error?: string;
}

export interface BookingWithService {
  id: string;
  client_name: string;
  client_email: string;
  client_phone?: string;
  starts_at: string;
  ends_at: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  cancel_token: string;
  service: {
    name: string;
    duration_minutes: number;
    price_cents: number;
  };
}

export interface BookingStats {
  monthly_revenue_cents: number;
  monthly_bookings_count: number;
  pending_bookings_count: number;
  weekly_fill_rate: number;
}
