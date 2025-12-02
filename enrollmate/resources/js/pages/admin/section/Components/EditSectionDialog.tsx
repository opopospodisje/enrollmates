import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
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
import { BookUp2, ChartBar, List, PencilLine, SquarePen } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

type GradeLevel = {
  id: number;
  name: string;
};


type Section = {
  id?: number;
  name: string;
  grade_level_id: number;
  grade_level_name?: string;
  cutoff_grade: number | null;
  is_special: boolean;
};

type Props = {
  section: Section;
  gradeLevels: GradeLevel[]; 
  buttonStyle?: string;
};

const EditSectionDialog = ({ section ,gradeLevels, buttonStyle}: Props) => {
  const [open, setOpen] = useState(false);

  const getDefaultSectionFormData = (): Section => ({
    id: section.id || 0,
    name: section.name || '',
    grade_level_id: section.grade_level_id || 0,
    cutoff_grade: section.cutoff_grade || 85,
    is_special: section.is_special || false,
  });

  const { data, setData, put, processing, errors, reset } = useForm(
    getDefaultSectionFormData()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    put(route('admin.sections.update', section.id),{
      onSuccess: () => {
        toast.success('Section updated successfully.');
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {buttonStyle === 'withName' ? (
          <Button className='bg-emerald-600 hover:bg-emerald-700'>
            <SquarePen className="mr-2" />
            Edit Section
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
            <DialogTitle>Edit Section</DialogTitle>
            <DialogDescription>
              Update the section below.
            </DialogDescription>
          </DialogHeader>

          <Separator />

          <div className='w-full grid divide-x'>
            <div className='p-4'>
              <div className='flex items-center gap-2 mb-2'>
                <List className='text-muted-foreground' size={14}/>
                <div className='text-sm font-bold'>Section Details:</div>
              </div>
              <div className='px-2 grid gap-4'>
                {/*name*/}
                <div className="grid col-span-full gap-2">
                  <div className='flex items-center text-neutral-600 gap-2'>
                    <PencilLine size={16}/>
                    <Label htmlFor="name" className='font-semibold'>Section</Label>
                  </div>
                  <div className='px-4'>
                    <Input
                      id="name"
                      type="text"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      placeholder='Enter section here'
                      className='border border-dashed border-neutral-400'
                    />
                  </div>
                  {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                </div>

                {/*grade level*/}
                <div className="grid gap-2">
                  <div className='flex items-center text-neutral-600 gap-2'>
                    <BookUp2 size={16}/>
                    <Label className='font-semibold'>Grade Level</Label>
                  </div>
                  <div className='px-4'>
                    <Select                     
                      value={data.grade_level_id === 0 ? '' : data.grade_level_id.toString()}
                      onValueChange={(value) => setData('grade_level_id', Number(value))}
                    >
                    <SelectTrigger className='border border-dashed border-neutral-400'>
                      <SelectValue placeholder="Grade Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Grade Levels</SelectLabel>
                        {gradeLevels.map((type) => (
                          <SelectItem key={type.id} value={type.id.toString()}>{type.name}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                    </Select>                
                  </div>
                  {errors.grade_level_id && <p className="text-sm text-red-600">{errors.grade_level_id}</p>}
                </div>

                {/*is_special*/}
                <div className="col-span-full flex items-center gap-2">
                  <Checkbox
                    id="is_active"
                    checked={data.is_special}
                    onCheckedChange={(checked) => setData('is_special', !!checked)}
                  />
                  <div className="flex gap-1">
                    <Label htmlFor="is_active">Special Section</Label>
                    <p className="text-muted-foreground text-sm">
                      (Check if this is a special section.)
                    </p>
                  </div>
                </div>

                {/* Show cutoff input if is_special is checked */}
                {data.is_special && (
                  <div className="grid px-4 gap-2">
                    <div className="flex items-center text-neutral-600 gap-2">
                      <ChartBar size={16} />
                      <Label htmlFor="cutoff_grade" className="font-semibold">Cutoff Grade</Label>
                    </div>
                    <div className="px-4">
                      <Input
                        id="cutoff_grade"
                        type="number"
                        
                        value={data.cutoff_grade || ''}
                        onChange={(e) => setData('cutoff_grade', Number(e.target.value))}
                        min={1}
                        className="border border-dashed border-neutral-400"
                      />
                    </div>
                    {errors.cutoff_grade && (
                      <p className="text-sm text-red-600">{errors.cutoff_grade}</p>
                    )}
                  </div>
                )}
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

export default EditSectionDialog;
