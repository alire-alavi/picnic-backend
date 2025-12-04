import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { ChannelsService } from './channels.service'
import { Channel } from './models/channel.model'
import { CreateChannelInput } from './dto/create-channel.input'
import { UpdateChannelInput } from './dto/update-channel.input'
import { GqlAuthGuard } from '../auth/gql-auth.guard'
import { GqlRolesGuard } from '../auth/guards/gql-roles.guard'
import { Roles, UserRole } from '../auth/decorators/roles.decorator'

@Resolver(() => Channel)
export class ChannelsResolver {
    constructor(private readonly channelsService: ChannelsService) { }

    @Query(() => [Channel], { name: 'channels' })
    async findAll() {
        return this.channelsService.findAll()
    }

    @Query(() => [Channel], { name: 'activeChannels' })
    async findActive() {
        return this.channelsService.findActive()
    }

    @Query(() => Channel, { name: 'channel' })
    async findOne(@Args('id') id: string) {
        return this.channelsService.findOne(id)
    }

    @Query(() => Channel, { name: 'channelBySlug', nullable: true })
    async findBySlug(@Args('slug') slug: string) {
        return this.channelsService.findBySlug(slug)
    }

    @Mutation(() => Channel)
    @UseGuards(GqlAuthGuard, GqlRolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    async createChannel(@Args('input') input: CreateChannelInput) {
        return this.channelsService.create({
            name: input.name,
            slug: input.slug,
            type: input.type,
            description: input.description,
            isActive: input.isActive,
        })
    }

    @Mutation(() => Channel)
    @UseGuards(GqlAuthGuard, GqlRolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    async updateChannel(
        @Args('id') id: string,
        @Args('input') input: UpdateChannelInput,
    ) {
        return this.channelsService.update(id, {
            name: input.name,
            slug: input.slug,
            type: input.type,
            description: input.description,
            isActive: input.isActive,
        })
    }

    @Mutation(() => Channel)
    @UseGuards(GqlAuthGuard, GqlRolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    async deleteChannel(@Args('id') id: string) {
        return this.channelsService.remove(id)
    }
}
