<?php

namespace App\Enums;

enum ConnectionTypeEnum: string
{
    case PPP = 'ppp';
    case HOTSPOT = 'hotspot';
}
