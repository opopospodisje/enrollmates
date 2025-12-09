import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Heading from '@/components/heading';
import { UserCircle, ArrowLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

type Teacher = {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  middle_name?: string | null;
  suffix?: string | null;
  email?: string | null;
  address?: string | null;
  contact_number?: string | null;
  gender?: string | null;
  birthdate?: string | null;
  is_archived?: boolean;
};

type Props = {
  teacher: Teacher;
};

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Teachers', href: '/teachers' },
];

const TeacherShow = ({ teacher }: Props) => {
  const fullName = [teacher.last_name, teacher.first_name, teacher.middle_name].filter(Boolean).join(', ');

  return (
    <div className="container">
      <Head title="Teacher Profile" />

      <Heading title="Teacher Profile" description="View teacher information" icon={UserCircle} />

      <div className="flex items-center justify-between px-4 mb-4">
        <Link href={route('admin.teachers.index')} className="inline-flex items-center gap-2 text-sm">
          <ArrowLeft size={16} /> Back to list
        </Link>
        {teacher.is_archived && (
          <div className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground border">archived</div>
        )}
      </div>

      <Card className="p-0 gap-0 overflow-hidden">
        <CardHeader className="p-4">
          <div className="text-lg font-semibold">{fullName || 'N/A'}</div>
          <div className="text-sm text-muted-foreground">ID: {teacher.id}</div>
        </CardHeader>
        <Separator />
        <CardContent className="p-4 grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-muted-foreground">Email</div>
            <div className="text-sm">{teacher.email || 'N/A'}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Contact Number</div>
            <div className="text-sm">{teacher.contact_number || 'N/A'}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Address</div>
            <div className="text-sm">{teacher.address || 'N/A'}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Gender</div>
            <div className="text-sm">{teacher.gender || 'N/A'}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Birthdate</div>
            <div className="text-sm">{teacher.birthdate || 'N/A'}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Suffix</div>
            <div className="text-sm">{teacher.suffix || 'N/A'}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

TeacherShow.layout = (page: React.ReactNode) => (
  <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);

export default TeacherShow;

