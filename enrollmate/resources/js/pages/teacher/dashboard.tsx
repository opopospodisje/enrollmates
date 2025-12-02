import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm ,Link} from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableCell, TableBody } from '@/components/ui/table';
import Heading from '@/components/heading';
import { ChevronRight } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar"
import React from 'react';
import { Separator } from '@/components/ui/separator';

type Teacher = {
  id: number;
  first_name: string;
  last_name: string;
};

type Student = {
  id: number;
  first_name: string;
  last_name: string;
  class_group: string;
};

type Props = {
  teacher: Teacher;
  activeSchoolYear: { id: number; name: string } | null;
  totalStudents: number;
  totalSubjectsAssigned: number;
  totalClasses: number;
  recentStudents: Student[];
};

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
];

export default function Dashboard({
  teacher,
  activeSchoolYear,
  totalStudents,
  totalSubjectsAssigned,
  totalClasses,
    recentStudents,
}: Props) {

    const [date, setDate] = React.useState<Date | undefined>(new Date())

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Dashboard" />

        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-2 overflow-x-auto">
            <div className='flex justify-between gap-8'>
                <div className='flex flex-col w-full gap-4'>
                    <Link href={route('profile.edit')} className='flex justify-between items-center gap-4 p-4 w-full bg-sidebar-accent rounded-lg'>
                        <div className='dark:text-black'>
                            <h1 className='text-4xl font-medium'>Hello, <span className='font-black'>{teacher.first_name} {teacher.last_name}</span>!</h1>
                            <h4>Welcome to your dashboard</h4>
                        </div>
                        <div>
                            <ChevronRight className='size-8 text-muted-foreground' />
                        </div>
                    </Link>

                    {/* KPI Cards */}
                    <div className="grid gap-4 grid-cols-4">
                        <Link href={route('teacher.grades.index')} className="col-span-2">
                            <Card className="p-4">
                                <div className='flex justify-between items-center mb-2'>
                                    <h1 className='font-black text-md'>Total Students</h1>
                                    <ChevronRight className='size-4 text-muted-foreground' />
                                </div>
                                <h1 className='text-4xl font-black text-center p-2'>{totalStudents}</h1>
                                <p className='text-sm text-muted-foreground mt-2 truncate'>
                                    Students under your classes
                                </p>
                            </Card>
                        </Link>
                        <Link href={route('teacher.classgroupsubjects.index')}>
                            <Card className="p-4">
                                <div className='flex justify-between items-center mb-2'>
                                    <h1 className='font-black text-md'>Total Subjects</h1>
                                    <ChevronRight className='size-4 text-muted-foreground' />
                                </div>
                                <h1 className='text-4xl font-black text-center p-2'>{totalSubjectsAssigned}</h1>
                                <p className='text-sm text-muted-foreground mt-2 truncate'>
                                    Subjects Assigned to you
                                </p>
                            </Card>
                        </Link>
                        <Link href={route('teacher.classgroupsubjects.index')}>
                            <Card className="p-4">
                                <div className='flex justify-between items-center mb-2'>
                                    <h1 className='font-black text-md'>Total Class</h1>
                                    <ChevronRight className='size-4 text-muted-foreground' />
                                </div>
                                <h1 className='text-4xl font-black text-center p-2'>{totalClasses}</h1>
                                <p className='text-sm text-muted-foreground mt-2 truncate'>
                                    Classes you are handling
                                </p>
                            </Card>
                        </Link>
                    </div>

                    {/* Recent Enrollments Table */}
                    <Card className="overflow-x-auto p-0 gap-0">
                        <Link href={route('teacher.grades.index')} className='flex items-center justify-between w-fulls gap-2 p-4'>
                            <h3 className="text-lg font-bold">Recent Students</h3>
                            <ChevronRight className='size-4 text-muted-foreground' />
                        </Link>                        
                        <Separator className='m-0' />
                        <div className='px-4'>
                            <Table>
                                <TableHeader>
                                <TableRow className='font-bold'>
                                    <TableCell>No</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Class</TableCell>
                                </TableRow>
                                </TableHeader>
                                <TableBody>
                                {recentStudents.map((student,index) => (
                                    <TableRow key={student.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{student.first_name} {student.last_name}</TableCell>
                                        <TableCell>{student.class_group}</TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </div>
                <div>
                    <div>
                        <h1 className='font-black'>School Year</h1>
                        <h1 className='text-center text-4xl font-black py-4'>{activeSchoolYear?.name}</h1>
                    </div>
                    <Separator className='my-4' />
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-lg border"
                    />
                </div>
            </div>
        </div>
        </AppLayout>
    );
}
