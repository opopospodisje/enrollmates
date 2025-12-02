import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { BookUp2, List } from 'lucide-react';
import * as React from "react"
import { ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState, } from "@tanstack/react-table"
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import TableToolbar from '@/components/table/TableToolbar';
import { useState } from 'react';
import CreateSubjectDialog from './Components/CreateSubjectDialog';
import RoomTable from '@/components/table/RoomTable';
import { getColumns } from './Components/subjectColumns';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import ClassGroupSubjectIndex from '../classgroupsubject';


const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Subjects',
    href: '/subjects',
  },
];

type ClassGroup = {
  id: number;
  section_name: string;
  grade_level_name: string;
  school_year_name: string;
}

type Teacher = {
  id: number;
  first_name: string;
  last_name: string;
};

type Subject = {
  id: number;
  code: string;
  name: string;
  is_special: boolean;
};

type classGroupSubject = {
  id: number;
  class_group_id: number;
  subject_id: number;
  teacher_id: number;
  class_group_name: string;
  subject_name: string;
  teacher_name: string;
};

type SubjectIndexProps = {
  subjects: Subject[];
  classGroupSubjects: classGroupSubject[];
  classGroups: ClassGroup[];
  teachers: Teacher[];
};

const SubjectIndex = ({ classGroupSubjects, classGroups, subjects,teachers }: SubjectIndexProps) => {

  const { delete: destroy } = useForm<Subject>();

  const handleDelete = (id: number) => {
    destroy(route('admin.subjects.destroy', id));
    toast.success("Row deleted successfully!");
  };

  const handleDeleteSelected = () => {
      const selectedIds = table.getSelectedRowModel().rows.map(row => row.original.id);

      if (selectedIds.length === 0) {
          alert("No items selected.");
          return;
      }

      router.post(route("admin.subjects.bulkDelete"), {
        ids: selectedIds,
      });

      toast.success("Selected Rows Deleted Succesfully!");
  };

  const columns = getColumns({ handleDelete })

  const [sorting, setSorting] = useState<SortingState>([{ id: "id", desc: false }])
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 100, });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const table = useReactTable({
    data: subjects,
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

  const [tab, setTab] = useState<'create' | 'all' | 'is_special'>('create');
  const [filter, setFilter] = useState<'all' | 'is_special'>('all');

  function handleFilterChange(newFilter: 'all' | 'is_special') {
    setFilter(newFilter);
    router.get(route('admin.subjects.index', { filter: newFilter }), {}, { preserveState: true });
  }

  function handleTabChange(newTab: 'create' | 'all' | 'is_special') {
    setTab(newTab);

    if (newTab === 'all') {
      handleFilterChange('all');
    } else if (newTab === 'is_special') {
      handleFilterChange('is_special');
    }else{
      handleFilterChange('all');
    }
    // For 'create' tab, no backend call is needed unless you want to fetch something
  }
  

  return (
    <div className="container">
      <Head title="Subject" />
      <Toaster position='top-center' />

      <Heading title="Subject Management" description="Manage Subjects" icon={BookUp2} />

      <div className='relative border-y py-2 my-4'>
        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />        
      </div>

      <div className='bg-gray-100 border rounded-lg p-2 dark:bg-neutral-900'>
        <div className='flex gap-2 p-2 dark:bg-neutral-900'>
          <Button 
            variant={tab === 'create' ? 'default' : 'outline'} 
            onClick={() => handleTabChange('create')}
          >
            Assigned Subjects per Class
          </Button>
          <Button 
            variant={tab === 'all' ? 'default' : 'outline'} 
            onClick={() => handleTabChange('all')}
          >
            All Subjects
          </Button>
          <Button 
            variant={tab === 'is_special' ? 'default' : 'outline'} 
            onClick={() => handleTabChange('is_special')}
          >
            Special Subjects
          </Button>
        </div>

        <Separator />

        

        {tab === 'create' && 
        <div>
          <ClassGroupSubjectIndex classGroupSubjects={classGroupSubjects} classGroups={classGroups} subjects={subjects} teachers={teachers} />
        </div>
        }

        {(tab === 'all' || tab === 'is_special') && (
        <>
          <div className="flex items-center justify-between px-4 my-4">
              <div className="flex items-center gap-2">
                  <List className="text-muted-foreground" size={18} />
                  <h2 className="text-md font-semibold">List of all subjects entries.</h2>
              </div>
              <CreateSubjectDialog />
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

SubjectIndex.layout = (page: React.ReactNode) => (
  <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);

export default SubjectIndex;
