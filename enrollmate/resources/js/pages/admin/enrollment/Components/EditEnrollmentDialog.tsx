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
import { BookUp2, CalendarDays, ChartBar, FilePlus, List, ListTodo, PencilLine, SquarePen } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Checkbox } from '@/components/ui/checkbox';

type Student = {
  id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix: string;
};

type ClassGroup = {
  id: number;
  section:{
    id: number;
    name: string;
  }
  school_year:{
    id: number;
    name: string;
  }
};

type Enrollment = {
  id?: number;
  
  student_id:number;
  class_group_id:number;

  status:string;
  enrolled_at:string;
};  

type Props = {
  enrollment: Enrollment;
  classGroups: ClassGroup[]; 
  students: Student[];
  buttonStyle?: string;
};

const EditEnrollmentDialog = ({ enrollment ,classGroups ,students, buttonStyle}: Props) => {
  const [open, setOpen] = useState(false);

  const getDefaultEnrollmentFormData = (): Enrollment => ({
    id: enrollment.id,
    student_id: enrollment.student_id,
    class_group_id: enrollment.class_group_id,
    status: enrollment.status,
    enrolled_at: enrollment.enrolled_at,
  });

  const { data, setData, put, processing, errors, reset } = useForm(
    getDefaultEnrollmentFormData()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    put(route('admin.enrollments.update', enrollment.id));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {buttonStyle === 'withName' ? (
          <Button className='bg-emerald-600 hover:bg-emerald-700'>
            <SquarePen className="mr-2" />
            Edit Enrollment
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
            <DialogTitle>Edit Enrollment</DialogTitle>
            <DialogDescription>
              Update the enrollment below.
            </DialogDescription>
          </DialogHeader>

          <Separator />

          <div className='w-full grid divide-x'>
            <div className='p-4'>
              <div className='flex items-center gap-2 mb-2'>
                <List className='text-muted-foreground' size={14}/>
                <div className='text-sm font-bold'>Enrollment Details:</div>
              </div>
              <div className='px-2 grid gap-4'>
                {/*Student*/}
                <div className="grid col-span-full gap-2">
                  <div className='flex items-center text-neutral-600 gap-2'>
                    <FilePlus size={16}/>
                    <Label className='font-semibold'>Students</Label>
                  </div>
                  <div className='px-4'>
                    <Select                     
                      value={data.student_id === 0 ? '' : data.student_id.toString()}
                      onValueChange={(value) => setData('student_id', Number(value))}
                    >
                    <SelectTrigger className='border border-dashed border-neutral-400'>
                      <SelectValue placeholder="Select Student" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Students</SelectLabel>
                        {students.map((type) => (
                          <SelectItem key={type.id} value={type.id.toString()}>{type.last_name},{type.first_name} {type.middle_name} {type.suffix}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                    </Select>                
                  </div>
                  {errors.student_id && <p className="text-sm text-red-600">{errors.student_id}</p>}
                </div>

                {/*class_group_id*/}
                <div className="grid col-span-full gap-2">
                  <div className='flex items-center text-neutral-600 gap-2'>
                    <BookUp2 size={16}/>
                    <Label className='font-semibold'>Section</Label>
                  </div>
                  <div className='px-4'>
                    <Select                     
                      value={data.class_group_id === 0 ? '' : data.class_group_id.toString()}
                      onValueChange={(value) => setData('class_group_id', Number(value))}
                    >
                    <SelectTrigger className='border border-dashed border-neutral-400'>
                      <SelectValue placeholder="Section & Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Section & Level</SelectLabel>
                        {classGroups.map((type) => (
                          <SelectItem key={type.id} value={type.id.toString()}>
                            {type.section?.name} - {type.school_year?.name ?? 'No Grade'}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                    </Select>                
                  </div>
                  {errors.class_group_id && <p className="text-sm text-red-600">{errors.class_group_id}</p>}
                </div>

                {/* status */}
                <div className="grid col-span-full gap-2">
                  <div className="flex items-center text-neutral-600 gap-2">
                    <ListTodo size={16} />
                    <Label className="font-semibold">Status</Label>
                  </div>
                  <div className="px-4">
                    <Select
                      value={data.status}
                      onValueChange={(value) => setData('status', value)}
                    >
                      <SelectTrigger className="border border-dashed border-neutral-400">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Status</SelectLabel>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="promoted">Promoted</SelectItem>
                          <SelectItem value="retained">Retained</SelectItem>
                          <SelectItem value="transffered">Transferred</SelectItem>
                          <SelectItem value="dropped">Dropped</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.status && (
                    <p className="text-sm text-red-600">{errors.status}</p>
                  )}
                </div>

                {/* enrolled_at */}
                <div className="grid col-span-1 gap-2">
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

          <Separator />

          <DialogFooter className='p-4'>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={processing}>
              Update
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEnrollmentDialog;
