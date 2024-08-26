import { WeekDay } from "@prisma/client";

export interface Hospital {
  id: number;
  name: string;
  address: string;
  phone_number: string;
  state: {
    id: number;
    name: string;
  };
  stateId: number;
  tier: {
    id: number;
    name: string;
  };
  tierId: number;
  type: {
    id: number;
    name: string;
  };
  typeId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface State {
  id: number;
  name: string;
}

export interface Tier {
  id: number;
  name: string;
}

export interface Type {
  id: number;
  name: string;
}

export interface DropDownOptions {
  states: State[];
  types: Type[];
  tiers: Tier[];
}

export interface PopoverProps {
  hospital: Hospital;
  onClose: () => void;
  onSave: (hospital: Hospital) => void;
  options: DropDownOptions;
}

export interface AvailableSlot {
  id: string;
  day: WeekDay;
  startTime: string;
  endTime: string;
}

export interface User {
  id: string;
  name: string | null;
  email: string;
  role: "HOD" | "STUDENT"; // Assuming "HOD" and "STUDENT" are the possible roles
  matricNo?: string | null; // Only applicable to students
  department: string;
  createdAt: Date;
  updatedAt: Date;
}
