export interface SmsSendResult {
    success: boolean
    error?: string
    provider?: string
    providerMessageId?: string | number
}

export interface SmsStrategy {
    name: string
    sendText(to: string, message: string): Promise<SmsSendResult>
    sendOtp(to: string, otp: string, template?: string): Promise<SmsSendResult>
}

export interface SmsFactoryOptions {
    provider: 'kavenegar'
    // Kavenegar
    apiKey?: string
    sender?: string
    baseUrl?: string
    template?: string
}

export type SmsFactory = (opts: SmsFactoryOptions) => SmsStrategy
