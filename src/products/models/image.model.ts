import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { AbstractModel } from '@picnic/utils'

export enum ImageSize {
    SMALL = 'SMALL',
    MEDIUM = 'MEDIUM',
    LARGE = 'LARGE',
}

registerEnumType(ImageSize, {
    name: 'ImageSize',
})

@ObjectType()
export class Image extends AbstractModel {
    @Field()
    url: string

    @Field(() => ImageSize)
    size: ImageSize

    @Field({ nullable: true })
    altText?: string

    @Field()
    createdAt: Date

    @Field()
    updatedAt: Date
}
