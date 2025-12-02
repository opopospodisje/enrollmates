import React, { useState } from 'react';
import { toast } from 'sonner';
import { BadgeCheck, CornerDownRight, KeyRound, List, Mail, MapPin, Phone, Plus, SquarePen, UserRound, UserRoundPen, UserRoundPlus } from 'lucide-react';
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
import { useForm } from '@inertiajs/react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';


type UserFormData = {
  id?: number;
  first_name: string;
  last_name: string;
  contact_number: string;
  address: string;
  email: string;
  password?: string;
  role_id:number;
};

type Role = {
  id: number;
  name: string;
}


type EditUserDialogProps = {
  roles: Role[];
  user: UserFormData;
  buttonStyle?: 'default' | 'withName'; // Optional prop
};

const EditUserDialog = ({ roles,user,buttonStyle='default' }: EditUserDialogProps) => {

  const getDefaultUserFormData = (): UserFormData => ({
    first_name: user.first_name ?? '',
    last_name: user.last_name ?? '',
    contact_number: user.contact_number ?? '',
    address: user.address ?? '',
    email: user.email ?? '',
    password: '',
    role_id: user.role_id ?? 0 ,
  });
  
  const { data, setData, put, processing, errors, reset } = useForm<UserFormData>(
    getDefaultUserFormData()
  );

  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    put(route('admin.users.update', user.id), {
      onSuccess: () => {
        toast.success('User created succesfully!');        
        setOpen(false);
        setData(getDefaultUserFormData());
      },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (isOpen){
          setData(getDefaultUserFormData());
        };          
      }}
    >
      <DialogTrigger asChild>
        {buttonStyle === 'withName' ? (
          <Button className='bg-emerald-600 hover:bg-emerald-700'>
            <SquarePen className="mr-2" />
            Edit User
          </Button>
        ) : (
          <Button variant="outline">
            <SquarePen />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] lg:max-w-[800px] p-0">
        <form onSubmit={handleSubmit} encType="multipart/form-data" autoComplete="off">
          <DialogHeader className='gap-0 p-4'>
            <DialogTitle className='flex items-center gap-2'>
              <UserRoundPlus className='text-muted-foreground'/>
              <div className='text-2xl'>Edit User</div>
            </DialogTitle>

            <DialogDescription className='flex items-center gap-2 px-2'>
              <CornerDownRight className='text-muted-foreground' size={18}/>
              <div>Fill in the user details and assign role.</div>              
            </DialogDescription>
          </DialogHeader>          

          <Separator />
          <div className='w-full grid divide-x'>
            <div className='p-4'>
              <div className='flex items-center gap-2 mb-2'>
                <List className='text-muted-foreground' size={14}/>
                <div className='text-sm font-bold'>User Details:</div>
              </div>

              <div className='px-2'>
                <div className="grid grid-cols-2 gap-4 px-2">
                  {/*firstname*/}
                  <div className="grid gap-2">
                      <div className='flex items-center text-neutral-600 gap-2'>
                        <UserRound size={16}/>
                        <Label htmlFor="first_name" className='font-semibold'>First Name</Label>
                      </div>
                      <div className='px-4'>
                        <Input
                          id="first_name"
                          type="text"
                          value={data.first_name}
                          onChange={(e) => setData('first_name', e.target.value)}
                          placeholder='First name here'
                          className='border border-dashed border-neutral-400'
                        />
                      </div>
                      {errors.first_name && <p className="text-sm text-red-600">{errors.first_name}</p>}
                  </div>

                  {/*lastname*/}
                  <div className="grid gap-2">
                      <div className='flex items-center text-neutral-600 gap-2'>
                        <UserRoundPen size={16}/>
                        <Label htmlFor="last_name" className='font-semibold'>Last Name</Label>
                      </div>
                      <div className='px-4'>
                        <Input
                          id="last_name"
                          type="text"
                          value={data.last_name}
                          onChange={(e) => setData('last_name', e.target.value)}
                          placeholder='Last name here'
                          className='border border-dashed border-neutral-400'
                        />
                      </div>
                      {errors.last_name && <p className="text-sm text-red-600">{errors.last_name}</p>}
                  </div>

                  {/*contact_number*/}
                  <div className="grid gap-2">
                      <div className='flex items-center text-neutral-600 gap-2'>
                        <Phone size={16}/>
                        <Label htmlFor="contact_number" className='font-semibold'>Contact Number</Label>
                      </div>
                      <div className='px-4'>
                        <Input
                          id="contact_number"
                          type="text"
                          value={data.contact_number}
                          onChange={(e) => setData('contact_number', e.target.value)}
                          placeholder='Format (09xxxxxxxxx or +639xxxxxxxxx)'
                          className='border border-dashed border-neutral-400'
                        />
                      </div>
                      {errors.contact_number && <p className="text-sm text-red-600">{errors.contact_number}</p>}
                  </div>

                  {/*email*/}
                  <div className="grid gap-2">
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
                          placeholder='Email here'
                          className='border border-dashed border-neutral-400'
                        />
                      </div>
                      {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                  </div>

                  {/*address*/}
                  <div className="grid col-span-full gap-2">
                      <div className='flex items-center text-neutral-600 gap-2'>
                        <MapPin size={16}/>
                        <Label htmlFor="address" className='font-semibold'>Address</Label>
                      </div>
                      <div className='px-4'>
                        <Textarea
                          id="address"
                          value={data.address}
                          onChange={(e) => setData('address', e.target.value)}
                          placeholder='Address here'
                          className='resize-y max-h-50 border border-dashed border-neutral-400'
                        />
                      </div>
                      {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
                  </div>

                  {/*password*/}
                  <div className="grid gap-2">
                      <div className='flex items-center text-neutral-600 gap-2'>
                        <KeyRound size={16}/>
                        <Label htmlFor="password" className='font-semibold'>Password</Label>
                      </div>
                      <div className='px-4'>
                        <Input
                          id="password"
                          type="password"
                          value={data.password}
                          onChange={(e) => setData('password', e.target.value)}
                          placeholder='Enter new password'
                          className='border border-dashed border-neutral-400'
                        />
                      </div>
                      {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                  </div>

                  {/*room type*/}
                  <div className="grid gap-2">
                      <div className='flex items-center text-neutral-600 gap-2'>
                        <BadgeCheck size={16}/>
                        <Label className='font-semibold'>Roles</Label>
                      </div>
                      <div className='px-4'>
                        <Select                     
                          value={data.role_id === 0 ? '' : data.role_id.toString()}
                          onValueChange={(value) => setData('role_id', Number(value))}
                        >
                          <SelectTrigger className='border border-dashed border-neutral-400'>
                            <SelectValue placeholder="Assign Role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Role Types</SelectLabel>
                              {roles.map((role) => (
                                <SelectItem key={role.id} value={role.id.toString()}>{role.name}</SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>                
                      </div>
                      {errors.role_id && <p className="text-sm text-red-600">{errors.role_id}</p>}
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
            <Button type="submit" disabled={processing} className='bg-emerald-600 hover:bg-emerald-800'>Update User</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
