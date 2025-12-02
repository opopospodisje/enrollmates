import React, { useState } from 'react';
import AppLogo from '@/components/app-logo';
import { Separator } from '@/components/ui/separator';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type SharedData } from '@/types';
import { Head, Link, router, usePage,useForm } from '@inertiajs/react';
import { LogOut, ChevronLeft } from 'lucide-react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';   
import { Button } from "@/components/ui/button";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';

type Alumni = {
  id: number;
  full_name: string;
  employment_status: string | null;
  job_title: string | null;
  work_history: string | null;
};

type StudentProps = {
  alumni: Alumni;
};

export default function Index({ alumni }: StudentProps) {
    const { auth } = usePage<SharedData>().props;
    const cleanup = useMobileNavigation();

    const handleLogout = () => {
    cleanup();
    router.flushAll();
    };

    const {
    data,
    setData,
    put,
    processing,
    } = useForm({
    employment_status: alumni.employment_status ?? 'not_set',
    job_title: alumni.job_title ?? 'not_set',
    work_history: alumni.work_history ?? 'not_set',
    });

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    put(route('student.alumnis.update'), {
        onFinish: () => {
        // optional: show success message
        },
    });
    };

  return (
    <>
      <Head title="Alumni Info" />

      <div className='flex min-h-screen flex-col items-center bg-[#F1F3F2] text-[#1b1b18] dark:bg-[#0a0a0a]'>
        <header className="mb-6 bg-sidebar rounded-b-lg w-full text-sm p-6">
          <nav className="flex items-center justify-end gap-4">
            <div className='flex gap-2 items-end mr-auto text-white'>
              <AppLogo />
            </div>
            {auth.user && (
              <Link method="post" href={route('logout')} as="button" onClick={handleLogout}>
                <div className="flex items-center text-white hover:underline px-2 gap-2">                                   
                  <LogOut className='inline size-4 ml-1' />
                  Log out
                </div>
              </Link>
            )}
          </nav>
        </header>

        <div className='p-6 w-full max-w-6xl'>
          <div>
            <Link href={route('student.home')}>
              <Button variant="default">
                <ChevronLeft /> Back
              </Button>
            </Link>  
          </div>

          <div className='relative border-y py-2 my-4'>
            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />        
          </div>

          <div>
            <div>
              <h3>Alumni Name:</h3>
              <h1 className='text-4xl font-black'>{alumni.full_name}</h1>
            </div>
            <Separator className='my-4' />
            
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
              <div className="flex items-center gap-2">
                <div className='flex items-center text-neutral-600 gap-2 w-40'>
                  <Label htmlFor="employment_status" className='font-semibold'>Employment Status:</Label>
                </div>
                <div className='px-4 flex-1'>
                    <Select
                    value={data.employment_status}
                    onValueChange={(value) => setData('employment_status', value)}
                    >
                    <SelectTrigger id='employment_status' className="w-full border border-dashed border-neutral-400">
                        <SelectValue placeholder="Select employment status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="not_set">-- Not Set --</SelectItem>
                        <SelectItem value="employed">Employed</SelectItem>
                        <SelectItem value="unemployed">Unemployed</SelectItem>
                        <SelectItem value="self-employed">Self-Employed</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="retired">Retired</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className='flex items-center text-neutral-600 gap-2 w-40'>
                  <Label htmlFor="job_title" className='font-semibold'>Job Title:</Label>
                </div>
                <div className='px-4 flex-1'>
                  <Input 
                    id='job_title'
                    type='text'
                    value={data.job_title}
                    onChange={(e) => setData({ ...data, job_title: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <div className='text-neutral-600 gap-2 w-40'>
                  <Label htmlFor="work_history" className='font-semibold'>Work History:</Label>
                </div>
                <div className='px-4 flex-1'>
                  <Textarea
                    id='work_history'
                    value={data.work_history}
                    onChange={(e) => setData({ ...data, work_history: e.target.value })}
                  />
                </div>
              </div>

              <div className='flex justify-end'>
                <Button type="submit" disabled={processing}>
                {processing ? 'Saving...' : 'Update'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
