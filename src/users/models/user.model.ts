import { AbstractModel } from '@picnic/utils'
import { Field, ObjectType } from '@nestjs/graphql'
import { Address } from './address.model';
import { Profile } from './profile.model'
import { Order } from './order.model'

@ObjectType()
export class User extends AbstractModel {
  @Field({ nullable: true })
  email?: string
  @Field({ nullable: true })
  phoneNumber?: string
  @Field({ nullable: true })
  name?: string
  @Field()
  createdAt: string
  @Field()
  updatedAt: string

  @Field(() => [Address])
  addresses: Address[]

  @Field(() => [Order])
  orders: Order[]

  @Field(() => Profile, { nullable: true })
  profile?: Profile
}

