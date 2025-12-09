<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Spatie\Permission\Exceptions\UnauthorizedException;
use Spatie\Permission\Middleware\RoleMiddleware;
use Symfony\Component\HttpFoundation\Response;

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
