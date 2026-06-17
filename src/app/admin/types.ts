export interface Profile {
  name: string;
  email: string;
  title: string | null;
  words?: string | null;
  bio: string | null;
  profilePictureUrl: string | null;
  phone?: string | null;
  github?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  youtube?: string | null;
  stackoverflow?: string | null;
  medium?: string | null;
  devto?: string | null;
  location?: string | null;
  mapEmbedUrl?: string | null;
}

export interface ProjectImage {
  id?: string;
  url: string;
  alt: string;
  isFeatured: boolean;
}

export interface ChallengeSolution {
  id?: string;
  challenge: string;
  solution: string;
}

export interface Project {
  id: string;
  order: number;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  metrics: string[];
  devOps: string[];
  live: string;
  code: string;
  sourceNote: string | null;
  problem: string;
  architecture: string;
  futureEnhancements: string;
  challengeSolutions: ChallengeSolution[];
  images: ProjectImage[];
  tags: string[];
}

export interface Experience {
  id: string;
  order: number;
  company: string;
  role: string;
  employmentType: string;
  period: string;
  duration: string;
  location: string;
  workMode: string;
  isCurrent: boolean;
  tagline: string;
  summary: string;
  highlights: string[];
  techStack: string[];
  architecture: string | null;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  order: number;
  color?: string;
  iconColor?: string;
  iconName?: string;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issueDate: string | null;
  credentialId: string | null;
  credentialUrl: string | null;
  imageUrl: string;
  order: number;
}

export interface SkillCategory {
  id: string;
  name: string;
  slug: string;
  order: number;
}

export interface Blog {
  id: string;
  title: string;
  description: string;
  image: string;
  author: string;
  keywords: string[];
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Education {
  id: string;
  examTitle: string;
  major: string;
  institute: string;
  result: string;
  passingYear: number;
  duration: string;
  order: number;
}


