import { Button } from "@/components/ui/button";
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Toaster } from '@/components/ui/sonner';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, CornerDownRight, User } from 'lucide-react';
import * as React from "react";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Students',
    href: '/teacher/students',
  },
  {
    title: 'Profile',
    href: ``,
  },
];

type Student = {
  id: number;
  lrn: string | null;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  suffix: string | null;
  email: string;
  address: string | null;
  contact_number: string | null;
  gender: string;
  birthdate: string | null;
  full_name: string;
  current_class_name: string | null;
};

type Props = { student: Student };

const TeacherStudentShow = ({ student }: Props) => {
  return (
    <div className="container mx-auto">
      <Head title="Student Profile" />
      <Toaster position='top-center' />

      <div className="mb-4">
          <div className='flex justify-between items-center px-2 gap-2 text-md text-muted-foreground border-y w-50 mb-2'>
            <h4>Student ID:</h4>
            <div className='bg-accent px-4'>{student.id}</div>
          </div>

          <div className='flex justify-between items-center px-4'>
            <div className="flex items-center gap-2">
                <User className="text-muted-foreground" size={28} />
                <h1 className='text-2xl capitalize font-bold'>{student.full_name}</h1>
            </div>

            <div className='flex gap-2'>
              <Link href={route('teacher.students.index')}>
                <Button className="text-white dark:text-black">
                  <ArrowLeft size={24}/>
                  Back
                </Button>
              </Link>
            </div>

          </div>

          <div className="flex items-center px-8 gap-2">
            <CornerDownRight className="text-muted-foreground" size={18} />
            <p className="italic text-muted-foreground">Current class: {student.current_class_name ?? 'Not enrolled this school year'}</p>
          </div>
      </div>

      <div className='relative border-y py-2 mb-8'>
        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
      </div>

      <div className='border rounded-lg gap-4 p-4 grid grid-cols-2'>
        <div>
          <div className='font-semibold'>LRN</div>
          <div>{student.lrn ?? '—'}</div>
        </div>
        <div>
          <div className='font-semibold'>Email</div>
          <div>{student.email}</div>
        </div>
        <div>
          <div className='font-semibold'>Contact</div>
          <div>{student.contact_number ?? '—'}</div>
        </div>
        <div>
          <div className='font-semibold'>Birthdate</div>
          <div>{student.birthdate ?? '—'}</div>
        </div>
        <div className='col-span-2'>
          <div className='font-semibold'>Address</div>
          <div>{student.address ?? '—'}</div>
        </div>
      </div>
    </div>
  );
};

TeacherStudentShow.layout = (page: React.ReactNode) => (
  <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);

export default TeacherStudentShow;
