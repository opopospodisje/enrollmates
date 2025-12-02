import { Room, RoomType, type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowDown01, ArrowDown10, ArrowDownAZ, ArrowDownZA, ArrowLeft, Bed, BedDouble, BookOpen, CircleDollarSign, CornerDownRight, Dot, Eye, FileDigit, FileDown, ImageOff, Layers, LetterText, List, Mountain, NotebookPen, PencilRuler, PhilippinePeso, Plus, SquarePen, StickyNote, Trash2, Users, Workflow } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import * as React from "react"
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState, } from "@tanstack/react-table"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from '@/components/ui/label';
import TableExportDropdown from '@/components/TableExportDropdown';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import TableToolbar from '@/components/table/TableToolbar';
import RoomIndex from '.';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Textarea } from '@/components/ui/textarea';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import EditRoomDialog from './Components/EditRoomDialog';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Rooms',
    href: '/roomtypes',
  },
  {
    title: 'Show',
    href: '',
  },
];

type Booking = {
  id: number;
  room_name: string;
  booking_date_from: string;
  booking_date_to: string;
};

type RoomShowProps = {
  roomType: RoomType;
  roomTypes: RoomType[];
  room: Room;
  rooms: Room[];
  bookings: Booking[];
  allRooms:Room[];
};

const RoomShow = ({allRooms, room,rooms, roomType, roomTypes,bookings,}: RoomShowProps) => {

  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="container mx-auto">
      <Head title="Room Types" />
      <Toaster position='top-center' />

      <div className="mb-4">
          <div className='flex justify-between items-center px-2 gap-2 text-md text-muted-foreground border-y w-38 mb-2'>
            <h4>Room id:</h4>
            <div className='bg-accent px-4'>{room.id}</div>            
          </div>

          <div className='flex justify-between items-center px-4'> 
            <div className="flex items-center gap-2">
                <BedDouble className="text-muted-foreground" size={28} />
                <h1 className='text-4xl capitalize font-bold'>{room.name}</h1>
            </div>
            
          <div className='flex gap-2'>
              <Link href={route('rooms.index')}>
                <Button className="text-white dark:text-black">
                  <ArrowLeft size={24}/>
                    Back to Room
                </Button>
              </Link>
              <EditRoomDialog allRooms={allRooms} room={room} roomTypes={roomTypes} buttonStyle='withName' />
          </div>

          </div>

        <div className="flex items-center px-8 gap-2">
          <CornerDownRight className="text-muted-foreground" size={18} />
          <p className="italic text-muted-foreground">Room Name</p>
        </div>
      </div>

      <Separator />

      <div className='relative border-y py-2'>
        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />        
      </div>

      <div className='w-full grid grid-cols-2 gap-8 p-4'>
        <div className='flex flex-col gap-4 items-center justify-center px-14'>
          {/* Slide counter */}
          {room.attachments.length > 0 && count > 0 ? (
            <div className="py-1 w-40 text-center text-sm border-y border-dashed">
              Image {current + 1} of {count}
            </div>
          ) : (
            <div className="py-1 w-40 text-center text-sm border-y border-dashed">
              No Images
            </div>
          )}
          <Carousel className="w-full" setApi={setApi}>
            <CarouselContent>
              {room.attachments.length > 0 ? (
                room.attachments.map((attachment, index) => {
                  if ('file_path' in attachment) {
                    return (
                      <CarouselItem
                        key={attachment.id || index}
                        className="flex items-center justify-center"
                      >
                        <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg relative">
                          <img
                            src={attachment.file_path}
                            alt={`Attachment ${attachment.id ?? index}`}
                            className="w-full h-full object-center object-cover rounded"
                          />
                        </AspectRatio>
                      </CarouselItem>
                    );
                  }
                  return null;
                })
              ) : (
                <CarouselItem className="flex items-center justify-center">
                  <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg flex flex-col items-center justify-center text-muted-foreground">
                    <ImageOff size={18} />No Image
                  </AspectRatio>
                </CarouselItem>
              )}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          {/* Dot indicators */}
          {count > 0 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              {Array.from({ length: count }).map((_, index) => (
                <Button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={`
                    w-2 h-2 p-0 rounded-full
                    ${index === current ? 'bg-primary' : 'bg-gray-400'}
                    transition-colors
                  `}
                  aria-label={`Go to slide ${index + 1}`}
                />
                  
              ))}
            </div>
          )}
        </div>

        <Card className='py-0 gap-0 overflow-hidden'>
          <CardHeader className='bg-accent py-4'>
            <div className='flex items-center gap-2'>
              <List size={18} />
              <h1 className='text-lg font-semibold'>Room Details</h1>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className='py-4'>
            <div className="grid grid-cols-2 gap-4">

              <div className="grid gap-2">
                <div className='text-sm flex items-center text-muted-foreground gap-2'><Layers size={18}/> Room Type:</div>
                <div className='text-sm font-medium px-4 flex items-center'><Dot className='text-gray-500' />{room.room_type_name}</div>
              </div>  

              <div className="grid gap-2">
                <div className='text-sm flex items-center text-muted-foreground gap-2'><Workflow size={18}/> Sub Room Of:</div>
                <div className='text-sm font-medium px-4 flex items-center'><Dot className='text-gray-500' />{room.sub_room_of_name ?? 'none'}</div>
              </div>  

              <div className="grid gap-2">
                <div className='text-sm flex items-center text-muted-foreground gap-2'><Mountain size={18}/> View:</div>
                <div className='text-sm font-medium px-4 flex items-center'><Dot className='text-gray-500' />{room.view ?? 'none'}</div>
              </div>  

              <div className="grid gap-2">
                <div className='text-sm flex items-center text-muted-foreground gap-2'><PencilRuler size={18}/> Size:</div>
                <div className='text-sm font-medium px-4 flex items-center'><Dot className='text-gray-500' />{room.size ?? 'none'}</div>
              </div>  

              <div className="grid gap-2">
                <div className='text-sm flex items-center text-muted-foreground gap-2'><Users size={18}/> Capacity:</div>
                <div className='text-sm font-medium px-4 flex items-center'><Dot className='text-gray-500' />{room.capacity ?? 'none'}</div>
              </div> 

              <div className="grid gap-2">
                <div className='text-sm flex items-center text-muted-foreground gap-2'><Bed size={18}/> Number Of Bed:</div>
                <div className='text-sm font-medium px-4 flex items-center'><Dot className='text-gray-500' />{room.number_of_bed ?? 'none'}</div>
              </div>   

              <div className="grid col-span-full gap-2">
                <div className='text-sm flex items-center text-muted-foreground gap-2'><NotebookPen size={18}/> Description:</div>
                <div className='text-sm font-medium px-4'>
                  <Textarea
                    className='border border-dashed border-neutral-400 rounded-md resize-none'
                    value={room.description ?? 'none'}
                  />
                    
                </div>
              </div>   

              <div className="grid gap-2 col-span-2">
                <div className='text-sm flex items-center text-muted-foreground gap-2'><CircleDollarSign size={18}/>Price:</div>
                <div className=' px-4'>                  
                  <div className='text-center font-semibold text-3xl rounded-md border border-emerald-600 py-4 gap-2 bg-lime-100'><span>₱</span>{room.price ?? 'none'}</div>                  
                </div>
              </div>  
              
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='relative border-y py-2 mb-4'>
        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />        
      </div>

      <div className='relative border-y py-4 mb-4'>
        <h3 className='text-center font-medium  '>Related Table</h3>      
      </div>
      
    </div>
  );
};

RoomShow.layout = (page: React.ReactNode) => (
  <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);

export default RoomShow;
