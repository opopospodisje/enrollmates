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
import { CalendarCheck, CalendarDays, List, Mail, MapPin, Pencil, PencilLine, SquarePen, VenusAndMars } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';

type Teacher = {
  id?: number;
  first_name: string;
  last_name: string;
  middle_name: string;
  suffix: string;
  email: string;
  address: string;
  contact_number: string;
  gender: string;
  birthdate: string;
};

type Props = {
  teacher: Teacher;
  buttonStyle?: string;
};

const EditTeacherDialog = ({ teacher , buttonStyle}: Props) => {
  const [open, setOpen] = useState(false);

  const getDefaultTeacherFormData = (): Teacher => ({
    id: teacher.id,
    first_name: teacher.first_name || '',
    last_name: teacher.last_name || '',
    middle_name: teacher.middle_name || '',
    suffix: teacher.suffix || '',
    email: teacher.email || '',
    address: teacher.address || '',
    contact_number: teacher.contact_number || '',
    gender: teacher.gender || '',
    birthdate: teacher.birthdate || '',
  });

  const { data, setData, put, processing, errors, reset } = useForm(
    getDefaultTeacherFormData()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    put(route('admin.teachers.update', teacher.id),{
      onSuccess: () => {
        toast.success('Teacher updated successfully.');
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {buttonStyle === 'withName' ? (
          <Button className='bg-emerald-600 hover:bg-emerald-700' title="Edit Teacher">
            <SquarePen className="mr-2" />
            Edit Grade Level
          </Button>
        ) : (
          <Button variant="outline" title="Edit Teacher">
            <SquarePen />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[800px] p-0">
        <form onSubmit={handleSubmit}>
          <DialogHeader className='p-4 gap-0'>
            <DialogTitle>Edit Grade Level</DialogTitle>
            <DialogDescription>
              Update the grade level below.
            </DialogDescription>
          </DialogHeader>

          <Separator />

          <div className='w-full grid divide-x'>
            <div className='p-4'>
              <div className='flex items-center gap-2 mb-2'>
                <List className='text-muted-foreground' size={14}/>
                <div className='text-sm font-bold'>Grade Level Details:</div>
              </div>
              <div className='px-2 grid grid-cols-6 gap-2 gap-y-4'>
                {/*last_name*/}
                <div className="grid col-span-3 gap-2">
                    <div className='flex items-center text-neutral-600 gap-2'>
                      <PencilLine size={16}/>
                      <Label htmlFor="last_name" className='font-semibold'>Last Name</Label>
                    </div>
                    <div className='px-4'>
                      <Input
                        id="last_name"
                        type="text"
                        value={data.last_name}
                        onChange={(e) => setData('last_name', e.target.value)}
                        placeholder='Last name'
                        className='border border-dashed border-neutral-400'
                      />
                    </div>
                    {errors.last_name && <p className="text-sm text-red-600">{errors.last_name}</p>}
                </div>

                {/*first_name*/}
                <div className="grid col-span-3 gap-2">
                    <div className='flex items-center text-neutral-600 gap-2'>
                      <PencilLine size={16}/>
                      <Label htmlFor="first_name" className='font-semibold'>First Name</Label>
                    </div>
                    <div className='px-4'>
                      <Input
                        id="first_name"
                        type="text"
                        value={data.first_name}
                        onChange={(e) => setData('first_name', e.target.value)}
                        placeholder='First name'
                        className='border border-dashed border-neutral-400'
                      />
                    </div>
                    {errors.first_name && <p className="text-sm text-red-600">{errors.first_name}</p>}
                </div>

                {/*middle_name*/}
                <div className="grid col-span-3 gap-2">
                    <div className='flex items-center text-neutral-600 gap-2'>
                      <PencilLine size={16}/>
                      <Label htmlFor="middle_name" className='font-semibold'>Middle Name</Label>
                    </div>
                    <div className='px-4'>
                      <Input
                        id="middle_name"
                        type="text"
                        value={data.middle_name}
                        onChange={(e) => setData('middle_name', e.target.value)}
                        placeholder='Middle name'
                        className='border border-dashed border-neutral-400'
                      />
                    </div>
                    {errors.middle_name && <p className="text-sm text-red-600">{errors.middle_name}</p>}
                </div>

                {/*suffix*/}
                <div className="grid col-span-3 gap-2">
                    <div className='flex items-center text-neutral-600 gap-2'>
                      <PencilLine size={16}/>
                      <Label htmlFor="suffix" className='font-semibold'>Suffix</Label>
                    </div>
                    <div className='px-4'>
                      <Input
                        id="suffix"
                        type="text"
                        value={data.suffix}
                        onChange={(e) => setData('suffix', e.target.value)}
                        placeholder='(e.g., Jr., Sr.)'
                        className='border border-dashed border-neutral-400'
                      />
                    </div>
                    {errors.suffix && <p className="text-sm text-red-600">{errors.suffix}</p>}
                </div>

                {/*email*/}
                <div className="grid col-span-3 gap-2">
                    <div className='flex items-center text-neutral-600 gap-2'>
                      <Mail size={16}/>
                      <Label htmlFor="email" className='font-semibold'>Email</Label>
                    </div>
                    <div className='px-4'>
                      <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder='Email address'
                        className='border border-dashed border-neutral-400'
                      />
                    </div>
                    {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                </div>

                {/*address*/}
                <div className="grid col-span-3 gap-2">
                    <div className='flex items-center text-neutral-600 gap-2'>
                      <MapPin size={16}/>
                      <Label htmlFor="address" className='font-semibold'>Address</Label>
                    </div>
                    <div className='px-4'>
                      <Input
                        id="address"
                        type="text"
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                        placeholder='Address'
                        className='border border-dashed border-neutral-400'
                      />
                    </div>
                    {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
                </div>

                {/*contact_number*/}
                <div className="grid col-span-2 gap-2">
                    <div className='flex items-center text-neutral-600 gap-2'>
                      <MapPin size={16}/>
                      <Label htmlFor="contact_number" className='font-semibold'>Contact Number</Label>
                    </div>
                    <div className='px-4'>
                      <Input
                        id="contact_number"
                        type="text"
                        value={data.contact_number}
                        onChange={(e) => setData('contact_number', e.target.value)}
                        placeholder='Contact number'
                        className='border border-dashed border-neutral-400'
                      />
                    </div>
                    {errors.contact_number && <p className="text-sm text-red-600">{errors.contact_number}</p>}
                </div>

                {/* birthdate */}
                <div className="grid col-span-2 gap-2">
                  <div className="flex items-center text-neutral-600 gap-2">
                    <CalendarDays size={16} />
                    <Label htmlFor="birthdate" className="font-semibold">Birthdate</Label>
                  </div>
                  <div className="px-4">
                    <Input
                      id="birthdate"
                      type="date"
                      value={data.birthdate}
                      onChange={(e) => setData('birthdate', e.target.value)}
                      placeholder="YYYY-MM-DD"
                      className="border border-dashed border-neutral-400"
                    />
                  </div>
                  {errors.birthdate && <p className="text-sm text-red-600">{errors.birthdate}</p>}
                </div>

                {/* gender */}
                <div className="grid col-span-2 gap-2">
                  <div className="flex items-center text-neutral-600 gap-2">
                    <VenusAndMars size={16} />
                    <Label className="font-semibold">Gender</Label>
                  </div>
                  <div className="px-4">
                    <Select
                      value={data.gender}
                      onValueChange={(value) => setData('gender', value)}
                    >
                      <SelectTrigger className="border border-dashed border-neutral-400">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Gender</SelectLabel>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Others">Others</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.gender && (
                    <p className="text-sm text-red-600">{errors.gender}</p>
                  )}
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

export default EditTeacherDialog;
