import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    
    const email = "njeriignatius@gmail.com";
    const password = "adminpassword123";
    
    // Check if exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        existingUser.role = "admin";
        await existingUser.save();
        return NextResponse.json({ message: "User existed. Upgraded to admin.", email, password });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      name: "Buba Owner",
      email,
      password: hashedPassword,
      role: "admin",
    });

    return NextResponse.json({ message: "Admin created successfully.", email, password });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
