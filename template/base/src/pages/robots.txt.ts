const content=`User-agent: *
Allow: /

Sitemap: ${new URL("sitemap-index.xml", import.meta.env.SITE).href}`

export const GET = () => {
    return new Response(content);
}