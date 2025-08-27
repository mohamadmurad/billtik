<?php

namespace App\Policies;

class InvoicePolicy extends BasePolicy
{
    protected string $resource = 'invoices';
    protected bool $hasCompany = true;
}

