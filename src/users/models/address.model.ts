import { AbstractModel } from '@picnic/utils'
import { Field, ObjectType } from '@nestjs/graphql'
import { AddressType } from './user.enums'

@ObjectType()
export class Address extends AbstractModel {
    @Field()
    street: string

    @Field(() => AddressType)
    type: AddressType

    @Field()
    city: string

    @Field()
    state: string

    @Field()
    zipCode: string

    @Field()
    country: string

    @Field()
    createdAt: string

    @Field()
    updatedAt: string
}
