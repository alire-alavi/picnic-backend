import { PrismaClient, UserRole } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Helper function to create or update an admin user
 */
async function createAdminUser(
  email: string,
  name: string,
  role: UserRole = UserRole.ADMIN,
  password?: string
) {
  const user = await prisma.user.upsert({
    where: { email },
    update: { 
      role,
      name,
    },
    create: {
      email,
      name,
      role,
      profileStatus: 'ACTIVE',
      // If you want to set a default password, add it here
      // passwordHash: hashPassword(password),
    },
  })

  console.log(`✅ ${role} user created/updated: ${email}`)
  return user
}

async function main() {
  console.log('🚀 Seeding admin users...')

  // Create a super admin
  await createAdminUser(
    'super-admin@picnic.local',
    'Super Admin',
    UserRole.SUPER_ADMIN
  )

  // Create an admin
  await createAdminUser(
    'admin@picnic.local',
    'Admin User',
    UserRole.ADMIN
  )

  // Create a regular user for testing
  await createAdminUser(
    'user@picnic.local',
    'Test User',
    UserRole.USER
  )

  console.log('✅ Admin users seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding admin users:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
