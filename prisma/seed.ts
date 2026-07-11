import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  LOCATIONS,
  CAR_LISTINGS,
  PHONE_LISTINGS,
  REAL_ESTATE_LISTINGS,
  FURNITURE_LISTINGS,
  CLOTHING_LISTINGS,
  KIDS_LISTINGS,
  JOB_LISTINGS,
  SERVICE_LISTINGS,
  IMAGES,
  pickRandom,
  randomInt,
  randomPrice,
} from "./listings-bulk";

const prisma = new PrismaClient();

type ListingInput = {
  title: string;
  description: string;
  price: number;
  categoryId: string;
  userId: string;
  shopId?: string;
  type: "CLASSIFIED" | "PRODUCT";
  condition: "NEW" | "USED" | "REFURBISHED";
  location: string;
  images: string;
  attributes?: Record<string, string>;
};

function buildBulkListings(
  createdCategories: Record<string, string>,
  userIds: string[],
  shopId?: string
): ListingInput[] {
  const bulk: ListingInput[] = [];
  const sellerId = userIds[0];

  for (const car of CAR_LISTINGS) {
    for (const year of car.years) {
      const mileage = randomInt(15000, 180000);
      const transmission = pickRandom(["Автомат", "Механика"]);
      const fuel = pickRandom(["Бензин", "Дизель", "Газ"]);
      const location = pickRandom(LOCATIONS);
      const price = randomPrice(car.priceRange[0], car.priceRange[1]);
      const colors = ["Сафед", "Қора", "Кабуд", "Норанҷӣ", "Кумир"];
      const color = pickRandom(colors);

      bulk.push({
        title: `${car.brand} ${car.model} ${year} — ${color}`,
        description: `${car.brand} ${car.model} соли ${year}. Пробег ${mileage.toLocaleString()} км. ${transmission}, ${fuel}. Ҳолати хуб, бе зарари ҷiddi. Телефон барои маълумоти бештар.`,
        price,
        categoryId: createdCategories["moshin"],
        userId: pickRandom(userIds),
        type: "CLASSIFIED",
        condition: year >= 2020 ? pickRandom(["USED", "USED", "NEW"]) : "USED",
        location,
        images: JSON.stringify([pickRandom(IMAGES.car)]),
        attributes: {
          brand: car.brand,
          model: car.model,
          year: String(year),
          mileage: String(mileage),
          transmission,
          fuel,
        },
      });
    }
  }

  for (const phone of PHONE_LISTINGS) {
    bulk.push({
      title: phone.title,
      description: `${phone.title}. ${phone.condition === "NEW" ? "Нав, бо гарантия." : "Истифода шуда, ҳолати хуб."} Тавсия медиҳем санҷед.`,
      price: phone.price + randomInt(-100, 200),
      categoryId: createdCategories["telefon"],
      userId: pickRandom([sellerId, ...userIds]),
      shopId: Math.random() > 0.4 ? shopId : undefined,
      type: phone.condition === "NEW" ? "PRODUCT" : "CLASSIFIED",
      condition: phone.condition,
      location: pickRandom(LOCATIONS),
      images: JSON.stringify([pickRandom(IMAGES.phone)]),
    });
  }

  for (const re of REAL_ESTATE_LISTINGS) {
    const isRent = re.title.includes("Иҷора");
    bulk.push({
      title: re.title,
      description: isRent
        ? `${re.title}. Майдон ${re.area} м². Коммуналка алohida. Бе ҳайvon.`
        : `${re.title}. Майдон ${re.area} м². ${re.rooms > 0 ? `${re.rooms} хона.` : ""} Санад мавҷуд.`,
      price: re.price,
      categoryId: createdCategories["khona"],
      userId: pickRandom(userIds),
      type: "CLASSIFIED",
      condition: "USED",
      location: pickRandom(LOCATIONS),
      images: JSON.stringify([pickRandom(IMAGES.home)]),
    });
  }

  for (const item of FURNITURE_LISTINGS) {
    bulk.push({
      title: item.title,
      description: `${item.title}. Сифати хуб. ${Math.random() > 0.5 ? "Нав." : "Истифода шуда, ҳолати хуб."}`,
      price: item.price,
      categoryId: createdCategories["mebel"],
      userId: pickRandom(userIds),
      type: "CLASSIFIED",
      condition: item.title.includes("нав") ? "NEW" : "USED",
      location: pickRandom(LOCATIONS),
      images: JSON.stringify([pickRandom(IMAGES.furniture)]),
    });
  }

  for (const item of CLOTHING_LISTINGS) {
    bulk.push({
      title: item.title,
      description: `${item.title}. Матои сифатнок.`,
      price: item.price,
      categoryId: createdCategories["libos"],
      userId: pickRandom(userIds),
      type: "CLASSIFIED",
      condition: "USED",
      location: pickRandom(LOCATIONS),
      images: JSON.stringify([pickRandom(IMAGES.clothing)]),
    });
  }

  for (const item of KIDS_LISTINGS) {
    bulk.push({
      title: item.title,
      description: `${item.title}. Барои кӯдакон. Ҳолати хуб.`,
      price: item.price,
      categoryId: createdCategories["kudakona"],
      userId: pickRandom(userIds),
      type: "CLASSIFIED",
      condition: item.title.includes("нав") || item.title.includes("LEGO") ? "NEW" : "USED",
      location: pickRandom(LOCATIONS),
      images: JSON.stringify([pickRandom(IMAGES.kids)]),
    });
  }

  for (const item of JOB_LISTINGS) {
    bulk.push({
      title: item.title,
      description: `${item.title}. Маош мувофиқи музокира. Тajriba хуш омад мешавад. CV ба WhatsApp фиристед.`,
      price: 0,
      categoryId: createdCategories["kor"],
      userId: pickRandom(userIds),
      type: "CLASSIFIED",
      condition: "NEW",
      location: pickRandom(LOCATIONS),
      images: JSON.stringify([pickRandom(IMAGES.job)]),
    });
  }

  for (const item of SERVICE_LISTINGS) {
    bulk.push({
      title: item.title,
      description: `${item.title}. Сифати баланд, нархи мувофиқ. Занг занед!`,
      price: item.price,
      categoryId: createdCategories["khizmat"],
      userId: pickRandom(userIds),
      type: "CLASSIFIED",
      condition: "NEW",
      location: pickRandom(LOCATIONS),
      images: JSON.stringify([pickRandom(IMAGES.service)]),
    });
  }

  return bulk;
}

async function main() {
  const passwordHash = await bcrypt.hash("password123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@bozor.tj" },
    update: { phone: "+992900000001" },
    create: {
      name: "Админ",
      email: "admin@bozor.tj",
      passwordHash,
      role: "ADMIN",
      phone: "+992900000001",
    },
  });

  const user = await prisma.user.upsert({
    where: { email: "user@bozor.tj" },
    update: { phone: "+992901234567" },
    create: {
      name: "Азиз Раҳимов",
      email: "user@bozor.tj",
      passwordHash,
      role: "USER",
      phone: "+992901234567",
    },
  });

  const seller = await prisma.user.upsert({
    where: { email: "seller@bozor.tj" },
    update: { phone: "+992909876543" },
    create: {
      name: "Мағозаи Техно",
      email: "seller@bozor.tj",
      passwordHash,
      role: "SELLER",
      phone: "+992909876543",
    },
  });

  const extraUsers = [
    { name: "Фарход Н.", email: "farhod@bozor.tj", phone: "+992931112233" },
    { name: "Мадина К.", email: "madina@bozor.tj", phone: "+992924445566" },
    { name: "Джамшед А.", email: "jamshid@bozor.tj", phone: "+992917778899" },
    { name: "АвтоМаркет TJ", email: "auto@bozor.tj", phone: "+992905551234", role: "SELLER" },
    { name: "Хонаи Хуб", email: "khona@bozor.tj", phone: "+992936667788", role: "SELLER" },
  ];

  const allUserIds = [user.id, seller.id];
  for (const u of extraUsers) {
    const created = await prisma.user.upsert({
      where: { email: u.email },
      update: { phone: u.phone },
      create: {
        name: u.name,
        email: u.email,
        passwordHash,
        role: u.role ?? "USER",
        phone: u.phone,
      },
    });
    allUserIds.push(created.id);
  }

  const categories = [
    { name: "Мошинҳо", slug: "moshin", icon: "car" },
    { name: "Хонаҳо", slug: "khona", icon: "home" },
    { name: "Телефонҳо", slug: "telefon", icon: "smartphone" },
    { name: "Либос", slug: "libos", icon: "shirt" },
    { name: "Кор", slug: "kor", icon: "briefcase" },
    { name: "Мебел", slug: "mebel", icon: "sofa" },
    { name: "Кӯдакона", slug: "kudakona", icon: "baby" },
    { name: "Хизматрасонӣ", slug: "khizmat", icon: "wrench" },
  ];

  const createdCategories: Record<string, string> = {};
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    createdCategories[cat.slug] = created.id;
  }

  const subcategories = [
    { name: "Седан", slug: "sedan", parentSlug: "moshin" },
    { name: "SUV", slug: "suv", parentSlug: "moshin" },
    { name: "Квартира", slug: "kvartira", parentSlug: "khona" },
    { name: "Хона", slug: "hona", parentSlug: "khona" },
    { name: "iPhone", slug: "iphone", parentSlug: "telefon" },
    { name: "Samsung", slug: "samsung", parentSlug: "telefon" },
  ];

  for (const sub of subcategories) {
    await prisma.category.upsert({
      where: { slug: sub.slug },
      update: {},
      create: {
        name: sub.name,
        slug: sub.slug,
        parentId: createdCategories[sub.parentSlug],
      },
    });
  }

  const carBrands = [
    "Toyota",
    "Honda",
    "Mercedes-Benz",
    "BMW",
    "Hyundai",
    "Kia",
    "Chevrolet",
    "Lada",
  ];

  const carAttributes = [
    {
      slug: "brand",
      name: "Марка",
      type: "SELECT",
      options: carBrands,
      order: 0,
    },
    { slug: "model", name: "Модел", type: "TEXT", options: [], order: 1 },
    { slug: "year", name: "Сол", type: "NUMBER", options: [], order: 2 },
    { slug: "mileage", name: "Пробег (км)", type: "NUMBER", options: [], order: 3 },
    {
      slug: "transmission",
      name: "Коробка",
      type: "SELECT",
      options: ["Автомат", "Механика"],
      order: 4,
    },
    {
      slug: "fuel",
      name: "Сузишворӣ",
      type: "SELECT",
      options: ["Бензин", "Дизель", "Газ", "Электро", "Гибрид"],
      order: 5,
    },
  ];

  const attributeIds: Record<string, string> = {};
  for (const attr of carAttributes) {
    const created = await prisma.categoryAttribute.upsert({
      where: {
        categoryId_slug: {
          categoryId: createdCategories["moshin"],
          slug: attr.slug,
        },
      },
      update: {
        name: attr.name,
        type: attr.type,
        options: JSON.stringify(attr.options),
        order: attr.order,
      },
      create: {
        categoryId: createdCategories["moshin"],
        name: attr.name,
        slug: attr.slug,
        type: attr.type,
        options: JSON.stringify(attr.options),
        order: attr.order,
      },
    });
    attributeIds[attr.slug] = created.id;
  }

  const shop = await prisma.shop.upsert({
    where: { userId: seller.id },
    update: {},
    create: {
      userId: seller.id,
      name: "ТехноМаркет",
      description: "Мағозаи расмии техника ва гаджетҳо",
      rating: 4.8,
      reviewCount: 124,
    },
  });

  const sampleImages = JSON.stringify([
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
    "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800",
  ]);

  const listings: Array<{
    title: string;
    description: string;
    price: number;
    categoryId: string;
    userId: string;
    shopId?: string;
    type: "CLASSIFIED" | "PRODUCT";
    condition: "NEW" | "USED" | "REFURBISHED";
    location: string;
    images: string;
    attributes?: Record<string, string>;
  }> = [
    {
      title: "iPhone 15 Pro Max 256GB — Нав",
      description: "iPhone 15 Pro Max бо ҳаҷми 256GB. Ранги Titanium Black. Дар қуттии заводӣ, бо гарантия. Ҳамаи аксессуарҳо мавҷуданд.",
      price: 12500,
      categoryId: createdCategories["telefon"],
      userId: seller.id,
      shopId: shop.id,
      type: "PRODUCT",
      condition: "NEW",
      location: "Душанбе",
      images: sampleImages,
    },
    {
      title: "Toyota Camry 2019 — Сафед",
      description: "Toyota Camry соли 2019, пробег 45000 км. Ҳолати аъло, бе зарар. Мотор 2.5L, автомат. Тамоми хизматрасониҳо сари вақт.",
      price: 145000,
      categoryId: createdCategories["moshin"],
      userId: user.id,
      type: "CLASSIFIED",
      condition: "USED",
      location: "Душанбе",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1621007947382-bcb3eaa62c0f?w=800",
      ]),
      attributes: {
        brand: "Toyota",
        model: "Camry",
        year: "2019",
        mileage: "45000",
        transmission: "Автомат",
        fuel: "Бензин",
      },
    },
    {
      title: "Honda CR-V 2021 — Қора",
      description: "Honda CR-V EX-L, пробег 28000 км. Камераи 360°, кожа, панорама. Ҳолати идеалӣ.",
      price: 198000,
      categoryId: createdCategories["moshin"],
      userId: user.id,
      type: "CLASSIFIED",
      condition: "USED",
      location: "Душанбе",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800",
      ]),
      attributes: {
        brand: "Honda",
        model: "CR-V",
        year: "2021",
        mileage: "28000",
        transmission: "Автомат",
        fuel: "Бензин",
      },
    },
    {
      title: "Mercedes-Benz E200 2018",
      description: "Mercedes E200 AMG Line. Пробег 62000 км. Тамоми опсияҳо, хizmatrasонӣ дар дилер.",
      price: 265000,
      categoryId: createdCategories["moshin"],
      userId: seller.id,
      type: "CLASSIFIED",
      condition: "USED",
      location: "Душанбе",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800",
      ]),
      attributes: {
        brand: "Mercedes-Benz",
        model: "E200",
        year: "2018",
        mileage: "62000",
        transmission: "Автомат",
        fuel: "Бензин",
      },
    },
    {
      title: "Lada Vesta 2020",
      description: "Lada Vesta SW Cross, пробег 35000 км. Механика, иқonomии баланд.",
      price: 78000,
      categoryId: createdCategories["moshin"],
      userId: user.id,
      type: "CLASSIFIED",
      condition: "USED",
      location: "Хуҷанд",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800",
      ]),
      attributes: {
        brand: "Lada",
        model: "Vesta",
        year: "2020",
        mileage: "35000",
        transmission: "Механика",
        fuel: "Бензин",
      },
    },
    {
      title: "Квартира 3-хонагӣ — Марказ",
      description: "Квартираи 3-хонагӣ дар маркази шаҳр. Ошёнаи 5, майдони умумӣ 85 м². Таъмир нав, мебелпулӣ.",
      price: 850000,
      categoryId: createdCategories["khona"],
      userId: user.id,
      type: "CLASSIFIED",
      condition: "USED",
      location: "Душанбе",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      ]),
    },
    {
      title: "MacBook Air M2 2024",
      description: "MacBook Air M2, 16GB RAM, 512GB SSD. Барои кор ва таҳсил идеалӣ. Ҳолати нав, 3 моҳ истифода шуда.",
      price: 9800,
      categoryId: createdCategories["telefon"],
      userId: seller.id,
      shopId: shop.id,
      type: "PRODUCT",
      condition: "USED",
      location: "Душанбе",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
      ]),
    },
    {
      title: "Куртаи зимистона — L размер",
      description: "Куртаи зимистонаи брендӣ, андозаи L. Матои сифатнок, ранги кабуди торик. Як маротиба пӯшида шуда.",
      price: 450,
      categoryId: createdCategories["libos"],
      userId: user.id,
      type: "CLASSIFIED",
      condition: "USED",
      location: "Хуҷанд",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800",
      ]),
    },
    {
      title: "Samsung Galaxy S24 Ultra",
      description: "Samsung Galaxy S24 Ultra 512GB. Ранги Titanium Gray. Нав, бо гарантияи расмӣ 1 сол.",
      price: 10200,
      categoryId: createdCategories["telefon"],
      userId: seller.id,
      shopId: shop.id,
      type: "PRODUCT",
      condition: "NEW",
      location: "Душанбе",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800",
      ]),
    },
  ];

  for (const listing of listings) {
    const { attributes, ...listingData } = listing;
    const existing = await prisma.listing.findFirst({
      where: { title: listing.title },
    });

    const record =
      existing ??
      (await prisma.listing.create({
        data: {
          ...listingData,
          status: "ACTIVE",
          views: Math.floor(Math.random() * 500),
        },
      }));

    if (attributes) {
      for (const [slug, value] of Object.entries(attributes)) {
        const attributeId = attributeIds[slug];
        if (!attributeId) continue;
        await prisma.listingAttributeValue.upsert({
          where: {
            listingId_attributeId: {
              listingId: record.id,
              attributeId,
            },
          },
          update: { value },
          create: {
            listingId: record.id,
            attributeId,
            value,
          },
        });
      }
    }
  }

  const bulkListings = buildBulkListings(createdCategories, allUserIds, shop.id);
  let bulkCreated = 0;

  for (const listing of bulkListings) {
    const existing = await prisma.listing.findFirst({
      where: { title: listing.title },
    });
    if (existing) continue;

    const { attributes, ...listingData } = listing;
    const record = await prisma.listing.create({
      data: {
        ...listingData,
        status: "ACTIVE",
        views: Math.floor(Math.random() * 2000) + 50,
        createdAt: new Date(Date.now() - randomInt(0, 30) * 86400000),
      },
    });
    bulkCreated++;

    if (attributes) {
      for (const [slug, value] of Object.entries(attributes)) {
        const attributeId = attributeIds[slug];
        if (!attributeId) continue;
        await prisma.listingAttributeValue.create({
          data: { listingId: record.id, attributeId, value },
        });
      }
    }
  }

  const totalListings = await prisma.listing.count({ where: { status: "ACTIVE" } });

  await prisma.banner.deleteMany();
  await prisma.banner.createMany({
    data: [
      {
        title: "Хариду фурӯш дар як платформа",
        subtitle: "Эълонҳои шахсӣ ва мағозаҳои онлайн — ҳама дар Душанбе Маркетплейс",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200",
        link: "/sell",
        order: 0,
      },
      {
        title: "Техникаи нав бо тахфиф",
        subtitle: "То 30% тахфиф дар мағозаҳои расмӣ",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200",
        link: "/category/telefon",
        order: 1,
      },
    ],
  });

  const coupons = [
    {
      code: "SUMMER10",
      discountType: "PERCENT",
      value: 10,
      minOrderAmount: 500,
      usageLimit: 100,
    },
    {
      code: "WELCOME50",
      discountType: "FIXED",
      value: 50,
      minOrderAmount: 1000,
      usageLimit: 200,
    },
  ];

  for (const coupon of coupons) {
    await prisma.coupon.upsert({
      where: { code: coupon.code },
      update: {},
      create: {
        ...coupon,
        expiresAt: new Date("2027-12-31"),
      },
    });
  }

  const iphoneListing = await prisma.listing.findFirst({
    where: { title: { contains: "iPhone" } },
  });

  if (iphoneListing) {
    const existingReview = await prisma.review.findFirst({
      where: { listingId: iphoneListing.id, userId: user.id },
    });
    if (!existingReview) {
      await prisma.review.create({
        data: {
          userId: user.id,
          listingId: iphoneListing.id,
          shopId: shop.id,
          rating: 5,
          comment: "Маҳсулоти аъло! Тавсия медиҳам.",
          isVerifiedPurchase: true,
        },
      });
    }
  }

  console.log("Seed completed!");
  console.log(`Эълонҳо: ${totalListings} (нав: +${bulkCreated})`);
  console.log("Coupons: SUMMER10 (10%), WELCOME50 (50 с.)");
  console.log("Admin: admin@bozor.tj / password123");
  console.log("User: user@bozor.tj / password123");
  console.log("Seller: seller@bozor.tj / password123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
