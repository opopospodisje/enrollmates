import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { BookUp2, ChevronDown, FilePlus, List } from 'lucide-react';
import * as React from "react"
import { ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState, } from "@tanstack/react-table"
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import TableToolbar from '@/components/table/TableToolbar';
import { useState } from 'react';
import CreateGradeDialog from './Components/CreateGradeDialog';
import RoomTable from '@/components/table/RoomTable';
import { getColumns } from './Components/gradeColumns';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import Heading from '@/components/heading';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Label } from '@/components/ui/label';



const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Grades',
    href: '/grades',
  },
];

type Student = {
  id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix: string;
};

type Teacher = {
  id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix: string;
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


type ClassGroup = {
  id: number;
  section:Section;
  school_year: {
    id: number;
    name: string;
  };
};

type ClassGroupSubject = {
  id: number;
  subject: {
    id: number;
    name: string;
  };
  teacher: Teacher;
};

type Enrollment = {
  id?: number;
  
  student_id:number;
  class_group_id:number;
  class_group_name?: string;

  status:string;
  enrolled_at:string;
}; 


type Grade = {
  id: number;
  
  enrollment_id:number;
  student_name:string;
  gender:string;

  class_name:string;

  class_group_subject_id:number;
  subject_name:string;

  first_quarter:number;
  second_quarter:number;
  third_quarter:number;
  fourth_quarter:number;
  final_grade:number;
};  

type GradeIndexProps = {
  grades: Grade[];
  enrollments: Enrollment[];
  classGroupSubjects: ClassGroupSubject[];
  gradeLevels: GradeLevel[];
  selectedLevel: string;
  selectedSection: string;
  selectedGender: string;
  sections: Section[];
};

const GradeIndex = ({ grades,classGroupSubjects,enrollments,gradeLevels,sections,selectedLevel,selectedSection,selectedGender  }: GradeIndexProps) => {

  const { delete: destroy } = useForm<Grade>();

  const handleDelete = (id: number) => {
    destroy(route('admin.grades.destroy', id));
    toast.success("Row deleted successfully!");
  };

  const handleDeleteSelected = () => {
      const selectedIds = table.getSelectedRowModel().rows.map(row => row.original.id);

      if (selectedIds.length === 0) {
          alert("No items selected.");
          return;
      }

      router.post(route("admin.grades.bulkDelete"), {
        ids: selectedIds,
      });

      toast.success("Selected Rows Deleted Succesfully!");
  };

  const columns = getColumns()

  const [sorting, setSorting] = useState<SortingState>([{ id: "id", desc: false }])
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 100, });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const table = useReactTable({
    data: enrollments,
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
    router.get(route('admin.grades.index'), { 
      level,
      section: 'allSections' // reset section when level changes
    });
  };

  const handleSectionFilterChange = (section: string) => {
    router.get(route('admin.grades.index'), { 
      level: selectedLevel,
      section
    });
  };

  const handleGenderFilterChange = (gender: string) => {
    router.get(route('admin.grades.index'), { 
      level: selectedLevel,
      section: selectedSection,
      gender
    });
  };

  return (
    <div className="container">
      <Head title="Grade" />
      <Toaster position='top-center' />

      <Heading title="Grade Management" description="Manage Grades" icon={BookUp2} />

      <div className='relative border-y py-2 my-4'>
        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />        
      </div>
      
      <div className="flex items-center justify-between px-4 mb-4">
        <div className="flex items-center gap-2">
            <List className="text-muted-foreground" size={18} />
            <h2 className="text-md font-semibold">List of all grades entries.</h2>
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
      </div>
      
      <Card className="p-0 gap-0 overflow-hidden">
          <CardHeader className="p-0">
              <TableToolbar
                  table={table}
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

GradeIndex.layout = (page: React.ReactNode) => (
  <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);

export default GradeIndex;
