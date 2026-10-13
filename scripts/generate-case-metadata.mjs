import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Produce route-specific HTML metadata while keeping the application a client-rendered SPA.
// Social crawlers generally read the original HTML rather than waiting for React effects.
const host = "https://moustapha-adebigni.vercel.app";
const template = readFileSync("dist/index.html", "utf8");
const projects = JSON.parse(readFileSync("src/projects.json", "utf8"));

function escapeAttribute(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
}

function replaceOne(html, pattern, replacement, name) {
  const matches = html.match(new RegExp(pattern.source, "g"));
  if (matches?.length !== 1) throw new Error("Expected exactly one " + name + " element");
  return html.replace(pattern, replacement);
}

for (const project of projects) {
  const url = host + "/projects/" + project.slug;
  const title = project.name + " — " + project.headline + " | Moustapha Adebigni";
  const description = project.summary;
  let html = template;
  html = replaceOne(html, /<title>[^<]*<\/title>/, "<title>" + escapeAttribute(title) + "</title>", "title");
  html = replaceOne(html, /(<meta name="description" content=")[^"]*(")/, "$1" + escapeAttribute(description) + "$2", "description");
  html = replaceOne(html, /(<link rel="canonical" href=")[^"]*(")/, "$1" + escapeAttribute(url) + "$2", "canonical");
  html = replaceOne(html, /(<meta property="og:url" content=")[^"]*(")/, "$1" + escapeAttribute(url) + "$2", "og:url");
  html = replaceOne(html, /(<meta property="og:title" content=")[^"]*(")/, "$1" + escapeAttribute(title) + "$2", "og:title");
  html = replaceOne(html, /(<meta property="og:description" content=")[^"]*(")/, "$1" + escapeAttribute(description) + "$2", "og:description");
  html = replaceOne(html, /(<meta property="og:type" content=")[^"]*(")/, "$1article$2", "og:type");
  html = replaceOne(
    html,
    /<\/head>/,
    '<meta name="twitter:title" content="' + escapeAttribute(title) + '" />\n' +
      '<meta name="twitter:description" content="' + escapeAttribute(description) + '" />\n</head>',
    "head",
  );
  const directory = join("dist", "projects", project.slug);
  mkdirSync(directory, { recursive: true });
  writeFileSync(join(directory, "index.html"), html, "utf8");
  console.log("Generated SEO metadata:", "/projects/" + project.slug);
}
