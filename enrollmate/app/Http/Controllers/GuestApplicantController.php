<?php

namespace App\Http\Controllers;

use App\Http\Requests\GuestApplicantRequest;
use App\Models\Applicant;
use App\Models\ApplicantEmailOtp;
use App\Models\SchoolYear;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\URL;

class GuestApplicantController extends Controller
{
    public function create()
    {
        $currentSchoolYear = SchoolYear::where('is_active', true)->first();
        return inertia('auth/signup', [
            'currentSchoolYear' => $currentSchoolYear ? [
                'id' => $currentSchoolYear->id,
                'name' => $currentSchoolYear->name,
            ] : null,
        ]);
    }

    public function store(GuestApplicantRequest $request)
    {
        $data = $request->validated();
        $currentSchoolYear = SchoolYear::where('is_active', true)->first();
        $data['school_year_id'] = $currentSchoolYear ? $currentSchoolYear->id : $data['school_year_id'] ?? null;
        $data['status'] = 'pending';

        $applicant = Applicant::create($data);

        $code = random_int(100000, 999999);

        ApplicantEmailOtp::create([
            'applicant_id' => $applicant->id,
            'email' => $applicant->email,
            'code_hash' => hash('sha256', (string) $code),
            'expires_at' => now()->addMinutes(10),
        ]);

        Mail::raw('Your verification code is: ' . $code, function ($message) use ($applicant) {
            $message->to($applicant->email)->subject('Email Verification Code');
        });

        return Redirect::route('signup.verify.form', ['applicant_id' => $applicant->id]);
    }

    public function showVerifyForm(Request $request)
    {
        $applicantId = (int) $request->query('applicant_id');
        return inertia('auth/verify-otp', [
            'applicantId' => $applicantId,
        ]);
    }

    public function verify(Request $request)
    {
        $request->validate([
            'applicant_id' => ['required', 'exists:applicants,id'],
            'code' => ['required', 'digits:6'],
        ]);

        $applicantId = (int) $request->input('applicant_id');
        $code = (string) $request->input('code');

        $otp = ApplicantEmailOtp::where('applicant_id', $applicantId)
            ->orderByDesc('id')
            ->first();

        if (!$otp) {
            return Redirect::back()->withErrors(['code' => 'Invalid code.']);
        }

        if ($otp->expires_at && $otp->expires_at->isPast()) {
            return Redirect::back()->withErrors(['code' => 'The code has expired.']);
        }

        $isValid = hash_equals($otp->code_hash, hash('sha256', $code));

        if (!$isValid) {
            return Redirect::back()->withErrors(['code' => 'Invalid code.']);
        }

        $otp->verified_at = now();
        $otp->save();

        return Redirect::route('login')->with('status', 'Email verified. You can now log in.');
    }

    public function resend(Request $request)
    {
        $request->validate([
            'applicant_id' => ['required', 'exists:applicants,id'],
        ]);

        $applicant = Applicant::findOrFail((int) $request->input('applicant_id'));

        $code = random_int(100000, 999999);

        ApplicantEmailOtp::create([
            'applicant_id' => $applicant->id,
            'email' => $applicant->email,
            'code_hash' => hash('sha256', (string) $code),
            'expires_at' => now()->addMinutes(10),
        ]);

        Mail::raw('Your verification code is: ' . $code, function ($message) use ($applicant) {
            $message->to($applicant->email)->subject('Email Verification Code');
        });

        return Redirect::back()->with('status', 'A new code has been sent.');
    }
}
