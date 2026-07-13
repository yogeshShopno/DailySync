import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// Import models
import Department from "./model/DepartmentModel.js";
import Permission from "./model/PermissionModel.js";
import Role from "./model/RoleModel.js";
import Users from "./model/UsersModel.js";

dotenv.config();

const DEFAULT_PERMISSIONS = [
    { name: "create_task", module: "tasks", description: "Create tasks" },
    { name: "read_task", module: "tasks", description: "View tasks" },
    { name: "update_task", module: "tasks", description: "Edit tasks" },
    { name: "delete_task", module: "tasks", description: "Delete tasks" },

    { name: "create_user", module: "users", description: "Create users" },
    { name: "read_user", module: "users", description: "View users" },
    { name: "update_user", module: "users", description: "Edit users" },
    { name: "delete_user", module: "users", description: "Delete users" },

    { name: "create_department", module: "departments", description: "Create departments" },
    { name: "read_department", module: "departments", description: "View departments" },
    { name: "update_department", module: "departments", description: "Edit departments" },
    { name: "delete_department", module: "departments", description: "Delete departments" },

    { name: "create_role", module: "roles", description: "Create roles" },
    { name: "read_role", module: "roles", description: "View roles" },
    { name: "update_role", module: "roles", description: "Edit roles" },
    { name: "delete_role", module: "roles", description: "Delete roles" },

    { name: "create_project", module: "projects", description: "Create projects" },
    { name: "read_project", module: "projects", description: "View projects" },
    { name: "update_project", module: "projects", description: "Edit projects" },
    { name: "delete_project", module: "projects", description: "Delete projects" },

    { name: "view_reports", module: "reports", description: "View reports" },
];

const seed = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB ✔️");

    // 1. Seed Permissions
    console.log("Seeding permissions...");
    for (const p of DEFAULT_PERMISSIONS) {
        await Permission.updateOne({ name: p.name }, p, { upsert: true });
    }
    const allPermissions = await Permission.find();
    console.log(`✅ Permissions seeded (${allPermissions.length})`);

    // 2. Seed Department
    console.log("Seeding department...");
    await Department.updateOne(
        { name: "Engineering" },
        { name: "Engineering", description: "Core engineering team", status: true },
        { upsert: true }
    );
    const engineeringDept = await Department.findOne({ name: "Engineering" });
    console.log(`✅ Department seeded`);

    // 3. Seed Roles
    console.log("Seeding roles...");
    // Admin gets all permissions
    const adminPermIds = allPermissions.map(p => p._id);
    await Role.updateOne(
        { name: "Admin" },
        { name: "Admin", description: "Full system access", permissions: adminPermIds },
        { upsert: true }
    );

    // Staff gets limited permissions
    const staffPermNames = ["create_task", "read_task", "update_task", "read_project", "read_department"];
    const staffPermIds = allPermissions.filter(p => staffPermNames.includes(p.name)).map(p => p._id);
    await Role.updateOne(
        { name: "Staff" },
        { name: "Staff", description: "Standard user access", permissions: staffPermIds },
        { upsert: true }
    );

    const adminRole = await Role.findOne({ name: "Admin" });
    const staffRole = await Role.findOne({ name: "Staff" });
    console.log(`✅ Roles seeded`);

    // 4. Seed Users
    console.log("Seeding users...");
    const users = [
        {
            name: "Admin User",
            email: "admin@dailysync.com",
            password: await bcrypt.hash("Admin@123", 10),
            roleId: adminRole._id,
            departmentId: engineeringDept._id,
            isAdmin: true,
        },
        {
            name: "Staff User",
            email: "staff@dailysync.com",
            password: await bcrypt.hash("Staff@123", 10),
            roleId: staffRole._id,
            departmentId: engineeringDept._id,
            isAdmin: false,
        },
    ];

    for (const u of users) {
        const exists = await Users.findOne({ email: u.email });
        if (exists) {
            await Users.updateOne({ email: u.email }, u);
            console.log(`🔄 Updated user: ${u.email}`);
        } else {
            await Users.create(u);
            console.log(`✅ Created user: ${u.email}`);
        }
    }

    await mongoose.disconnect();
    console.log("Done!");
};

seed().catch(console.error);
