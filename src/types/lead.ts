export interface Lead {
  id: string;
  platform: string;
  country: string;
  when: string;
  duration: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  city: string;
  category?: string;
  status?: string;
  assigned_group?: string;
  expected_next_call?: string;
  age_of_traveller?: number;
  profession?: string;
  traveller_type?: string;
  expected_budget?: string;
  person_interacting?: string;
}

export interface Interaction {
  id: string;
  timestamp: string;
  details: string;
  summary: string;
  who_interacted: string;
  next_action: string;
  duration: string;
}
