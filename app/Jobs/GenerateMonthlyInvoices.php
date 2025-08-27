<?php

namespace App\Jobs;

use App\Enums\InvoiceStatusEnum;
use App\Models\ClientSubscription\ClientSubscription;
use App\Models\Company;
use App\Models\Invoice;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Carbon;

class GenerateMonthlyInvoices implements ShouldQueue
{
    use Queueable, Dispatchable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $companies = Company::with('subscriptions.client')
            ->where('is_active', true)
            ->get();

        foreach ($companies as $company) {
            $this->generateInvoicesForCompany($company);

        }
    }

    protected function generateInvoicesForCompany(Company $company): void
    {
        $generate_invoice_before = intval($company->settings['generate_invoice_before'] ?? 1);
        ClientSubscription::query()
            ->with('profile')
            ->whereHas('client', fn($q) => $q->byCompany($company))
            ->whereDate('end_date', '=', today()->addDays($generate_invoice_before))
            ->chunk(100, function ($subscriptions) use ($company) {
                foreach ($subscriptions as $subscription) {
                    $this->generateInvoiceForSubscription($subscription, $company);
                }
            });
    }

    protected function generateInvoiceForSubscription(ClientSubscription $subscription, Company $company): void
    {

        $today = today();
        $dueDate = $today->copy()->addDays($company->settings['grace_period_days'] ?? 1);
        $endDate = Carbon::parse($subscription->end_date);
        $invoice = Invoice::create([
            'company_id' => $company->id,
            'client_id' => $subscription->client_id,
            'issue_date' => now(),
            'due_date' => $dueDate,
            'amount' => 0,
            'total_amount' => 0,
            'status' => InvoiceStatusEnum::UNPAID->value,
        ]);
        $invoice->items()->create([
            'item_type' => $subscription::class,
            'item_id' => $subscription->id,
            'quantity' => 1,
            'unit_price' => $subscription->profile->price,
            'amount' => $subscription->profile->price,
            'renewal_start' => $endDate->toDateString(),
            'renewal_end' => $endDate->clone()->addMonth()->toDateString(),
        ]);
        $invoice->calcAmount();
    }

}
