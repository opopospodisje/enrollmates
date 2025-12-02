import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner'; // or your preferred toast
import { BookKey, CalendarCheck, CornerDownRight, List, PencilLine, Plus, SquarePlus } from 'lucide-react';
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

type Subject = {
  id?: number;
  code: string;
  name: string;
  is_special: boolean;
};

const CreateSubjectDialog = () => {
  const [open, setOpen] = useState(false);

  const getDefaultSubjectFormData = (): Subject => ({
    code: '',
    name: '',
    is_special: false,
  });

  const { data, setData, post, processing, errors } = useForm<Subject>(
    getDefaultSubjectFormData()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    post(route('admin.subjects.store'), {
      onSuccess: () => {
        toast.success('Subject created!');
        setData(getDefaultSubjectFormData());
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (isOpen) setData(getDefaultSubjectFormData());
    }}>
      <DialogTrigger asChild>
        <Button className='bg-emerald-600 text-white hover:bg-emerald-700'>
          <Plus className="mr-2 h-4 w-4" />
          Add Subject
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[520px] p-0">
        <form onSubmit={handleSubmit}>
          <DialogHeader className='p-4 gap-0'>
            <DialogTitle className='flex items-center gap-2'>
              <SquarePlus className='text-muted-foreground'/>
              <div className='text-2xl'>Add Subject</div>
            </DialogTitle>
            <DialogDescription className='flex items-center gap-2 px-2'>
              <CornerDownRight className='text-muted-foreground' size={18}/>
              <div>Fill in the subject.</div>              
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
              <Button variant="outline" type="button">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={processing} className='bg-emerald-600 hover:bg-emerald-800'>
              Create Subject
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSubjectDialog;
