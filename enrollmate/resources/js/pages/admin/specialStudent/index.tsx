import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { BookUp2, List, ListTodo } from 'lucide-react';
import * as React from "react"
import { ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState, } from "@tanstack/react-table"
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import TableToolbar from '@/components/table/TableToolbar';
import { useState } from 'react';
import RoomTable from '@/components/table/RoomTable';
import { getColumns } from './Components/studentColumns';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import Heading from '@/components/heading';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Button } from '@/components/ui/button';
import CreateEnrollmentDialog from './Components/CreateEnrollmentDialog';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Label } from '@/components/ui/label';


const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Students',
    href: '/students',
  },
];

type ClassGroup = {
  id: number;
  section: {
    id: number;
    name: string;
    grade_level: {
      id: number;
      name: string;
    };
    is_special: boolean;
  };
  school_year: {
    id: number;
    name: string;
  };
};

type Student = {
  id: number;
  user_id: number;
  applicant_id: number;

  lrn: string;
  full_name: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  suffix: string;

  email: string;
  address: string;
  contact_number: string;
  gender: string;
  birthdate: string;

  current_class_name:string;

  latest_enrollment: {
    id: number;
    student_id:number;
    class_group_id:number;

    status:string;
    enrolled_at:string;
  };
};

type GradeLevel ={
  id: number;
  name: string;
};

type Section ={
  id: number;
  name: string;
  grade_level: GradeLevel;
};


type StudentIndexProps = {
  regularStudents: Student[]; // Regular Students
  students: Student[];
  classGroups: ClassGroup[];
  specialClassGroups: ClassGroup[];
  selectedLevel: string;
  selectedSection: string;
  sections: Section[];
  gradeLevels: GradeLevel[];
  selectedGender: string;
};

const StudentIndex = ({regularStudents, students , classGroups,specialClassGroups, selectedGender,sections,selectedLevel,selectedSection,gradeLevels }: StudentIndexProps) => {

  const { delete: destroy } = useForm<Student>();

  const handleDelete = (id: number) => {
    destroy(route('admin.students.destroy', id));
    toast.success("Row deleted successfully!");
  };

  const handleDeleteSelected = () => {
      const selectedIds = table.getSelectedRowModel().rows.map(row => row.original.id);

      if (selectedIds.length === 0) {
          alert("No items selected.");
          return;
      }

      router.post(route("admin.students.bulkDelete"), {
        ids: selectedIds,
      });

      toast.success("Selected Rows Deleted Succesfully!");
  };

  const columns = getColumns({classGroups, handleDelete })

  const [sorting, setSorting] = useState<SortingState>([{ id: "id", desc: false }])
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 100, });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const table = useReactTable({
    data: students,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination
    },
    enableSortingRemoval: false,
  })

    const handleLevelFilterChange = (level: string) => {
      router.get(route('admin.specialStudentsIndex'), { 
        level,
        gender:selectedGender,
        section: 'allSections' // reset section when level changes
      });
    };
  
    const handleSectionFilterChange = (section: string) => {
      router.get(route('admin.specialStudentsIndex'), { 
        level: selectedLevel,
        gender:selectedGender,
        section
      });
    };
  
    const handleGenderFilterChange = (gender: string) => {
      router.get(route('admin.specialStudentsIndex'), { 
        level: selectedLevel,
        section: selectedSection,
        gender
      });
    };

  return (
    <div className="container">
      <Head title="Student" />
      <Toaster position='top-center' />

      <Heading title="Special Section Students" description="Mange Special Section Students" icon={BookUp2} />

      <div className='relative border-y py-2 my-4'>
        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />        
      </div>

      <div className="flex items-center justify-between my-4">
        <div className="flex items-center gap-2">
          <ListTodo className="text-muted-foreground" size={18} />
          <h2 className="text-md font-semibold">
            Special Section Students List
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {/* Grade Levels */}
          <div className="flex items-center gap-2">
            <Label className="font-semibold">Grade Levels</Label>
            <Select
              value={selectedLevel}
              onValueChange={handleLevelFilterChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Grade Levels</SelectLabel>
                  <SelectItem value="allLevels">All Levels</SelectItem>
                  {gradeLevels.map((level) => (
                    <SelectItem
                      key={level.id}
                      value={level.id.toString()} // convert to string for Select
                    >
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Sections */}
          <div className="flex items-center gap-2">
            <Label className="font-semibold">Sections</Label>
            <Select
              value={selectedSection}
              onValueChange={handleSectionFilterChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a Section" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="allSections">All Sections</SelectItem>
                  {sections.map((section) => (
                    <SelectItem
                      key={section.id}
                      value={section.id.toString()} // convert to string
                    >
                      {section.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Gender */}
          <div className="flex items-center gap-2">
            <Label className="font-semibold">Gender</Label>
            <Select
              value={selectedGender}
              onValueChange={handleGenderFilterChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Grade Levels</SelectLabel>
                  <SelectItem value="allGenders">All Genders</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <CreateEnrollmentDialog classGroups={specialClassGroups} students={regularStudents} />
      </div>
      
      <Card className="p-0 gap-0 overflow-hidden">
          <CardHeader className="p-0">
              <TableToolbar
                  table={table}
                  onDeleteSelected={handleDeleteSelected}
                  useGlobalFilter
              />
          </CardHeader>
          <Separator />
          <CardContent className="px-0">
              <RoomTable table={table} columnsLength={columns.length} />               
          </CardContent>
      </Card>
      

    </div>
  );
};

StudentIndex.layout = (page: React.ReactNode) => (
  <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);

export default StudentIndex;
