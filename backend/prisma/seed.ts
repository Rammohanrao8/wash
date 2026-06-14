import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Create Admin User ─────────────────────────────────
  const hashedPassword = await bcrypt.hash('Admin@123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@wash.com' },
    update: {},
    create: {
      email: 'admin@wash.com',
      name: 'Wash Admin',
      phone: '+919876543210',
      password: hashedPassword,
      role: Role.ADMIN,
      isVerified: true,
      isActive: true,
    },
  });
  console.log(`✅ Admin user created: ${admin.email}`);

  // ─── Create Sample Shop Owner ──────────────────────────
  const shopOwner = await prisma.user.upsert({
    where: { email: 'owner@wash.com' },
    update: {},
    create: {
      email: 'owner@wash.com',
      name: 'Demo Shop Owner',
      phone: '+919876543211',
      password: hashedPassword,
      role: Role.SHOP_OWNER,
      isVerified: true,
      isActive: true,
    },
  });
  console.log(`✅ Shop owner created: ${shopOwner.email}`);

  // ─── Create Sample Laundry Shop ────────────────────────
  const shop = await prisma.laundryShop.upsert({
    where: { id: 'seed-shop-001' },
    update: {},
    create: {
      id: 'seed-shop-001',
      ownerId: shopOwner.id,
      name: 'Sparkle Clean Laundry',
      description: 'Premium laundry and dry cleaning services with doorstep pickup and delivery.',
      phone: '+919876543211',
      email: 'sparkle@wash.com',
      street: '123 MG Road',
      city: 'Hyderabad',
      state: 'Telangana',
      zipCode: '500001',
      latitude: 17.385,
      longitude: 78.4867,
      isApproved: true,
      isActive: true,
      openTime: '08:00',
      closeTime: '21:00',
    },
  });
  console.log(`✅ Sample shop created: ${shop.name}`);

  // ─── Create Sample Services ────────────────────────────
  const services = [
    { name: 'Wash & Fold', description: 'Regular wash, fold, and pack', price: 49, unit: 'per_kg', estimatedDuration: 24 },
    { name: 'Wash & Iron', description: 'Wash with professional ironing', price: 79, unit: 'per_kg', estimatedDuration: 36 },
    { name: 'Dry Cleaning', description: 'Professional dry cleaning for delicate fabrics', price: 199, unit: 'per_piece', estimatedDuration: 48 },
    { name: 'Steam Iron', description: 'Steam pressing for wrinkle-free clothes', price: 29, unit: 'per_piece', estimatedDuration: 12 },
    { name: 'Stain Removal', description: 'Specialized stain removal treatment', price: 149, unit: 'per_piece', estimatedDuration: 48 },
  ];

  for (const svc of services) {
    await prisma.service.create({
      data: {
        shopId: shop.id,
        ...svc,
        isActive: true,
      },
    });
  }
  console.log(`✅ ${services.length} sample services created`);

  // ─── Create Sample Customer ────────────────────────────
  const customer = await prisma.user.upsert({
    where: { email: 'customer@wash.com' },
    update: {},
    create: {
      email: 'customer@wash.com',
      name: 'Demo Customer',
      phone: '+919876543212',
      password: hashedPassword,
      role: Role.CUSTOMER,
      isVerified: true,
      isActive: true,
    },
  });
  console.log(`✅ Customer created: ${customer.email}`);

  // ─── Create Sample Address ─────────────────────────────
  await prisma.address.create({
    data: {
      userId: customer.id,
      label: 'Home',
      street: '456 Banjara Hills',
      city: 'Hyderabad',
      state: 'Telangana',
      zipCode: '500034',
      latitude: 17.4138,
      longitude: 78.4393,
      isDefault: true,
    },
  });
  console.log(`✅ Sample address created`);

  // ─── Create Sample Delivery Partner ────────────────────
  const dpUser = await prisma.user.upsert({
    where: { email: 'delivery@wash.com' },
    update: {},
    create: {
      email: 'delivery@wash.com',
      name: 'Demo Delivery Partner',
      phone: '+919876543213',
      password: hashedPassword,
      role: Role.DELIVERY_PARTNER,
      isVerified: true,
      isActive: true,
    },
  });

  await prisma.deliveryPartner.upsert({
    where: { userId: dpUser.id },
    update: {},
    create: {
      userId: dpUser.id,
      vehicleType: 'MOTORCYCLE',
      vehicleNumber: 'TS09AB1234',
      licenseNumber: 'DL123456789',
      isAvailable: true,
      isVerified: true,
    },
  });
  console.log(`✅ Delivery partner created: ${dpUser.email}`);

  console.log('\n🎉 Seeding completed successfully!');
  console.log('\n📋 Demo Accounts:');
  console.log('─────────────────────────────────────');
  console.log(`Admin:    admin@wash.com    / Admin@123`);
  console.log(`Owner:    owner@wash.com    / Admin@123`);
  console.log(`Customer: customer@wash.com / Admin@123`);
  console.log(`Delivery: delivery@wash.com / Admin@123`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
