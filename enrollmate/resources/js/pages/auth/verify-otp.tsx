import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

type Props = {
  applicantId: number;
};

export default function VerifyOtp({ applicantId }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    applicant_id: applicantId,
    code: '',
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    post(route('signup.verify'));
  };

  const resend = () => {
    post(route('signup.resend'));
  };

  return (
    <AuthLayout title="Verify your email" description="Enter the 6-digit code sent to your email">
      <Head title="Verify email" />
      <form className="flex flex-col gap-5" onSubmit={submit}>
        <div className="grid gap-2">
          <Label htmlFor="code" className="text-white">Verification code</Label>
          <Input id="code" value={data.code} onChange={(e) => setData('code', e.target.value)} className="bg-white text-black border-0" />
          <InputError message={errors.code} />
        </div>
        <Button type="submit" className="mt-2 w-full bg-[#4b1a1a] hover:bg-[#4b1a1a]/90 text-white" disabled={processing}>
          Verify
        </Button>
        <Button type="button" variant="outline" className="mt-2 w-full" onClick={resend} disabled={processing}>
          Resend code
        </Button>
      </form>
    </AuthLayout>
  );
}

