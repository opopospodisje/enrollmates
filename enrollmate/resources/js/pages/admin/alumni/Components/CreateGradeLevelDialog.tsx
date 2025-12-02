import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner'; // or your preferred toast
import { CalendarCheck, CornerDownRight, List, PencilLine, Plus, SquarePlus } from 'lucide-react';
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

type GradeLevel = {
  id?: number;
  name: string;
};

const CreateGradeLevelDialog = () => {
  const [open, setOpen] = useState(false);

  const getDefaultGradeLevelFormData = (): GradeLevel => ({
    name: '',
  });

  const { data, setData, post, processing, errors } = useForm<GradeLevel>(
    getDefaultGradeLevelFormData()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    post(route('admin.gradelevels.store'), {
      onSuccess: () => {
        toast.success('Grade Level created!');
        setData(getDefaultGradeLevelFormData());
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (isOpen) setData(getDefaultGradeLevelFormData());
    }}>
      <DialogTrigger asChild>
        <Button className='bg-emerald-600 text-white hover:bg-emerald-700'>
          <Plus className="mr-2 h-4 w-4" />
          Add Grade Level
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[520px] p-0">
        <form onSubmit={handleSubmit}>
          <DialogHeader className='p-4 gap-0'>
            <DialogTitle className='flex items-center gap-2'>
              <SquarePlus className='text-muted-foreground'/>
              <div className='text-2xl'>Add Grade Level</div>
            </DialogTitle>
            <DialogDescription className='flex items-center gap-2 px-2'>
              <CornerDownRight className='text-muted-foreground' size={18}/>
              <div>Fill in the grade level.</div>              
            </DialogDescription>
          </DialogHeader>

          <Separator />

          <div className='w-full grid divide-x'>
            <div className='p-4'>
              <div className='flex items-center gap-2 mb-2'>
                <List className='text-muted-foreground' size={14}/>
                <div className='text-sm font-bold'>Grade Level Details:</div>
              </div>
              <div className='px-2 grid gap-4'>
                {/*name*/}
                <div className="grid col-span-full gap-2">
                  <div className='flex items-center text-neutral-600 gap-2'>
                    <PencilLine size={16}/>
                    <Label htmlFor="name" className='font-semibold'>Grade Level</Label>
                  </div>
                  <div className='px-4'>
                    <Input
                      id="name"
                      type="text"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      placeholder='Enter grade level here'
                      className='border border-dashed border-neutral-400'
                    />
                  </div>
                  {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
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
              Create Grade Level
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGradeLevelDialog;
