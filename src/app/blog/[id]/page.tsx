import BlogLayout from "../../../components/common/BlogLayout";
import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://twahanur.dev";
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(`${apiUrl}/api/blogs/${id}`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const payload = await res.json();
      const blog = payload?.data || payload;
      if (blog && (blog.Title || blog.title)) {
        const title = blog.Title || blog.title;
        const description =
          blog.Description ||
          blog.description ||
          blog.Summary ||
          blog.summary ||
          `Read ${title} by Twahanur Rahman`;
        const banner = blog.BannerUrl || blog.bannerUrl || blog.image || "/Meta.png";
        const keywords = Array.isArray(blog.Keywords)
          ? blog.Keywords
          : ["Twahanur Rahman", "Engineering Blog", "Software Architecture"];

        return {
          title: `${title} | Twahanur Rahman Blog`,
          description,
          keywords,
          alternates: {
            canonical: `/blog/${id}`,
          },
          openGraph: {
            type: "article",
            url: `${siteUrl}/blog/${id}`,
            title,
            description,
            images: [
              {
                url: banner.startsWith("http") ? banner : `${siteUrl}${banner}`,
                width: 1200,
                height: 630,
                alt: title,
              },
            ],
            publishedTime: blog.PublishedAt || blog.publishedAt || blog.createdAt,
            authors: [blog.Author || "Twahanur Rahman"],
          },
          twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [banner.startsWith("http") ? banner : `${siteUrl}${banner}`],
          },
        };
      }
    }
  } catch (err) {
    console.error("Error generating blog metadata:", err);
  }

  return {
    title: "Blog Post | Twahanur Rahman",
    description:
      "Technical articles, engineering insights, and software architecture by Twahanur Rahman.",
    alternates: {
      canonical: `/blog/${id}`,
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let blogData: any = null;

  try {
    const res = await fetch(`${apiUrl}/api/blogs/${id}`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const payload = await res.json();
      blogData = payload?.data || payload;
    }
  } catch (e) {
    console.error("Error fetching blog for JSON-LD schema:", e);
  }

  const title = blogData?.Title || blogData?.title || "Blog Post";
  const banner = blogData?.BannerUrl || blogData?.bannerUrl || blogData?.image || "/Meta.png";

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description:
      blogData?.Description || blogData?.description || blogData?.Summary || title,
    image: [banner.startsWith("http") ? banner : `${siteUrl}${banner}`],
    datePublished:
      blogData?.PublishedAt || blogData?.publishedAt || blogData?.createdAt || new Date().toISOString(),
    dateModified:
      blogData?.updatedAt || blogData?.PublishedAt || new Date().toISOString(),
    author: {
      "@type": "Person",
      name: blogData?.Author || "Twahanur Rahman",
      url: siteUrl,
    },
    publisher: {
      "@type": "Person",
      name: "Twahanur Rahman",
      url: siteUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${id}`,
    },
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${siteUrl}/#Blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: `${siteUrl}/blog/${id}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <BlogLayout />
    </>
  );
}
