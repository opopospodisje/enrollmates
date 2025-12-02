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
    title: 'Grades',
    href: '/grades',
  },
  {
    title: 'Grades Sheet',
    href: '#',
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
  id: number;
  student:Student;
  class_group: ClassGroup;
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

interface Setting {
  id: number;
  setting_name: string;
  value: string;
  default_value: string;
}

type GradeEditProps = {
  enrollment: Enrollment;
  grades: Grade[];
  settings: Setting[];
};

type GradeFormData = {
  grades: Grade[];
};

const GradeEdit = ({enrollment, grades,settings }: GradeEditProps) => {

  const getSetting = (name: string) => settings.find(s => s.setting_name === name);

  const isInputAllowed = getSetting('enable_all_quarters_input')?.value === 'true';
  
  const getDefaultGradeFormData = (): GradeFormData => ({
    grades: grades.map(g => ({
      id: g.id,
      class_group_subject_id: g.class_group_subject_id,
      first_quarter: g.first_quarter,
      second_quarter: g.second_quarter,
      third_quarter: g.third_quarter,
      fourth_quarter: g.fourth_quarter,
      final_grade: g.final_grade,
      class_group_subject: g.class_group_subject,
    }))
  });


  const { data, setData, put, processing } = useForm(getDefaultGradeFormData());

  const updateGrade = (index: number, field: keyof Grade, value: string) => {
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
    put(route("teacher.grades.update", enrollment.id), {
      onSuccess: () => {
        toast.success('Grades updated successfully.');
      },
      preserveScroll: true,
      preserveState: true,
    });
  };

  return (
    <div className="container">
      <Head title="Grade" />
      <Toaster position='top-center' />

      <div>
        <Link href={route('teacher.grades.index')}><Button variant={'default'}> <ChevronLeft /> Back</Button></Link>  
      </div>
      
      <div className='relative border-y py-2 my-4'>
        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />        
      </div>

      <div className='mb-4'>
        <h1 className='text-4xl font-bold'>
          {enrollment.student.last_name}, {enrollment.student.first_name} {enrollment.student.middle_name} {enrollment.student.suffix}    
        </h1>
        <h3>{enrollment.class_group.section.name} - {enrollment.class_group.section.grade_level.name}(SY {enrollment.class_group.school_year.name })</h3>
      </div>

      <Separator />

      <div className='my-2'>
        <p className='text-center'>Report Card of {enrollment.student.first_name} {enrollment.student.last_name} for {enrollment.class_group.section.grade_level.name} ({enrollment.class_group.section.name}), School Year {enrollment.class_group.school_year.name}</p>      
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
          {data.grades.map((grade, index) => ( 
            <TableRow key={grade.id} className='divide-x divide-gray-300 border-b border-gray-300 h-8'>
              <TableCell className='text-center font-black'>{index + 1}</TableCell>
              <TableCell className='font-semibold'>{grade.class_group_subject.subject.name}</TableCell>
              <TableCell>
                <Input
                  className="text-center"
                  type="number"
                  step="0.01"
                  max={100}
                  value={grade.first_quarter ?? ""}
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
                  value={grade.second_quarter ?? ""}
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
                  value={grade.third_quarter ?? ""}
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
                  value={grade.fourth_quarter ?? ""}
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
                  value={grade.final_grade ?? ""}
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

GradeEdit.layout = (page: React.ReactNode) => (
  <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);

export default GradeEdit;
