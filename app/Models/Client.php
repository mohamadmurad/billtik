<?php

namespace App\Models;

use App\Traits\HasAbilities;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Client extends Model
{
    use SoftDeletes;
    use HasAbilities;

    protected $fillable = [
        'name', 'username', 'password', 'email', 'phone', 'id_number',
    ];

    protected $casts = [
        'created_at' => 'datetime:Y-m-d H:i:s',
    ];
}
