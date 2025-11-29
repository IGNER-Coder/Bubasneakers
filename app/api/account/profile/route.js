import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// GET: Fetch current user details
export async function GET() {
  const session = { user: { email: 'test@gmail.com' } }; // ⚠️ MOCK SESSION: Replace with getServerSession(authOptions) in prod

  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  await connectToDatabase();
  const user = await User.findOne({ email: session.user.email }).select("-password");

  if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

  return NextResponse.json(user);
}

// PATCH: Update details or password
export async function PATCH(request) {
  try {
    const session = { user: { email: 'test@gmail.com' } }; // ⚠️ MOCK SESSION: Replace with getServerSession(authOptions)

    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { name, phone, address, city, currentPassword, newPassword } = body;

    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email }).select("+password");

    // 1. Handle Password Change (Optional)
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return NextResponse.json({ message: "Current password is incorrect" }, { status: 400 });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    // 2. Update Basic Info
    if (name) user.name = name;
    // We need to add these fields to the User Schema if they don't exist, 
    // or store them in a 'profile' object. For now, we'll assume extended schema or flexible usage.
    // Ideally, update models/User.js to include: phone, address, city.
    
    // Saving generic fields to the root or a profile object
    // For this MVP, we will save them if the schema supports strict: false or if we added them.
    // Let's assume we treat them as part of the user document.
    user.phone = phone;
    user.address = address;
    user.city = city;

    await user.save();

    return NextResponse.json({ message: "Profile updated successfully" });

  } catch (error) {
    console.error("Profile Update Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}