import AppLogo from '@/components/app-logo';
import { Separator } from '@/components/ui/separator';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type SharedData } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { LogOut, Notebook, PencilLine, Settings, Sheet, User2 } from 'lucide-react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';   
import { Button } from "@/components/ui/button";
import { ChevronLeft } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Checkbox } from '@/components/ui/checkbox';


type Student = {
  id: number;
  lrn: string;
  full_name: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  suffix: string;
  email: string;
  address: string;
  contact_number: string;
  gender: string;
  birthdate: string;

  has_special_needs: boolean;
  special_needs_type: string | null;
  is_4ps: boolean;
};

type StudentProps = {
    student: Student;
}

export default function Index({ student }: StudentProps) {
    const { auth } = usePage<SharedData>().props;

    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };


    const { data, setData, put, processing } = useForm<Student>({
        ...student,
    });

    const [editing, setEditing] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        put(route("student.profile.update", student.id), {
        onSuccess: () => setEditing(false),
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

                    <div>
                        <div>
                            <h3>Student Name:</h3>
                            <h1 className='text-4xl font-black'>{student.full_name}</h1>
                        </div>
                        <Separator className='my-4' />
                        
                        <form onSubmit={handleSubmit} className='space-y-4'>
                            {/* ---- LRN ---- */}
                            <div className="flex items-center gap-2">
                            <Label className='w-40 font-semibold'>LRN:</Label>
                            <Input
                                value={data.lrn}
                                readOnly={!editing}
                                onChange={(e) => setData('lrn', e.target.value)}
                            />
                            </div>

                            {/* ---- Name Fields ---- */}
                            {["last_name", "first_name", "middle_name", "suffix"].map((field) => (
                            <div className="flex items-center gap-2" key={field}>
                                <Label className='w-40 font-semibold'>
                                {field.replace("_", " ").toUpperCase()}:
                                </Label>
                                <Input
                                value={(data as any)[field] ?? ""}
                                readOnly={!editing}
                                onChange={(e) => setData(field as any, e.target.value)}
                                />
                            </div>
                            ))}

                            {/* ---- Email ---- */}
                            <div className="flex items-center gap-2">
                            <Label className='w-40 font-semibold'>Email:</Label>
                            <Input
                                type="email"
                                value={data.email ?? ""}
                                readOnly={!editing}
                                onChange={(e) => setData("email", e.target.value)}
                            />
                            </div>

                            {/* ---- Address ---- */}
                            <div className="flex items-center gap-2">
                            <Label className='w-40 font-semibold'>Address:</Label>
                            <Input
                                value={data.address ?? ""}
                                readOnly={!editing}
                                onChange={(e) => setData("address", e.target.value)}
                            />
                            </div>

                            {/* ---- Contact Number ---- */}
                            <div className="flex items-center gap-2">
                            <Label className='w-40 font-semibold'>Contact Number:</Label>
                            <Input
                                value={data.contact_number ?? ""}
                                readOnly={!editing}
                                onChange={(e) => setData("contact_number", e.target.value)}
                            />
                            </div>

                            {/* ---- Gender ---- */}
                            <div className="flex items-center gap-2">
                            <Label className='w-40 font-semibold'>Gender:</Label>

                            {editing ? (
                                <Select
                                value={data.gender}
                                onValueChange={(val) => setData('gender', val)}
                                >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                </SelectContent>
                                </Select>
                            ) : (
                                <Input value={data.gender} readOnly />
                            )}
                            </div>

                            {/* ---- Birthdate ---- */}
                            <div className="flex items-center gap-2">
                            <Label className='w-40 font-semibold'>Birthdate:</Label>
                            <Input
                                type="date"
                                value={data.birthdate ?? ""}
                                readOnly={!editing}
                                onChange={(e) => setData("birthdate", e.target.value)}
                            />
                            </div>

                            <Separator className="my-4" />

                            <div className='flex justify-end'>
                                {/* ---- ACTION BUTTONS ---- */}
                                {editing ? (
                                <div className="flex gap-3">
                                    <Button type="submit" disabled={processing}>
                                    Save Changes
                                    </Button>
                                    <Button variant="secondary" onClick={() => setEditing(false)}>
                                    Cancel
                                    </Button>
                                </div>
                                ) : (
                                <Button onClick={() => setEditing(true)}>
                                    Edit Profile
                                </Button>
                                )}
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </>
    );
}
