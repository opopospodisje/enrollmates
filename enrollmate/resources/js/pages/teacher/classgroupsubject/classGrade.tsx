import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Separator } from '@/components/ui/separator';
import { Toaster } from '@/components/ui/sonner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowDown01, ArrowDown10, ChevronLeft } from 'lucide-react';
import * as React from "react";
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

  const allowQ1 = getSetting('enable_first_quarter_input')?.value === 'true';
  const allowQ2 = getSetting('enable_second_quarter_input')?.value === 'true';
  const allowQ3 = getSetting('enable_third_quarter_input')?.value === 'true';
  const allowQ4 = getSetting('enable_fourth_quarter_input')?.value === 'true';
  const allowFinal = getSetting('enable_final_grade_input')?.value === 'true';

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
  const [sortDesc, setSortDesc] = React.useState(true);

  React.useEffect(() => {
    const sorted = [...data.grades].sort((a, b) => {
      const af = a.final_grade ?? -Infinity;
      const bf = b.final_grade ?? -Infinity;
      return bf - af; // descending on mount
    });
    setData('grades', sorted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resort = (desc: boolean) => {
    const sorted = [...data.grades].sort((a, b) => {
      const af = a.final_grade ?? -Infinity;
      const bf = b.final_grade ?? -Infinity;
      return desc ? bf - af : af - bf;
    });
    setData('grades', sorted);
  };

  const toggleSort = () => {
    const next = !sortDesc;
    setSortDesc(next);
    resort(next);
  };

  
  const updateGrade = (index: number, field: keyof ClassGradeFormData, value: string) => {
    let numValue = value === "" ? null : Number(value);
    if (numValue !== null && !isNaN(numValue)) {
      numValue = parseFloat(numValue.toFixed(2));
    }

    let updatedGrades = data.grades.map((g, i) => (i === index ? { ...g, [field]: numValue } : g));

    const g = updatedGrades[index];
    const q = [g.first_quarter, g.second_quarter, g.third_quarter, g.fourth_quarter].filter(v => typeof v === 'number' && !isNaN(v as number)) as number[];
    if (q.length === 4 || q.length > 0) {
      const avg = parseFloat((q.reduce((s, v) => s + v, 0) / q.length).toFixed(2));
      updatedGrades[index] = { ...g, final_grade: avg };
    }

    if (sortDesc) {
      updatedGrades = [...updatedGrades].sort((a, b) => (b.final_grade ?? -Infinity) - (a.final_grade ?? -Infinity));
    } else {
      updatedGrades = [...updatedGrades].sort((a, b) => (a.final_grade ?? -Infinity) - (b.final_grade ?? -Infinity));
    }

    setData('grades', updatedGrades);
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
            <TableHead className='text-center w-50'>
              <Button variant={'ghost'} onClick={toggleSort} className='w-full flex justify-between items-center'>
                <span>Final Grade</span>
                {sortDesc ? <ArrowDown10 size={16} /> : <ArrowDown01 size={16} />}
              </Button>
            </TableHead>
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
                  readOnly={!allowQ1}
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
                  readOnly={!allowQ2}
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
                  readOnly={!allowQ3}
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
                  readOnly={!allowQ4}
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
                  readOnly={!allowFinal}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className='flex justify-end'>
        {(allowQ1 || allowQ2 || allowQ3 || allowQ4 || allowFinal) &&
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
