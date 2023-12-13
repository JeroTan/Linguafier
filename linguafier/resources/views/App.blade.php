<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="author" content="OnlyMeChanics | Jerowe Tan | Mekani_Tekno">
    <meta name="description" content="Website for Wizard who have learned how to utter a Language.">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/icon" href="{{ asset('favicon.ico') }}" />
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
