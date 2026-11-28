import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { Address } from './models/address.model';
import { CreateAddressInput } from './dto/create-address.input';
import { UpdateAddressInput } from './dto/update-address.input';
import { GqlAuthGuard } from '../auth/gql-auth.guard';

@Resolver(() => Address)
export class AddressesResolver {
    constructor(private readonly addressesService: AddressesService) { }

    @Mutation(() => Address, {
        name: 'createAddress',
        description: 'Create a new address for the authenticated user',
    })
    @UseGuards(GqlAuthGuard)
    async createAddress(
        @Args('input') input: CreateAddressInput,
        @Context() context: any,
    ): Promise<Address> {
        const userId = context.req.user.userId;
        return this.addressesService.create(userId, input) as any;
    }

    @Query(() => [Address], {
        name: 'myAddresses',
        description: 'Get all addresses for the authenticated user',
    })
    @UseGuards(GqlAuthGuard)
    async myAddresses(@Context() context: any): Promise<Address[]> {
        const userId = context.req.user.userId;
        return this.addressesService.findAll(userId) as any;
    }

    @Query(() => Address, {
        name: 'address',
        description: 'Get a specific address by ID (must belong to authenticated user)',
    })
    @UseGuards(GqlAuthGuard)
    async address(
        @Args('id') id: string,
        @Context() context: any,
    ): Promise<Address> {
        const userId = context.req.user.userId;
        return this.addressesService.findOne(id, userId) as any;
    }

    @Mutation(() => Address, {
        name: 'updateAddress',
        description: 'Update an address (must belong to authenticated user)',
    })
    @UseGuards(GqlAuthGuard)
    async updateAddress(
        @Args('id') id: string,
        @Args('input') input: UpdateAddressInput,
        @Context() context: any,
    ): Promise<Address> {
        const userId = context.req.user.userId;
        return this.addressesService.update(id, userId, input) as any;
    }

    @Mutation(() => Address, {
        name: 'deleteAddress',
        description: 'Delete an address (must belong to authenticated user)',
    })
    @UseGuards(GqlAuthGuard)
    async deleteAddress(
        @Args('id') id: string,
        @Context() context: any,
    ): Promise<Address> {
        const userId = context.req.user.userId;
        return this.addressesService.remove(id, userId) as any;
    }
}
