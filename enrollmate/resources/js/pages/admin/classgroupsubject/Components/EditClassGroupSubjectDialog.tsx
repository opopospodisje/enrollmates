import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookUp2, ChartBar, List, PencilLine, SquarePen } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

type ClassGroup = {
  id: number;
  section_name: string;
  grade_level_name: string;
  school_year_name: string;
}

type Subject = {
  id: number;
  name: string;
};

type Teacher = {
  id: number;
  first_name: string;
  last_name: string;
};

type ClassGroupSubjectFormData = {
  id?: number;
  class_group_id: number;
  subject_id: number;
  teacher_id: number;
};


type Props = {
  classGroupSubject: ClassGroupSubjectFormData;
  classGroups: ClassGroup[];
  subjects: Subject[];
  teachers: Teacher[];
  buttonStyle?: string;
};

const EditClassGroupSubjectDialog = ({ classGroupSubject ,classGroups, subjects,teachers, buttonStyle}: Props) => {
  const [open, setOpen] = useState(false);

  const getDefaultClassGroupSubjectFormData = (): ClassGroupSubjectFormData => ({
    id: classGroupSubject.id,
    class_group_id: classGroupSubject.class_group_id,
    subject_id: classGroupSubject.subject_id,
    teacher_id: classGroupSubject.teacher_id,
  });

  const { data, setData, put, processing, errors, reset } = useForm(
    getDefaultClassGroupSubjectFormData()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('admin.classgroupsubjects.update', classGroupSubject.id));
    toast.success('Class Group Subject updated successfully!');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {buttonStyle === 'withName' ? (
          <Button className='bg-emerald-600 hover:bg-emerald-700'>
            <SquarePen className="mr-2" />
            Edit Class Group Subject
          </Button>
        ) : (
          <Button variant="outline">
            <SquarePen />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[520px] p-0">
        <form onSubmit={handleSubmit}>
          <DialogHeader className='p-4 gap-0'>
            <DialogTitle>Edit Class Group Subject</DialogTitle>
            <DialogDescription>
              Update the class group subject below.
            </DialogDescription>
          </DialogHeader>

          <Separator />

          <div className='w-full grid divide-x'>
            <div className='p-4'>
              <div className='flex items-center gap-2 mb-2'>
                <List className='text-muted-foreground' size={14}/>
                <div className='text-sm font-bold'>Class Group Subject Details:</div>
              </div>
              <div className='px-2 grid gap-4'>
                {/*classGroups*/}
                <div className="grid gap-2">
                  <div className='flex items-center text-neutral-600 gap-2'>
                    <BookUp2 size={16}/>
                    <Label className='font-semibold'>Class Group Subject</Label>
                  </div>
                  <div className='px-4'>
                    <Select                     
                      value={data.class_group_id === 0 ? '' : data.class_group_id.toString()}
                      onValueChange={(value) => setData('class_group_id', Number(value))}
                    >
                    <SelectTrigger className='border border-dashed border-neutral-400'>
                      <SelectValue placeholder="Class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Section & Level</SelectLabel>
                        {classGroups.map((type) => (
                          <SelectItem key={type.id} value={type.id.toString()}>{type.section_name} - {type.grade_level_name} ({type.school_year_name})</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                    </Select>                
                  </div>
                  {errors.class_group_id && <p className="text-sm text-red-600">{errors.class_group_id}</p>}
                </div>

                {/*subjects*/}
                <div className="grid gap-2">
                  <div className='flex items-center text-neutral-600 gap-2'>
                    <BookUp2 size={16}/>
                    <Label className='font-semibold'>Subject</Label>
                  </div>
                  <div className='px-4'>
                    <Select                     
                      value={data.subject_id === 0 ? '' : data.subject_id.toString()}
                      onValueChange={(value) => setData('subject_id', Number(value))}
                    >
                    <SelectTrigger className='border border-dashed border-neutral-400'>
                      <SelectValue placeholder="Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Subjects</SelectLabel>
                        {subjects.map((type) => (
                          <SelectItem key={type.id} value={type.id.toString()}>{type.name}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                    </Select>                
                  </div>
                  {errors.subject_id && <p className="text-sm text-red-600">{errors.subject_id}</p>}
                </div>

                {/*teachers*/}
                <div className="grid gap-2">
                  <div className='flex items-center text-neutral-600 gap-2'>
                    <BookUp2 size={16}/>
                    <Label className='font-semibold'>Teacher</Label>
                  </div>
                  <div className='px-4'>
                    <Select                     
                      value={data.teacher_id === 0 ? '' : data.teacher_id.toString()}
                      onValueChange={(value) => setData('teacher_id', Number(value))}
                    >
                    <SelectTrigger className='border border-dashed border-neutral-400'>
                      <SelectValue placeholder="Assigned a teacher" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Teachers</SelectLabel>
                        {teachers.map((type) => (
                          <SelectItem key={type.id} value={type.id.toString()}>{type.last_name},{type.first_name}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                    </Select>                
                  </div>
                  {errors.teacher_id && <p className="text-sm text-red-600">{errors.teacher_id}</p>}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <DialogFooter className='p-4'>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={processing}>
              Update Class Group Subject
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditClassGroupSubjectDialog;
