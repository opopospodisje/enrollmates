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
import { List, Pencil, PencilLine, SquarePen } from 'lucide-react';
import { RoomType } from '@/types';
import { Separator } from '@/components/ui/separator';

type Props = {
  roomType: RoomType;
  buttonStyle?: string;
};

const EditRoomTypeDialog = ({ roomType , buttonStyle}: Props) => {
  const [open, setOpen] = useState(false);

  const { data, setData, put, processing, errors, reset } = useForm({
    name: roomType.name,
  });

  useEffect(() => {
    if (open) {
      setData('name', roomType.name);
    } else {
      reset();
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    put(route('roomtypes.update', roomType.id), {
      onSuccess: () => {
        toast.success('Room type updated!');
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {buttonStyle === 'withName' ? (
          <Button className='bg-emerald-600 hover:bg-emerald-700'>
            <SquarePen className="mr-2" />
            Edit Room Type
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
            <DialogTitle>Edit Room Type</DialogTitle>
            <DialogDescription>
              Update the room type name below.
            </DialogDescription>
          </DialogHeader>

          <Separator />

          <div className='w-full grid divide-x'>
            <div className='p-4'>
              <div className='flex items-center gap-2 mb-2'>
                <List className='text-muted-foreground' size={14}/>
                <div className='text-sm font-bold'>Room Type Details:</div>
              </div>
              <div className='px-2'>
                  {/*name*/}
                  <div className="grid col-span-full gap-2">
                      <div className='flex items-center text-neutral-600 gap-2'>
                        <PencilLine size={16}/>
                        <Label htmlFor="name" className='font-semibold'>Room Type Name</Label>
                      </div>
                      <div className='px-4'>
                        <Input
                          id="name"
                          type="text"
                          value={data.name}
                          onChange={(e) => setData('name', e.target.value)}
                          placeholder='Enter room type name here'
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

export default EditRoomTypeDialog;
