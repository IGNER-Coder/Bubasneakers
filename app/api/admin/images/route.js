import { NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// Configure Cloudinary with server-side secrets
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Extracts the public_id from a standard Cloudinary URL
 * e.g. https://res.cloudinary.com/demo/image/upload/v12345/folder/item.jpg -> folder/item
 */
function getPublicIdFromUrl(url) {
  try {
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;
    let path = parts[1];
    
    // Remove "v12341234/" versioning if present
    if (path.match(/^v\d+\//)) {
        path = path.replace(/^v\d+\//, '');
    }
    
    // Remove extension
    const lastDotIndex = path.lastIndexOf('.');
    if (lastDotIndex !== -1) {
       path = path.substring(0, lastDotIndex);
    }
    return path;
  } catch (e) {
    return null;
  }
}

export async function DELETE(request) {
  try {
    // 🔒 Admin Auth Guard
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ message: "Image URL is required" }, { status: 400 });
    }

    const publicId = getPublicIdFromUrl(url);

    if (!publicId) {
       return NextResponse.json({ message: "Invalid Cloudinary URL formatting" }, { status: 400 });
    }

    // 2. Safety Check: Only proceed if API Secret is configured
    if (!process.env.CLOUDINARY_API_SECRET) {
        console.warn("⚠️ CLOUDINARY_API_SECRET is missing. Skipping physical cloud deletion. Only removing from UI.");
        return NextResponse.json({ message: "Skipped physical deletion due to missing secrets", result: 'skipped' });
    }

    // 3. Command Cloudinary to destroy the file
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== 'ok' && result.result !== 'not found') {
       console.error("Cloudinary Deletion Output:", result);
    }

    return NextResponse.json({ message: "Image deleted successfully", result: result.result });
    
  } catch (error) {
    console.error("Server Error in Delete Image:", error);
    return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}
