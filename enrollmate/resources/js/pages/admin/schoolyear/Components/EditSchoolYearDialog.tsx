import React, { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
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
import { CalendarCheck, List, Pencil, PencilLine, SquarePen } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';

type SchoolYear = {
  id: number;
  name: string;
  is_active: boolean;
};

type Props = {
  schoolYear: SchoolYear;
  buttonStyle?: string;
};

const EditSchoolYearDialog = ({ schoolYear , buttonStyle}: Props) => {
  const [open, setOpen] = useState(false);

  const getDefaultSchoolYearFormData = (): SchoolYear => ({
    id: schoolYear.id || 0,
    name: schoolYear.name || '',
    is_active: schoolYear.is_active || false,
  });

  const { data, setData, put, processing, errors, reset } = useForm(
    getDefaultSchoolYearFormData()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    put(route('admin.schoolyears.update', schoolYear.id),{
      onSuccess: () => {
        toast.success('School Year updated successfully.');
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {buttonStyle === 'withName' ? (
          <Button className='bg-emerald-600 hover:bg-emerald-700'>
            <SquarePen className="mr-2" />
            Edit School Year
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
            <DialogTitle>Edit School Year</DialogTitle>
            <DialogDescription>
              Update the school year below.
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

export default EditSchoolYearDialog;
