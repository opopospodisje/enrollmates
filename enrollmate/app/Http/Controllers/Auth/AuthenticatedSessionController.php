<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use Jenssegers\Agent\Agent;
use App\Models\LoginInfo;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $this->logLoginAttempt($request, 'pending');

        // Attempt to authenticate the user
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $this->updateLoginStatus($request, 'successful');

            $request->session()->regenerate();

            $user = Auth::user();

            // ✅ Spatie role-based redirection
            if ($user->hasRole('admin')) {
                return redirect()->intended(route('admin.dashboard', absolute: false));
            } elseif ($user->hasRole('teacher')) {
                return redirect()->route('teacher.dashboard');
            } elseif ($user->hasRole('student')) {
                return redirect()->route('student.home');
            } else {
                Auth::logout();
                return redirect()->route('login')->withErrors(['email' => 'Unauthorized role.']);
            }

        } else {
            $this->updateLoginStatus($request, 'failed');

            return redirect()->route('login')->withErrors(['email' => 'Invalid credentials']);
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

    /**
     * Log the login attempt with initial 'pending' status.
     * This records the initial attempt before authentication is finished.
     */
    private function logLoginAttempt(Request $request, $status)
    {
        $agent = new Agent();

        LoginInfo::create([
            'email' => $request->email,
            'status' => $status,
            'ip_address' => $request->ip(),
            'device' => $agent->device(),
            'platform' => $agent->platform(),
            'browser' => $agent->browser(),
        ]);
    }

    /**
     * Update the status of a login attempt after authentication.
     * This sets the status to 'successful' or 'failed' based on login outcome.
     */
    private function updateLoginStatus(Request $request, $status)
    {
        // Find the last pending login attempt for the given email and IP
        $loginInfo = LoginInfo::where('email', $request->email)
                              ->where('ip_address', $request->ip())
                              ->where('status', 'pending')
                              ->latest()
                              ->first();

        if ($loginInfo) {
            $loginInfo->update(['status' => $status]);
        }
    }
}
