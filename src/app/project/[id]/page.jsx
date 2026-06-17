import ProjectPageLayout from "../../../components/common/ProjectLayout";

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
    const res = await fetch(`${apiUrl}/api/projects/${id}`);
    if (res.ok) {
      const payload = await res.json();
      if (payload.success && payload.data) {
        const project = payload.data;
        const featuredImage = project.images?.find((img) => img.isFeatured) || project.images?.[0];
        return {
          title: `${project.title} | Portfolio`,
          description: project.tagline || project.description,
          openGraph: {
            title: project.title,
            description: project.tagline || project.description,
            images: featuredImage ? [{ url: featuredImage.url }] : [],
            type: "website",
          },
        };
      }
    }
  } catch (err) {
    console.error("Error generating project metadata:", err);
  }

  return {
    title: "Project Details | Portfolio",
  };
}

export default function ProjectPage() {
  return <ProjectPageLayout />;
}
