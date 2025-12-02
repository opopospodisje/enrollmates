import AppLogo from '@/components/app-logo';
import { Separator } from '@/components/ui/separator';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { FilePlus, GraduationCap, LogOut, Notebook, Settings, Sheet, User2 } from 'lucide-react';
import logo from '@/assets/logo/logo.png'


type Student ={
    id: number;
    first_name: string;
    last_name: string;
    is_graduated: number;
}

interface Setting {
  id: number;
  setting_name: string;
  value: string;
  default_value: string;
}


type StudentProps = {
    student: Student;
    settings: Setting[];
    isFreshmen: boolean;
    isGraduating: boolean;
}

export default function Home({ student, settings, isFreshmen, isGraduating}: StudentProps) {
    const { auth } = usePage<SharedData>().props;


    const getSetting = (name: string) => settings.find(s => s.setting_name === name);

    const isViewAllowed = getSetting('can_student_view_grades')?.value === 'true';

    const isEnrollmentAllowed = getSetting('can_student_enroll')?.value === 'true';

    const isStudentAlumni = student.is_graduated === 1;

    console.log(isEnrollmentAllowed)

    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    console.log(student);
    

    return (
        <>
            <Head title="Home">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            
            <div className='flex min-h-screen flex-col items-center bg-[#F1F3F2] text-[#1b1b18] dark:bg-[#0a0a0a]'>
                <header className="bg-sidebar w-full text-sm not-has-[nav]:hidden p-6">
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

                <div className='w-full' 
                    style={{
                        backgroundImage: "url(https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
                        backgroundPosition: "center",
                        backgroundSize: "cover"
                    }}
                >
                    <div className='w-full h-full p-6 backdrop-blur-xs'>
                        <div className="max-w-6xl h-full mx-auto space-y-2 flex flex-col justify-center p-6">
                            <div className='flex items-center justify-center'>
                                <img src={logo} alt="" className='object-cover h-40 aspect-square' />
                            </div>
                            <div>
                                <h3 className='inline-block px-4 text-2xl bg-sidebar text-white dark:text-sidebar-accent'>
                                    {student.is_graduated ? 'Congratulations' : 'Welcome'}
                                </h3>
                            </div>

                            <h1 className="text-3xl lg:text-6xl font-semibold text-white">
                                {student.first_name} {student.last_name} <span className='text-xs bg-amber-300'></span> 
                            </h1>                    
                            <p className="text-gray-900 text-lg bg-accent px-1">
                                {student.is_graduated ? 
                                    'And Welcome to the Alumni Community' 
                                    : 
                                    'This is your dashboard. You can check your subjects, grades and your information here.'
                                }                            
                            </p>
                        </div>
                    </div>
                </div>

                <div className='bg-yellow-200 w-full h-15 flex items-center justify-center font-black px-4 text-center'>
                    <p>Stay connected, stay inspired – the legacy of [school] lives on, no matter where life takes you.</p>
                </div>
                    
                <div className='p-6 w-full max-w-6xl'>

                    <div className='grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-8 mx-auto w-full'>
                        {/* Main content goes here */}

                        {isViewAllowed &&
                            <Link href={route('student.grades.index')} className='flex flex-col justify-end rounded-md bg-sidebar-accent shadow-lg w-full aspect-square p-4 hover:shadow-2xl hover:bg-lime-300 hover:scale-[1.02] transition-all duration-200'>
                                <div className='flex items-center flex-auto '>
                                    <Sheet className='size-10 text-neutral-500' />
                                </div>                        
                                <h2 className='text-lg font-semibold'>Grades</h2>
                                <p className='text-gray-600 h-[40px] truncate'>Check your grades for each subject.</p>
                            </Link>
                        }

                        {isStudentAlumni &&
                            <Link href={route('student.alumnis.show')} className='flex flex-col justify-end rounded-md bg-amber-200 shadow-lg w-full aspect-square p-4 hover:shadow-2xl hover:bg-amber-300 hover:scale-[1.02] transition-all duration-200'>
                                <div className='flex items-center flex-auto '>
                                    <GraduationCap className='size-10 text-neutral-500' />
                                </div>                        
                                <h2 className='text-lg font-semibold'>Alumni</h2>
                                <p className='text-gray-600 h-[40px] truncate'>Check and Update your alumni info.</p>
                            </Link>
                        }

                        {isEnrollmentAllowed && !isFreshmen && !isGraduating &&
                            <Link href={route('student.enrollments.create')} className='flex flex-col justify-end rounded-md bg-orange-200 shadow-lg w-full aspect-square p-4 hover:shadow-2xl hover:bg-orange-300 hover:scale-[1.02] transition-all duration-200'>
                                <div className='flex items-center flex-auto '>
                                    <FilePlus className='size-10 text-neutral-500' />
                                </div>                        
                                <h2 className='text-lg font-semibold'>Enroll</h2>
                                <p className='text-gray-600 h-[40px] truncate'>View and edit your profile information.</p>
                            </Link>
                        }

                        <Link href={route('student.profile.profile')} className='flex flex-col justify-end rounded-md bg-blue-200 shadow-lg w-full aspect-square p-4 hover:shadow-2xl hover:bg-blue-300 hover:scale-[1.02] transition-all duration-200'>
                            <div className='flex items-center flex-auto '>
                                <User2 className='size-10 text-neutral-500' />
                            </div>                        
                            <h2 className='text-lg font-semibold'>Profile</h2>
                            <p className='text-gray-600 h-[40px] truncate'>View and edit your profile information.</p>
                        </Link>
                        


{
/*

                        <div className='flex flex-col justify-end rounded-md bg-amber-200 shadow-lg w-full aspect-square p-4 hover:shadow-2xl hover:bg-amber-300 hover:scale-[1.02] transition-all duration-200'>
                            <div className='flex items-center flex-auto '>
                                <Notebook className='size-10 text-neutral-500' />
                            </div>                        
                            <h2 className='text-lg font-semibold'>Subjects</h2>
                            <p className='text-gray-600 h-[40px] truncate'>View your enrolled subjects and their details.</p>
                        </div>
                        <div className='flex flex-col justify-end rounded-md bg-neutral-300 shadow-lg w-full aspect-square p-4 hover:shadow-2xl hover:bg-neutral-400 hover:scale-[1.02] transition-all duration-200'>
                            <div className='flex items-center flex-auto '>
                                <Settings className='size-10 text-neutral-500' />
                            </div>                        
                            <h2 className='text-lg font-semibold'>Settings</h2>
                            <p className='text-gray-600 h-[40px] truncate'>Manage your account settings and preferences.</p>
                        </div>
                        */
}
                    </div>
                </div>
            </div>
        </>
    );
}
