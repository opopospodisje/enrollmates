import Heading from '@/components/heading';
import RoomTable from '@/components/table/RoomTable';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import CreateApplicantDialog from '@/pages/admin/applicant/Components/CreateApplicantDialog';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState, } from "@tanstack/react-table";
import { BookUp2, List } from 'lucide-react';
import * as React from "react";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Applicants',
    href: '/teacher/applicants',
  },
];

type Applicant = {
  id: number;
  full_name: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  suffix?: string;
  email: string;
  contact_number: string;
  address: string;
  birthdate:string;
  gender:string;
  school_year_name: string;
  entrance_exam_score: number;
  exam_taken_at: string;
  status: string;
};

type SchoolYear = { id: number; name: string };

type ApplicantIndexProps = {
  applicants: Applicant[];
  schoolYears: SchoolYear[];
  currentSchoolYear: SchoolYear | null;
};

function getColumns(): any[] {
  return [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }: any) => <div className='px-4 text-center'>{row.getValue('id')}</div>,
    },
    {
      accessorKey: 'full_name',
      header: 'Full Name',
      cell: ({ row }: any) => <div className='px-4 capitalize font-medium'>{row.getValue('full_name')}</div>,
    },
    {
      accessorKey: 'school_year_name',
      header: 'School Year',
      cell: ({ row }: any) => <div className='px-4'>{row.getValue('school_year_name')}</div>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => <div className='px-4 capitalize'>{row.getValue('status')}</div>,
    },
  ];
}

const ApplicantIndex = ({ applicants, schoolYears, currentSchoolYear }: ApplicantIndexProps) => {
  const columns = getColumns();

  const [sorting, setSorting] = React.useState<SortingState>([{ id: "id", desc: false }])
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 100, });
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const table = useReactTable({
    data: applicants,
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

  return (
    <div className="container">
      <Head title="Applicants" />
      <Heading title="Applicant List" description="View applicants" icon={BookUp2} />

      <div className='relative border-y py-2 my-4'>
        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />        
      </div>

      <div className="flex items-center justify-between px-4 mb-4">
          <div className="flex items-center gap-2">
              <List className="text-muted-foreground" size={18} />
              <h2 className="text-md font-semibold">List of all applicants entries.</h2>
          </div>
          <CreateApplicantDialog gradeLevels={[]} schoolYears={schoolYears} currentSchoolYear={currentSchoolYear} postRoute={'teacher.applicants.store'} />
      </div>
      <Card className="p-0 gap-0 overflow-hidden">
          <CardHeader className="p-0" />
          <Separator />
          <CardContent className="px-0">
              <RoomTable table={table} columnsLength={columns.length} />               
          </CardContent>
      </Card>
    </div>
  );
};

ApplicantIndex.layout = (page: React.ReactNode) => (
  <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);

export default ApplicantIndex;
