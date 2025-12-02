import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner'; // or your preferred toast
import { BookUp2, CalendarCheck, CalendarDays, ChartBar, CornerDownRight, FilePlus, List, ListTodo, PencilLine, Plus, SquarePlus } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select"
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
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
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
  section: {
    id: number;
    name: string;
    grade_level: {
      id: number;
      name: string;
    };
  };
  school_year: {
    id: number;
    name: string;
  };
};

type Enrollment = {
  id?: number;
  student_id:number;
  class_group_id:number;
  status:string;
  enrolled_at:string;
};  


type CreateEnrollmentDialogProps = {
  students: Student[];
  classGroups: ClassGroup[]; 
};

const CreateEnrollmentDialog = ({classGroups,students }: CreateEnrollmentDialogProps) => {
  const [open, setOpen] = useState(false);

  const getDefaultEnrollmentFormData = (): Enrollment => ({
    student_id: 0,
    class_group_id: 0,
    status: '',
    enrolled_at: new Date().toISOString().slice(0, 10) // "YYYY-MM-DD"
  });

  const { data, setData, post, processing, errors } = useForm<Enrollment>(
    getDefaultEnrollmentFormData()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    post(route('admin.enrollments.store'), {
      onSuccess: () => {
        toast.success('Enrollment created!');
        setData(getDefaultEnrollmentFormData());
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (isOpen) setData(getDefaultEnrollmentFormData());
    }}>
      <DialogTrigger asChild>
        <Button className='bg-emerald-600 text-white hover:bg-emerald-700'>
          <Plus className="mr-2 h-4 w-4" />
          Add Enrollment
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[520px] p-0">
        <form onSubmit={handleSubmit}>
          <DialogHeader className='p-4 gap-0'>
            <DialogTitle className='flex items-center gap-2'>
              <SquarePlus className='text-muted-foreground'/>
              <div className='text-2xl'>Add Enrollment</div>
            </DialogTitle>
            <DialogDescription className='flex items-center gap-2 px-2'>
              <CornerDownRight className='text-muted-foreground' size={18}/>
              <div>Fill in the enrollment.</div>              
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
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Class Lists</SelectLabel>
                        {classGroups.map((type) => (
                          <SelectItem key={type.id} value={type.id.toString()}>
                            {type.section?.grade_level?.name} - {type.section?.name} - {type.school_year?.name ?? 'No Grade'}
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
                          <SelectItem value="transferred">Transferred</SelectItem>
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
          
          <Separator />

          <DialogFooter className='p-4'>
            <DialogClose asChild>
              <Button variant="outline" type="button">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={processing} className='bg-emerald-600 hover:bg-emerald-800'>
              Create Enrollment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEnrollmentDialog;
