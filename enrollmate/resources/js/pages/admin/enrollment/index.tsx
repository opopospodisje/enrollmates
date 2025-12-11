import Heading from '@/components/heading';
import RoomTable from '@/components/table/RoomTable';
import TableToolbar from '@/components/table/TableToolbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Separator } from '@/components/ui/separator';
import { Toaster } from '@/components/ui/sonner';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState, } from "@tanstack/react-table";
import { BookUp2, CalendarDays, FilePlus, List, ListTodo } from 'lucide-react';
import * as React from "react";
import { useState } from 'react';
import { toast } from 'sonner';
import CreateEnrollmentDialog from './Components/CreateEnrollmentDialog';
import { getColumns } from './Components/enrollmentColumns';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Enrollments',
    href: '/enrollments',
  },
];

type GradeLevel ={
  id: number;
  name: string;
};

type SchoolYear ={
  id: number;
  name: string;
  is_active: boolean;
};


type Section ={
  id: number;
  name: string;
  grade_level: GradeLevel;
};

type Student = {
  id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix: string;
};

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
  student_limit: number;
  enrollments_count: number;
};

type Enrollment = {
  id?: number;
  
  student_id:number;
  class_group_id:number;
  class_group_name?: string;

  status:string;
  enrolled_at:string;
};  


type EnrollmentIndexProps = {
  enrollments: Enrollment[];
  students: Student[];
  classGroups: ClassGroup[];
  selectedLevel: string;
  selectedSection: string;
  selectedSchoolYear: string;
  sections: Section[];
  gradeLevels: GradeLevel[];
  schoolYears: SchoolYear[];
};

const EnrollmentIndex = ({ enrollments,classGroups,students, selectedLevel, selectedSection, sections, gradeLevels,selectedSchoolYear,schoolYears }: EnrollmentIndexProps) => {

  const { delete: destroy } = useForm<Enrollment>();

  const getDefaultEnrollmentFormData = (): Enrollment => ({
    student_id: 0,
    class_group_id: 0,
    status: '',
    enrolled_at: new Date().toISOString().slice(0, 10) // "YYYY-MM-DD"
  });

  const { data, setData, post, processing, errors } = useForm<Enrollment>(
    getDefaultEnrollmentFormData()
  );

  const handleDelete = (id: number) => {
    destroy(route('admin.enrollments.destroy', id));
    toast.success("Row deleted successfully!");
  };

  const handleDeleteSelected = () => {
      const selectedIds = table.getSelectedRowModel().rows.map(row => row.original.id);

      if (selectedIds.length === 0) {
          alert("No items selected.");
          return;
      }

      router.post(route("admin.enrollments.bulkDelete"), {
        ids: selectedIds,
      });

      toast.success("Selected Rows Deleted Succesfully!");
  };

  const columns = getColumns({ classGroups,students,handleDelete })

  const [sorting, setSorting] = useState<SortingState>([{ id: "enrolled_at", desc: true }])
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

  const [tab, setTab] = useState<'create' | 'all'>('create');
  const [studentQuery, setStudentQuery] = useState('');
  const [studentOpen, setStudentOpen] = useState(false);
  const [selectedStudentLabel, setSelectedStudentLabel] = useState('');

  const normalize = (v?: string) => (v ?? '').toLowerCase().trim();
  const studentLabel = (s: Student) => `${s.last_name}, ${s.first_name} ${s.middle_name ?? ''} ${s.suffix ?? ''}`.replace(/\s+/g,' ').trim();
  const filteredStudents = students.filter((s) => studentLabel(s).toLowerCase().includes(studentQuery.toLowerCase()));

  function handleTabChange(newTab: 'create' | 'all') {
    setTab(newTab);
  }

  const handleLevelFilterChange = (level: string) => {
    router.get(
      route('admin.enrollments.index'),
      { 
        level,
        section: 'allSections', // reset section when level changes
        schoolYear: selectedSchoolYear,

      },
      {
        preserveState: true,
        onSuccess: () => {
          handleTabChange('all')
        }
      }
    );
  };

  const handleSectionFilterChange = (section: string) => {
    router.get(
      route('admin.enrollments.index'),
      { 
        level: selectedLevel,
        schoolYear: selectedSchoolYear,
        section
      },
      {
        preserveState: true,
        onSuccess: () => {
          handleTabChange('all')
        }
      }
    );
  };

  const handleSchoolYearFilterChange = (schoolYear: string) => {
    router.get(
      route('admin.enrollments.index'),
      { 
        level: selectedLevel,
        section: selectedSection,
        schoolYear
      },
      {
        preserveState: true,
        onSuccess: () => {
          handleTabChange('all')
        }
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    post(route('admin.enrollments.store'), {
      onSuccess: () => {
        toast.success('Enrollment created!');
        setData(getDefaultEnrollmentFormData());
      },
    });
  };

  return (
    <div className="container">
      <Head title="Enrollment" />
      <Toaster position='top-center' />

      <Heading title="Enrollment Management" description="Manage Student Enrollment" icon={BookUp2} />

      <div className='relative border-y py-2 my-4'>
        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />        
      </div>

      <div className=''>
        <div className='flex gap-2 p-2 dark:bg-neutral-900'>
          <Button 
            variant={tab === 'create' ? 'default' : 'outline'} 
            onClick={() => handleTabChange('create')}
            className={`hover:underline ${tab === 'create' ? 'underline' : ''}`}
          >
            Enroll Students
          </Button>
          <Button 
            variant={tab === 'all' ? 'default' : 'outline'} 
            onClick={() => handleTabChange('all')}
            className={`hover:underline ${tab === 'all' ? 'underline' : ''}`}
          >
            All Enrollments
          </Button>
        </div>

        <Separator />

        

        {tab === 'create' && 
        <div>
          <div className="flex items-center justify-between px-2 my-4">
              <div className="flex items-center gap-2">
                  <List className="text-muted-foreground" size={18} />
                  <h2 className="text-md font-semibold">Create enrollments entries.</h2>
              </div>
          </div>

          <form onSubmit={handleSubmit}>
            <Card className='gap-2 py-4'>
              <CardHeader className='border-b pb-4'>
                <div className='gap-2font-extrabold'>Complete enrollment form and submit.</div>              
              </CardHeader>
              <CardContent>              
                <div className='w-full grid divide-x'>
                  <div className=''>
                    <div className='grid gap-4'>
                      {/*Student*/}
                      <div className="grid col-span-full gap-2">
                        <div className='flex items-center text-neutral-600 gap-2'>
                          <FilePlus size={16}/>
                          <Label className='font-semibold'>Students</Label>
                        </div>
                        <div className='px-4'>
                          <Popover open={studentOpen} onOpenChange={setStudentOpen}>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className='w-full justify-between border border-dashed border-neutral-400'>
                                {selectedStudentLabel || 'Select Student'}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className='p-0 w-[320px]'>
                              <div className='p-2 border-b'>
                                <Input
                                  placeholder='Search student...'
                                  value={studentQuery}
                                  onChange={(e) => setStudentQuery(e.target.value)}
                                  className='h-8'
                                />
                              </div>
                              <div className='max-h-48 overflow-y-auto'>
                                {filteredStudents.length > 0 ? (
                                  filteredStudents.map((s) => (
                                    <Button
                                      key={s.id}
                                      variant='ghost'
                                      className='w-full justify-start rounded-none'
                                      onClick={() => {
                                        setData('student_id', s.id);
                                        const lbl = studentLabel(s);
                                        setSelectedStudentLabel(lbl);
                                        setStudentOpen(false);
                                      }}
                                    >
                                      {studentLabel(s)}
                                    </Button>
                                  ))
                                ) : (
                                  <div className='px-2 py-2 text-sm text-muted-foreground'>No results</div>
                                )}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                        {errors.student_id && <p className="text-sm text-red-600">{errors.student_id}</p>}
                      </div>

                      {/*class_group_id*/}
                      <div className="grid col-span-full gap-2">
                        <div className='flex items-center text-neutral-600 gap-2'>
                          <BookUp2 size={16}/>
                          <Label className='font-semibold'>Section</Label>
                        </div>
                        <div className='px-4'>
                          <Select                     
                            value={data.class_group_id === 0 ? '' : data.class_group_id.toString()}
                            onValueChange={(value) => setData('class_group_id', Number(value))}
                          >
                            <SelectTrigger className='border border-dashed border-neutral-400'>
                              <SelectValue placeholder="Select Class" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup className="max-h-48 overflow-y-auto">
                                <SelectLabel>Grade - Section(SY)</SelectLabel>
                                {classGroups.length > 0 ? (
                                  classGroups.map((type) => {
                                    return (
                                      <SelectItem 
                                        key={type.id} 
                                        value={type.id.toString()}
                                      >
                                        {type.section?.grade_level?.name} - {type.section?.name} ({type.school_year?.name ?? 'No SY'}) - ({type.enrollments_count}/{type.student_limit} slots)
                                        {type.section?.is_special && (
                                          <span className="bg-amber-300 px-2 rounded-sm text-xs ml-2">
                                            Special Section
                                          </span>
                                        )}
                                      </SelectItem>
                                    );
                                  })
                                ) : (
                                  <div className="text-sm text-muted-foreground px-2 py-1">
                                    No class groups available. Create a class group first.
                                  </div>
                                )}
                              </SelectGroup>
                            </SelectContent>
                          </Select>                
                        </div>
                        {errors.class_group_id && (
                          <p className="text-sm text-red-600">{errors.class_group_id}</p>
                        )}
                      </div>

                      {/* status */}
                      <div className="grid col-span-full gap-2">
                        <div className="flex items-center text-neutral-600 gap-2">
                          <ListTodo size={16} />
                          <Label className="font-semibold">Status</Label>
                        </div>
                        <div className="px-4">
                          <Select
                            value={data.status}
                            onValueChange={(value) => setData('status', value)}
                          >
                            <SelectTrigger className="border border-dashed border-neutral-400">
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Status</SelectLabel>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="promoted">Promoted</SelectItem>
                                <SelectItem value="retained">Retained</SelectItem>
                                <SelectItem value="transferred">Transferred</SelectItem>
                                <SelectItem value="dropped">Dropped</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        {errors.status && (
                          <p className="text-sm text-red-600">{errors.status}</p>
                        )}
                      </div>

                      {/* enrolled_at */}
                      <div className="grid col-span-full gap-2">
                        <div className="flex items-center text-neutral-600 gap-2">
                          <CalendarDays size={16} />
                          <Label htmlFor="enrolled_at" className="font-semibold">Enrolled At</Label>
                        </div>
                        <div className="px-4">
                          <Input
                            id="enrolled_at"
                            type="date"
                            value={data.enrolled_at}
                            onChange={(e) => setData('enrolled_at', e.target.value)}
                            placeholder="YYYY-MM-DD"
                            className="border border-dashed border-neutral-400"
                          />
                        </div>
                        {errors.enrolled_at && <p className="text-sm text-red-600">{errors.enrolled_at}</p>}
                      </div>
                    </div>
                  </div>
                </div>              
              </CardContent>
              <CardFooter className='border-t pt-4'>
                <Button type="submit" disabled={processing} className='bg-sidebar ml-auto text-white flex gap-2 hover:underline hover:bg-sidebar'>
                  Create Enrollment
                </Button>
              </CardFooter>            
            </Card>
          </form>
        </div>
        }

        {(tab === 'all') && (
        <>
          <div className="flex items-center justify-between px-2 my-4">
              <div className="flex items-center gap-2">
                  <List className="text-muted-foreground" size={18} />
                  <h2 className="text-md font-semibold">List of all enrollments entries.</h2>
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

                <div className="flex items-center gap-2">
                  <Label className="font-semibold">School Year</Label>
                  <Select
                    value={selectedSchoolYear?.toString()}
                    onValueChange={handleSchoolYearFilterChange}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a School Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {schoolYears.map((sy) => (
                        <SelectItem
                          key={sy.id}
                          value={sy.id.toString()}
                        >
                          {sy.name} {sy.is_active && '(Active)'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <CreateEnrollmentDialog classGroups={classGroups} students={students} />
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
        </>
        )}
      </div>
    </div>
  );
};

EnrollmentIndex.layout = (page: React.ReactNode) => (
  <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);

export default EnrollmentIndex;
