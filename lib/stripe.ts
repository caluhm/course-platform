import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-08-16",
});

export async function createCheckoutLink(customer: string) {
  const checkout = await stripe.checkout.sessions.create({
    success_url: `https://${process.env.NEXTAUTH_URL}?success=true`,
    cancel_url: `https://${process.env.NEXTAUTH_URL}?success=false`,
    customer: customer,
    line_items: [
      {
        price: "price_1NtFsqFVRAT9rxdZhGOJUqdI",
        quantity: 1,
      },
    ],
    mode: "payment",
  });

  return checkout.url;
}
