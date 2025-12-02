import {type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, CornerDownRight, Layers, Table2 } from 'lucide-react';
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Toaster } from '@/components/ui/sonner';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import EditGradeLevelDialog from './Components/EditGradeDialog';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Grade Levels',
    href: '/gradelevels',
  },
  {
    title: 'Show',
    href: ``,
  },
];

type GradeLevel = {
  id: number;
  name: string;
};


type GradeLevelShowProps = {
  gradeLevel: GradeLevel;
};

const GradeLevelShow = ({gradeLevel}: GradeLevelShowProps) => {

  return (
    <div className="container mx-auto">
      <Head title="Grade Levels" />
      <Toaster position='top-center' />

      <div className="mb-4">
          <div className='flex justify-between items-center px-2 gap-2 text-md text-muted-foreground border-y w-50 mb-2'>
            <h4>Grade Level id:</h4>
            <div className='bg-accent px-4'>{gradeLevel.id}</div>            
          </div>

          <div className='flex justify-between items-center px-4'> 
            <div className="flex items-center gap-2">
                <Layers className="text-muted-foreground" size={28} />
                <h1 className='text-4xl capitalize font-bold'>{gradeLevel.name}</h1>
            </div>
            
          <div className='flex gap-2'>
              <Link href={route('gradelevels.index')}>
                <Button className="text-white dark:text-black">
                  <ArrowLeft size={24}/>
                    Back
                </Button>
              </Link>
              <EditGradeLevelDialog gradeLevel={gradeLevel} buttonStyle='withName' />
          </div>

          </div>
          
          <div className="flex items-center px-8 gap-2">
            <CornerDownRight className="text-muted-foreground" size={18} />
            <p className="italic text-muted-foreground">Grade Level Name</p>
          </div>
      </div>

      <div className='relative border-y py-2 mb-8'>
        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
      </div>

      <div className='relative p-2 bg-neutral-300 dark:bg-neutral-800 flex items-center rounded-t-lg gap-2'>
        <Table2 size={18} />
        <h3 className='font-medium'>Related Table</h3>
      </div>

      <div className='border rounded-b-lg gap-2 p-4'>
{
//
//       <GradeLevelIndex
//         rooms={rooms}
//       />
//
}
      </div>
    </div>
  );
};

GradeLevelShow.layout = (page: React.ReactNode) => (
  <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);

export default GradeLevelShow;
