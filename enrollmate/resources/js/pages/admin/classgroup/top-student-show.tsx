import {type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import * as React from "react"
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Class Groups',
    href: '/classgroups',
  },
];

type Section = {
  id: number;
  name: string
  grade_level: {
    id: number;
    name: string;
  }
};


export interface ClassGroup {
    id: number;
    section: Section;
    schoolYear: {
      id: number;
      name: string;
    } | null;
}


type TopStudent = {
  id: number;
  name: string;
  gender: string;
  average: number;
};

type TopStudentsByGrading = {
  first_quarter: TopStudent[];
  second_quarter: TopStudent[];
  third_quarter: TopStudent[];
  fourth_quarter: TopStudent[];
};

type Props = {
  classGroup: ClassGroup;
  topStudentsByGrading: TopStudentsByGrading;
};


const ClassGroupIndex = ({classGroup, topStudentsByGrading }: Props) => {

  const gradingLabels = {
    first_quarter: 'First Grading',
    second_quarter: 'Second Grading',
    third_quarter: 'Third Grading',
    fourth_quarter: 'Fourth Grading',
  };

  return (
    <div className="container">
      <Head title="Class Group" />

      <div>
        <Link href={route('admin.top-students-by-classgroups.index')}><Button variant={'default'}> <ChevronLeft /> Back</Button></Link>  
      </div>
      
      <div className='relative border-y py-2 my-4'>
        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />        
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-2">
          Top Students – {classGroup.section?.name} ({classGroup.section?.grade_level?.name})
        </h1>
        <p className="text-gray-600 mb-6">School Year: {classGroup.schoolYear?.name}</p>

        {Object.entries(gradingLabels).map(([key, label]) => {
          const students = topStudentsByGrading[key as keyof TopStudentsByGrading];
          return (
            <div key={key} className="mb-8">
              <h2 className="text-xl font-semibold mb-2">{label}</h2>

              {students.length > 0 ? (
                <table className="w-full border border-gray-300 rounded text-left text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 border-b">#</th>
                      <th className="p-2 border-b">Name</th>
                      <th className="p-2 border-b">Gender</th>
                      <th className="p-2 border-b">Average</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, index) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="p-2 border-b">{index + 1}</td>
                        <td className="p-2 border-b">{student.name}</td>
                        <td className="p-2 border-b capitalize">{student.gender}</td>
                        <td className="p-2 border-b">{student.average.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-sm text-gray-500">No data available.</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

ClassGroupIndex.layout = (page: React.ReactNode) => (
  <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);

export default ClassGroupIndex;
