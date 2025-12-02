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
import { BookKey, CalendarCheck, List, Pencil, PencilLine, SquarePen } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';

type Subject = {
  id?: number;
  code: string;
  name: string;
  is_special: boolean;
};

type Props = {
  subject: Subject;
  buttonStyle?: string;
};

const EditSubjectDialog = ({ subject , buttonStyle}: Props) => {
  const [open, setOpen] = useState(false);

  const getDefaultSubjectFormData = (): Subject => ({
    id: subject.id || 0,
    code: subject.code || '',
    name: subject.name || '',
    is_special: subject.is_special || false,
  });

  const { data, setData, put, processing, errors, reset } = useForm(
    getDefaultSubjectFormData()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    put(route('admin.subjects.update', subject.id));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {buttonStyle === 'withName' ? (
          <Button className='bg-emerald-600 hover:bg-emerald-700'>
            <SquarePen className="mr-2" />
            Edit Subject
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
            <DialogTitle>Edit Subject</DialogTitle>
            <DialogDescription>
              Update the subject below.
            </DialogDescription>
          </DialogHeader>

          <Separator />

          <div className='w-full grid divide-x'>
            <div className='p-4'>
              <div className='flex items-center gap-2 mb-2'>
                <List className='text-muted-foreground' size={14}/>
                <div className='text-sm font-bold'>Subject Details:</div>
              </div>
              <div className='px-2 grid gap-4'>
                {/*code*/}
                <div className="grid col-span-full gap-2">
                  <div className='flex items-center text-neutral-600 gap-2'>
                    <BookKey size={16}/>
                    <Label htmlFor="code" className='font-semibold'>Code</Label>
                  </div>
                  <div className='px-4'>
                    <Input
                      id="code"
                      type="text"
                      value={data.code}
                      onChange={(e) => setData('code', e.target.value)}
                      placeholder='Enter subject code here'
                      className='border border-dashed border-neutral-400'
                    />
                  </div>
                  {errors.code && <p className="text-sm text-red-600">{errors.code}</p>}
                </div>

                {/*name*/}
                <div className="grid col-span-full gap-2">
                  <div className='flex items-center text-neutral-600 gap-2'>
                    <PencilLine size={16}/>
                    <Label htmlFor="name" className='font-semibold'>Subject</Label>
                  </div>
                  <div className='px-4'>
                    <Input
                      id="name"
                      type="text"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      placeholder='Enter subject name here'
                      className='border border-dashed border-neutral-400'
                    />
                  </div>
                  {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                </div>

                {/*is_special*/}
                <div className="col-span-full flex items-center gap-2">
                  <Checkbox
                    id="is_active"
                    checked={data.is_special}
                    onCheckedChange={(checked) => setData('is_special', !!checked)}
                  />
                  <div className="flex gap-1">
                    <Label htmlFor="is_active">Special Subject</Label>
                    <p className="text-muted-foreground text-sm">
                      (Check if this is a special subject.)
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

export default EditSubjectDialog;
