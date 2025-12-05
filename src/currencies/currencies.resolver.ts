import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { CurrenciesService } from './currencies.service'
import { Currency } from './models/currency.model'
import { CreateCurrencyInput } from './dto/create-currency.input'
import { UpdateCurrencyInput } from './dto/update-currency.input'
import { GqlAuthGuard } from '../auth/gql-auth.guard'
import { GqlRolesGuard } from '../auth/guards/gql-roles.guard'
import { Roles, UserRole } from '../auth/decorators/roles.decorator'

@Resolver(() => Currency)
export class CurrenciesResolver {
    constructor(private readonly currenciesService: CurrenciesService) { }

    @Mutation(() => Currency)
    @UseGuards(GqlAuthGuard, GqlRolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    async createCurrency(
        @Args('input', { type: () => CreateCurrencyInput })
        input: CreateCurrencyInput,
    ): Promise<Currency> {
        return this.currenciesService.create({
            code: input.code,
            name: input.name,
            symbol: input.symbol,
            decimalPlaces: input.decimalPlaces,
            isActive: input.isActive,
        })
    }

    @Mutation(() => Currency)
    @UseGuards(GqlAuthGuard, GqlRolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    async updateCurrency(
        @Args('id', { type: () => String }) id: string,
        @Args('input', { type: () => UpdateCurrencyInput })
        input: UpdateCurrencyInput,
    ): Promise<Currency | null> {
        return this.currenciesService.update(id, {
            name: input.name,
            symbol: input.symbol,
            decimalPlaces: input.decimalPlaces,
            isActive: input.isActive,
        })
    }

    @Mutation(() => Boolean)
    @UseGuards(GqlAuthGuard, GqlRolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    async deleteCurrency(
        @Args('id', { type: () => String }) id: string,
    ): Promise<boolean> {
        return this.currenciesService.delete(id)
    }

    @Query(() => [Currency], { name: 'currencies' })
    async getCurrencies(
        @Args('activeOnly', { type: () => Boolean, nullable: true, defaultValue: false })
        activeOnly?: boolean,
    ): Promise<Currency[]> {
        return this.currenciesService.list(activeOnly)
    }

    @Query(() => Currency, { name: 'currency', nullable: true })
    async getCurrency(
        @Args('id', { type: () => String }) id: string,
    ): Promise<Currency | null> {
        return this.currenciesService.getById(id)
    }

    @Query(() => Currency, { name: 'currencyByCode', nullable: true })
    async getCurrencyByCode(
        @Args('code', { type: () => String }) code: string,
    ): Promise<Currency | null> {
        return this.currenciesService.getByCode(code)
    }
}
