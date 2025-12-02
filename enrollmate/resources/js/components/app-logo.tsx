import {BookMarked, Notebook} from 'lucide-react';
import AppLogoIcon from './app-logo-icon';
import logo from '@/assets/logo/logo.png'

type props = {
    withText?:boolean;
}

export default function AppLogo({withText = true}:props) {
    return (
        <>
            <div className="flex aspect-square size-6 items-center justify-center rounded-sm text-sidebar-primary-foreground">
                <img src={logo} alt="" className='object-cover w-full h-full' />
            </div>

            {withText &&
                <div className="ml-1 grid text-left text-sm">
                    <span className="mb-0.5 truncate leading-tight font-semibold">Enroll_Mate</span>
                </div>
            }
        </>
    );
}
