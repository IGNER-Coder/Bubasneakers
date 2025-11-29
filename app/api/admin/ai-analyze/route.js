import { HfInference } from "@huggingface/inference";
import { NextResponse } from "next/server";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(request) {
  try {
    const { imageUrl } = await request.json();
    console.log("🤖 Analyzing Image with HuggingFace:", imageUrl);

    if (!imageUrl) {
      return NextResponse.json({ message: "Image URL required" }, { status: 400 });
    }

    // ✅ Fetch image and convert to blob
    const imageResp = await fetch(imageUrl);
    if (!imageResp.ok) throw new Error("Failed to fetch image");
    const imageBlob = await imageResp.blob();

    // ✅ SMART FALLBACK: Try multiple models if one is busy/offline
    const modelsToTry = [
      "Salesforce/blip-image-captioning-large",
      "Salesforce/blip-image-captioning-base",
      "nlpconnect/vit-gpt2-image-captioning"
    ];

    let result = null;
    let usedModel = "";

    for (const model of modelsToTry) {
      try {
        console.log(`🤖 Trying model: ${model}...`);
        result = await hf.imageToText({
          data: imageBlob,
          model: model
        });
        
        if (result && result.generated_text) {
            usedModel = model;
            break; // Success! Stop trying.
        }
      } catch (err) {
        console.warn(`⚠️ Model ${model} failed:`, err.message);
      }
    }

    if (!result) {
        throw new Error("All AI models are currently busy or unavailable. Please try again.");
    }

    console.log(`✅ Success with ${usedModel}:`, result.generated_text);

    // ✅ Extract sneaker info from description
    const description = result.generated_text.toLowerCase();
    
    // Smart parsing based on description
    let brand = "Nike";
    if (description.includes("adidas") || description.includes("three stripes")) brand = "Adidas";
    if (description.includes("new balance") || description.includes("nb")) brand = "New Balance";
    if (description.includes("vans") || description.includes("checkerboard")) brand = "Vans";
    if (description.includes("asics") || description.includes("gel")) brand = "Asics";
    if (description.includes("jordan") || description.includes("jumpman")) brand = "Jordan";
    if (description.includes("yeezy")) brand = "Yeezy";

    let category = "Lifestyle";
    if (description.includes("running") || description.includes("runner")) category = "Running";
    if (description.includes("basketball") || description.includes("high top")) category = "Basketball";
    if (description.includes("skate") || description.includes("slip-on")) category = "Skate";

    // ✅ Generate product data
    const productData = {
      name: capitalizeWords(result.generated_text.split('shoe')[0] || "Sneaker"),
      brand: brand,
      category: category,
      gender: "Men",
      price: 18000,
      description: `${result.generated_text}. Quality construction with premium materials.`,
      storyLabel: "FRESH DROP",
      curatorNote: "A versatile addition to any rotation."
    };

    console.log("✅ Generated Product Data:", productData);
    return NextResponse.json(productData);

  } catch (error) {
    console.error("🔥 Analysis Failed:", error);
    
    return NextResponse.json({ 
      message: error.message || "AI analysis failed",
      details: "Using free HuggingFace API"
    }, { status: 500 });
  }
}

// Helper function
function capitalizeWords(str) {
  return str.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim();
}