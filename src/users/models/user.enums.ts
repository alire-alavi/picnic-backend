import { registerEnumType } from '@nestjs/graphql'

export enum AddressType {
    BILLING = 'BILLING',
    SHIPPING = 'SHIPPING',
}

export enum OrderStatus {
    PENDING = 'PENDING',
    SUBMITTED = 'SUBMITTED',
    PAYMENT_REQUIRED = 'PAYMENT_REQUIRED',
    PRODUCTION = 'PRODUCTION',
    PRODUCTION_COMPLETE = 'PRODUCTION_COMPLETE',
    PROCESSING = 'PROCESSING',
    SHIPPING = 'SHIPPING',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED',
}

registerEnumType(AddressType, { name: 'AddressType' })
registerEnumType(OrderStatus, { name: 'OrderStatus' })
