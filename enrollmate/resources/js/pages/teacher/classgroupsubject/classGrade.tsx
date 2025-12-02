import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm ,Link} from '@inertiajs/react';
import * as React from "react"
import { Toaster } from '@/components/ui/sonner';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { useRef } from "react";
import { debounce } from "lodash";
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'My Class',
    href: '/teacher/classgroupsubjects',
  },
  {
    title: 'Grading Sheet',
    href: '#',
  },
];

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
  class_group: ClassGroup;
};

type ClassGradeFormData = {
  id: number;
  student_name: string;
  enrollment_id: number;

  first_quarter:number;
  second_quarter:number;
  third_quarter:number;
  fourth_quarter:number;
  final_grade:number;

};  

interface Setting {
  id: number;
  setting_name: string;
  value: string;
  default_value: string;
}


type ClassGradeProps = {
  classGroupSubject: ClassGroupSubject;
  grades: ClassGradeFormData[];
  settings: Setting[];
};

type GradeFormData = {
  grades: ClassGradeFormData[];
};

const ClassGrade = ({classGroupSubject, grades,settings }: ClassGradeProps) => {
  
  const getSetting = (name: string) => settings.find(s => s.setting_name === name);

  const isInputAllowed = getSetting('enable_all_quarters_input')?.value === 'true';

  const getDefaultGradeFormData = (): GradeFormData => ({
    grades: grades.map(g => ({
      id: g.id,
      enrollment_id: g.enrollment_id,
      student_name: g.student_name,
      first_quarter: g.first_quarter,
      second_quarter: g.second_quarter,
      third_quarter: g.third_quarter,
      fourth_quarter: g.fourth_quarter,
      final_grade: g.final_grade,
    }))
  });


  const { data, setData, put, processing } = useForm(getDefaultGradeFormData());

  
  const updateGrade = (index: number, field: keyof ClassGradeFormData, value: string) => {
    let numValue = value === "" ? null : Number(value);

    // Only format if it's a number
    if (numValue !== null && !isNaN(numValue)) {
      // toFixed returns a string, so parse back to float for data storage
      numValue = parseFloat(numValue.toFixed(2));
    }

    const updatedGrades = data.grades.map((g, i) =>
      i === index ? { ...g, [field]: numValue } : g
    );
    setData("grades", updatedGrades);
  };

  const submitGrades = () => {
    put(route("teacher.classgroupsubjects.grades.update", {classGroupSubject: classGroupSubject.id}), {
      onSuccess: () => {
        toast.success('Grades updated successfully.');
      },
      preserveScroll: true,
      preserveState: true,
    });
  };


  console.log("classGroupSubject id:", classGroupSubject.id);
  
  return (
    <div className="container">
      <Head title="Grade" />
      <Toaster position='top-center' />

      <div>
        <Link href={route('teacher.classgroupsubjects.index')}><Button variant={'default'}> <ChevronLeft /> Back</Button></Link>  
      </div>
      
      <div className='relative border-y py-2 my-4'>
        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />        
      </div>

      <div className='mb-4'>
        <h1 className='text-4xl font-bold'>
           {classGroupSubject.subject.name}
        </h1>
        <h3></h3>
      </div>

      <Separator />

      <div className="my-4 text-center">
        <p className="text-lg font-medium">
          Grade Records for <span className="font-semibold">{classGroupSubject.subject.name}</span>
        </p>
        <p className="text-gray-600">
          {classGroupSubject.class_group.section.grade_level.name} – {classGroupSubject.class_group.section.name} 
          ({classGroupSubject.class_group.school_year.name})
        </p>
      </div>

      <Table className='border border-gray-300 mb-2'>
        <TableHeader className='bg-sidebar-accent dark:bg-neutral-800'>
          <TableRow className='divide-x divide-gray-300 border-b  border-gray-300 '>
            <TableHead className='text-center'>#</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead className='text-center w-40 '>1st Quarter</TableHead>
            <TableHead className='text-center w-40'>2nd Quarter</TableHead>
            <TableHead className='text-center w-40'>3rd Quarter</TableHead>
            <TableHead className='text-center w-40'>4th Quarter</TableHead>
            <TableHead className='text-center w-50'>Final Grade</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.grades.map((student, index) => ( 
            <TableRow key={student.enrollment_id} className='divide-x divide-gray-300 border-b border-gray-300 h-8'>
              <TableCell className='text-center font-black'>{index + 1}</TableCell>
              <TableCell className='font-semibold'>{student.student_name}</TableCell>
              <TableCell>
                <Input
                  className="text-center"
                  type="number"
                  step="0.01"
                  max={100}
                  value={student.first_quarter ?? ""}
                  
                  onChange={(e) => {
                    let value = parseFloat(e.target.value);

                    // Block numbers > 100
                    if (value > 100) value = 100;

                    // Block negatives if you want
                    if (value < 0) value = 0;

                    updateGrade(index, "first_quarter", value.toString());
                  }}
                  readOnly={!isInputAllowed}
                />
              </TableCell>
              <TableCell>
                <Input
                  className="text-center"
                  type="number"
                  step="0.01"
                  max={100}
                  value={student.second_quarter ?? ""}
                  onChange={(e) => {
                    let value = parseFloat(e.target.value);

                    // Block numbers > 100
                    if (value > 100) value = 100;

                    // Block negatives if you want
                    if (value < 0) value = 0;

                    updateGrade(index, "second_quarter", value.toString());
                  }}
                  readOnly={!isInputAllowed}
                />
              </TableCell>
              <TableCell>
                <Input
                  className="text-center"
                  type="number"
                  step="0.01"
                  max={100}
                  value={student.third_quarter ?? ""}
                  onChange={(e) => {
                    let value = parseFloat(e.target.value);

                    // Block numbers > 100
                    if (value > 100) value = 100;

                    // Block negatives if you want
                    if (value < 0) value = 0;

                    updateGrade(index, "third_quarter", value.toString());
                  }}
                  readOnly={!isInputAllowed}
                />
              </TableCell>
              <TableCell>
                <Input
                  className="text-center"
                  type="number"
                  step="0.01"
                  max={100}
                  value={student.fourth_quarter ?? ""}
                  onChange={(e) => {
                    let value = parseFloat(e.target.value);

                    // Block numbers > 100
                    if (value > 100) value = 100;

                    // Block negatives if you want
                    if (value < 0) value = 0;

                    updateGrade(index, "fourth_quarter", value.toString());
                  }}
                  readOnly={!isInputAllowed}
                />
              </TableCell>
              <TableCell>
                <Input
                  className="text-center"
                  type="number"
                  step="0.01"
                  max={100}
                  value={student.final_grade ?? ""}
                  onChange={(e) => {
                    let value = parseFloat(e.target.value);

                    // Block numbers > 100
                    if (value > 100) value = 100;

                    // Block negatives if you want
                    if (value < 0) value = 0;

                    updateGrade(index, "final_grade", value.toString());
                  }}
                  readOnly={!isInputAllowed}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className='flex justify-end'>
        {isInputAllowed &&
          <Button
            type="button"
            onClick={submitGrades}
            disabled={processing}
            className="px-4 py-2"
          >
            {processing ? "Saving..." : "Save Grades"}
          </Button>
        }
      </div>      
    </div>
  );
};

ClassGrade.layout = (page: React.ReactNode) => (
  <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);

export default ClassGrade;
