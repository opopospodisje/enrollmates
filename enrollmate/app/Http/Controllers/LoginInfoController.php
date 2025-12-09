<?php

namespace App\Http\Controllers;

use App\Models\LoginInfo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Jenssegers\Agent\Agent;

class LoginInfoController extends Controller
{
    /**
     * Display the login attempt logs.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $logs = LoginInfo::latest()->get();

        $formattedLogs = $logs->map(function ($log) {
            return [
                'id' => $log->id,
                'email' => $log->email,
                'status' => $log->status,
                'ip_address' => $log->ip_address,
                'device' => $log->device,
                'platform' => $log->platform,
                'browser' => $log->browser,
                'created_at' => $log->created_at->format('Y-m-d H:i:s'),
            ];
        });

        return Inertia::render('admin/login_infos/index', [
            'logs' => $formattedLogs,
        ]);
    }

    /**
     * Handle the login attempt and log the information.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logLoginAttempt(Request $request)
    {
        $credentials = $request->only('email', 'password');
        $agent = new Agent;

        // Log login attempt (status will be 'pending' until authentication is done)
        try {
            LoginInfo::create([
                'email' => $request->email,
                'status' => 'pending',  // We'll update this later
                'ip_address' => $request->ip(),
                'device' => $agent->device(),
                'platform' => $agent->platform(),
                'browser' => $agent->browser(),
            ]);
        } catch (\Exception $e) {
            // Log the error to see what happened
            \Log::error('Error creating login info: '.$e->getMessage());

            return response()->json([
                'error_msg' => 'There was an error logging the login attempt.',
            ]);
        }

        // Authenticate the user
        if (Auth::attempt($credentials)) {
            // If login is successful, update the 'pending' status to 'successful'
            $this->updateLoginStatus($request->email, 'successful', $request->ip());

            // Role-based redirection
            $user = Auth::user();
            if ($user->hasRole('admin')) {
                return response()->json(['redirect' => route('admin.dashboard')]);
            } elseif ($user->hasRole('manager')) {
                return response()->json(['redirect' => route('manager.dashboard')]);
            } else {
                return response()->json(['redirect' => route('home')]);
            }
        } else {
            // If login failed, update the 'pending' status to 'failed'
            $this->updateLoginStatus($request->email, 'failed', $request->ip());

            return response()->json([
                'error_msg' => 'Invalid email or password, please try again.',
            ]);
        }
    }

    /**
     * Update the status of the login attempt after checking the email and IP address.
     *
     * @param  string  $email
     * @param  string  $status
     * @param  string  $ipAddress
     * @return void
     */
    private function updateLoginStatus($email, $status, $ipAddress)
    {
        // Find the latest "pending" login record for the email and IP
        $loginInfo = LoginInfo::where('email', $email)
            ->where('ip_address', $ipAddress)
            ->where('status', 'pending')
            ->latest()
            ->first();

        if ($loginInfo) {
            $loginInfo->update([
                'status' => $status,
            ]);
        }
    }
}
