import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * The five roles this platform ships with. Permissions are assigned to
 * roles below rather than to users directly, so a user's access changes
 * automatically when their role's permissions change.
 */
const ROLES = [
  {
    name: "SUPER_ADMIN",
    description: "Full, unrestricted access to every module and system setting.",
  },
  {
    name: "ADMIN",
    description:
      "Manages users and all content/domain modules; cannot modify roles, permissions, or system settings.",
  },
  {
    name: "SEO_MANAGER",
    description: "Manages SEO metadata and has read access to content relevant to search optimization.",
  },
  {
    name: "CONTENT_MANAGER",
    description: "Creates, edits, and publishes blog and CMS content.",
  },
  {
    name: "EDITOR",
    description: "Creates and edits draft content; cannot publish or delete it.",
  },
] as const;

/**
 * Permission keys use a `<module>:<action>` convention. Most of these
 * modules (flights, airports, airlines, offers, blog, cms, seo) don't have
 * an implementation yet — the keys are seeded now so role/permission
 * wiring is ready the moment each module lands, without a follow-up
 * migration just to add its permissions.
 */
const PERMISSIONS = [
  // Users, roles & permissions (access control)
  { key: "users:read", description: "View user accounts." },
  { key: "users:write", description: "Create and update user accounts." },
  { key: "users:delete", description: "Delete user accounts." },
  { key: "roles:read", description: "View roles." },
  { key: "roles:write", description: "Create, update, and assign roles." },
  { key: "permissions:read", description: "View permissions and role-permission assignments." },
  { key: "permissions:write", description: "Create, update, and assign permissions." },

  // Admin / platform
  { key: "admin:access", description: "Access the admin dashboard." },
  { key: "dashboard:view", description: "View dashboard analytics and overview." },
  { key: "settings:manage", description: "Manage system-wide settings." },

  // CMS
  { key: "cms:read", description: "View CMS pages and content." },
  { key: "cms:write", description: "Create and edit CMS pages and content." },
  { key: "cms:publish", description: "Publish CMS pages and content." },

  // Blog
  { key: "blog:read", description: "View blog posts." },
  { key: "blog:write", description: "Create and edit blog posts." },
  { key: "blog:publish", description: "Publish blog posts." },
  { key: "blog:delete", description: "Delete blog posts." },

  // SEO
  { key: "seo:read", description: "View SEO metadata and reports." },
  { key: "seo:write", description: "Edit SEO metadata." },

  // Flights
  { key: "flights:read", description: "View flight data." },
  { key: "flights:write", description: "Create and edit flight data." },
  { key: "flights:delete", description: "Delete flight data." },

  // Airports
  { key: "airports:read", description: "View airport data." },
  { key: "airports:write", description: "Create and edit airport data." },
  { key: "airports:delete", description: "Delete airport data." },

  // Airlines
  { key: "airlines:read", description: "View airline data." },
  { key: "airlines:write", description: "Create and edit airline data." },
  { key: "airlines:delete", description: "Delete airline data." },

  // Offers
  { key: "offers:read", description: "View offers and deals." },
  { key: "offers:write", description: "Create and edit offers and deals." },
  { key: "offers:delete", description: "Delete offers and deals." },
] as const;

const ALL_PERMISSION_KEYS = PERMISSIONS.map((permission) => permission.key);

const ROLE_PERMISSIONS: Record<(typeof ROLES)[number]["name"], readonly string[]> = {
  SUPER_ADMIN: ALL_PERMISSION_KEYS,
  ADMIN: ALL_PERMISSION_KEYS.filter(
    (key) => !["roles:write", "permissions:write", "settings:manage"].includes(key),
  ),
  SEO_MANAGER: [
    "dashboard:view",
    "seo:read",
    "seo:write",
    "cms:read",
    "blog:read",
    "flights:read",
    "airports:read",
    "airlines:read",
  ],
  CONTENT_MANAGER: [
    "dashboard:view",
    "cms:read",
    "cms:write",
    "cms:publish",
    "blog:read",
    "blog:write",
    "blog:publish",
    "blog:delete",
    "seo:read",
  ],
  EDITOR: ["dashboard:view", "cms:read", "cms:write", "blog:read", "blog:write"],
};

async function main() {
  console.log("Seeding roles...");
  const roles = await Promise.all(
    ROLES.map((role) =>
      prisma.role.upsert({
        where: { name: role.name },
        update: { description: role.description },
        create: role,
      }),
    ),
  );

  console.log("Seeding permissions...");
  const permissions = await Promise.all(
    PERMISSIONS.map((permission) =>
      prisma.permission.upsert({
        where: { key: permission.key },
        update: { description: permission.description },
        create: permission,
      }),
    ),
  );

  const roleByName = new Map(roles.map((role) => [role.name, role]));
  const permissionByKey = new Map(permissions.map((permission) => [permission.key, permission]));

  console.log("Seeding role-permission assignments...");
  for (const [roleName, permissionKeys] of Object.entries(ROLE_PERMISSIONS)) {
    const role = roleByName.get(roleName);
    if (!role) continue;

    await Promise.all(
      permissionKeys.map((key) => {
        const permission = permissionByKey.get(key);
        if (!permission) return null;

        return prisma.rolePermission.upsert({
          where: { roleId_permissionId: { roleId: role.id, permissionId: permission.id } },
          update: {},
          create: { roleId: role.id, permissionId: permission.id },
        });
      }),
    );
  }

  console.log(
    `Seed complete: ${roles.length} roles, ${permissions.length} permissions.`,
  );
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
