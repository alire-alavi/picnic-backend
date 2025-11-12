/**
 * Kavenegar SMS client (lightweight, dependency-free).
 * Docs: https://kavenegar.com/en/apidoc
 */

export interface KavenegarOptions {
    apiKey: string
    sender?: string
    baseUrl?: string // Default: https://api.kavenegar.com
}

export interface KavenegarReturn {
    status: number
    message: string
}

export interface KavenegarEntry {
    messageid: number
    message: string
    status: number
    statustext: string
    sender: string
    receptor: string
    date: number
    cost?: number
}

export interface KavenegarResponse<T = KavenegarEntry[]> {
    return: KavenegarReturn
    entries?: T
}

export interface SendResult {
    success: boolean
    messageId?: number
    status?: number
    statusText?: string
    receptor?: string
    raw?: unknown
    error?: string
}

const DEFAULT_BASE_URL = 'https://api.kavenegar.com'

export class KavenegarClient {
    private apiKey: string
    private sender?: string
    private baseUrl: string

    constructor(options: KavenegarOptions) {
        this.apiKey = options.apiKey
        this.sender = options.sender
        this.baseUrl = (options.baseUrl || DEFAULT_BASE_URL).replace(/\/$/, '')
    }

    /**
     * Send a plain SMS message.
     */
    async sendSms(receptor: string, message: string, sender?: string): Promise<SendResult> {
        const url = `${this.baseUrl}/v1/${this.apiKey}/sms/send.json`
        const params = new URLSearchParams({ receptor, message })
        const from = sender || this.sender
        if (from) params.set('sender', from)

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: params.toString(),
            })
            const data = (await res.json()) as KavenegarResponse

            const ok = data?.return?.status === 200
            const first = data?.entries?.[0]
            return {
                success: ok,
                messageId: first?.messageid,
                status: first?.status,
                statusText: first?.statustext,
                receptor: first?.receptor,
                raw: data,
                error: ok ? undefined : data?.return?.message || 'Kavenegar sendSms failed',
            }
        } catch (err: any) {
            return { success: false, error: err?.message || 'Network error' }
        }
    }

    /**
     * Use Kavenegar Verify Lookup for OTP templates.
     * Create a template in Kavenegar panel and pass its name.
     */
    async verifyLookup(
        receptor: string,
        template: string,
        token: string,
        opts?: { token2?: string; token3?: string; type?: 'sms' | 'call' },
    ): Promise<SendResult> {
        const url = `${this.baseUrl}/v1/${this.apiKey}/verify/lookup.json`
        const params = new URLSearchParams({ receptor, template, token })
        if (opts?.token2) params.set('token2', opts.token2)
        if (opts?.token3) params.set('token3', opts.token3)
        if (opts?.type) params.set('type', opts.type)

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: params.toString(),
            })
            const data = (await res.json()) as KavenegarResponse
            const ok = data?.return?.status === 200
            const first = data?.entries?.[0]
            return {
                success: ok,
                messageId: first?.messageid,
                status: first?.status,
                statusText: first?.statustext,
                receptor: first?.receptor,
                raw: data,
                error: ok ? undefined : data?.return?.message || 'Kavenegar verifyLookup failed',
            }
        } catch (err: any) {
            return { success: false, error: err?.message || 'Network error' }
        }
    }
}


