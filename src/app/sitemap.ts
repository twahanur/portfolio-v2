import { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://twahanur.dev';
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  // Fetch dynamic projects for sitemap
  try {
    const res = await fetch(`${apiUrl}/api/projects`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      const projects = Array.isArray(data) ? data : data?.data || data?.projects || [];
      projects.forEach((proj: any) => {
        const identifier = proj.slug || proj.id;
        if (identifier) {
          routes.push({
            url: `${siteUrl}/project/${identifier}`,
            lastModified: proj.updatedAt ? new Date(proj.updatedAt) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
          });
        }
      });
    }
  } catch (err) {
    console.error('Failed to fetch projects for sitemap:', err);
  }

  // Fetch dynamic blogs for sitemap
  try {
    const res = await fetch(`${apiUrl}/api/blogs`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      const blogs = Array.isArray(data) ? data : data?.data || data?.blogs || [];
      blogs.forEach((blog: any) => {
        const identifier = blog.slug || blog.id;
        if (identifier) {
          routes.push({
            url: `${siteUrl}/blog/${identifier}`,
            lastModified: blog.updatedAt ? new Date(blog.updatedAt) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
          });
        }
      });
    }
  } catch (err) {
    console.error('Failed to fetch blogs for sitemap:', err);
  }

  return routes;
}
