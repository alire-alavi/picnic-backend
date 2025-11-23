import { AbstractModel } from '@picnic/utils'
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { Address } from './address.model'
import { Profile } from './profile.model'
import { Order } from '../../orders/models/order.model'

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'User role for access control',
})

@ObjectType()
export class User extends AbstractModel {
  @Field({ nullable: true })
  email?: string
  @Field({ nullable: true })
  phoneNumber?: string
  @Field({ nullable: true })
  name?: string
  @Field(() => UserRole)
  role: UserRole
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
