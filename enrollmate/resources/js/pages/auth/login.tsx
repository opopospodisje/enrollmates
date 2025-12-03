import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle, UserRound } from 'lucide-react';
import { FormEventHandler } from 'react';

import logo from '@/assets/logo/logo.png';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <Head title="Log in" />

            <div className="relative flex items-center justify-center bg-white p-10">
                <div className="flex flex-col items-center gap-6">
                    <img src={logo} alt="School Logo" className="h-52 w-52 md:h-60 md:w-60 object-contain" />
                    <div className="text-center">
                        <p className="text-2xl md:text-3xl font-bold text-neutral-700">Welcome to</p>
                        <h1 className="text-5xl md:text-6xl font-black text-red-600">Enroll_Mate</h1>
                    </div>
                </div>
                <PlaceholderPattern className="absolute left-6 bottom-6 h-24 w-24 text-red-600 opacity-60" variant="dots" corner="bottom-left" />
            </div>

            <div className="relative flex items-center justify-center bg-[#6f2222] p-10 text-white">
                <PlaceholderPattern className="absolute right-6 top-6 h-24 w-24 text-white opacity-60" variant="dots" corner="top-right" />
                <div className="w-full max-w-md">
                    <div className="flex flex-col items-center gap-3 mb-6">
                        <div className="flex items-center justify-center rounded-full bg-white/15 p-4">
                            <UserRound className="h-8 w-8 text-white" />
                        </div>
                        <div className="space-y-2 text-center">
                            <h1 className="text-2xl font-semibold">Login in to your account</h1>
                            <p className="text-sm text-neutral-200">Enter your email and password below to log in</p>
                        </div>
                    </div>

                    <form className="flex flex-col gap-5" onSubmit={submit}>
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-white">Email Address:</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="email@example.com"
                                className="bg-white text-black border-0"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password" className="text-white">Password:</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                tabIndex={2}
                                autoComplete="current-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Password"
                                className="bg-white text-black border-0"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-center gap-3">
                            <Checkbox
                                id="remember"
                                name="remember"
                                checked={data.remember}
                                onClick={() => setData('remember', !data.remember)}
                                tabIndex={3}
                            />
                            <Label htmlFor="remember" className="text-white">Remember me</Label>
                        </div>

                        <Button type="submit" className="mt-2 w-full bg-[#4b1a1a] hover:bg-[#4b1a1a]/90 text-white" tabIndex={4} disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Log in
                        </Button>
                    </form>

                    {status && <div className="mt-4 text-center text-sm font-medium text-green-300">{status}</div>}
                    <div className="mt-4 text-center text-sm">
                        <span className="text-neutral-200">Don't have an account? </span>
                        <Link href={route('signup.form')} className="underline text-white">Sign up</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
