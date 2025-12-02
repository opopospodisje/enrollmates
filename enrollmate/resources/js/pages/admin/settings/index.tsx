import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react'; // if using Inertia
import { Calendar } from 'lucide-react';
import * as React from "react"
import { Toaster } from '@/components/ui/sonner';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import Heading from '@/components/heading';
import { Switch } from '@/components/ui/switch'; // Make sure this is the correct import
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Room Types',
    href: '/roomtypes',
  },
];

type SchoolSettingsProps = {
  settings: {
    id: number;
    setting_name: string;
    value: string;
    default_value: string;
  }[];
}


const SchoolYearIndex = ({ settings }: SchoolSettingsProps) => {
  if (!Array.isArray(settings) || settings.length === 0) {
    return <div>No settings available.</div>;
  }

  // 🧠 Helper to initialize each setting
  const getSetting = (name: string) => settings.find(s => s.setting_name === name);

  // Get individual settings
  const canStudentViewGrades = getSetting('can_student_view_grades');
  const canStudentEnroll = getSetting('can_student_enroll');
  
  const canInputFirstQuarter = getSetting('enable_first_quarter_input');
  const canInputSecondQuarter = getSetting('enable_second_quarter_input');
  const canInputThirdQuarter = getSetting('enable_third_quarter_input');
  const canInputFourthQuarter = getSetting('enable_fourth_quarter_input');
  const canInputFinalGrade = getSetting('enable_final_grade_input');

  // Switch states
  const [isStudentViewGradesEnabled, setIsStudentViewGradesEnabled] = useState(canStudentViewGrades?.value === 'true');
  const [isStudentEnrollEnabled, setIsStudentEnrollEnabled] = useState(canStudentEnroll?.value === 'true');

  const [firstQuarterEnabled, setFirstQuarterEnabled] = useState(canInputFirstQuarter?.value === 'true');
  const [secondQuarterEnabled, setSecondQuarterEnabled] = useState(canInputSecondQuarter?.value === 'true');
  const [thirdQuarterEnabled, setThirdQuarterEnabled] = useState(canInputThirdQuarter?.value === 'true');
  const [fourthQuarterEnabled, setFourthQuarterEnabled] = useState(canInputFourthQuarter?.value === 'true');
  const [finalGradeEnabled, setFinalGradeEnabled] = useState(canInputFinalGrade?.value === 'true');

  // 🛠 Generalized switch handler
  const handleSwitchChange = (id: number | undefined, checked: boolean, setState: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (id === undefined) return;

    setState(checked);

    router.put(route('admin.settings.update'), {
      id,
      value: checked ? 'true' : 'false',
    }, {
      preserveScroll: true,
    });
  };

return (
    <div className="container">
      <Head title="School Settings" />
      <Toaster position="top-center" />
      <Heading title="School Settings Management" description="Manage School Settings" icon={Calendar} />

      <div className="relative border-y py-2 my-4">
        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
      </div>

      <Card className='p-0 gap-0 mb-4'>
          <CardHeader className='font-black py-4 text-lg'>View Settings</CardHeader>
          <Separator />
          <CardContent className='py-4 space-y-4'>
            {canStudentViewGrades && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="can-student-view-grades"
                  checked={isStudentViewGradesEnabled}
                  onCheckedChange={(checked) =>
                    handleSwitchChange(canStudentViewGrades.id, checked, setIsStudentViewGradesEnabled)
                  }
                />
                <Label htmlFor="can-student-view-grades">Enable Student View of Grades</Label>
              </div>
            )}
          </CardContent>
      </Card>

      <Card className='p-0 gap-0 mb-4'>
          <CardHeader className='font-black py-4 text-lg'>Enrollment Settings</CardHeader>
          <Separator />
          <CardContent className='py-4 space-y-4'>
            {/* student enrll */}
            {canStudentEnroll && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="can-student-enroll"
                  checked={isStudentEnrollEnabled}
                  onCheckedChange={(checked) =>
                    handleSwitchChange(canStudentEnroll.id, checked, setIsStudentEnrollEnabled)
                  }
                />
                <Label htmlFor="can-student-view-grades">Enable Student Enroll</Label>
              </div>
            )}
          </CardContent>
      </Card>

      <Card className='p-0 gap-0'>
          <CardHeader className='font-black py-4 text-lg'>Grades Settings</CardHeader>
          <Separator />
          <CardContent className='py-4 space-y-4'>
            {canInputFirstQuarter && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="enable-first-quarters"
                  checked={firstQuarterEnabled}
                  onCheckedChange={(checked) =>
                    handleSwitchChange(canInputFirstQuarter.id, checked, setFirstQuarterEnabled)
                  }
                />
                <Label htmlFor="enable-all-quarters">First Quarter Grades Input</Label>
              </div>
            )}

            {canInputSecondQuarter && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="enable-second-quarters"
                  checked={secondQuarterEnabled}
                  onCheckedChange={(checked) =>
                    handleSwitchChange(canInputSecondQuarter.id, checked, setSecondQuarterEnabled)
                  }
                />
                <Label htmlFor="enable-all-quarters">Second Quarter Grades Input</Label>
              </div>
            )}

            {canInputThirdQuarter && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="enable-third-quarters"
                  checked={thirdQuarterEnabled}
                  onCheckedChange={(checked) =>
                    handleSwitchChange(canInputThirdQuarter.id, checked, setThirdQuarterEnabled)
                  }
                />
                <Label htmlFor="enable-all-quarters">Third Quarter Grades Input</Label>
              </div>
            )}

            {canInputFourthQuarter && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="enable-fourth-quarters"
                  checked={fourthQuarterEnabled}
                  onCheckedChange={(checked) =>
                    handleSwitchChange(canInputFourthQuarter.id, checked, setFourthQuarterEnabled)
                  }
                />
                <Label htmlFor="enable-all-quarters">Fourth Quarter Grades Input</Label>
              </div>
            )}

            {canInputFinalGrade && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="enable-final"
                  checked={finalGradeEnabled}
                  onCheckedChange={(checked) =>
                    handleSwitchChange(canInputFinalGrade.id, checked, setFinalGradeEnabled)
                  }
                />
                <Label htmlFor="enable-all-quarters">Final Grades Input</Label>
              </div>
            )}
          </CardContent>
      </Card>
    </div>
  );
};

SchoolYearIndex.layout = (page: React.ReactNode) => (
  <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);

export default SchoolYearIndex;
