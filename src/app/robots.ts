import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// AI assistant / answer-engine crawlers we explicitly welcome so the site can
// be read, cited, and recommended by ChatGPT, Claude, Perplexity, Gemini, etc.
const AI_BOTS = [
  "GPTBot", // OpenAI training
  "OAI-SearchBot", // OpenAI search
  "ChatGPT-User", // ChatGPT browsing
  "ClaudeBot", // Anthropic
  "Claude-Web",
  "anthropic-ai",
  "Claude-SearchBot",
  "PerplexityBot", // Perplexity
  "Perplexity-User",
  "Google-Extended", // Gemini / Google AI
  "Applebot", // Apple / Siri
  "Applebot-Extended",
  "CCBot", // Common Crawl (feeds many models)
  "Amazonbot",
  "cohere-ai",
  "Meta-ExternalAgent", // Meta AI
  "FacebookBot",
  "DuckAssistBot",
  "YouBot",
  "Diffbot",
  "Bytespider",
];

export default function robots(): MetadataRoute.Robots {
  // Everything is crawlable except the private admin + API surfaces.
  const allowAll = { allow: "/", disallow: ["/admin", "/api/"] };
  return {
    rules: [
      { userAgent: "*", ...allowAll },
      // Explicitly allow each AI crawler (welcomes them rather than relying on
      // the wildcard, since many of these read named rules first).
      { userAgent: AI_BOTS, ...allowAll },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
