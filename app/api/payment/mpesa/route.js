import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { phoneNumber, amount, email } = body;

    if (!phoneNumber || !amount) {
      return NextResponse.json({ message: "Missing phone or amount" }, { status: 400 });
    }

    // 1. Format Phone Number (07xx -> 2547xx)
    let formattedPhone = phoneNumber.toString().trim();
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "254" + formattedPhone.substring(1);
    } else if (formattedPhone.startsWith("+")) {
      formattedPhone = formattedPhone.substring(1);
    }

    console.log(`🚀 Initiating STK Push to ${formattedPhone} for KES ${amount}`);

    // 2. Call IntaSend API (Sandbox)
    // Note: Switch URL to 'payment.intasend.com' when going live
    const intaSendResponse = await fetch('https://sandbox.intasend.com/api/v1/payment/mpesa-stk-push/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.INTASEND_SECRET_KEY}`
      },
      body: JSON.stringify({
        phone_number: formattedPhone,
        email: email || "customer@bubasneakers.com",
        amount: amount,
        api_ref: `ORDER_${Date.now()}`,
      })
    });

    const data = await intaSendResponse.json();

    if (!intaSendResponse.ok) {
      // Log exact error from IntaSend for debugging
      console.error("IntaSend Error:", data);
      return NextResponse.json({ message: "Payment Failed", details: data }, { status: 500 });
    }

    // 3. Success
    return NextResponse.json({ 
      message: "STK Push Sent", 
      tracking_id: data.tracking_id,
      invoice: data.invoice 
    });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}