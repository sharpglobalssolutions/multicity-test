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
    description: "Full, unrestricted access to every module, including role/permission management.",
  },
  {
    name: "ADMIN",
    description:
      "Manages users and all content/domain modules; cannot modify the roles or permissions catalog.",
  },
  {
    name: "SEO_MANAGER",
    description: "Manages SEO metadata and has read access to content relevant to search optimization.",
  },
  {
    name: "CONTENT_MANAGER",
    description: "Creates, edits, and publishes pages and blog content.",
  },
  {
    name: "EDITOR",
    description: "Creates and edits draft pages and blog content; cannot publish or delete.",
  },
] as const;

/**
 * Permission keys use a `<module>.<action>` convention. Most of these
 * modules (pages, seo, airlines, airports, offers, blog) don't have an
 * implementation yet — the keys are seeded now so role/permission wiring
 * is ready the moment each module lands, without a follow-up migration
 * just to add its permissions.
 */
const PERMISSIONS = [
  // Pages
  { key: "pages.read", description: "View pages." },
  { key: "pages.create", description: "Create pages." },
  { key: "pages.update", description: "Edit pages." },
  { key: "pages.delete", description: "Delete pages." },

  // Users
  { key: "users.read", description: "View user accounts." },
  { key: "users.create", description: "Create user accounts." },
  { key: "users.update", description: "Edit user accounts." },
  { key: "users.delete", description: "Delete user accounts." },

  // SEO
  { key: "seo.read", description: "View SEO metadata and reports." },
  { key: "seo.update", description: "Edit SEO metadata." },

  // Airlines
  { key: "airlines.read", description: "View airline data." },
  { key: "airlines.create", description: "Create airline records." },
  { key: "airlines.update", description: "Edit airline records." },
  { key: "airlines.delete", description: "Delete airline records." },

  // Airports
  { key: "airports.read", description: "View airport data." },
  { key: "airports.create", description: "Create airport records." },
  { key: "airports.update", description: "Edit airport records." },
  { key: "airports.delete", description: "Delete airport records." },

  // Offers
  { key: "offers.read", description: "View offers/deals." },
  { key: "offers.create", description: "Create offers/deals." },
  { key: "offers.update", description: "Edit offers/deals." },
  { key: "offers.delete", description: "Delete offers/deals." },

  // Blog
  { key: "blog.read", description: "View blog posts." },
  { key: "blog.create", description: "Create blog posts." },
  { key: "blog.update", description: "Edit blog posts." },
  { key: "blog.delete", description: "Delete blog posts." },
  { key: "blog.publish", description: "Publish blog posts." },

  // Access control (reserved for SUPER_ADMIN — see ROLE_PERMISSIONS below)
  { key: "roles.read", description: "View roles." },
  { key: "roles.update", description: "Create, edit, and assign roles." },
  { key: "permissions.read", description: "View permissions and role-permission assignments." },
  { key: "permissions.update", description: "Create, edit, and assign permissions." },

  // Audit
  { key: "audit_logs.read", description: "View the audit log." },
] as const;

const ALL_PERMISSION_KEYS = PERMISSIONS.map((permission) => permission.key);

/** Access-control permissions reserved for SUPER_ADMIN only. */
const ACCESS_CONTROL_ONLY = ["roles.update", "permissions.update"];

const ROLE_PERMISSIONS: Record<(typeof ROLES)[number]["name"], readonly string[]> = {
  SUPER_ADMIN: ALL_PERMISSION_KEYS,
  ADMIN: ALL_PERMISSION_KEYS.filter((key) => !ACCESS_CONTROL_ONLY.includes(key)),
  SEO_MANAGER: [
    "seo.read",
    "seo.update",
    "pages.read",
    "blog.read",
    "airlines.read",
    "airports.read",
    "offers.read",
  ],
  CONTENT_MANAGER: [
    "pages.read",
    "pages.create",
    "pages.update",
    "pages.delete",
    "blog.read",
    "blog.create",
    "blog.update",
    "blog.delete",
    "blog.publish",
    "seo.read",
  ],
  EDITOR: ["pages.read", "pages.create", "pages.update", "blog.read", "blog.create", "blog.update"],
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

  console.log("Removing permissions no longer in the catalog...");
  const removedPermissions = await prisma.permission.deleteMany({
    where: { key: { notIn: ALL_PERMISSION_KEYS } },
  });

  const roleByName = new Map(roles.map((role) => [role.name, role]));
  const permissionByKey = new Map(permissions.map((permission) => [permission.key, permission]));

  console.log("Reconciling role-permission assignments...");
  for (const [roleName, permissionKeys] of Object.entries(ROLE_PERMISSIONS)) {
    const role = roleByName.get(roleName);
    if (!role) continue;

    const permissionIds = permissionKeys
      .map((key) => permissionByKey.get(key)?.id)
      .filter((id): id is string => Boolean(id));

    await prisma.rolePermission.deleteMany({
      where: { roleId: role.id, permissionId: { notIn: permissionIds } },
    });

    await Promise.all(
      permissionIds.map((permissionId) =>
        prisma.rolePermission.upsert({
          where: { roleId_permissionId: { roleId: role.id, permissionId } },
          update: {},
          create: { roleId: role.id, permissionId },
        }),
      ),
    );
  }

  console.log(
    `Seed complete: ${roles.length} roles, ${permissions.length} permissions ` +
      `(${removedPermissions.count} stale permission(s) removed).`,
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
