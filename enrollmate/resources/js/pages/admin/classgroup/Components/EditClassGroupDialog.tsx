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
import { BookUp2, CalendarDays, ChartBar, List, PencilLine, SquarePen } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

type SchoolYear = {
  id: number;
  name: string;
};

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
  section_id: number;
  school_year_id: number;
}


type ClassGroupFormData = {
  id: number;
  section_id: number;
  school_year_id: number;
};

type Props = {
  classGroup: ClassGroup;
  sections: Section[]; 
  schoolYears: SchoolYear[];   // 👈 add this
  schoolYear: SchoolYear;      // active year (single)
  buttonStyle?: string;
};

const EditClassGroupDialog = ({ classGroup,sections ,schoolYears,schoolYear, buttonStyle}: Props) => {
  const [open, setOpen] = useState(false);

  const getDefaultClassGroupFormData = (): ClassGroupFormData => ({
    id: classGroup.id,
    section_id: classGroup.section_id,
    school_year_id: classGroup.school_year_id,
  });

  // 👇 explicitly type it
  const { data, setData, put, processing, errors, reset } = useForm<ClassGroupFormData>(
    getDefaultClassGroupFormData()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    put(route('admin.classgroups.update', classGroup.id),{
      onSuccess: () => {
        toast.success('Class Group updated successfully.');
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {buttonStyle === 'withName' ? (
          <Button className='bg-emerald-600 hover:bg-emerald-700'>
            <SquarePen className="mr-2" />
            Edit Class Group
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
            <DialogTitle>Edit Class Group</DialogTitle>
            <DialogDescription>
              Update the class group below.
            </DialogDescription>
          </DialogHeader>

          <Separator />

          <div className='w-full grid divide-x'>
            <div className='p-4'>
              <div className='flex items-center gap-2 mb-2'>
                <List className='text-muted-foreground' size={14}/>
                <div className='text-sm font-bold'>ClassGroup Details:</div>
              </div>
              <div className='px-2 grid gap-4'>
                {/*section*/}
                <div className="grid gap-2">
                  <div className='flex items-center text-neutral-600 gap-2'>
                    <BookUp2 size={16}/>
                    <Label className='font-semibold'>Section</Label>
                  </div>
                  <div className='px-4'>
                    <Select                     
                      value={data.section_id === 0 ? '' : data.section_id.toString()}
                      onValueChange={(value) => setData('section_id', Number(value))}
                    >
                    <SelectTrigger className='border border-dashed border-neutral-400'>
                      <SelectValue placeholder="Section & Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className='max-h-60 overflow-y-auto'>
                        <SelectLabel>Section & Level</SelectLabel>
                        {sections.map((type) => (
                          <SelectItem key={type.id} value={type.id.toString()}>
                            {type.name} - {type.grade_level?.name ?? 'No Grade'}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                    </Select>                
                  </div>
                  {errors.section_id && <p className="text-sm text-red-600">{errors.section_id}</p>}
                </div>

                {/*school_year_id*/}
                <div className="grid col-span-full gap-2">
                  <div className='flex items-center text-neutral-600 gap-2'>
                    <CalendarDays size={16}/>
                    <Label className='font-semibold'>School Year</Label>
                  </div>
                  <div className='px-4'>
                    <Select                     
                      value={data.school_year_id === 0 ? '' : data.school_year_id.toString()}
                      onValueChange={(value) => setData('school_year_id', Number(value))}
                    >
                    <SelectTrigger className='border border-dashed border-neutral-400'>
                      <SelectValue placeholder="School Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>School Years</SelectLabel>
                        {schoolYears.map((type) => (
                          <SelectItem key={type.id} value={type.id.toString()}>{type.name}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                    </Select>                
                  </div>
                  {errors.school_year_id && <p className="text-sm text-red-600">{errors.school_year_id}</p>}
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

export default EditClassGroupDialog;
