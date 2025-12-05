import { InputType, Field } from '@nestjs/graphql';
import { AddressType } from '../models/address.model';

@InputType()
export class UpdateAddressInput {
    @Field({ nullable: true })
    street?: string;

    @Field(() => AddressType, { nullable: true })
    type?: AddressType;

    @Field({ nullable: true })
    city?: string;

    @Field({ nullable: true })
    state?: string;

    @Field({ nullable: true })
    zipCode?: string;

    @Field({ nullable: true })
    country?: string;
}
