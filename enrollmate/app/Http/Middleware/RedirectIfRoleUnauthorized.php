<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Spatie\Permission\Exceptions\UnauthorizedException;
use Spatie\Permission\Middleware\RoleMiddleware;

class RedirectIfRoleUnauthorized extends RoleMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle($request, Closure $next, $role, $guard = null): Response
    {
        try {
            return parent::handle($request, $next, $role, $guard);
        } catch (UnauthorizedException $e) {
            return redirect()->route('home')->with('error', 'Access denied.');
        }
    }
}
