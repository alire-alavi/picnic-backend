import { PrismaClient, ChannelType } from '@prisma/client'

const prisma = new PrismaClient()

async function seedChannels() {
    console.log('Seeding channels...')

    const channels = [
        {
            name: 'Web Store',
            slug: 'web',
            type: ChannelType.WEB,
            description: 'Main web e-commerce platform',
            isActive: true,
        },
        {
            name: 'Mobile App',
            slug: 'mobile',
            type: ChannelType.MOBILE,
            description: 'iOS and Android mobile application',
            isActive: true,
        },
        {
            name: 'Marketplace',
            slug: 'marketplace',
            type: ChannelType.MARKETPLACE,
            description: 'Third-party marketplace integrations',
            isActive: true,
        },
        {
            name: 'Physical Store',
            slug: 'store',
            type: ChannelType.STORE,
            description: 'Brick and mortar retail locations',
            isActive: true,
        },
        {
            name: 'Partner Network',
            slug: 'partner',
            type: ChannelType.PARTNER,
            description: 'Partner and affiliate sales channels',
            isActive: true,
        },
    ]

    for (const channel of channels) {
        const existing = await prisma.channel.findUnique({
            where: { slug: channel.slug },
        })

        if (!existing) {
            await prisma.channel.create({
                data: channel,
            })
            console.log(`✓ Created channel: ${channel.name}`)
        } else {
            console.log(`- Channel already exists: ${channel.name}`)
        }
    }

    console.log('Channels seeding completed!')
}

seedChannels()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
