<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Facades\App;

trait HasTranslatedName
{
    protected function initializeHasTranslatedName(): void
    {
        $this->append('local_name');
    }

    public function localName(): Attribute
    {

        return Attribute::get(function () {
            $lang = ['en', 'ar'];
            if ($local_name = $this->name[App::getLocale()] ?? "") {
                return $local_name;
            }
            foreach ($lang as $locale) {
                if ($local_name = $this->name[$locale] ?? '') {
                    return $local_name;
                }
            }
            return $this->name;
        });

    }
}
