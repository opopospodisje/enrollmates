import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import AppLogo from '@/components/app-logo';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type SharedData } from '@/types';
import { LogOut } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Grades',
    href: '/grades',
  },
  {
    title: 'Grades Sheet',
    href: '#',
  },
];

type Teacher = {
  id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix: string;
  full_name?: string;
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
  id: number;
  student:Student;
  class_group: ClassGroup;

  grades: Grade[];
};


type Grade = {
  id: number;
  class_group_subject_id:number;
  first_quarter:number;
  second_quarter:number;
  third_quarter:number;
  fourth_quarter:number;
  final_grade:number;

  class_group_subject: ClassGroupSubject;
};  

type Student = {
  id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix: string;

  enrollments: Enrollment[];
};

type GradeIndexProps = {
  student: Student;
};

const GradeIndex = ({student }: GradeIndexProps) => {
  const { auth } = usePage<SharedData>().props;

  const cleanup = useMobileNavigation();

  const handleLogout = () => {
      cleanup();
      router.flushAll();
  };
  
  student.enrollments.forEach(enroll => {
    enroll.grades.forEach(grade => {
      grade.class_group_subject.teacher.full_name = `${grade.class_group_subject.teacher.last_name}, ${grade.class_group_subject.teacher.first_name} ${grade.class_group_subject.teacher.middle_name ? grade.class_group_subject.teacher.middle_name.charAt(0) + '.' : ''} ${grade.class_group_subject.teacher.suffix || ''}`.trim();
    });
  });
  
  return (
    <>
      <Head title="Home">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
      </Head>
      
      <div className='flex min-h-screen flex-col items-center bg-[#F1F3F2] text-[#1b1b18] dark:bg-[#0a0a0a]'>
        <header className="mb-6 bg-sidebar rounded-b-lg w-full text-sm not-has-[nav]:hidden p-6">
          <nav className="flex items-center justify-end gap-4">
            <div className='flex gap-2 items-end mr-auto text-white'>
                <AppLogo />
            </div>
            {auth.user ? (
                <Link method="post" href={route('logout')} as="button" onClick={handleLogout}>
                    <div className="flex items-center text-white hover:underline px-2 gap-2">                                   
                        <LogOut className='inline size-4 ml-1' />
                        Log out
                    </div>
                </Link>
            ) : null}
                                  
          </nav>
        </header>
        <div className='p-6 w-full max-w-6xl'>
          <div>
            <Link href={route('student.home')}><Button variant={'default'}> <ChevronLeft /> Back</Button></Link>  
          </div>
          
          <div className='relative border-y py-2 my-4'>
            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />        
          </div>

          {student.enrollments.length > 0 ? (
            student.enrollments.map((enroll) => (
              <div className='mb-8 p-4 border' key={enroll.id}>
                <div className='mb-4'>
                  <h2 className='text-2xl font-semibold'>
                    {enroll.class_group.section.grade_level.name} - {enroll.class_group.section.name}
                  </h2>
                  <p className='text-gray-600 dark:text-gray-300'>
                    School Year: {enroll.class_group.school_year.name}
                  </p>
                </div>
                <Table className='border border-gray-300 mb-2'>
                  <TableHeader className='bg-sidebar-accent dark:bg-neutral-800'>
                    <TableRow className='divide-x divide-gray-300 border-b border-gray-300'>
                      <TableHead className='text-center'>#</TableHead>
                      <TableHead className='w-40'>Subject</TableHead>
                      <TableHead className='w-40'>Teacher</TableHead>
                      <TableHead className='text-center'>1st</TableHead>
                      <TableHead className='text-center'>2nd</TableHead>
                      <TableHead className='text-center'>3rd</TableHead>
                      <TableHead className='text-center'>4th</TableHead>
                      <TableHead className='text-center'>Final</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enroll.grades.map((grade, index) => (
                      <TableRow
                        key={grade.id}
                        className='divide-x divide-gray-300 border-b border-gray-300 h-8'
                      >
                        <TableCell className='text-center font-black'>
                          {index + 1}
                        </TableCell>
                        <TableCell className='font-semibold w-40 whitespace-normal break-words'>
                          {grade.class_group_subject.subject.name}
                        </TableCell>
                        <TableCell className='w-40 whitespace-normal break-words'>
                          {grade.class_group_subject.teacher.full_name}
                        </TableCell>
                        <TableCell className='text-center'>{grade.first_quarter}</TableCell>
                        <TableCell className='text-center'>{grade.second_quarter}</TableCell>
                        <TableCell className='text-center'>{grade.third_quarter}</TableCell>
                        <TableCell className='text-center'>{grade.fourth_quarter}</TableCell>
                        <TableCell className='text-center font-bold'>{grade.final_grade}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

              </div>
            ))
          ) : (
            <div className='text-center p-6'>
              <p className='text-gray-600 dark:text-gray-300'>No enrollment record found.</p>
            </div>
          )}  
        </div>
      </div>
    </>
  );
};

export default GradeIndex;
