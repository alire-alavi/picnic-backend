import { InputType, Field } from '@nestjs/graphql';
import { AddressType } from '../models/address.model';

@InputType()
export class CreateAddressInput {
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
}
