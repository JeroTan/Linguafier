<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Defines the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'popFlash' => fn () => session('popFlash') ?? null,
            'asset' => url('/')."/",
            'storage' => url('/storage')."/",
            'storageVariation' => url('/storage/word_variation')."/",
            'storageAttribute' => url('/storage/word_attribute')."/",
            'storageWordLibrary' => url('/storage/word_library')."/",
            'specialAccount' => fn () => session('SpecialAccount') ?? null,
            'getAllMapNodes' => fn () => $request->session()->get('getAllMapNodes'),
            'getPrivileges' => fn ()=> $request->session()->get('SpecialAccount')['privilege'] ?? [],
            // 'flash' => fn () => $request->session()->all() ?? null,
        ]);
    }
}
