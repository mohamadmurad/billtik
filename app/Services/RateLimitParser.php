<?php

namespace App\Services;

class RateLimitParser
{
    public static function parse(string $rateLimit): array
    {
        if (empty($rateLimit) || $rateLimit === '0') {
            return [
                'download_rate' => 0,
                'download_unit' => 'bps',
                'upload_rate' => 0,
                'upload_unit' => 'bps',
                'original' => '0/0'
            ];
        }

        // Handle cases like "1M/1M" or "512k/256k"
        $parts = explode('/', $rateLimit);
        if (count($parts) !== 2) {
            throw new \InvalidArgumentException("Invalid rate limit format: {$rateLimit}");
        }

        $download = self::parseSingleRate($parts[0]);
        $upload = self::parseSingleRate($parts[1]);

        return [
            'download_rate' => $download['value'],
            'download_unit' => $download['unit'],
            'upload_rate' => $upload['value'],
            'upload_unit' => $upload['unit'],
            'original' => $rateLimit
        ];
    }

    protected static function parseSingleRate(string $rate): array
    {
        // Match numeric value and unit (e.g., "1M" => value=1, unit=M)
        if (!preg_match('/^(\d+)([kKmMgG]?)(bps)?$/i', trim($rate), $matches)) {
            throw new \InvalidArgumentException("Invalid rate component: {$rate}");
        }

        $value = (int)$matches[1];
        $unit = strtolower($matches[2] ?? '');

        // Convert unit to standard format
        $unitMap = [
            'k' => 'k',
            'm' => 'm',
            'g' => 'g',
            '' => 'bps'
        ];

        return [
            'value' => $value,
            'unit' => $unitMap[$unit] ?? 'bps'
        ];
    }

    public static function buildString(int $download, string $dUnit, int $upload, string $uUnit): string
    {
        $dUnit = strtolower(str_replace('bps', '', $dUnit));
        $uUnit = strtolower(str_replace('bps', '', $uUnit));

        return sprintf('%d%s/%d%s',
            $download, $dUnit === 'bps' ? '' : $dUnit,
            $upload, $uUnit === 'bps' ? '' : $uUnit
        );
    }
}
