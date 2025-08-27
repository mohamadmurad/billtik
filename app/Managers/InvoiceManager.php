<?php

namespace App\Managers;



class InvoiceManager {
    public static function make(): static
    {
        return new static();
    }

//    public function generateSubscriptionInvoice(Client $client, ClientSubscription $subscription, array $addons = []): Invoice
//    {
//        $profile = $subscription->profile;
//        $issueDate = Carbon::now();
//        $dueDate = $issueDate->copy()->addDays(15);
//
//        // Calculate base amount from subscription
//        $baseAmount = $profile->price; // Assuming profile has price field
//
//        // Create invoice
//        $invoice = Invoice::create([
//            'client_id' => $client->id,
//            'subscription_id' => $subscription->id,
//            'issue_date' => $issueDate,
//            'due_date' => $dueDate,
//            'amount' => $baseAmount,
//            'total_amount' => $baseAmount,
//            'status' => 'draft',
//        ]);
//
//        // Add subscription item
//        InvoiceItem::create([
//            'invoice_id' => $invoice->id,
//            'item_type' => 'subscription',
//            'description' => "{$profile->name} Subscription - " .
//                $subscription->from->format('M d, Y') . " to " .
//                $subscription->to->format('M d, Y'),
//            'quantity' => 1,
//            'unit_price' => $baseAmount,
//            'amount' => $baseAmount,
//        ]);
//
//        // Add addons if any
//        $addonsTotal = 0;
//        foreach ($addons as $addon) {
//            $addonsTotal += $addon['price'];
//
//            InvoiceItem::create([
//                'invoice_id' => $invoice->id,
//                'item_type' => 'addon',
//                'description' => $addon['name'],
//                'quantity' => $addon['quantity'] ?? 1,
//                'unit_price' => $addon['price'],
//                'amount' => $addon['price'] * ($addon['quantity'] ?? 1),
//            ]);
//        }
//
//        // Update invoice totals
//        $invoice->update([
//            'amount' => $baseAmount + $addonsTotal,
//            'total_amount' => $baseAmount + $addonsTotal,
//        ]);
//
//        return $invoice->fresh();
//    }
}
