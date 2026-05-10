<?php

namespace App\Concerns;

use App\Models\Client;
use Illuminate\Validation\Rule;

trait ProfileValidationRules
{
    /**
     * Get the validation rules used to validate Client profiles.
     *
     * @return array<string, array<int, ValidationRule|array<mixed>|string>>
     */
    protected function profileRules(?int $clientId = null): array
    {
        return [
            'name' => $this->nameRules(),
            'email' => $this->emailRules($clientId),
        ];
    }

    /**
     * Get the validation rules used to validate Client names.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function nameRules(): array
    {
        return ['required', 'string', 'max:255'];
    }

    /**
     * Get the validation rules used to validate Client emails.
     *
     * @return array<int, ValidationRule|array<mixed>|string>
     */
    protected function emailRules(?int $clientId = null): array
    {
        return [
            'required',
            'string',
            'email',
            'max:255',
            $clientId === null
                ? Rule::unique(Client::class)
                : Rule::unique(Client::class)->ignore($clientId),
        ];
    }
}
