<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Tinify\Tinify;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (config('services.tinify.key')) {
            Tinify::setKey(config('services.tinify.key'));
        }
    }
}
