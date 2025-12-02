import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner'; // or your preferred toast
import { CalendarCheck, CalendarDays, CornerDownRight, FileDigit, FilePlus, List, Mail, MapPin, PencilLine, Plus, SquarePlus, VenusAndMars } from 'lucide-react';
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
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select"

type Student = {
  id: number;

  lrn: string;
  full_name: string;

  email: string;
  address: string;
  contact_number: string;
  gender: string;
  birthdate: string;
};

type Props = {
  students: Student[];
};

const CreateStudentDialog = ({ students }: Props) => {
  const [open, setOpen] = useState(false);

  const getDefaultStudentFormData = (): any => ({
    id: 0,
    is_graduated: true
  });

  const { data, setData, put, processing, errors } = useForm<Student>(
    getDefaultStudentFormData()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    put(route('admin.graduates.update', data.id),{
          onSuccess: () => {
            toast.success('Student updated successfully.');
            setData(getDefaultStudentFormData());
            setOpen(false);
          },

        });
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (isOpen) setData(getDefaultStudentFormData());
    }}>
      <DialogTrigger asChild>
        <Button className='bg-sidebar text-white flex gap-2 hover:underline hover:bg-sidebar'>
          <Plus className="h-4 w-4" />
          <span>Mark Student as Graduated</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[800px] p-0">
        <form onSubmit={handleSubmit}>
          <DialogHeader className='p-4 gap-0'>
            <DialogTitle className='flex items-center gap-2'>
              <SquarePlus className='text-muted-foreground'/>
              <div className='text-2xl'>Mark Student as Graduate</div>
            </DialogTitle>
            <DialogDescription className='flex items-center gap-2 px-2'>
              <CornerDownRight className='text-muted-foreground' size={18}/>
              <div>Mark Qualified Student as graduates</div>              
            </DialogDescription>
          </DialogHeader>

          <Separator />

          <div className='w-full grid divide-x'>
            <div className='p-4 flex flex-col gap-4'>
              <div className='gap-2 gap-y-4'>
                {/*Student*/}
                <div className="grid gap-2">
                  <div className='flex items-center text-neutral-600 gap-2'>
                    <FilePlus size={16}/>
                    <Label className='font-semibold'>Qualified Students</Label>
                  </div>
                  <div className='px-4'>
                    <Select                     
                      value={data.id === 0 ? '' : data.id.toString()}
                      onValueChange={(value) => setData('id', Number(value))}
                    >
                    <SelectTrigger className='border border-dashed border-neutral-400'>
                      <SelectValue placeholder="Select Student" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Students</SelectLabel>
                        {students.map((type) => (
                          <SelectItem key={type.id} value={type.id.toString()}>{type.full_name}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                    </Select>                
                  </div>
                  {errors.id && <p className="text-sm text-red-600">{errors.id}</p>}
                </div>

              </div>

              {/* Student Info Section */}
              {data.id !== 0 && (() => {
                const selectedStudent = students.find(s => s.id === data.id);
                return selectedStudent ? (
                  <div className='bg-gray-100 rounded border p-2'>
                    <div className='flex items-center gap-2 mb-2'>
                      <List className='text-muted-foreground' size={14}/>
                      <div className='text-sm font-bold'>Student Details:</div>
                    </div>

                    <div className="px-6">
                      <div className='py-2'>
                        <p className='font-light text-xs'>Name:</p>
                        <p className='font-black text-2xl px-2'>{selectedStudent.full_name}</p>
                      </div>
                      <p className='text-sm'><span >LRN:</span> {selectedStudent.lrn}</p>
                      <p className='text-sm'><span >Email:</span> {selectedStudent.email}</p>
                      <p className='text-sm'><span >Address:</span> {selectedStudent.address}</p>
                      <p className='text-sm'><span >Contact:</span> {selectedStudent.contact_number}</p>
                      <p className='text-sm'><span >Gender:</span> {selectedStudent.gender}</p>
                      <p className='text-sm'><span >Birth Date:</span> {selectedStudent.birthdate}</p>
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          </div>
          
          <Separator />

          <DialogFooter className='p-4'>
            <DialogClose asChild>
              <Button variant="outline" type="button">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={processing} className='bg-emerald-600 hover:bg-emerald-800'>
              Mark Student as Graduate
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStudentDialog;
