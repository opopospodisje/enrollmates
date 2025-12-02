<?php

namespace App\Providers;

use Tinify\Tinify;
use Illuminate\Support\ServiceProvider;

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
