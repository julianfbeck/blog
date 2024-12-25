interface TagDescriptions {
  [key: string]: string;
}

const tagDescriptions: TagDescriptions = {
  kubernetes:
    "Articles about container orchestration and cloud-native infrastructure",
  ios: "Mobile app development for Apple's iOS platform",
  webdev: "Modern web development techniques and frameworks",
  cloudnative: "Cloud-native architecture and development practices",
  swiftui: "Building iOS apps with SwiftUI framework",
  typescript: "Type-safe JavaScript development",
  react: "Modern web development with React",
  docker: "Containerization and development workflows",
  devops: "Development operations and automation",
  aws: "Amazon Web Services cloud solutions",
  testing: "Software testing and quality assurance",
  architecture: "Software architecture patterns and practices",
};

export function getTagDescription(tag: string): string {
  const normalizedTag = tag.toLowerCase().replace(/[^a-z0-9]/g, "");
  return tagDescriptions[normalizedTag] || `Articles tagged with ${tag}`;
}
