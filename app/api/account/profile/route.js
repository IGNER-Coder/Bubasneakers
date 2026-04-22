import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// GET: Fetch current user's profile details
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();
  const user = await User.findOne({ email: session.user.email }).select("-password");

  if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

  return NextResponse.json(user);
}

// PATCH: Update profile details or change password
export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, address, city, currentPassword, newPassword } = body;

    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email }).select("+password");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 1. Handle Password Change (Optional)
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return NextResponse.json({ message: "Current password is incorrect" }, { status: 400 });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    // 2. Update Basic Info (fields are defined on the User schema)
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (city !== undefined) user.city = city;

    await user.save();

    return NextResponse.json({ message: "Profile updated successfully" });

  } catch (error) {
    console.error("Profile Update Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}