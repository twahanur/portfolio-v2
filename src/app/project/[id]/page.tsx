import ProjectPageLayout from "../../../components/common/ProjectLayout";
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
    const res = await fetch(`${apiUrl}/api/projects/${id}`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const payload = await res.json();
      if (payload.success && payload.data) {
        const project = payload.data;
        const featuredImage =
          project.images?.find((img: any) => img.isFeatured) || project.images?.[0];
        const title = project.title;
        const description =
          project.tagline ||
          project.description ||
          `Case study and architecture details of ${title} by Twahanur Rahman`;
        const imageUrl = featuredImage?.url || "/Meta.png";

        return {
          title: `${title} | Case Study by Twahanur Rahman`,
          description,
          alternates: {
            canonical: `/project/${id}`,
          },
          openGraph: {
            title: `${title} — Project Case Study`,
            description,
            url: `${siteUrl}/project/${id}`,
            images: [
              {
                url: imageUrl.startsWith("http") ? imageUrl : `${siteUrl}${imageUrl}`,
                width: 1200,
                height: 630,
                alt: `${title} Preview`,
              },
            ],
            type: "website",
          },
          twitter: {
            card: "summary_large_image",
            title: `${title} — Project Case Study`,
            description,
            images: [imageUrl.startsWith("http") ? imageUrl : `${siteUrl}${imageUrl}`],
          },
        };
      }
    }
  } catch (err) {
    console.error("Error generating project metadata:", err);
  }

  return {
    title: "Project Case Study | Twahanur Rahman",
    description: "Detailed architecture, stack, and features of projects built by Twahanur Rahman.",
    alternates: {
      canonical: `/project/${id}`,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let projectData: any = null;

  try {
    const res = await fetch(`${apiUrl}/api/projects/${id}`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const payload = await res.json();
      projectData = payload?.data;
    }
  } catch (err) {
    console.error("Error fetching project data for schema:", err);
  }

  const title = projectData?.title || "Project Details";
  const description = projectData?.tagline || projectData?.description || title;
  const featuredImage =
    projectData?.images?.find((img: any) => img.isFeatured) || projectData?.images?.[0];
  const imageUrl = featuredImage?.url || "/Meta.png";

  const jsonLdProject = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: title,
    description: description,
    image: imageUrl.startsWith("http") ? imageUrl : `${siteUrl}${imageUrl}`,
    codeRepository: projectData?.code || "https://github.com/Twahanur",
    programmingLanguage: projectData?.techStack?.map((t: any) =>
      typeof t === "object" && t.tag ? t.tag.name : String(t)
    ) || ["TypeScript", "Next.js"],
    author: {
      "@type": "Person",
      name: "Twahanur Rahman",
      url: siteUrl,
    },
    url: `${siteUrl}/project/${id}`,
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
        name: "Projects",
        item: `${siteUrl}/#Portofolio`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: `${siteUrl}/project/${id}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdProject) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <ProjectPageLayout />
    </>
  );
}
