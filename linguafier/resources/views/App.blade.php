<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    @inertiaHead {{--  IMPORTANTE TO SA INTERTIA REACT AT WALA TO SA DOCUMENTATION NILA KAYA MAARING PAKILAGAY PAG GAGAWA KA ULET NG BAGO PLEASE--}}
    @viteReactRefresh
    @vite('resources/css/app.css')
    @vite('resources/js/app.jsx')

  </head>
  <body>
    @inertia
  </body>
</html>

{{--
React Format

import { Head } from '@inertiajs/react';
import PagePlate from '../Utilities/PagePlate';

export default function Login(){

}

--}}
