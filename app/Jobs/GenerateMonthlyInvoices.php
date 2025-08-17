<?php

namespace App\Jobs;

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
            if (now()->day == ($company->settings['invoice_day'] ?? 1)) {
                $this->generateInvoicesForCompany($company);
            }
        }
    }
    protected function generateInvoicesForCompany(Company $company)
    {
        $subscriptions = $company->subscriptions()
            ->where('status', 'active')
            ->with('client', 'invoices')
            ->get();

        foreach ($subscriptions as $subscription) {
            $this->generateInvoiceForSubscription($subscription);
        }
    }

    protected function generateInvoiceForSubscription(ClientSubscription $subscription)
    {
        $today= today();
        $nextMonth = $today->copy()->addMonth();
        $nextMonthStart = $nextMonth->copy()->startOfMonth();
        $nextMonthEnd = $nextMonth->copy()->endOfMonth();

        $dueDate = $today->copy()->addDays($subscription->client->company->settings['grace_period_days']??1);

        foreach ($company->activeSubscriptions as $subscription) {
            $this->generateNextMonthInvoice(
                $subscription,
                $nextMonthStart,
                $nextMonthEnd,
                $dueDate
            );
        }

    }

    protected function generateNextMonthInvoice(
        ClientSubscription $subscription,
        Carbon $monthStart,
        Carbon $monthEnd,
        Carbon $dueDate
    ) {
        // التحقق من عدم وجود فاتورة لهذا الشهر
        $existingInvoice = $subscription->invoices()
            ->where('covered_from', $monthStart)
            ->first();

        if ($existingInvoice) {
            return;
        }

        // إنشاء فاتورة للشهر التالي
        Invoice::create([
            'subscription_id' => $subscription->id,
            'invoice_number' => 'INV-' . strtoupper(uniqid()),
            'issue_date' => now(), // تاريخ اليوم (يوم الاصدار)
            'due_date' => $dueDate,
            'covered_from' => $monthStart,
            'covered_to' => $monthEnd,
            'amount' => $subscription->profile->price,
            'status' => 'unpaid',
            'source' => 'auto'
        ]);
    }
}
