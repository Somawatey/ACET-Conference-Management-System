<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  $permission  The required permission
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next, $permission): Response
    {
        // Get the currently authenticated user
        $user = $request->user();
        // Check if the user has the specified permission
        if (!$user || !$user->hasPermissionTo($permission)) {
            abort(403, 'You do not have the required permission.');
        }

        // If permission is granted, allow the request to continue
        return $next($request);
    }
}
