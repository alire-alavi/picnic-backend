// import { KavenegarClient, KavenegarOptions } from '../auth/sms/kevenegar.js'
import { KavenegarClient, KavenegarOptions } from './kavenegar.js'
import { SmsFactory, SmsFactoryOptions, SmsSendResult, SmsStrategy } from './strategy.js'
import type { ConfigService } from '@nestjs/config'

export class KavenegarStrategy implements SmsStrategy {
    public readonly name = 'kavenegar'
    private client: KavenegarClient
    private defaultTemplate?: string

    constructor(options: KavenegarOptions & { template?: string }) {
        this.client = new KavenegarClient(options)
        this.defaultTemplate = options.template
    }

    async sendText(to: string, message: string): Promise<SmsSendResult> {
        const res = await this.client.sendSms(to, message)
        return {
            success: res.success,
            error: res.error,
            provider: this.name,
            providerMessageId: res.messageId,
        }
    }

    async sendOtp(to: string, otp: string, template?: string): Promise<SmsSendResult> {
        const tpl = template || this.defaultTemplate
        const res = tpl
            ? await this.client.verifyLookup(to, tpl, otp)
            : await this.client.sendSms(to, `Your verification code is ${otp}`)
        return {
            success: res.success,
            error: res.error,
            provider: this.name,
            providerMessageId: res.messageId,
        }
    }
}

export const createSmsStrategy: SmsFactory = (opts: SmsFactoryOptions): SmsStrategy => {
    switch (opts.provider) {
        case 'kavenegar':
            if (!opts.apiKey) throw new Error('Kavenegar apiKey is required')
            return new KavenegarStrategy({
                apiKey: opts.apiKey,
                sender: opts.sender,
                baseUrl: opts.baseUrl,
                template: opts.template,
            })
        default:
            throw new Error(`Unsupported SMS provider: ${opts.provider}`)
    }
}

// Convenience: build Kavenegar strategy from Nest ConfigService
export function createKavenegarStrategyFromConfig(config: ConfigService): SmsStrategy {
    const apiKey = config.get<string>('KAVENEGAR_API_KEY') || ''
    if (!apiKey) throw new Error('KAVENEGAR_API_KEY is not set')
    return new KavenegarStrategy({
        apiKey,
        sender: config.get<string>('KAVENEGAR_SENDER') || undefined,
        baseUrl: config.get<string>('KAVENEGAR_BASE_URL') || undefined,
        template: config.get<string>('KAVENEGAR_TEMPLATE') || undefined,
    })
}
