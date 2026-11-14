import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const host = "https://moustapha-adebigni.vercel.app";
const template = readFileSync("dist/index.html", "utf8");
const projects = JSON.parse(readFileSync("src/projects.json", "utf8"));
const site = JSON.parse(readFileSync("src/site.json", "utf8"));
const languages = ["fr", "en"];
const routes = [{ path: "/" }, ...projects.map(project => ({ path: "/projects/" + project.slug, project }))];
const sitemap = [];

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
}

function replaceOne(html, pattern, value) {
  if (!pattern.test(html)) throw new Error("Missing metadata: " + pattern);
  return html.replace(pattern, (_, opening, closing) => opening + escapeHtml(value) + closing);
}

for (const language of languages) {
  for (const { path, project } of routes) {
    const url = host + "/" + language + path;
    const label = language === "fr" ? "Étude de cas" : "Case study";
    const title = project ? project.name + " | " + label + " · Moustapha Adebigni" : site[language].title;
    const description = project?.[language].summary ?? site[language].description;
    let html = replaceOne(template, /(<html lang=")[^"]*(")/, language);
    html = replaceOne(html, /(<title>)[^<]*(<\/title>)/, title);
    html = replaceOne(html, /(<link rel="canonical" href=")[^"]*(")/, url);
    html = replaceOne(html, /(<link rel="alternate" hreflang="fr" href=")[^"]*(")/, host + "/fr" + path);
    html = replaceOne(html, /(<link rel="alternate" hreflang="en" href=")[^"]*(")/, host + "/en" + path);
    html = replaceOne(html, /(<meta name="description" content=")[^"]*(")/, description);
    html = replaceOne(html, /(<meta property="og:description" content=")[^"]*(")/, description);
    html = replaceOne(html, /(<meta property="og:url" content=")[^"]*(")/, url);
    html = replaceOne(html, /(<meta property="og:title" content=")[^"]*(")/, title);
    html = replaceOne(html, /(<meta property="og:type" content=")[^"]*(")/, project ? "article" : "website");
    html = replaceOne(html, /(<meta property="og:image" content=")[^"]*(")/, host + (language === "fr" ? "/og-preview.png" : "/og-preview-en.png"));
    html = replaceOne(html, /(<meta property="og:image:alt" content=")[^"]*(")/, title);
    const directory = join("dist", language, path);
    mkdirSync(directory, { recursive: true });
    writeFileSync(join(directory, "index.html"), html);
    sitemap.push("  <url><loc>" + url + "</loc></url>");
    if (language === "fr") {
      // Existing unprefixed URLs retain their metadata and redirect in the app.
      const legacyDirectory = join("dist", path);
      mkdirSync(legacyDirectory, { recursive: true });
      writeFileSync(join(legacyDirectory, "index.html"), html);
    }
  }
}

const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
writeFileSync("dist/sitemap.xml", xml + sitemap.join("\n") + "\n</urlset>\n");
