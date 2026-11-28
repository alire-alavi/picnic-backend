import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { AbstractModel } from '../../utils/graphql.models';

export enum AddressType {
    BILLING = 'BILLING',
    SHIPPING = 'SHIPPING',
}

registerEnumType(AddressType, {
    name: 'AddressType',
    description: 'The type of address',
});

@ObjectType()
export class Address extends AbstractModel {
    @Field()
    userId: string;

    @Field()
    street: string;

    @Field(() => AddressType)
    type: AddressType;

    @Field()
    city: string;

    @Field()
    state: string;

    @Field()
    zipCode: string;

    @Field()
    country: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}
