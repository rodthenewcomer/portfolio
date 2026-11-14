import { useEffect, useState } from "react";
import { Link, matchPath, Navigate, useLocation } from "react-router-dom";
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, ClipboardCheck, Code2,
  ListChecks, Mail, MapPin, Menu, Search, X,
} from "lucide-react";
import projects from "./projects.json";
import site from "./site.json";
import { contactEmail, copy, portfolioRepoUrl } from "./copy";
import {
  LanguageContext, localizedPath, publicSite, readPreference, savePreference, useLanguage,
} from "./language";
import type { Language } from "./language";

type Project = (typeof projects)[number];
type Screenshot = Project["hero"];

const sectionIds = ["work", "approach", "about"];
const caseIds = ["case-problem", "case-decisions", "case-system", "case-build"];
const stepIcons = [Search, ListChecks, Code2, ClipboardCheck];

function Brand() {
  const language = useLanguage();
  return (
    <Link className="brand" to={localizedPath(language)} aria-label={`Moustapha Adebigni · ${copy[language].home}`}>
      <span className="brand-mark" aria-hidden="true" />
      <span>Moustapha Adebigni</span>
    </Link>
  );
}

function LanguageSwitch({ path }: { path: string }) {
  const language = useLanguage();
  const { search, hash } = useLocation();
  const choices = [
    { code: "fr", label: "Français" },
    { code: "en", label: "English" },
  ] as const;
  return (
    <nav className="language-switch" aria-label={copy[language].language}>
      {choices.map(({ code, label }) => (
        <Link
          key={code}
          to={localizedPath(code, path) + search + hash}
          lang={code}
          hrefLang={code}
          aria-label={code.toUpperCase() + " · " + label}
          aria-current={language === code ? "true" : undefined}
          onClick={() => savePreference(code)}
        >{code.toUpperCase()}</Link>
      ))}
    </nav>
  );
}

function Header({ path }: { path: string }) {
  const language = useLanguage();
  const text = copy[language];
  const home = localizedPath(language);
  const [open, setOpen] = useState(false);
  return (
    <header className="header" onKeyDown={event => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        document.getElementById("menu-toggle")?.focus();
      }
    }}>
      <div className="container header-inner">
        <Brand />
        <nav className={open ? "main-nav open" : "main-nav"} aria-label={text.navigation} id="primary-navigation">
          {text.nav.map((label, index) => (
            <Link key={sectionIds[index]} to={home + "#" + sectionIds[index]} onClick={() => setOpen(false)}>{label}</Link>
          ))}
          <Link to={home + "#contact"} onClick={() => setOpen(false)}>{text.contact}</Link>
        </nav>
        <div className="header-tools">
          <LanguageSwitch path={path} />
          <button
            className="menu-toggle" id="menu-toggle" type="button" aria-label={open ? text.closeMenu : text.openMenu}
            aria-controls="primary-navigation" aria-expanded={open} onClick={() => setOpen(!open)}
          >{open ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </div>
    </header>
  );
}

function PageEffects({ path, project }: { path: string; project?: Project }) {
  const language = useLanguage();
  const { hash } = useLocation();

  useEffect(() => {
    document.documentElement.lang = language;
    const title = project ? `${project.name} | ${copy[language].study} · Moustapha Adebigni`
      : path === "/" ? site[language].title : `${copy[language].missing} | Moustapha Adebigni`;
    const description = project?.[language].summary ?? site[language].description;
    const canonical = publicSite + localizedPath(language, path);
    document.title = title;
    document.querySelector("link[rel=canonical]")?.setAttribute("href", canonical);
    document.querySelectorAll<HTMLLinkElement>("link[rel=alternate][hreflang]").forEach(link => {
      link.href = publicSite + localizedPath(link.hreflang === "en" ? "en" : "fr", path);
    });
    for (const [selector, value] of [
      ['[name="description"]', description], ['[property="og:description"]', description],
      ['[property="og:title"]', title], ['[property="og:url"]', canonical],
      ['[property="og:type"]', project ? "article" : "website"],
      ['[property="og:image"]', publicSite + (language === "fr" ? "/og-preview.png" : "/og-preview-en.png")],
      ['[property="og:image:alt"]', title],
    ]) {
      document.querySelector(`meta${selector}`)?.setAttribute("content", value);
    }
  }, [language, path, project]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (hash) {
        document.getElementById(hash.slice(1))?.scrollIntoView();
      } else {
        window.scrollTo(0, 0);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [path, hash]);

  return null;
}

function Hero() {
  const language = useLanguage();
  const text = copy[language];
  return (
    <section className="container hero" id="top">
      <div className="hero-copy">
        <p className="hero-role">{text.role} <span>{text.specialty}</span></p>
        <h1>{text.hero[0]} <em>{text.hero[1]}</em></h1>
        <p className="hero-intro">{text.intro}</p>
        <div className="actions">
          <Link className="button button-primary" to={localizedPath(language) + "#work"}>{text.seeWork} <ArrowDown size={17} /></Link>
          <a className="button button-text" href={`mailto:${contactEmail}?subject=${encodeURIComponent(text.subject)}`}>{text.email} <ArrowUpRight size={17} /></a>
        </div>
      </div>
      <figure className="portrait">
        <img src="/images/moustapha-portrait.jpg" width="1254" height="1254" alt={text.portrait} fetchPriority="high" />
        <figcaption><strong>Moustapha Adebigni</strong><span><MapPin size={14} /> {text.location}</span></figcaption>
      </figure>
    </section>
  );
}

function ScreenshotFigure({ screenshot, alt, caption, theme, eager = false }: {
  screenshot: Screenshot; alt: string; caption?: string; theme: Project["theme"]; eager?: boolean;
}) {
  return (
    <figure className={`screenshot screenshot-${theme}`}>
      <div className="screenshot-mat">
        <img
          src={"/project-shots/" + screenshot.file} alt={alt} width={screenshot.width} height={screenshot.height}
          loading={eager ? "eager" : "lazy"} decoding="async"
        />
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

function Stack({ items }: { items: string[] }) {
  return <ul className="stack">{items.map(item => <li key={item}>{item}</li>)}</ul>;
}

function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  const language = useLanguage();
  const text = copy[language];
  const content = project[language];
  return (
    <article className={featured ? "project-card featured" : "project-card"}>
      <div className="project-card-copy">
        <p className="category">{content.category}</p>
        <h3><Link className="project-link" to={localizedPath(language, "/projects/" + project.slug)}>{project.name}</Link></h3>
        <p className="project-summary">{content.summary}</p>
        <Stack items={project.stack.slice(0, 4)} />
        <span className="read-case" aria-hidden="true">{text.readCase} <ArrowUpRight size={17} /></span>
      </div>
      <ScreenshotFigure screenshot={project.hero} alt={content.heroAlt} theme={project.theme} />
    </article>
  );
}

function Work() {
  const language = useLanguage();
  const text = copy[language];
  return (
    <section className="container work section" id="work" aria-labelledby="work-title">
      <div className="section-heading">
        <h2 id="work-title">{text.studies}</h2>
        <p>{text.workIntro}</p>
      </div>
      <div className="project-grid">
        {projects.map((project, index) => <ProjectCard key={project.slug} project={project} featured={index === 0} />)}
      </div>
    </section>
  );
}

function Approach() {
  const text = copy[useLanguage()];
  return (
    <section className="approach section" id="approach" aria-labelledby="approach-title">
      <div className="container">
        <div className="section-heading">
          <h2 id="approach-title">{text.method}</h2>
          <p>{text.methodIntro}</p>
        </div>
        <ol className="steps">
          {text.steps.map(([title, description], index) => {
            const Icon = stepIcons[index];
            return <li key={title}><Icon size={23} /><h3>{title}</h3><p>{description}</p></li>;
          })}
        </ol>
      </div>
    </section>
  );
}

function About() {
  const text = copy[useLanguage()];
  return (
    <section className="container about section" id="about" aria-labelledby="about-title">
      <div>
        <h2 id="about-title">{text.about}</h2>
        <p className="about-lead">{text.independent}</p>
        <p>{text.aboutText}</p>
        <p>{text.aboutCareer}</p>
      </div>
      <div className="skills">
        <h3>{text.skills}</h3>
        <dl>{text.skillGroups.map(([name, values]) => <div key={name}><dt>{name}</dt><dd>{values}</dd></div>)}</dl>
      </div>
    </section>
  );
}

function Contact() {
  const text = copy[useLanguage()];
  return (
    <section className="contact section" id="contact" aria-labelledby="contact-title">
      <div className="container contact-inner">
        <div><h2 id="contact-title">{text.contactTitle}</h2><p>{text.contactBody}</p></div>
        <div className="actions">
          <a className="button button-light" href={`mailto:${contactEmail}?subject=${encodeURIComponent(text.subject)}`}><Mail size={18} /> {contactEmail}</a>
          <a className="button button-ghost" href={portfolioRepoUrl} target="_blank" rel="noreferrer">{text.portfolioCode} <ArrowUpRight size={17} /></a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const text = copy[useLanguage()];
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <Brand />
        <a href={portfolioRepoUrl} target="_blank" rel="noreferrer">{text.portfolioCode} <ArrowUpRight size={16} /></a>
      </div>
    </footer>
  );
}

function ProjectPage({ project }: { project: Project }) {
  const language = useLanguage();
  const text = copy[language];
  const content = project[language];
  const next = projects[(projects.indexOf(project) + 1) % projects.length];

  return (
    <>
      <article className="case-study">
        <header className="container case-intro">
          <Link className="back-link" to={localizedPath(language) + "#work"}><ArrowLeft size={17} /> {text.back}</Link>
          <p className="category">{text.study} <span>{content.category}</span></p>
          <h1>{project.name}</h1>
          <p className="case-headline">{content.headline}</p>
          <p className="case-summary">{content.summary}</p>
          <Stack items={project.stack} />
          <p className="case-source">{text.sourceStatus}</p>
          {project.publicUrl && content.publicLabel && (
            <a className="button button-outline case-public" href={project.publicUrl} target="_blank" rel="noreferrer">
              {content.publicLabel} <ArrowUpRight size={17} />
            </a>
          )}
        </header>
        <div className="container case-visual">
          <ScreenshotFigure screenshot={project.hero} alt={content.heroAlt} caption={content.heroCaption} theme={project.theme} eager />
        </div>
        <nav className="container case-jump" aria-label={text.jump}>
          {text.sections.map((label, index) => <a key={caseIds[index]} href={"#" + caseIds[index]}>{label}<ArrowDown size={15} /></a>)}
        </nav>
        <section className="container case-section" id="case-problem">
          <h2>{text.sections[0]}</h2>
          <div className="case-copy">
            <h3>{text.problem}</h3><p>{content.challenge}</p>
            <h3>{text.contribution}</h3><p>{content.contribution}</p>
          </div>
        </section>
        <section className="case-decisions" id="case-decisions">
          <div className="container">
            <h2>{text.sections[1]}</h2>
            <div className="decision-grid">
              {content.decisions.map(([title, description]) => <div key={title}><h3>{title}</h3><p>{description}</p></div>)}
            </div>
          </div>
        </section>
        <section className="container case-section" id="case-system">
          <h2>{text.sections[2]}</h2>
          <div className="case-copy">
            <ol className="pipeline">
              {content.flow.map((stage, index) => (
                <li key={stage}><span>{stage}</span>{index < content.flow.length - 1 && <ArrowRight size={16} aria-hidden="true" />}</li>
              ))}
            </ol>
            <h3>{text.stack}</h3><Stack items={project.stack} />
          </div>
        </section>
        <section className="container case-section" id="case-build">
          <h2>{text.sections[3]}</h2>
          <div className="case-copy">
            <h3>{text.verification}</h3><p>{content.verification}</p>
            <h3>{text.scope}</h3><p>{content.scope}</p>
          </div>
        </section>
        {project.gallery && content.galleryText && (
          <section className="container gallery">
            <h2>{text.gallery}</h2>
            <div className={`gallery-grid gallery-${project.theme}`}>
              {project.gallery.map((screenshot, index) => (
                <ScreenshotFigure key={screenshot.file} screenshot={screenshot} alt={content.galleryText?.[index][0] ?? ""}
                  caption={content.galleryText?.[index][1]} theme={project.theme} />
              ))}
            </div>
          </section>
        )}
        <div className="container next-project">
          <Link to={localizedPath(language, "/projects/" + next.slug)}>
            <div><p className="category">{text.next}</p><strong>{next.name}</strong></div><ArrowUpRight size={28} />
          </Link>
        </div>
      </article>
      <Contact />
    </>
  );
}

function NotFound() {
  const language = useLanguage();
  const text = copy[language];
  return <section className="container not-found"><h1>{text.missing}</h1><Link className="back-link" to={localizedPath(language)}><ArrowLeft size={17} /> {text.returnHome}</Link></section>;
}

export default function App() {
  const location = useLocation();
  const prefix = /^\/(fr|en)(?=\/|$)/.exec(location.pathname);
  const path = (prefix ? location.pathname.slice(prefix[0].length) : location.pathname).replace(/\/+$/, "") || "/";
  const language = prefix?.[1] as Language | undefined;
  const slug = matchPath("/projects/:slug", path)?.params.slug;
  const project = projects.find(item => item.slug === slug);

  if (!language) {
    return <Navigate replace to={localizedPath(readPreference(), path) + location.search + location.hash} />;
  }

  return (
    <LanguageContext.Provider value={language}>
      <PageEffects path={path} project={project} />
      <a className="skip-link" href="#main">{copy[language].skip}</a>
      <Header key={path} path={path} />
      <main id="main" tabIndex={-1}>
        {path === "/" ? <><Hero /><Work /><Approach /><About /><Contact /></>
          : project ? <ProjectPage project={project} /> : <NotFound />}
      </main>
      <Footer />
    </LanguageContext.Provider>
  );
}
