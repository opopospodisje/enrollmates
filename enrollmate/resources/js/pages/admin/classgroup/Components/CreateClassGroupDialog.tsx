import React, { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner'; // or your preferred toast
import { BookUp2, Calendar, CalendarCheck, ChartBar, CornerDownRight, List, PencilLine, Plus, SquarePlus } from 'lucide-react';
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


type ClassGroupFormData = {
  id?: number;
  section_id: number;
  school_year_id: number;
};

type CreateClassGroupDialogProps = {
  sections: Section[]; 
  schoolYear: SchoolYear;
  schoolYears: SchoolYear[];
};

const CreateClassGroupDialog = ({sections, schoolYear,schoolYears }: CreateClassGroupDialogProps) => {
  const [open, setOpen] = useState(false);

  const getDefaultClassGroupFormData = (): ClassGroupFormData => ({
    section_id: 0,
    school_year_id: schoolYear?.id ?? 0,
  });

  const { data, setData, post, processing, errors } = useForm<ClassGroupFormData>(
    getDefaultClassGroupFormData()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    post(route('admin.classgroups.store'), {
      onSuccess: () => {
        toast.success('Class Group created!');
        setData(getDefaultClassGroupFormData());
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (isOpen) setData(getDefaultClassGroupFormData());
    }}>
      <DialogTrigger asChild>
        <Button className='bg-emerald-600 text-white hover:bg-emerald-700'>
          <Plus className="mr-2 h-4 w-4" />
          Add Class Group
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[520px] p-0">
        <form onSubmit={handleSubmit}>
          <DialogHeader className='p-4 gap-0'>
            <DialogTitle className='flex items-center gap-2'>
              <SquarePlus className='text-muted-foreground'/>
              <div className='text-2xl'>Add Class Group</div>
            </DialogTitle>
            <DialogDescription className='flex items-center gap-2 px-2'>
              <CornerDownRight className='text-muted-foreground' size={18}/>
              <div>Fill in the section.</div>              
            </DialogDescription>
          </DialogHeader>

          <Separator />

          <div className='w-full grid divide-x'>
            <div className='p-4'>
              <div className='flex items-center gap-2 mb-2'>
                <List className='text-muted-foreground' size={14}/>
                <div className='text-sm font-bold'>Class Group Details:</div>
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
                <div className="grid gap-2">
                  <div className='flex items-center text-neutral-600 gap-2'>
                    <Calendar size={16}/>
                    <Label className='font-semibold'>School Year</Label>
                  </div>
                  <div className='px-4'>
                    <Select                     
                      value={data.school_year_id ? data.school_year_id.toString() : ''}
                      onValueChange={(value) => setData('school_year_id', Number(value))}
                    >
                    <SelectTrigger className='border border-dashed border-neutral-400'>
                      <SelectValue placeholder="Grade Level" />
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
              <Button variant="outline" type="button">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={processing} className='bg-emerald-600 hover:bg-emerald-800'>
              Create Class Group
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateClassGroupDialog;
