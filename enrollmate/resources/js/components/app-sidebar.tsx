import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarMenuSub,
} from '@/components/ui/sidebar';
import { Link, usePage } from '@inertiajs/react';
import {
  LayoutGrid, FileSpreadsheet, ListPlus, BookUp2, Layers,
  NotebookText, School, ContactRound, CalendarDays, User, FileUser, UserPlus, BookCheck, ChevronRight,
  GraduationCap,
  Folder,
  ArrowUp01,
  UserRound,
  UserRoundX,
  UserRoundPlus,
  UserStar
} from 'lucide-react';
import AppLogo from './app-logo';
import { type NavItem } from '@/types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

// ------------------- ROLE CONFIGS -------------------
type SidebarConfig = {
  dashboard: NavItem[];
  student?: NavItem[]; // optional
  class?: NavItem[];
  school?: NavItem[];  // optional
  footer?: NavItem[];
};

const adminSidebar: SidebarConfig = {
  dashboard: [
    { title: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
    { title: "Grades", href: "/admin/grades", icon: FileSpreadsheet },
    { title: "Top Students", href: "/admin/top-students", icon: ArrowUp01 },
    { title: "Alumni", href: "/admin/alumnis", icon: GraduationCap },
  ],
  student: [
    { title: "Enrollment", href: "/admin/enrollments", icon: ListPlus },
    { title: "Applicants", href: "/admin/applicants", icon: BookUp2 },
    { title: "Students", href: "/admin/students", icon: UserRound },
    { title: "Special Students", href: "/admin/specialStudentsIndex", icon: UserStar },
    { title: "Graduates", href: "/admin/graduates", icon: GraduationCap },
  ],
  class: [
    { title: "Subjects", href: "/admin/subjects", icon: NotebookText },
    { title: "Class Groups", href: "/admin/classgroups", icon: School },
    { title: "Sections", href: "/admin/sections", icon: Layers },
    { title: "Grade Levels", href: "/admin/gradelevels", icon: BookUp2 },
  ],
  school: [
    { title: "Teachers", href: "/admin/teachers", icon: ContactRound },
    { title: "School Years", href: "/admin/schoolyears", icon: CalendarDays },
    { title: "Users", href: "/admin/users", icon: User },
    { title: "School Settings", href: "/admin/settings", icon: School },
  ],
  footer: [
    { title: "Login Activities", href: "/admin/login-info", icon: FileUser },
  ],
};

const teacherSidebar: SidebarConfig = {
  dashboard: [
    { title: "Dashboard", href: "/teacher/dashboard", icon: LayoutGrid },
  ],
  class: [
    { title: "My Students", href: "/teacher/grades", icon: GraduationCap },
    { title: "My Subjects", href: "/teacher/subjects", icon: NotebookText },
    { title: "My Class", href: "/teacher/classgroupsubjects", icon: Folder },
  ],
  footer: [],
};


// ------------------- SIDEBAR COMPONENT -------------------
export function AppSidebar() {
  const { auth } = usePage().props as any;
  const role = auth?.user?.roles?.[0]?.name ?? null;

  const sidebarConfig = role === "admin" ? adminSidebar : teacherSidebar;

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      {/* HEADER */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="#" prefetch>
                <div className='flex gap-2 items-end'>
                    <AppLogo />
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* MAIN CONTENT */}
      <SidebarContent>
        {/* Dashboard always */}
        <NavMain items={sidebarConfig.dashboard} />

        {/* Student Section (only for admin) */}
        {sidebarConfig.student && (
          <SidebarGroup className="px-2 py-0"> 
            <SidebarGroupLabel>Student</SidebarGroupLabel> 
            <SidebarMenu> 
              <Collapsible defaultOpen className="group/collapsible"> 
                <SidebarMenuItem> 
                  <CollapsibleTrigger asChild> 
                    <SidebarMenuButton> 
                      <UserPlus /> 
                      <span>Admissions</span> 
                      <ChevronRight className="ml-auto size-4 transition-transform duration-100 group-data-[state=open]/collapsible:rotate-90" /> 
                    </SidebarMenuButton> 
                  </CollapsibleTrigger> 
                  
                  <CollapsibleContent> 
                    <SidebarMenuSub> 
                      <NavMain items={sidebarConfig.student} />
                    </SidebarMenuSub> 
                  </CollapsibleContent> 
                </SidebarMenuItem> 
              </Collapsible> 
            </SidebarMenu> 
          </SidebarGroup>
        )}

        {/* Class Section */}
        {sidebarConfig.class && (
          <SidebarGroup className="px-2 py-0"> 
            <SidebarGroupLabel>Class</SidebarGroupLabel> 
            <SidebarMenu> 
              <Collapsible defaultOpen className="group/collapsible"> 
                <SidebarMenuItem> 
                  <CollapsibleTrigger asChild> 
                    <SidebarMenuButton> 
                      <BookCheck /> 
                      <span>Academic Structure</span> 
                      <ChevronRight className="ml-auto size-4 transition-transform duration-100 group-data-[state=open]/collapsible:rotate-90" /> 
                    </SidebarMenuButton> 
                  </CollapsibleTrigger> 
                  
                  <CollapsibleContent> 
                    <SidebarMenuSub> 
                      <NavMain items={sidebarConfig.class} />
                    </SidebarMenuSub> 
                  </CollapsibleContent> 
                </SidebarMenuItem> 
              </Collapsible> 
            </SidebarMenu> 
          </SidebarGroup>
        )}

        {/* School Section (only for admin) */}
        {sidebarConfig.school && (
          <SidebarGroup className="px-2 py-0"> 
            <SidebarGroupLabel>School</SidebarGroupLabel> 
            <SidebarMenu> 
              <Collapsible defaultOpen className="group/collapsible"> 
                <SidebarMenuItem> 
                  <CollapsibleTrigger asChild> 
                    <SidebarMenuButton> 
                      <School /> 
                      <span>Administration</span> 
                      <ChevronRight className="ml-auto size-4 transition-transform duration-100 group-data-[state=open]/collapsible:rotate-90" /> 
                    </SidebarMenuButton> 
                  </CollapsibleTrigger> 
                  
                  <CollapsibleContent> 
                    <SidebarMenuSub> 
                      <NavMain items={sidebarConfig.school} />
                    </SidebarMenuSub> 
                  </CollapsibleContent> 
                </SidebarMenuItem> 
              </Collapsible> 
            </SidebarMenu> 
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter>
        {sidebarConfig.footer && <NavFooter items={sidebarConfig.footer} />}
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
