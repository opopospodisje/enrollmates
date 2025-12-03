import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Separator } from '@/components/ui/separator';
import { useForm } from '@inertiajs/react';
import { CalendarDays, CornerDownRight, FileDigit, FilePlus, List, Mail, MapPin, PencilLine, Plus, SquarePlus, VenusAndMars } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner'; // or your preferred toast

type Applicant = {
  id: number;
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

type Student = {
  id?: number;
  applicant_id: number | null;

  lrn: string;
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
  applicants: Applicant[];
};

const CreateStudentDialog = ({ applicants }: Props) => {
  const [open, setOpen] = useState(false);

  const getDefaultStudentFormData = (): Student => ({
    applicant_id: null,
    lrn: '',
    first_name: '',
    last_name: '',
    middle_name: '',
    suffix: '',

    email: '',
    address: '',
    contact_number:'',
    gender: '',
    birthdate: '' // 'YYYY-MM-DD'
  });

  const { data, setData, post, processing, errors } = useForm<Student>(
    getDefaultStudentFormData()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    post(route('teacher.students.store'), {
      onSuccess: () => {
        toast.success('Student created!');
        setData(getDefaultStudentFormData());
        setOpen(false);
      },
    });
  };

    // Assuming `data` is your form state, `setData` updates it
const handleApplicantChange = (applicantId: number | null) => {
  if (applicantId) {
    const selectedApplicant = applicants.find(a => a.id === applicantId);

    if (selectedApplicant) {
      setData({
        ...data,
        applicant_id: applicantId, // <- explicitly keep this
        first_name: selectedApplicant.first_name,
        last_name: selectedApplicant.last_name,
        middle_name: selectedApplicant.middle_name,
        suffix: selectedApplicant.suffix,
        email: selectedApplicant.email, // or applicant.email if available
        address: selectedApplicant.address,
        contact_number: selectedApplicant.contact_number,
        gender: (selectedApplicant.gender || '').toLowerCase(),
        birthdate: selectedApplicant.birthdate,
      });
    }
  } else {
    setData(getDefaultStudentFormData()); // resets everything including applicant_id
  }
};

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (isOpen) setData(getDefaultStudentFormData());
    }}>
      <DialogTrigger asChild>
        <Button className='bg-sidebar text-white flex gap-2 hover:underline hover:bg-sidebar'>
          <Plus className="h-4 w-4" />
          <span>Add Student</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[800px] p-0">
        <form onSubmit={handleSubmit}>
          <DialogHeader className='p-4 gap-0'>
            <DialogTitle className='flex items-center gap-2'>
              <SquarePlus className='text-muted-foreground'/>
              <div className='text-2xl'>Add Student</div>
            </DialogTitle>
            <DialogDescription className='flex items-center gap-2 px-2'>
              <CornerDownRight className='text-muted-foreground' size={18}/>
              <div>Fill in the student details.</div>              
            </DialogDescription>
          </DialogHeader>

          <Separator />

          <div className='w-full grid divide-x'>
            <div className='p-4'>
              <div className='flex items-center gap-2 mb-2'>
                <List className='text-muted-foreground' size={14}/>
                <div className='text-sm font-bold'>Student Details:</div>
              </div>
              <div className='px-2 grid grid-cols-6 gap-2 gap-y-4'>
                {/*Applicant*/}
                <div className="grid col-span-3 gap-2">
                  <div className='flex items-center text-neutral-600 gap-2'>
                    <FilePlus size={16}/>
                    <Label className='font-semibold'>Applicants</Label>
                  </div>
                  <div className='px-4'>
                    <Select
                      value={data.applicant_id === null || data.applicant_id === 0 ? '' : data.applicant_id.toString()}
                      onValueChange={(value) => handleApplicantChange(value ? Number(value) : null)}
                    >
                      <SelectTrigger className='border border-dashed border-neutral-400'>
                        <SelectValue placeholder="Select Applicant" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Applicants</SelectLabel>
                          {applicants.length > 0 ? (
                            applicants.map((type) => (
                              <SelectItem key={type.id} value={type.id.toString()}>
                                {type.last_name}, {type.first_name} {type.middle_name} {type.suffix}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem key="no-applicants" value="0" disabled>
                              No pending applicants yet
                            </SelectItem>
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>              
                  </div>
                  {errors.applicant_id && <p className="text-sm text-red-600">{errors.applicant_id}</p>}
                </div>

                {/*lrn*/}
                <div className="grid col-span-3 gap-2">
                    <div className='flex items-center text-neutral-600 gap-2'>
                      <FileDigit size={16}/>
                      <Label htmlFor="last_name" className='font-semibold'>LRN</Label>
                    </div>
                    <div className='px-4'>
                      <Input
                        id="lrn"
                        type="text"
                        value={data.lrn}
                        onChange={(e) => setData('lrn', e.target.value)}
                        placeholder='LRN'
                        className='border border-dashed border-neutral-400'
                      />
                    </div>
                    {errors.lrn && <p className="text-sm text-red-600">{errors.lrn}</p>}
                </div>


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
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
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
              <Button variant="outline" type="button">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={processing} className='bg-emerald-600 hover:bg-emerald-800'>
              Create Student
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStudentDialog;
