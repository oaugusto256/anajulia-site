import { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://psicoanajulia.com.br",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
  ]
}
