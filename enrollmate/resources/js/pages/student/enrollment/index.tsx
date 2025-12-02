import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { BookUp2, CalendarDays, ListTodo } from 'lucide-react';
import * as React from "react"
import { toast } from 'sonner';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { type SharedData } from '@/types';
import AppLogo from '@/components/app-logo';
import { Head, Link, useForm, usePage,router } from '@inertiajs/react';
import { LogOut } from 'lucide-react';
import { ChevronLeft } from 'lucide-react';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';


type Student = {
  id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix: string;
};

type ClassGroup = {
  id: number;
  section: {
    id: number;
    name: string;
    grade_level: {
      id: number;
      name: string;
    };
    is_special: boolean;
  };
  school_year: {
    id: number;
    name: string;
  };
  student_limit: number;
  enrollments_count: number;
};

type Enrollment = {
  id?: number;
  
  student_id:number;
  class_group_id:number;
  class_group_name?: string;

  status:string;
  enrolled_at:string;
};  


type EnrollmentIndexProps = {
  classGroups: ClassGroup[];
  studentId: number;
  alreadyEnrolled: boolean;
};

const EnrollmentIndex = ({classGroups,studentId, alreadyEnrolled}: EnrollmentIndexProps) => {
  const { auth } = usePage<SharedData>().props;

  const getDefaultEnrollmentFormData = (): Enrollment => ({
    student_id: studentId,
    class_group_id: 0,
    status: 'promoted',
    enrolled_at: new Date().toISOString().slice(0, 10) // "YYYY-MM-DD"
  });

  const { data, setData, post, processing, errors } = useForm<Enrollment>(
    getDefaultEnrollmentFormData()
  );

  const cleanup = useMobileNavigation();

  const handleLogout = () => {
      cleanup();
      router.flushAll();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    post(route('student.enrollments.store'), {
      onSuccess: () => {
        toast.success('Enrollment created!');
        setData(getDefaultEnrollmentFormData());
      },
    });
  };

  return (
        <>
            <Head title="Home">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            
            <div className='flex min-h-screen flex-col items-center bg-[#F1F3F2] text-[#1b1b18] dark:bg-[#0a0a0a]'>
                <header className="mb-6 bg-sidebar rounded-b-lg w-full text-sm not-has-[nav]:hidden p-6">
                    <nav className="flex items-center justify-end gap-4">
                        <div className='flex gap-2 items-end mr-auto text-white'>
                            <AppLogo />
                        </div>
                        {auth.user ? (
                            <Link method="post" href={route('logout')} as="button" onClick={handleLogout}>
                                <div className="flex items-center text-white hover:underline px-2 gap-2">                                   
                                    <LogOut className='inline size-4 ml-1' />
                                    Log out
                                </div>
                            </Link>
                        ) : null}
                                            
                    </nav>
                </header>

                <div className='p-6 w-full max-w-6xl'>
                    <div>
                        <Link href={route('student.home')}><Button variant={'default'}> <ChevronLeft /> Back</Button></Link>  
                    </div>
                
                    <div className='relative border-y py-2 my-4'>
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />        
                    </div>
                        {!alreadyEnrolled ? (
                                <form onSubmit={handleSubmit}>
                                    <Card className='gap-2 py-4'>
                                    <CardHeader className='border-b pb-4'>
                                        <div className='gap-2font-extrabold'>Complete enrollment form and submit.</div>              
                                    </CardHeader>
                                    <CardContent>              
                                        <div className='w-full grid divide-x'>
                                        <div className=''>
                                            <div className='grid gap-4'>

                                            {/*class_group_id*/}
                                            <div className="grid col-span-full gap-2">
                                                <div className='flex items-center text-neutral-600 gap-2'>
                                                <BookUp2 size={16}/>
                                                <Label className='font-semibold'>Section</Label>
                                                </div>
                                                <div className='px-4'>
                                                <Select                     
                                                    value={data.class_group_id === 0 ? '' : data.class_group_id.toString()}
                                                    onValueChange={(value) => setData('class_group_id', Number(value))}
                                                >
                                                    <SelectTrigger className='border border-dashed border-neutral-400'>
                                                    <SelectValue placeholder="Select Class" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                    <SelectGroup className="max-h-48 overflow-y-auto">
                                                        <SelectLabel>Grade - Section(SY)</SelectLabel>
                                                        {classGroups.length > 0 ? (
                                                        classGroups.map((type) => {
                                                            return (
                                                            <SelectItem 
                                                                key={type.id} 
                                                                value={type.id.toString()}
                                                            >
                                                                {type.section?.grade_level?.name} - {type.section?.name} ({type.school_year?.name ?? 'No SY'}) - ({type.enrollments_count}/{type.student_limit} slots)
                                                                {type.section?.is_special && (
                                                                <span className="bg-amber-300 px-2 rounded-sm text-xs ml-2">
                                                                    Special Section
                                                                </span>
                                                                )}
                                                            </SelectItem>
                                                            );
                                                        })
                                                        ) : (
                                                        <div className="text-sm text-muted-foreground px-2 py-1">
                                                            No class groups available. Create a class group first.
                                                        </div>
                                                        )}
                                                    </SelectGroup>
                                                    </SelectContent>
                                                </Select>                
                                                </div>
                                                {errors.class_group_id && (
                                                <p className="text-sm text-red-600">{errors.class_group_id}</p>
                                                )}
                                            </div>

                                            {/* status */}
                                            <div className="grid col-span-full gap-2">
                                                <div className="flex items-center text-neutral-600 gap-2">
                                                <ListTodo size={16} />
                                                <Label className="font-semibold">Status</Label>
                                                </div>
                                                <div className="px-4">
                                                <Input
                                                    type='text'
                                                    value={'promoted'}
                                                    readOnly
                                                    className='border border-dashed border-neutral-400'
                                                />
                                                </div>
                                                {errors.status && (
                                                <p className="text-sm text-red-600">{errors.status}</p>
                                                )}
                                            </div>

                                            {/* enrolled_at */}
                                            <div className="grid col-span-full gap-2">
                                                <div className="flex items-center text-neutral-600 gap-2">
                                                <CalendarDays size={16} />
                                                <Label htmlFor="enrolled_at" className="font-semibold">Enrolled At</Label>
                                                </div>
                                                <div className="px-4">
                                                <Input
                                                    id="enrolled_at"
                                                    type="date"
                                                    value={data.enrolled_at}
                                                    readOnly
                                                    className="border border-dashed border-neutral-400"
                                                />
                                                </div>
                                                {errors.enrolled_at && <p className="text-sm text-red-600">{errors.enrolled_at}</p>}
                                            </div>
                                            </div>
                                        </div>
                                        </div>              
                                    </CardContent>
                                    <CardFooter className='border-t pt-4'>
                                        <Button type="submit" disabled={processing} className='bg-sidebar ml-auto text-white flex gap-2 hover:underline hover:bg-sidebar'>
                                        Create Enrollment
                                        </Button>
                                    </CardFooter>            
                                    </Card>
                                </form>
                            ):(
                                <div>
                                    You're already enrolled this school year
                                </div>
                            )
                        }

                </div>
            </div>
        </>
  );
};

export default EnrollmentIndex;
