import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from '@/components/ui/separator';
import { Toaster } from '@/components/ui/sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { BookUp2, CalendarDays, FilePlus, List, ListTodo } from 'lucide-react';
import * as React from "react";
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Enrollments',
    href: '/teacher/enrollments',
  },
];

type Student = {
  id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix: string;
};

type ClassGroup = {
  id: number;
  section: {
    id: number;
    name: string;
    grade_level: { id: number; name: string };
  };
  school_year: { id: number; name: string };
  student_limit?: number;
  enrollments_count?: number;
};

type Enrollment = {
  id?: number;
  student_id: number;
  class_group_id: number;
  class_group_name?: string;
  status: string;
  enrolled_at: string;
  student_name?: string;
};

type EnrollmentIndexProps = {
  enrollments: Enrollment[];
  students: Student[];
  classGroups: ClassGroup[];
  selectedLevel: string;
  selectedSection: string;
  selectedSchoolYear: string;
};

const EnrollmentIndex = ({ enrollments, classGroups, students }: EnrollmentIndexProps) => {
  const getDefaultEnrollmentFormData = (): Enrollment => ({
    student_id: 0,
    class_group_id: 0,
    status: '',
    enrolled_at: new Date().toISOString().slice(0, 10)
  });

  const { data, setData, post, processing, errors } = useForm<Enrollment>(getDefaultEnrollmentFormData());
  const [studentQuery, setStudentQuery] = React.useState("");
  const [showResults, setShowResults] = React.useState(false);
  const filteredStudents = React.useMemo(() => {
    const q = studentQuery.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) => {
      const full = `${s.last_name}, ${s.first_name} ${s.middle_name ?? ''} ${s.suffix ?? ''}`.toLowerCase();
      return full.includes(q);
    });
  }, [studentQuery, students]);

  const handleStudentSelect = (id: number) => {
    const selected = students.find((s) => s.id === id);
    const label = selected ? `${selected.last_name}, ${selected.first_name} ${selected.middle_name ?? ''} ${selected.suffix ?? ''}` : '';
    setData('student_id', id);
    setStudentQuery(label);
    setShowResults(false);
    const ready = id !== 0 && data.class_group_id !== 0 && data.status !== '' && data.enrolled_at !== '';
    if (ready) {
      post(route('teacher.enrollments.store'), {
        onSuccess: () => {
          toast.success('Enrollment created!');
          setData(getDefaultEnrollmentFormData());
        },
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('teacher.enrollments.store'), {
      onSuccess: () => {
        toast.success('Enrollment created!');
        setData(getDefaultEnrollmentFormData());
      },
    });
  };

  return (
    <div className="container">
      <Head title="Teacher Enrollment" />
      <Toaster position='top-center' />

      <Heading title="Enrollment Management" description="Enroll students into your classes" icon={BookUp2} />

      <div className='relative border-y py-2 my-4'>
        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
      </div>

      <form onSubmit={handleSubmit}>
        <Card className='gap-2 py-4'>
          <CardHeader className='border-b pb-4'>
            <div className='gap-2font-extrabold'>Complete enrollment form and submit.</div>
          </CardHeader>
          <CardContent>
            <div className='w-full grid divide-x'>
              <div className=''>
                <div className='grid gap-4'>
                  <div className="grid col-span-full gap-2">
                    <div className='flex items-center text-neutral-600 gap-2'>
                      <FilePlus size={16} />
                      <Label className='font-semibold'>Students</Label>
                    </div>
                    <div className='px-4 grid gap-2'>
                      <Input
                        value={studentQuery}
                        onChange={(e) => { setStudentQuery(e.target.value); setShowResults(true); }}
                        onFocus={() => setShowResults(true)}
                        placeholder='Type to search student (Last, First Middle Suffix)'
                        autoComplete='off'
                        className='border border-dashed border-neutral-400'
                      />
                      {showResults && (
                      <div className='border rounded-md max-h-48 overflow-y-auto pointer-events-auto relative z-10'>
                        {filteredStudents.map((type) => {
                          const label = `${type.last_name}, ${type.first_name} ${type.middle_name ?? ''} ${type.suffix ?? ''}`;
                          const isSelected = data.student_id === type.id;
                          return (
                            <button
                              key={type.id}
                              type='button'
                              onPointerDown={(e) => { e.preventDefault(); handleStudentSelect(type.id); }}
                              onKeyDown={(e) => { if (e.key === 'Enter') handleStudentSelect(type.id); }}
                              onClick={() => handleStudentSelect(type.id)}
                              className={`w-full text-left px-3 py-2 cursor-pointer ${isSelected ? 'bg-sidebar-accent/30 font-semibold' : ''}`}
                            >
                              {label}
                            </button>
                          );
                        })}
                        {filteredStudents.length === 0 && (
                          <div className='px-3 py-2 text-sm text-muted-foreground'>No students found</div>
                        )}
                      </div>
                      )}
                    </div>
                    {errors.student_id && <p className="text-sm text-red-600">{errors.student_id}</p>}
                  </div>

                  <div className="grid col-span-full gap-2">
                    <div className='flex items-center text-neutral-600 gap-2'>
                      <BookUp2 size={16} />
                      <Label className='font-semibold'>Class Group</Label>
                    </div>
                    <div className='px-4'>
                      <Select
                        value={data.class_group_id === 0 ? '' : data.class_group_id.toString()}
                        onValueChange={(value) => setData('class_group_id', Number(value))}
                      >
                        <SelectTrigger className='border border-dashed border-neutral-400'>
                          <SelectValue placeholder="Select Class" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup className='max-h-48 overflow-y-auto'>
                            <SelectLabel>Grade - Section(SY)</SelectLabel>
                            {classGroups.map((type) => (
                              <SelectItem key={type.id} value={type.id.toString()}>
                                {type.section?.grade_level?.name} - {type.section?.name} ({type.school_year?.name ?? 'No SY'})
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    {errors.class_group_id && <p className="text-sm text-red-600">{errors.class_group_id}</p>}
                  </div>

                  <div className="grid col-span-full gap-2">
                    <div className="flex items-center text-neutral-600 gap-2">
                      <ListTodo size={16} />
                      <Label className="font-semibold">Status</Label>
                    </div>
                    <div className="px-4">
                      <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                        <SelectTrigger className="border border-dashed border-neutral-400">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Status</SelectLabel>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="promoted">Promoted</SelectItem>
                            <SelectItem value="retained">Retained</SelectItem>
                            <SelectItem value="transferred">Transferred</SelectItem>
                            <SelectItem value="dropped">Dropped</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    {errors.status && <p className="text-sm text-red-600">{errors.status}</p>}
                  </div>

                  <div className="grid col-span-full gap-2">
                    <div className="flex items-center text-neutral-600 gap-2">
                      <CalendarDays size={16} />
                      <Label htmlFor="enrolled_at" className="font-semibold">Enrolled At</Label>
                    </div>
                    <div className="px-4">
                      <Input
                        id="enrolled_at"
                        type="date"
                        value={data.enrolled_at}
                        onChange={(e) => setData('enrolled_at', e.target.value)}
                        placeholder="YYYY-MM-DD"
                        className="border border-dashed border-neutral-400"
                      />
                    </div>
                    {errors.enrolled_at && <p className="text-sm text-red-600">{errors.enrolled_at}</p>}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className='border-t pt-4'>
            <Button type="submit" disabled={processing} className='bg-sidebar ml-auto text-white flex gap-2 hover:underline hover:bg-sidebar'>
              Create Enrollment
            </Button>
          </CardFooter>
        </Card>
      </form>

      <Separator className='my-4' />

      <Card className="p-0 gap-0 overflow-hidden">
        <CardHeader className="p-4">
          <div className="flex items-center gap-2">
            <List className="text-muted-foreground" size={18} />
            <h2 className="text-md font-semibold">Your Recent Enrollments</h2>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="px-4 pb-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-16 text-center'>ID</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Enrolled At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrollments.map((enroll) => (
                <TableRow key={enroll.id} className='divide-x'>
                  <TableCell className='text-center'>{enroll.id}</TableCell>
                  <TableCell>{enroll.student_name}</TableCell>
                  <TableCell>{enroll.class_group_name}</TableCell>
                  <TableCell className='capitalize'>{enroll.status}</TableCell>
                  <TableCell>{enroll.enrolled_at}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

EnrollmentIndex.layout = (page: React.ReactNode) => (
  <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);

export default EnrollmentIndex;
