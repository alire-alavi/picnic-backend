import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { ProductsFilter } from './dto/products.interface'
import { Product } from './models/product.model'
import { CatalogPackItem, ProductCatalog } from './models/product-catalog.model'

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async getCatalog(productId: string): Promise<ProductCatalog> {
    const product = await this.prisma.product.findUniqueOrThrow({
      where: { id: productId },
      select: {
        category: { select: { wholesaleMinimumPacks: true } },
        sellingModes: {
          orderBy: { mode: 'asc' },
          include: {
            variants: {
              where: { isActive: true },
              orderBy: [{ name: 'asc' }, { id: 'asc' }],
              include: {
                prices: {
                  where: { currency: { isActive: true } },
                  orderBy: { currency: { code: 'asc' } },
                  include: { currency: true },
                },
              },
            },
          },
        },
      },
    })

    return {
      deliveryConditions: {
        shippingIncludedInPrice: false,
        destinationRequiredForQuote: true,
      },
      sellingModes: product.sellingModes
        .filter(({ variants }) => variants.length > 0)
        .map(({ mode, purchasePolicy, variants }) => {
          const wholesale = mode === 'WHOLESALE'
          const minimumPacks = wholesale
            ? product.category.wholesaleMinimumPacks
            : null
          const minimumStock = wholesale ? minimumPacks : 1

          return {
            mode,
            purchasePolicy,
            minimumPacks,
            variants: variants.map(
              ({ id, name, stock, packContents, prices }) => {
                // The database enforces the contents shape for wholesale packs.
                const contents = wholesale
                  ? (packContents as unknown as CatalogPackItem[])
                  : []
                const itemsPerSale = wholesale
                  ? contents.reduce(
                      (total, item) => total.plus(item.quantity),
                      new Prisma.Decimal(0),
                    )
                  : 1

                return {
                  id,
                  name,
                  available:
                    minimumStock !== null &&
                    stock >= minimumStock &&
                    prices.length > 0,
                  packContents: contents,
                  prices: prices.map(({ amount, currency }) => ({
                    currencyCode: currency.code,
                    currencySymbol: currency.symbol,
                    amount: amount.toFixed(),
                    amountPerItem: wholesale
                      ? amount.div(itemsPerSale).toFixed()
                      : amount.toFixed(),
                  })),
                }
              },
            ),
          }
        }),
    }
  }

  async create(data: {
    name: string
    slug: string
    prices: Array<{ currencyId: string; amount: number }>
    seo_title: string
    seo_description: string
    seo_keywords: string
    categoryId: string
    thumbnailId?: string
    channelId?: string
  }): Promise<Product> {
    // Get the first price as the legacy price field (for backward compatibility)
    const prices = data.prices.map(({ currencyId, amount }) => ({
      currencyId,
      amount,
    }))
    const defaultPrice = prices[0]?.amount ?? 0

    const product = await this.prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        price: defaultPrice,
        seo_title: data.seo_title,
        seo_description: data.seo_description,
        seo_keywords: data.seo_keywords,
        categoryId: data.categoryId,
        thumbnailId: data.thumbnailId,
        channelId: data.channelId,
        productPrices: { create: prices },
        sellingModes: {
          create: {
            mode: 'RETAIL',
            purchasePolicy: 'INSTANT',
            variants: {
              create: {
                name: data.name,
                prices: { create: prices },
              },
            },
          },
        },
      },
      include: {
        thumbnail: true,
        sliderImages: true,
        channel: true,
        productPrices: {
          include: {
            currency: true,
          },
        },
      },
    })

    return {
      ...product,
      price: product.price.toString(),
      productPrices: product.productPrices.map((pp) => ({
        ...pp,
        amount: pp.amount.toString(),
      })),
    } as Product
  }

  async list(
    filter?: ProductsFilter,
    limit?: number,
    offset?: number,
  ): Promise<Product[]> {
    const where: Prisma.ProductWhereInput = {}

    // Apply category filter
    if (filter?.category) {
      where.categoryId = filter.category
    }

    // Apply price filters
    if (filter?.priceLte !== undefined || filter?.priceGte !== undefined) {
      where.price = {}
      if (filter.priceLte !== undefined) {
        where.price.lte = filter.priceLte
      }
      if (filter.priceGte !== undefined) {
        where.price.gte = filter.priceGte
      }
    }

    const products = await this.prisma.product.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
      take: limit || 20,
      skip: offset || 0,
      include: {
        thumbnail: true,
        sliderImages: true,
        channel: true,
        productPrices: {
          include: {
            currency: true,
          },
        },
      },
    })

    return products.map((p) => ({
      ...p,
      price: p.price.toString(),
      productPrices: p.productPrices.map((pp) => ({
        ...pp,
        amount: pp.amount.toString(),
      })),
    })) as Product[]
  }

  async getBySlug(slug: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        thumbnail: true,
        sliderImages: true,
        channel: true,
        productPrices: {
          include: {
            currency: true,
          },
        },
      },
    })
    if (!product) return null

    return {
      ...product,
      price: product.price.toString(),
      productPrices: product.productPrices.map((pp) => ({
        ...pp,
        amount: pp.amount.toString(),
      })),
    } as Product
  }

  async getById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        thumbnail: true,
        sliderImages: true,
        channel: true,
        productPrices: {
          include: {
            currency: true,
          },
        },
      },
    })
    if (!product) return null

    return {
      ...product,
      price: product.price.toString(),
      productPrices: product.productPrices.map((pp) => ({
        ...pp,
        amount: pp.amount.toString(),
      })),
    } as Product
  }

  async count(filter?: ProductsFilter): Promise<number> {
    const where: Prisma.ProductWhereInput = {}

    if (filter?.category) {
      where.categoryId = filter.category
    }

    if (filter?.priceLte !== undefined || filter?.priceGte !== undefined) {
      where.price = {}
      if (filter.priceLte !== undefined) {
        where.price.lte = filter.priceLte
      }
      if (filter.priceGte !== undefined) {
        where.price.gte = filter.priceGte
      }
    }

    return this.prisma.product.count({ where })
  }

  /**
   * Update product images: thumbnail and slider images.
   * - If thumbnailId is provided, set product.thumbnailId
   * - If sliderImageIds is provided, associate those images to the product
   *   and disassociate any existing images not in the new list.
   */
  async updateImages(
    productId: string,
    data: { thumbnailId?: string | null; sliderImageIds?: string[] | null },
  ): Promise<Product | null> {
    // Update thumbnail if provided
    if (data.thumbnailId !== undefined) {
      await this.prisma.product.update({
        where: { id: productId },
        data: { thumbnailId: data.thumbnailId || null },
      })
    }

    if (data.sliderImageIds !== undefined) {
      const newIds = data.sliderImageIds || []

      // Disassociate images that were linked to this product but are not in newIds
      await this.prisma.image.updateMany({
        where: {
          productSliderId: productId,
          id: { notIn: newIds.length ? newIds : ['-'] },
        },
        data: { productSliderId: null },
      })

      if (newIds.length) {
        // Associate specified images to this product
        await this.prisma.image.updateMany({
          where: { id: { in: newIds } },
          data: { productSliderId: productId },
        })
      }
    }

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        thumbnail: true,
        sliderImages: true,
        channel: true,
        productPrices: {
          include: {
            currency: true,
          },
        },
      },
    })
    if (!product) return null

    return {
      ...product,
      price: product.price.toString(),
      productPrices: product.productPrices.map((pp) => ({
        ...pp,
        amount: pp.amount.toString(),
      })),
    } as Product
  }
}
