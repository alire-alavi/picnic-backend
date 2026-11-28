import { PurchasePolicy, SellingMode } from '@prisma/client'
import {
  Field,
  Float,
  ID,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql'

registerEnumType(SellingMode, { name: 'SellingMode' })
registerEnumType(PurchasePolicy, { name: 'PurchasePolicy' })

@ObjectType()
export class CatalogPrice {
  @Field()
  currencyCode: string

  @Field()
  currencySymbol: string

  @Field()
  amount: string

  @Field({ description: 'Price per individual item, as a decimal string.' })
  amountPerItem: string
}

@ObjectType()
export class CatalogPackItem {
  @Field()
  name: string

  @Field(() => Float, { description: 'Whole number of items in the pack.' })
  quantity: number
}

@ObjectType()
export class CatalogVariant {
  @Field(() => ID)
  id: string

  @Field()
  name: string

  @Field()
  available: boolean

  @Field(() => [CatalogPackItem])
  packContents: CatalogPackItem[]

  @Field(() => [CatalogPrice])
  prices: CatalogPrice[]
}

@ObjectType()
export class CatalogSellingMode {
  @Field(() => SellingMode)
  mode: SellingMode

  @Field(() => PurchasePolicy)
  purchasePolicy: PurchasePolicy

  @Field(() => Int, {
    nullable: true,
    description: 'Minimum packs per wholesale variant in the primary category.',
  })
  minimumPacks: number | null

  @Field(() => [CatalogVariant])
  variants: CatalogVariant[]
}

@ObjectType()
export class CatalogDeliveryConditions {
  @Field()
  shippingIncludedInPrice: boolean

  @Field()
  destinationRequiredForQuote: boolean
}

@ObjectType()
export class ProductCatalog {
  @Field(() => [CatalogSellingMode])
  sellingModes: CatalogSellingMode[]

  @Field(() => CatalogDeliveryConditions)
  deliveryConditions: CatalogDeliveryConditions
}
