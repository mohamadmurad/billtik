<?php

namespace App\Models;

use App\Enums\InvoiceStatusEnum;
use App\Models\Client\Client;
use App\Models\ClientSubscription\ClientSubscription;
use App\Policies\InvoicePolicy;
use App\Traits\HasCompany;
use Illuminate\Database\Eloquent\Attributes\UsePolicy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

#[UsePolicy(InvoicePolicy::class)]
class Invoice extends Model
{
    use SoftDeletes, HasCompany;

    protected $fillable = [
        'client_id', 'invoice_number', 'company_id', 'number',
        'issue_date', 'due_date', 'amount', 'tax_amount',
        'discount_amount', 'total_amount', 'description', 'status', 'paid_at'
    ];
    protected $casts = [
        'issue_date' => 'date',
        'due_date' => 'date',
        'paid_at' => 'date',
        'amount' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
    ];

    protected static function booted()
    {
        static::creating(function ($invoice) {
            if (empty($invoice->invoice_number)) {
                $invoice->number = static::generateInvoiceNumber($invoice->company_id);
                $invoice->formated_number = static::generateFormatedNumber($invoice->number);
            }
        });
    }

    public static function generateInvoiceNumber(int $company_id)
    {
        $lastNumber = Invoice::byCompany($company_id)->max('number');
        if ($lastNumber) return $lastNumber + 1;
        return 1;
    }

    private static function generateFormatedNumber(int $number): string
    {
        return 'INV-' . date('ynj') . '-' . $number;
    }

    public function calcAmount()
    {
        $amount = 0;
        foreach ($this->items()->get() as $item) {
            /**  @var InvoiceItem $item */
            $amount += $item->subAmount();
        }
        $this->amount = round($amount, 2);
        $total = $amount + $this->tax_amount - $this->discount_amount;
        $this->total_amount = $total;
        $this->save();
        $this->checkPaidStatus();
    }

    public function items(): HasMany
    {
        return $this->hasMany(InvoiceItem::class);
    }

    private function checkPaidStatus()
    {
        return;
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function handle()
    {
        if ($this->isPaid()) return;
        DB::beginTransaction();

        try {
            $items = $this->items()->with('item')->get();
            foreach ($items as $item) {
                if ($item->item_type === ClientSubscription::class) {
                    /** @var ClientSubscription $subscription */
                    $subscription = $item->item;
                    if ($item->renewal_end) {
                        $subscription->update([
                            'end_date' => $item->renewal_end,
                        ]);
                        $subscription->checkStatus();
                    }
                }
            }
            DB::commit();
        } catch (\Exception $exception) {
            DB::rollBack();
        }
    }

    public function isPaid(): bool
    {
        return $this->status === InvoiceStatusEnum::PAID->value || !is_null($this->paid_at);
    }

}
