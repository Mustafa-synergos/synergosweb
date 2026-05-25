export type StrapiImage = {
  data: {
    attributes: {
      url: string;
      width?: number;
      height?: number;
      alternativeText?: string;
    };
  } | null;
};

export type Project = {
  id: number;
  attributes: {
    title: string;
    slug: string;
    description: string;
    tags: string[];
    link: string;
    cover_image: StrapiImage;
  };
};

export type BlogPost = {
  id: number;
  attributes: {
    title: string;
    slug: string;
    author: string;
    content: string;
    publishedAt: string;
    cover_image: StrapiImage;
  };
};

export type Service = {
  id: number;
  attributes: {
    title: string;
    description: string;
    icon: string;
  };
};

export type TeamMember = {
  id: number;
  attributes: {
    name: string;
    role: string;
    bio: string;
    photo: StrapiImage;
  };
};
