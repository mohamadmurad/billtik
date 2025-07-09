<?php

namespace App\Models;

use App\Traits\HasAbilities;
use App\Traits\HasTranslatedName;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Company extends Model
{
    use SoftDeletes;
    use HasAbilities, HasTranslatedName;

    protected $fillable = ['name', 'status'];

    protected $casts = [
        'name' => 'json',
        'created_at' => 'datetime:Y-m-d H:i:s',
    ];


}
