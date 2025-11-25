import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    await connectToDatabase();

    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ message: "User already exists." }, { status: 400 });
    }

    // 2. Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create the user
    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    return NextResponse.json({ message: "User registered." }, { status: 201 });
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ message: "An error occurred while registering the user." }, { status: 500 });
  }
}