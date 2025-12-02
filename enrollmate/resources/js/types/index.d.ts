import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    contact_number: string;
    address: string;
    email: string;
    email_verified_at: string;
    password?: string;
    role_name: string;
    role_id: number;
}

type UserFormData = {
  id?:number;
  first_name: string;
  last_name: string;
  contact_number: string;
  address: string;
  email: string;
  password: string;
  role_id:number;
  role:string;
  email_verified_at: string;
};


export interface RoomType {
    id: number;
    name: string;
}

export interface Room {
    id: number;
    name: string;
    size: string;
    view: string;
    room_type_id: number;
    room_type_name: string;
    sub_room_of: number;
    sub_room_of_name: string;
    capacity: number;
    price: number;
    description: string;
    featured: boolean;
    is_active:boolean;
    number_of_bed:number;
    attachments: (File | { id: number; file_path: string })[];
}

export interface ClassGroup {
    id: number;
    section_id: number;
    school_year_id: number;
    section_name: string;
    school_year_name: string;
    grade_level_name: string;
    section_and_level: string;
    student_limit: number;
    enrollments_count: number;
}

export interface ClassGroupFormData {
  id?: number;
  section_id: number;
  school_year_id: number;
}
