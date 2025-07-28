<?php

namespace App\Models;

use App\Traits\HasAbilities;
use App\Traits\HasCompany;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Router extends Model
{
    use SoftDeletes, HasAbilities;
    use HasCompany;

    protected $fillable = ['company_id', 'name', 'ip', 'username', 'password', 'port'];

}
