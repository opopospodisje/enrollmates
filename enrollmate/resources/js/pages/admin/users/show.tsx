import { Button } from "@/components/ui/button";
import { PlaceholderPattern } from "@/components/ui/placeholder-pattern";
import { Toaster } from "@/components/ui/sonner";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, UserFormData } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, Award, Badge, BadgeCheck, Contact, CornerDownRight, IdCard, List, Mail, MailCheck, MailOpen, MapPin, Phone, UserRound, UserRoundPen } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";
import { Card, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import EditUserDialog from "./Components/EditUserDialog";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'User',
    href: '/users',
  },
];

type Role = {
  id: number;
  name: string;
}

type ShowUserProps = {
  roles: Role[];
  user: UserFormData;
};

const UserShow = ({ user, roles }: ShowUserProps) => {

  return (
    <div className="container mx-auto">
      <Head title="Room Types" />
      <Toaster position='top-center' />

      <div className="mb-4">
        <div className='flex justify-between items-center px-2 gap-2 text-md text-muted-foreground border-y w-38 mb-2'>
          <h4>User id:</h4>
          <div className='bg-accent px-4'>{user.id}</div>            
        </div>

        <div className='flex justify-between items-center px-4'> 
          <div className="flex items-center gap-2">
            <UserRound className="text-muted-foreground" size={28} />
            <h1 className='text-4xl capitalize font-bold'>{user.first_name} {user.last_name}</h1>
          </div>
            
          <div className='flex gap-2'>
            <Link href={route('users.index')}>
              <Button className="text-white dark:text-black">
              <ArrowLeft size={24}/>
                Back to Room
              </Button>
            </Link>
            <EditUserDialog user={user} roles={roles} buttonStyle="withName" />
          </div>
        </div>

        <div className="flex items-center px-8 gap-2">
          <CornerDownRight className="text-muted-foreground" size={18} />
          <p className="italic text-muted-foreground">User Name</p>
        </div>
      </div>

      <div className='relative border-y py-2 4 mb-4'>
        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />        
      </div>

      <Card className="p-0 gap-0 overflow-hidden">
          <CardHeader className='bg-accent py-4'>
            <div className='flex items-center gap-2'>
              <Contact size={18} />
              <h1 className='text-md font-semibold'>User Details</h1>
            </div>
          </CardHeader>
          <Separator />
        <Table>
          <TableBody>
            <TableRow className=" text-md divide-x">
              <TableCell className="px-4">
                <div className='flex items-center text-muted-foreground gap-4'><IdCard size={16}/>ID</div>            
              </TableCell>
              <TableCell className="px-4"><div>{user.id}</div></TableCell>
            </TableRow>

            <TableRow className=" text-md divide-x">
              <TableCell className="px-4">
                <div className='flex items-center text-muted-foreground gap-4 '><UserRound size={16}/>First Name</div>
              </TableCell>
              <TableCell className="px-4"><div>{user.first_name}</div></TableCell>
            </TableRow>

            <TableRow className=" text-md divide-x">
              <TableCell className="px-4">
                <div className='flex items-center text-muted-foreground gap-4'><CornerDownRight size={16}/>Last Name</div>
              </TableCell>
              <TableCell className="px-4"><div>{user.last_name}</div></TableCell>
            </TableRow>

            <TableRow className=" text-md divide-x">
              <TableCell className="px-4">
                <div className='flex items-center text-muted-foreground gap-4'><Phone size={16}/>Contact Number</div>
              </TableCell>
              <TableCell className="px-4"><div>{user.contact_number}</div></TableCell>
            </TableRow>

            <TableRow className=" text-md divide-x">
              <TableCell className="px-4">
                <div className='flex items-center text-muted-foreground gap-4'><MapPin size={16}/>Address</div>
              </TableCell>
              <TableCell className="px-4"><div>{user.address}</div></TableCell>
            </TableRow>

            <TableRow className=" text-md divide-x">
              <TableCell className="px-4">
                <div className='flex items-center text-muted-foreground gap-4'><Mail size={16}/>Email</div>
              </TableCell>
              <TableCell className="px-4"><div>{user.email}</div></TableCell>
            </TableRow>

            <TableRow className=" text-md divide-x">
              <TableCell className="px-4">
                <div className='flex items-center text-muted-foreground gap-4'><MailOpen size={16}/>Email Verified At</div>
              </TableCell>
              <TableCell className="px-4"><div>{user.email_verified_at}</div></TableCell>
            </TableRow>

            <TableRow className=" text-md divide-x">
              <TableCell className="px-4">
                <div className='flex items-center text-muted-foreground gap-4'><BadgeCheck size={16}/>Role</div>
              </TableCell>
              <TableCell className="px-4">
                <div>
                  <span className={
                      `px-4 rounded-full text-white capitalize text-xs ` +
                      (user.role === 'admin'
                        ? 'bg-purple-500'
                        : user.role === 'reception'
                        ? 'bg-orange-500'
                        : 'bg-gray-400') // default
                    }
                  >
                    {user.role}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>

    </div>
  );

}

UserShow.layout = (page: React.ReactNode) => (
  <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);

export default UserShow;