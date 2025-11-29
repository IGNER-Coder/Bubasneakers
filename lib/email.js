import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = "your_real_email@gmail.com"; // ⚠️ REPLACE THIS WITH YOUR EMAIL

export async function sendOrderEmails({ order, customerEmail }) {
  
  const orderIdShort = order._id.toString().slice(-6).toUpperCase();
  const itemListHtml = order.items.map(item => 
    `<li>${item.name} (Size ${item.size}) x${item.quantity} - KES ${item.priceAtPurchase}</li>`
  ).join('');

  // 1. Send Customer Receipt
  await resend.emails.send({
    from: 'Buba Sneakers <onboarding@resend.dev>', // Use 'onboarding' until you verify your domain
    to: customerEmail,
    subject: `Order #${orderIdShort} Confirmed - BUBASNEAKERS`,
    html: `
      <h1>Thanks for your order!</h1>
      <p>We have received your order #${orderIdShort}.</p>
      <h3>Order Summary:</h3>
      <ul>${itemListHtml}</ul>
      <p><strong>Total: KES ${order.totalAmount.toLocaleString()}</strong></p>
      <p>We will notify you when your items ship.</p>
    `
  });

  // 2. Send Admin Alert
  await resend.emails.send({
    from: 'Buba System <onboarding@resend.dev>',
    to: ADMIN_EMAIL,
    subject: `🔔 NEW ORDER: #${orderIdShort} (KES ${order.totalAmount})`,
    html: `
      <h2>New Order Received!</h2>
      <p><strong>Customer:</strong> ${order.shippingAddress.name}</p>
      <p><strong>Phone:</strong> ${order.shippingAddress.phone}</p>
      <p><strong>Location:</strong> ${order.shippingAddress.city}, ${order.shippingAddress.address}</p>
      <hr />
      <h3>Items:</h3>
      <ul>${itemListHtml}</ul>
      <h3>Total: KES ${order.totalAmount.toLocaleString()}</h3>
      <p><a href="https://bubasneakers.vercel.app/admin">Go to Admin Dashboard</a></p>
    `
  });
}