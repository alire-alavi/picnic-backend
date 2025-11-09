import { AbstractModel } from '@picnic/utils'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Profile extends AbstractModel {
    @Field({ nullable: true })
    company?: string

    @Field({ nullable: true })
    companyVat?: string

    @Field({ nullable: true })
    companyPhone?: string

    @Field({ nullable: true })
    bio?: string

    @Field()
    createdAt: string

    @Field()
    updatedAt: string
}
