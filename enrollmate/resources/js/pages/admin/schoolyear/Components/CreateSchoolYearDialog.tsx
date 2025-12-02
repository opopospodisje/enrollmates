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

type SchoolYearFormData = {
  name: string;
  is_active: boolean;
};

const CreateSchoolYearDialog = () => {
  const [open, setOpen] = useState(false);

  const getDefaultSchoolYearFormData = (): SchoolYearFormData => ({
    name: '',
    is_active: false,
  });

  const { data, setData, post, processing, errors } = useForm<SchoolYearFormData>(
    getDefaultSchoolYearFormData()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    post(route('admin.schoolyears.store'), {
      onSuccess: () => {
        toast.success('School year created!');
        setData(getDefaultSchoolYearFormData());
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (isOpen) setData(getDefaultSchoolYearFormData());
    }}>
      <DialogTrigger asChild>
        <Button className='bg-emerald-600 text-white hover:bg-emerald-700'>
          <Plus className="mr-2 h-4 w-4" />
          Add School Year
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[520px] p-0">
        <form onSubmit={handleSubmit}>
          <DialogHeader className='p-4 gap-0'>
            <DialogTitle className='flex items-center gap-2'>
              <SquarePlus className='text-muted-foreground'/>
              <div className='text-2xl'>Add School Year</div>
            </DialogTitle>
            <DialogDescription className='flex items-center gap-2 px-2'>
              <CornerDownRight className='text-muted-foreground' size={18}/>
              <div>Fill in the school year.</div>              
            </DialogDescription>
          </DialogHeader>

          <Separator />

          <div className='w-full grid divide-x'>
            <div className='p-4'>
              <div className='flex items-center gap-2 mb-2'>
                <List className='text-muted-foreground' size={14}/>
                <div className='text-sm font-bold'>School Year Details:</div>
              </div>
              <div className='px-2 grid gap-4'>
                {/*name*/}
                <div className="grid col-span-full gap-2">
                  <div className='flex items-center text-neutral-600 gap-2'>
                    <PencilLine size={16}/>
                    <Label htmlFor="name" className='font-semibold'>School Year</Label>
                  </div>
                  <div className='px-4'>
                    <Input
                      id="name"
                      type="text"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      placeholder='Enter school year here'
                      className='border border-dashed border-neutral-400'
                    />
                  </div>
                  {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                </div>

                {/*is active*/}
                <div className="col-span-full flex items-center gap-2">
                  <Checkbox
                    id="is_active"
                    checked={data.is_active}
                    onCheckedChange={(checked) => setData('is_active', !!checked)}
                  />
                  <div className="flex gap-1">
                    <Label htmlFor="is_active">Active</Label>
                    <p className="text-muted-foreground text-sm">
                      (If active, This will be the current school year.)
                    </p>
                  </div>
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
              Create School Year
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSchoolYearDialog;
