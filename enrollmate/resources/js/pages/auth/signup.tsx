import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import AuthLayout from '@/layouts/auth-layout';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

type Props = {
  currentSchoolYear: { id: number; name: string } | null;
};

export default function Signup({ currentSchoolYear }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    first_name: '',
    middle_name: '',
    last_name: '',
    suffix: '',
    email: '',
    contact_number: '',
    address: '',
    gender: '',
    birthdate: '',
    school_year_id: currentSchoolYear?.id ?? null,
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    post(route('signup.store'));
  };

  return (
    <AuthLayout title="Create your account" description="Sign up to become an applicant">
      <Head title="Sign up" />
      <form className="flex flex-col gap-5" onSubmit={submit}>
        <div className="grid gap-2">
          <Label htmlFor="first_name" className="text-white">*First Name</Label>
          <Input id="first_name" value={data.first_name} onChange={(e) => setData('first_name', e.target.value)} className="bg-white text-black border-0" />
          <InputError message={errors.first_name} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="middle_name" className="text-white">Middle Name</Label>
          <Input id="middle_name" value={data.middle_name} onChange={(e) => setData('middle_name', e.target.value)} className="bg-white text-black border-0" />
          <InputError message={errors.middle_name} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="last_name" className="text-white">*Last Name</Label>
          <Input id="last_name" value={data.last_name} onChange={(e) => setData('last_name', e.target.value)} className="bg-white text-black border-0" />
          <InputError message={errors.last_name} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="suffix" className="text-white">Suffix</Label>
          <Input id="suffix" value={data.suffix ?? ''} onChange={(e) => setData('suffix', e.target.value)} className="bg-white text-black border-0" />
          <InputError message={errors.suffix} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email" className="text-white">*Email</Label>
          <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className="bg-white text-black border-0" />
          <InputError message={errors.email} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="contact_number" className="text-white">Contact Number</Label>
          <Input id="contact_number" value={data.contact_number} onChange={(e) => setData('contact_number', e.target.value)} className="bg-white text-black border-0" />
          <InputError message={errors.contact_number} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="address" className="text-white">Address</Label>
          <Input id="address" value={data.address} onChange={(e) => setData('address', e.target.value)} className="bg-white text-black border-0" />
          <InputError message={errors.address} />
        </div>

        <div className="grid gap-2">
          <Label className="text-white">*Gender</Label>
          <Select value={data.gender} onValueChange={(value) => setData('gender', value)}>
            <SelectTrigger className="bg-white text-black border-0">
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Gender</SelectLabel>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <InputError message={errors.gender} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="birthdate" className="text-white">Birthdate</Label>
          <Input id="birthdate" type="date" value={data.birthdate} onChange={(e) => setData('birthdate', e.target.value)} className="bg-white text-black border-0" />
          <InputError message={errors.birthdate} />
        </div>

        <Button type="submit" className="mt-2 w-full bg-[#4b1a1a] hover:bg-[#4b1a1a]/90 text-white" disabled={processing}>
          Sign up
        </Button>
      </form>
    </AuthLayout>
  );
}

