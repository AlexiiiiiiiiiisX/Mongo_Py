import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { createUserSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";

// GET /api/users - List all users
export async function GET() {
  try {
    const db = await getDatabase();
    const users = await db
      .collection("users")
      .find({}, { projection: { password: 0 } })
      .sort({ _id: -1 })
      .toArray();

    const serialized = users.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    }));

    return NextResponse.json(serialized);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input with Zod
    const parsed = createUserSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    const db = await getDatabase();

    // Check for duplicate email
    const existing = await db.collection("users").findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password with bcrypt (secure, unlike sha256_crypt)
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    return NextResponse.json(
      {
        id: result.insertedId.toString(),
        name,
        email,
        createdAt: new Date(),
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
