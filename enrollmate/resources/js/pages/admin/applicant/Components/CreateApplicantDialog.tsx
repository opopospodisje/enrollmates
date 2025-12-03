import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner'; // or your preferred toast
import { BookUp2, CalendarCheck, CalendarClock, CalendarDays, ChartBar, CornerDownRight, List, PencilLine, Plus, SquarePlus, Tally5, VenusAndMars } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select"
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
  id: number;
  name: string;
};

type SchoolYear = {
  id: number;
  name: string;
};


type Applicant = {
  id?: number;
  first_name: string;
  last_name: string;
  middle_name?: string;
  suffix?: string;
  email: string;
  contact_number: string;
  address: string;
  birthdate:string;
  gender:string;

  school_year_id: number;

  entrance_exam_score: number | null;
  exam_taken_at: string;
};

type CreateApplicantDialogProps = {
  gradeLevels: GradeLevel[]; 
  schoolYears: SchoolYear[];
  currentSchoolYear: SchoolYear | null;
  postRoute?: string;
};

const CreateApplicantDialog = ({gradeLevels,schoolYears,currentSchoolYear, postRoute = 'admin.applicants.store' }: CreateApplicantDialogProps) => {
  const [open, setOpen] = useState(false);

  const getDefaultApplicantFormData = (): Applicant => ({
    first_name: '',
    last_name: '',
    middle_name: '',
    suffix: '',
    email: '',
    contact_number: '',
    address: '',
    birthdate: '',
    gender:'',

    school_year_id: currentSchoolYear ? currentSchoolYear.id : 0,

    entrance_exam_score: null,
    exam_taken_at: new Date().toISOString().split('T')[0], // default to today
  });

  const { data, setData, post, processing, errors } = useForm<Applicant>(
    getDefaultApplicantFormData()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    post(route(postRoute), {
      onSuccess: () => {
        toast.success('Applicant created!');
        setData(getDefaultApplicantFormData());
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (isOpen) setData(getDefaultApplicantFormData());
    }}>
      <DialogTrigger asChild>
        <Button className='bg-emerald-600 text-white hover:bg-emerald-700'>
          <Plus className="mr-2 h-4 w-4" />
          Add Applicant
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[800px] p-0">
        <form onSubmit={handleSubmit}>
          <DialogHeader className='p-4 gap-0'>
            <DialogTitle className='flex items-center gap-2'>
              <SquarePlus className='text-muted-foreground'/>
              <div className='text-2xl'>Add Applicant</div>
            </DialogTitle>
            <DialogDescription className='flex items-center gap-2 px-2'>
              <CornerDownRight className='text-muted-foreground' size={18}/>
              <div>Fill in the section.</div>              
            </DialogDescription>
          </DialogHeader>

          <Separator />

          <div className='w-full grid divide-x py-4 gap-4'>
            <div className='px-4'>
              <div className='flex items-center gap-2 mb-2'>
                <List className='text-muted-foreground' size={14}/>
                <div className='text-sm font-bold'>Entrance Exam Details:</div>
              </div>

              <div className='px-2 grid grid-cols-3 gap-4'>
                {/*entrance_exam_score*/}
                <div className="grid col-span-1 gap-2">
                  <div className='flex items-center text-neutral-600 gap-2'>
                    <Tally5 size={16}/>
                    <Label htmlFor="entrance_exam_score" className='font-semibold'>Exam Score</Label>
                  </div>
                    <div className='px-4'>
                    <Input
                      id="entrance_exam_score"
                      type="number"
                      value={data.entrance_exam_score !== null ? data.entrance_exam_score : ''}
                      onChange={(e) => {
                      let val = Number(e.target.value);
                      if (val > 50) val = 50;
                      setData('entrance_exam_score', val);
                      }}
                      placeholder='Exam score here'
                      className='border border-dashed border-neutral-400'
                      max={50}
                    />
                    </div>
                  {errors.entrance_exam_score && <p className="text-sm text-red-600">{errors.entrance_exam_score}</p>}
                </div>

                {/*exam_taken_at*/}
                <div className="grid col-span-1 gap-2">
                  <div className='flex items-center text-neutral-600 gap-2'>
                    <CalendarClock size={16}/>
                    <Label htmlFor="exam_taken_at" className='font-semibold'>Exam Date</Label>
                  </div>
                  <div className='px-4'>
                    <Input
                      id="exam_taken_at"
                      type="date"
                      value={data.exam_taken_at}
                      onChange={(e) => setData('exam_taken_at', e.target.value)}
                      placeholder='Suffix here (e.g. Jr., Sr.)'
                      className='border border-dashed border-neutral-400'
                    />
                  </div>
                  {errors.exam_taken_at && <p className="text-sm text-red-600">{errors.exam_taken_at}</p>}
                </div>

                {/*school_year_id*/}
                <div className="grid col-span-1 gap-2">
                  <div className='flex items-center text-neutral-600 gap-2'>
                    <CalendarDays size={16}/>
                    <Label className='font-semibold'>School Year</Label>
                  </div>
                  <div className='px-4'>
                    <Select                     
                      value={data.school_year_id === 0 ? '' : data.school_year_id.toString()}
                      onValueChange={(value) => setData('school_year_id', Number(value))}
                    >
                    <SelectTrigger className='border border-dashed border-neutral-400'>
                      <SelectValue placeholder="School Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>School Years</SelectLabel>
                        {schoolYears.map((type) => (
                          <SelectItem key={type.id} value={type.id.toString()}>{type.name}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                    </Select>                
                  </div>
                  {errors.school_year_id && <p className="text-sm text-red-600">{errors.school_year_id}</p>}
                </div>
              </div>
            </div>
            
            <div className='px-4'>
              <div className='flex items-center gap-2 mb-2'>
                <List className='text-muted-foreground' size={14}/>
                <div className='text-sm font-bold'>Applicant Details:</div>
              </div>
              <div className='px-2 grid grid-cols-6 gap-4'>
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
                      placeholder='First name here'
                      className='border border-dashed border-neutral-400'
                    />
                  </div>
                  {errors.first_name && <p className="text-sm text-red-600">{errors.first_name}</p>}
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
                      placeholder='Last name here'
                      className='border border-dashed border-neutral-400'
                    />
                  </div>
                  {errors.last_name && <p className="text-sm text-red-600">{errors.last_name}</p>}
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
                      placeholder='Middle name here'
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
                      placeholder='Suffix here (e.g. Jr., Sr.)'
                      className='border border-dashed border-neutral-400'
                    />
                  </div>
                  {errors.suffix && <p className="text-sm text-red-600">{errors.suffix}</p>}
                </div>

                {/*contact_number*/}
                <div className="grid col-span-2 gap-2">
                  <div className='flex items-center text-neutral-600 gap-2'>
                    <PencilLine size={16}/>
                    <Label htmlFor="contact_number" className='font-semibold'>Contact Number</Label>
                  </div>
                  <div className='px-4'>
                    <Input
                      id="contact_number"
                      type="text"
                      value={data.contact_number}
                      onChange={(e) => setData('contact_number', e.target.value)}
                      placeholder='Contact number here'
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

                {/*email*/}
                <div className="grid col-span-3 gap-2">
                  <div className='flex items-center text-neutral-600 gap-2'>
                    <PencilLine size={16}/>
                    <Label htmlFor="email" className='font-semibold'>Email</Label>
                  </div>
                  <div className='px-4'>
                    <Input
                      id="email"
                      type="email"
                      value={data.email}
                      onChange={(e) => setData('email', e.target.value)}
                      placeholder='Email address here'
                      className='border border-dashed border-neutral-400'
                    />
                  </div>
                  {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                </div>

                {/*address*/}
                <div className="grid col-span-3 gap-2">
                  <div className='flex items-center text-neutral-600 gap-2'>
                    <PencilLine size={16}/>
                    <Label htmlFor="address" className='font-semibold'>Address</Label>
                  </div>
                  <div className='px-4'>
                    <Input
                      id="address"
                      type="text"
                      value={data.address}
                      onChange={(e) => setData('address', e.target.value)}
                      placeholder='Full address here'
                      className='border border-dashed border-neutral-400'
                    />
                  </div>
                  {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
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
              Create Applicant
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateApplicantDialog;
