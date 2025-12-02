import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Bed, CornerDownRight, ImagePlus, ImageUp, Layers, List, Mountain, NotebookPen, PencilLine, PencilRuler, PhilippinePeso, Plus, SquarePen, SquarePlus, Trash, Users, Workflow } from 'lucide-react';
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
import { router, useForm } from '@inertiajs/react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Room, RoomType } from '@/types';

type RoomFormData = {
  id: number;
  name: string;
  size: string;
  view: string;
  room_type_id: number;
  sub_room_of: number | null;
  capacity: number;
  price: number;
  description: string;
  featured: boolean;
  is_active: boolean;
  number_of_bed: number;
  attachments: (File | { id: number; file_path: string })[];
  deleted_attachments: number [];
};

type EditRoomDialogProps = {
  allRooms: Room[];
  room: Room;
  roomTypes: RoomType[];
  buttonStyle?: 'default' | 'withName'; // Optional prop
};

const EditRoomDialog = ({allRooms, room, roomTypes, buttonStyle='default'  }: EditRoomDialogProps) => {

  const [open, setOpen] = useState(false);

  const getInitialRoomFormData = (room: Room): RoomFormData => ({
    id: room.id,
    name: room.name,
    size: room.size,
    view: room.view,
    room_type_id: room.room_type_id,
    sub_room_of: room.sub_room_of,
    number_of_bed: room.number_of_bed,
    capacity: room.capacity,
    price: room.price,
    description: room.description,
    featured: room.featured,
    is_active: room.is_active,
    attachments: room.attachments ?? [],
    deleted_attachments: [],
  });

  const { data, setData, put, processing, errors, reset } = useForm<RoomFormData>(
    getInitialRoomFormData(room)
  );

  const [deletedAttachmentIds, setDeletedAttachmentIds] = useState<number[]>([]);

  const removeFile = (index: number) => {
    const updatedFiles = [...data.attachments];
    const fileToRemove = updatedFiles[index];

    console.log('fileToRemove:', fileToRemove);

    // If it's an existing attachment (not a File object)
    if (!(fileToRemove instanceof File) && 'id' in fileToRemove && typeof fileToRemove.id === 'number') {
      const updatedDeleted = [...(data.deleted_attachments ?? []), fileToRemove.id];
      setData('deleted_attachments', updatedDeleted);
      console.log('New deleted_attachments array:', updatedDeleted);
    }

    // Remove from UI regardless
    updatedFiles.splice(index, 1);
    setData('attachments', updatedFiles);
  };


  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
  const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);

    // Validate file types and size
    const invalidFiles = fileArray.filter(
      (file) =>
        !validImageTypes.includes(file.type) || file.size > MAX_FILE_SIZE
    );

    if (invalidFiles.length > 0) {
      alert('Only image files (JPEG, PNG, GIF, WebP) under 5MB are allowed.');
      e.target.value = ''; // Clear input
      return;
    }

    // Filter out duplicates (only compare against File instances)
    const uniqueNewFiles = fileArray.filter(
      (newFile) =>
        !data.attachments.some(
          (existing) =>
            existing instanceof File &&
            existing.name === newFile.name &&
            existing.size === newFile.size
        )
    );

    setData('attachments', [...data.attachments, ...uniqueNewFiles]);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const files = Array.from(e.dataTransfer.files);

    // Validate type and size
    const invalidFiles = files.filter(
      (file) =>
        !validImageTypes.includes(file.type) || file.size > MAX_FILE_SIZE
    );

    if (invalidFiles.length > 0) {
      alert('Only image files (JPEG, PNG, GIF, WebP) under 5MB are allowed.');
      return;
    }

    // Filter out duplicates against existing File objects
    const uniqueNewFiles = files.filter(
      (newFile) =>
        !data.attachments.some(
          (existing) =>
            existing instanceof File &&
            existing.name === newFile.name &&
            existing.size === newFile.size
        )
    );

    setData('attachments', [...data.attachments, ...uniqueNewFiles]);
  };

  const [priceInput, setPriceInput] = useState(String(data.price ?? ''));

  useEffect(() => {
    setPriceInput(String(data.price ?? ''));
  }, [data.price]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Form data being submitted: ', data);

    router.post(route('rooms.update', room.id), {
      ...data,
      _method: 'put',
    }, {
      forceFormData: true,
      onSuccess: () => {
        toast.success('Room updated!');
        setOpen(false);
      },
    });
  };


  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (isOpen) {
          setData(getInitialRoomFormData(room));
        }
      }}
    >
      <DialogTrigger asChild>
        {buttonStyle === 'withName' ? (
          <Button className='bg-emerald-600 hover:bg-emerald-700'>
            <SquarePen className="mr-2" />
            Edit Room
          </Button>
        ) : (
          <Button variant="outline">
            <SquarePen />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] lg:max-w-[1000px] p-0">
        <form onSubmit={handleSubmit} encType="multipart/form-data" autoComplete="off">
          <DialogHeader className='gap-0 p-4'>
            <DialogTitle className='flex items-center gap-2'>
              <SquarePen className='text-muted-foreground'/>
              <div className='text-2xl'>Edit Room</div>
            </DialogTitle>

            <DialogDescription className='flex items-center gap-2 px-2'>
              <CornerDownRight className='text-muted-foreground' size={18}/>
              <div>Upload an image and fill in the room details.</div>              
            </DialogDescription>
          </DialogHeader>          

          <Separator />
          <div className='w-full grid grid-cols-5 divide-x'>
            <div className='col-span-3 p-4'>
              <div className='flex items-center gap-2 mb-2'>
                <List className='text-muted-foreground' size={14}/>
                <div className='text-sm font-bold'>Room Details:</div>
              </div>
              <div className='px-2'>
                <div className="grid grid-cols-3 gap-4 px-2">
                  {/*name*/}
                  <div className="grid col-span-full gap-2">
                      <div className='flex items-center text-neutral-600 gap-2'>
                        <PencilLine size={16}/>
                        <Label htmlFor="name" className='font-semibold'>Room Name</Label>
                      </div>
                      <div className='px-4'>
                        <Input
                          id="name"
                          type="text"
                          value={data.name}
                          onChange={(e) => setData('name', e.target.value)}
                          placeholder='Enter room name here'
                          className='border border-dashed border-neutral-400'
                        />
                      </div>
                      {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                  </div>
                  {/*view*/}
                  <div className="grid gap-2">
                      <div className='flex items-center text-neutral-600 gap-2'>
                        <Mountain size={16}/>
                        <Label htmlFor="view" className='font-semibold'>View</Label>
                      </div>
                      <div className='px-4'>
                        <Input
                          id="view"
                          type="text"
                          value={data.view}
                          onChange={(e) => setData('view', e.target.value)}
                          placeholder='e.g. Sea View etc.'
                          className='border border-dashed border-neutral-400'
                        />
                      </div>
                      {errors.view && <p className="text-sm text-red-600">{errors.view}</p>}
                  </div>
                  {/*room type*/}
                  <div className="grid gap-2">
                      <div className='flex items-center text-neutral-600 gap-2'>
                        <Layers size={16}/>
                        <Label className='font-semibold'>Room Type</Label>
                      </div>
                      <div className='px-4'>
                        <Select                     
                          value={data.room_type_id === 0 ? '' : data.room_type_id.toString()}
                          onValueChange={(value) => setData('room_type_id', Number(value))}
                        >
                          <SelectTrigger className='border border-dashed border-neutral-400'>
                            <SelectValue placeholder="Room Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Room Types</SelectLabel>
                              {roomTypes.map((type) => (
                                <SelectItem key={type.id} value={type.id.toString()}>{type.name}</SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>                
                      </div>
                      {errors.room_type_id && <p className="text-sm text-red-600">{errors.room_type_id}</p>}
                  </div>
                  {/*sub room of*/}
                  <div className="grid gap-2">
                      <div className='flex items-center text-neutral-600 gap-2'>
                        <Workflow size={16}/>
                        <Label className='font-semibold'>Sub Room Of</Label>
                      </div>
                      <div className='px-4'>                    
                        <Select
                          value={data.sub_room_of?.toString() ?? ''}
                          onValueChange={(value) => setData('sub_room_of', value === '' ? null : Number(value))} 
                        >
                          <SelectTrigger className='border border-dashed border-neutral-400'>
                            <SelectValue placeholder="Select a room" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Rooms</SelectLabel>
                              {allRooms.map((room) => (
                                <SelectItem key={room.id} value={room.id.toString()}>{room.name}</SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>                                 
                      </div>
                      {errors.sub_room_of && <p className="text-sm text-red-600">{errors.sub_room_of}</p>}
                  </div>
                  {/*size*/}
                  <div className="grid gap-2">
                      <div className='flex items-center text-neutral-600 gap-2'>
                        <PencilRuler size={16}/>
                        <Label htmlFor="size" className='font-semibold'>Room Size</Label>
                      </div>
                      <div className='px-4'>
                        <Input
                          id="size"
                          type="text"
                          value={data.size}
                          onChange={(e) => setData('size', e.target.value)}
                          placeholder='e.g. 45 sqm'
                          className='border border-dashed border-neutral-400'
                        />
                      </div>
                      {errors.size && <p className="text-sm text-red-600">{errors.size}</p>}
                  </div>
                  {/*number of bed*/}
                  <div className="grid gap-2">
                      <div className='flex items-center text-neutral-600 gap-2'>
                        <Bed size={16}/>
                        <Label htmlFor="number_of_bed" className='font-semibold'>Number Of Bed</Label>
                      </div>
                      <div className='px-4'>
                        <Input
                          id="number_of_bed"
                          type="number"
                          value={data.number_of_bed}
                          onChange={(e) => setData('number_of_bed', Number(e.target.value))}
                          min={1}
                          className='border border-dashed border-neutral-400'
                        />
                      </div>
                      {errors.number_of_bed && <p className="text-sm text-red-600">{errors.number_of_bed}</p>}
                  </div>
                  {/*capacity*/}
                  <div className="grid gap-2">
                      <div className='flex items-center text-neutral-600 gap-2'>
                        <Users size={16}/>
                        <Label htmlFor="capacity" className='font-semibold'>Capacity</Label>
                      </div>
                      <div className='px-4'>
                        <Input
                          id="capacity"
                          type="number"
                          value={data.capacity}
                          onChange={(e) => setData('capacity', Number(e.target.value))}
                          min={1}
                          className='border border-dashed border-neutral-400'
                        />
                      </div>
                      {errors.capacity && <p className="text-sm text-red-600">{errors.capacity}</p>}
                  </div>
                  {/*price*/}
                  <div className="grid col-span-full gap-2">
                    <div className='flex items-center text-neutral-600 gap-2'>
                      <PhilippinePeso size={16} />
                      <Label htmlFor="price" className='font-semibold'>Price</Label>
                    </div>
                    <div className='px-4'> 
                      <Input
                        id='price'
                        className='border border-dashed border-neutral-400'
                        type="text"
                        inputMode="decimal"
                        value={priceInput}
                        onChange={(e) => {
                          const value = e.target.value;

                          // Allow digits and optional one dot
                          if (/^\d*\.?\d*$/.test(value)) {
                            setPriceInput(value);
                          }
                        }}
                        onBlur={() => {
                          // Convert to float when focus leaves
                          const numericValue = parseFloat(priceInput);
                          setData('price', isNaN(numericValue) ? 0 : numericValue);
                        }}
                      />
                    </div>
                    {errors.price && <p className="text-sm text-red-600">{errors.price}</p>}
                  </div>
                  {/*description*/}
                  <div className="grid col-span-full gap-2">
                      <div className='flex items-center text-neutral-600 gap-2'>
                        <NotebookPen size={16}/>
                        <Label htmlFor="description" className='font-semibold'>Description</Label>
                      </div>
                      <div className='px-4'>
                        <Textarea
                          id="description"
                          placeholder="Enter room description here."
                          value={data.description || ''}
                          onChange={(e) => setData('description', e.target.value)}
                          className="resize-y max-h-30 order border-dashed border-neutral-400"
                        />
                      </div>
                      {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                  </div> 
                  {/*is active*/}
                  <div className="col-span-full flex items-center gap-2">
                    <Checkbox
                      id="is_active"
                      checked={data.is_active}
                      onCheckedChange={(checked) => setData('is_active', !!checked)}
                    />
                    <div className="flex gap-1">
                      <Label htmlFor="is_active">Active</Label>
                      <p className="text-muted-foreground text-sm">
                        (If not active, clients cannot book this room.)
                      </p>
                    </div>
                  </div>
                  <div className="col-span-full flex items-start gap-2">
                    <Checkbox
                      id="featured"
                      checked={data.featured}
                      onCheckedChange={(checked) => setData('featured', !!checked)}
                    />
                    <div className="flex gap-1">
                      <Label htmlFor="featured">Featured</Label>
                      <p className="text-muted-foreground text-sm">
                        (Featured rooms are more visible to clients.)
                      </p>
                    </div>
                  </div>             
                </div>
              </div>
            </div>

            <div className='col-span-2 items-start p-4'>
              <div className='flex items-center gap-2 mb-2'>
                <ImageUp className='text-muted-foreground' size={14}/>
                <div className='text-sm font-bold'>Room Image/s</div>
              </div>
              <div className='h-110 max-h-110 px-2 flex flex-col items-center gap-6'>
                <div
                  className="relative flex-auto w-full rounded-lg border border-dashed border-neutral-400 flex flex-col justify-center items-center text-muted-foreground"
                  onDrop={handleFileDrop}
                  onDragOver={(e) => e.preventDefault()} // Important: allows drop
                >
                  <input
                    id="attachments"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  <button
                    type="button"
                    className="w-full h-full flex flex-col items-center justify-center"
                    onClick={() => document.getElementById('attachments')?.click()}
                  >
                    <ImagePlus />
                    <div className="px-4 text-center text-sm">
                      <span className="text-blue-800">Upload a file</span> or drag and drop <br /> PNG, JPG, GIF up to 5MB
                    </div>
                  </button>
                </div>
                <Separator />
                <div className="h-[150px] w-[340px] overflow-x-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
                  <div className="flex h-[120px] space-x-4 pr-4">
                    {data.attachments.length > 0 ? (
                      data.attachments.map((file, index) => {
                        const isFileObject = file instanceof File;
                        const src = isFileObject
                          ? URL.createObjectURL(file)
                          : (file as { file_path: string }).file_path; // no /storage prefix needed

                        return (
                          <div
                            key={index}
                            className="relative h-full aspect-square bg-neutral-200 shrink-0 rounded-md shadow shadow-neutral-500 overflow-hidden"
                          >
                            <img
                              src={src}
                              alt={`Preview ${index}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                            >
                              <Trash size={12} />
                            </button>
                          </div>
                        );
                      }
                    )
                    ) : (
                      <div className="flex items-center justify-center text-gray-400 w-full h-full col-span-3">
                        No image attached yet
                      </div>
                    )}
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />

          <DialogFooter className='p-4'>
            <DialogClose asChild>
              <Button variant="outline" type="button">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={processing} className='bg-emerald-600 hover:bg-emerald-800'>Update Room</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditRoomDialog;
