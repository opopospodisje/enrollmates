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
import { AlumniEmploymentKPI } from '@/components/chart/employment-chart';

type Admin = {
    id: number;
    first_name: string;
    last_name: string;
};

type AlumniStats = {
  stats: string; // should be string, not number
  total: number;
}

type Props = {
    admin: Admin;
    totalStudents: number;
    totalApplicants: number;
    totalTeachers: number;
    totalSections: number;
    totalClassGroups: number;
    recentEnrollments: {
        id: number;
        student: { first_name: string; last_name: string };
        classGroup?: {
            section?: {
            name?: string;
            gradeLevel?: { name?: string };
            };
        };
        enrolled_at: string;
    }[];
    pendingApplicants: { id: number; first_name: string; last_name: string }[];
    activeSchoolYear: { id: number; name: string } | null;
    alumniStats: AlumniStats[];
    femaleStudents: number;
    maleStudents : number;
};

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
];

export default function Dashboard({
    admin,
    totalStudents,
    totalApplicants,
    totalTeachers,
    totalSections,
    totalClassGroups,
    recentEnrollments,
    pendingApplicants,
    activeSchoolYear,
    alumniStats,
    maleStudents,
    femaleStudents
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
                            <h1 className='text-4xl font-medium'>Hello, <span className='font-black'>{admin.first_name} {admin.last_name}</span>!</h1>
                            <h4>Welcome to your dashboard</h4>
                        </div>
                        <div>
                            <ChevronRight className='size-8 text-muted-foreground' />
                        </div>
                    </Link>

                    {/* KPI Cards */}
                    <div className="grid gap-4 grid-cols-4">
                        <Link href={route('admin.students.index')} className="col-span-2">
                        <Card className="p-4">
                            <div className="flex justify-between items-center mb-2">
                            <h1 className="font-black text-md">Total Students</h1>
                            <ChevronRight className="size-4 text-muted-foreground" />
                            </div>

                            <h1 className="text-4xl font-black text-center p-2">{totalStudents}</h1>

                            <div className="flex justify-center gap-6 text-sm mt-2">
                            <p className="text-blue-600 font-semibold">Male: {maleStudents}</p>
                            <p className="text-pink-600 font-semibold">Female: {femaleStudents}</p>
                            </div>

                        </Card>
                        </Link>

                        <Link href={route('admin.applicants.index')}>
                            <Card className="p-4">
                                <div className='flex justify-between items-center mb-2'>
                                    <h1 className='font-black text-md'>Total Applicants</h1>
                                    <ChevronRight className='size-4 text-muted-foreground' />
                                </div>
                                <h1 className='text-4xl font-black text-center p-2'>{totalApplicants}</h1>
                                <p className='text-sm text-muted-foreground mt-2 truncate'>
                                    New Applicants for the active school year
                                </p>
                            </Card>
                        </Link>
                        <Link href={route('admin.teachers.index')}>
                            <Card className="p-4">
                                <div className='flex justify-between items-center mb-2'>
                                    <h1 className='font-black text-md'>Total Teachers</h1>
                                    <ChevronRight className='size-4 text-muted-foreground' />
                                </div>
                                <h1 className='text-4xl font-black text-center p-2'>{totalTeachers}</h1>
                                <p className='text-sm text-muted-foreground mt-2 truncate'>
                                    Registered Teachers
                                </p>
                            </Card>
                        </Link>
                    </div>

                    <div className='w-full'>
                        <AlumniEmploymentKPI alumniStats={alumniStats} />
                    </div>

                    {/* Recent Enrollments Table */}
                    <Card className="overflow-x-auto p-0 gap-0">
                        <Link href={route('admin.enrollments.index')} className='flex items-center justify-between w-fulls gap-2 p-4'>
                            <h3 className="text-lg font-bold">Recent Enrollments</h3>
                            <ChevronRight className='size-4 text-muted-foreground' />
                        </Link>                        
                        <Separator className='m-0' />
                        <div className='px-4'>
                            <Table>
                                <TableHeader>
                                <TableRow className='font-bold'>
                                    <TableCell>No</TableCell>
                                    <TableCell>Student</TableCell>
                                    <TableCell>Section</TableCell>
                                    <TableCell>Grade Level</TableCell>
                                    <TableCell>Enrolled At</TableCell>
                                </TableRow>
                                </TableHeader>
                                <TableBody>
                                {recentEnrollments.map((enrollment,index) => (
                                    <TableRow key={enrollment.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{enrollment.student.first_name} {enrollment.student.last_name}</TableCell>
                                        <TableCell>{enrollment.classGroup?.section?.name ?? 'N/A'}</TableCell>
                                        <TableCell>{enrollment.classGroup?.section?.gradeLevel?.name ?? 'N/A'}</TableCell>
                                        <TableCell>{enrollment.enrolled_at}</TableCell>
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
