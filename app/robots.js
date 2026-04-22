// NOTE: Replace with your actual production URL
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.bubasneakers.com";

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/account/'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
