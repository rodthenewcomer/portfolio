import { useEffect, useRef, useState } from "react";
import { Link, Route, Routes, useLocation, useParams } from "react-router-dom";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronRight, GitBranch, Menu, X } from "lucide-react";
import projects from "./projects.json";

type Project = (typeof projects)[number];
const profileUrl = "https://github.com/rodthenewcomer";
const activeYear = "2026";

function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link className={light ? "brand brand-light" : "brand"} to="/" aria-label="Moustapha Adebigni, home">
      <span className="brand-mark" aria-hidden="true">M<span>.</span></span>
      <span className="brand-wordmark"><strong>Moustapha Adebigni</strong><small>Software developer · AI integrations</small></span>
    </Link>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const nav = [
    { label: "Selected work", to: "/#work" },
    { label: "My approach", to: "/#approach" },
    { label: "About", to: "/#about" },
  ];
  return (
    <header className="site-header">
      <div className="container header-content">
        <Brand />
        <nav className={open ? "nav-links nav-open" : "nav-links"} aria-label="Main navigation" id="primary-navigation">
          {nav.map(item => <Link key={item.label} to={item.to} onClick={() => setOpen(false)}>{item.label}</Link>)}
          <a className="nav-contact" href={profileUrl} target="_blank" rel="noreferrer">GitHub profile <ArrowUpRight size={15} aria-hidden="true" /></a>
        </nav>
        <button className="mobile-toggle" type="button" aria-label={open ? "Close navigation" : "Open navigation"} aria-controls="primary-navigation" aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}

function ScrollManager() {
  const location = useLocation();
  useEffect(() => {
    const target = location.hash.replace("#", "");
    if (target) {
      window.setTimeout(() => document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);
  return null;
}

function RevealOnScroll() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const nodes = [...document.querySelectorAll<HTMLElement>("[data-reveal]")];
    document.documentElement.classList.add("motion-ready");
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0.07, rootMargin: "0px 0px -20px 0px" });
    nodes.forEach((node) => observer.observe(node));
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("motion-ready");
    };
  }, [pathname]);
  return null;
}

function ReadingProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (bar.current) bar.current.style.transform = "scaleX(" + Math.max(0, Math.min(1, max > 0 ? window.scrollY / max : 0)) + ")";
      });
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => { window.removeEventListener("scroll", update); cancelAnimationFrame(frame); };
  }, []);
  return <div className="reading-progress" aria-hidden="true"><div ref={bar} /></div>;
}

function CareerBadge({ text = "Open to full-time opportunities" }: { text?: string }) {
  return <span className="availability"><span aria-hidden="true">↗</span>{text}</span>;
}

function HeroSystem() {
  const stages = [
    ["01", "Understand the problem", "Ask questions, map the work"],
    ["02", "Connect the pieces", "Screens, data, APIs, decisions"],
    ["03", "Make it work", "Build, review, fix, repeat"],
    ["04", "Test the details", "Try it, debug it, improve it"],
  ];
  return (
    <div className="hero-system" aria-label="Illustration of the product building process">
      <div className="system-top"><span className="system-kicker">A LOOK AT HOW I WORK</span><span className="system-signal">FOUR CASE STUDIES</span></div>
      <div className="system-main">
        <div className="system-heading">The best part?<br /><em>Making it work.</em></div>
        <div className="system-stages">
          {stages.map((stage, i) => (
            <div className="system-stage" key={stage[0]}>
              <span className="stage-no">{stage[0]}</span><div><strong>{stage[1]}</strong><small>{stage[2]}</small></div>
              {i === 3 ? <Check size={18} aria-hidden="true" /> : <ChevronRight size={17} aria-hidden="true" />}
            </div>
          ))}
        </div>
      </div>
      <div className="system-bottom"><span>THE PROCESS / HANDS-ON</span><span>BUILD → TEST → IMPROVE</span></div>
    </div>
  );
}

function Hero() {
  return (
    <section className="hero container" id="top">
      <div className="hero-eyebrow"><span>SOFTWARE DEVELOPER · AI INTEGRATIONS · UNITED STATES</span><CareerBadge /></div>
      <div className="hero-grid">
        <div className="hero-copy">
          <div className="hello-note"><span aria-hidden="true">✳</span> HI, I’M MOUSTAPHA.</div>
          <h1>I build software <span className="serif-italic">that just works.</span></h1>
          <p className="hero-description">I work on AI tools, web apps and native software. I like untangling tricky problems, connecting the pieces and making the details feel simple.</p>
          <div className="hero-actions">
            <Link className="button button-dark" to="/#work">See what I’ve built <ArrowUpRight size={19} aria-hidden="true" /></Link>
            <Link className="text-link" to="/#approach">How I work <ArrowDown size={18} aria-hidden="true" /></Link>
          </div>
          <div className="hero-footnote"><span className="line-mark" /> <span>Four projects, four different challenges.<br />Here’s the thinking and work behind each one.</span></div>
        </div>
        <HeroSystem />
      </div>
      <div className="discipline-bar" aria-label="Areas of work"><span>WHAT I WORK ACROSS</span><strong>AI AGENTS</strong><strong>DATA ANALYTICS</strong><strong>BUSINESS AUTOMATION</strong><strong>NATIVE iOS</strong></div>
    </section>
  );
}

function BridgetArt() {
  return (
    <div className="visual visual-agent" aria-label="Conceptual example of a Bridget work dashboard">
      <div className="visual-meta"><span>BRIDGET / WORKSPACE</span><span>MACOS SYSTEM</span></div>
      <div className="agent-window">
        <div className="agent-window-top"><div className="window-lights"><i /><i /><i /></div><span>Bridget</span><span className="window-dots">•••</span></div>
        <div className="agent-window-body">
          <div className="agent-heading"><span>Work overview</span><small>Illustrative UI</small></div>
          <div className="agent-tasks">
            <div className="agent-task"><span className="task-symbol">↗</span><div><strong>Review a proposed plan</strong><small>Approval required</small></div><span className="task-pill pill-amber">Needs you</span></div>
            <div className="agent-task"><span className="task-symbol">✳</span><div><strong>Analyze session notes</strong><small>Structured workflow</small></div><span className="task-pill pill-blue">Working</span></div>
            <div className="agent-task"><span className="task-symbol">✓</span><div><strong>Prepare a report</strong><small>Result verified</small></div><span className="task-pill pill-green">Done</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ForensicsArt() {
  return (
    <div className="visual visual-forensics" aria-label="Illustrative trading behavior analysis dashboard">
      <div className="visual-meta"><span>EDGE FORENSICS / ANALYSIS</span><span>EXAMPLE DATA</span></div>
      <div className="analytics-screen">
        <div className="analytics-top"><span className="analytics-small-circle">✳</span><span>Behavior review</span><small>Session patterns</small></div>
        <div className="analytics-chart"><span className="chart-label">PATTERN FREQUENCY / ILLUSTRATION</span><svg viewBox="0 0 360 130" preserveAspectRatio="none" aria-hidden="true"><path d="M0 101H360 M0 64H360 M0 27H360" stroke="#404746" strokeWidth="1" strokeDasharray="3 7" /><path d="M0 106 C35 92 47 103 70 85 S112 46 143 61 S191 117 214 81 S265 60 288 48 S334 20 360 32" fill="none" stroke="#a9dfbb" strokeWidth="3" strokeLinecap="round" /></svg></div>
        <div className="analytics-patterns"><div><span className="pattern-dot p-red" />Revenge trading <span>Review</span></div><div><span className="pattern-dot p-gold" />Risk escalation <span>Review</span></div><div><span className="pattern-dot p-green" />Position sizing <span>Analyze</span></div></div>
      </div>
    </div>
  );
}

function PokouArt() {
  return (
    <div className="visual visual-pokou" aria-label="Illustrative customer workflow for Pokou AI">
      <div className="visual-meta"><span>POKOU / BUSINESS ENGINE</span><span>WORKFLOW EXAMPLE</span></div>
      <div className="pokou-flow">
        <div className="pokou-request"><span>01 / CUSTOMER MESSAGE</span><p>“Do you have a room available this weekend?”</p></div>
        <div className="pokou-flow-line"><span className="flow-node" /> <span>UNDERSTAND & ROUTE</span></div>
        <div className="pokou-steps"><div><b>02</b><strong>Check rules</strong><small>Hotel module</small></div><div><b>03</b><strong>Take action</strong><small>Booking workflow</small></div><div><b>04</b><strong>Confirm</strong><small>Or hand off</small></div></div>
        <div className="pokou-foot"><span className="status-light" />Human context preserved when needed</div>
      </div>
    </div>
  );
}

function CrownArt() {
  const pieces = new Set([1,3,5,7,8,10,12,14,17,19,21,23,40,42,44,46,49,51,53,55,56,58,60,62]);
  return (
    <div className="visual visual-crown" aria-label="Illustration of an eight by eight checkers board">
      <div className="visual-meta"><span>CROWN / GAMECORE</span><span>SWIFT + SPRITEKIT</span></div>
      <div className="board-scene">
        <div className="game-board" aria-hidden="true">{Array.from({length:64},(_,i)=>{const dark=(Math.floor(i/8)+i%8)%2===1;const hasPiece=pieces.has(i);return <span key={i} className={dark?"board-cell board-dark":"board-cell board-light"}>{hasPiece&&<span className={i<32?"piece piece-cream":"piece piece-dark"} />}</span>;})}</div>
        <div className="board-aside"><span className="board-aside-line">SELECT A RULESET</span><strong>Precision<br />in every<br />move.</strong><span className="rules-badge">FOUR VARIANTS</span><span className="board-caption">Board display / illustrative</span></div>
      </div>
    </div>
  );
}
function ProjectVisual({ project }: { project: Project }) {
  if(project.type==="agent")return <BridgetArt/>;
  if(project.type==="analytics")return <ForensicsArt/>;
  if(project.type==="business")return <PokouArt/>;
  return <CrownArt/>;
}
function SectionLabel({ index, children }: { index:string; children:React.ReactNode }) {
  return <div className="section-label"><span>{index}</span><span>{children}</span></div>;
}
function ProjectCard({ project }: { project: Project }) {
  return (
    <Link data-reveal className={"project-card card-"+project.type} to={"/projects/"+project.slug} aria-label={"Read "+project.name+" case study"}>
      <div className="card-topline"><span>{project.number} / FEATURED PROJECT</span><span>{project.category}<ArrowUpRight size={15}/></span></div>
      <div className="card-text"><h3>{project.name}</h3><p>{project.summary}</p></div>
      <ProjectVisual project={project}/>
      <div className="card-bottom"><div className="card-tags">{project.stack.slice(0,3).map(s=><span key={s}>{s}</span>)}</div><span className="card-open">View case study <ArrowUpRight size={17}/></span></div>
    </Link>
  );
}
function Work() {
  return <section className="work-section section-pad container" id="work">
    <SectionLabel index="01">SELECTED WORK</SectionLabel>
    <div className="section-title-row" data-reveal><div><h2>Four projects.<br/><em>Four good challenges.</em></h2><p>From Mac automation to a checkers game for iPhone. Each one taught me something different about making software that people can use.</p></div><span className="section-count">01 — 04</span></div>
    <div className="project-grid">{projects.map(project=><ProjectCard key={project.slug} project={project}/>)}</div>
    <p className="privacy-note"><span className="privacy-icon">i</span> These projects live in private repositories. The case studies share the approach and the work—not private code or credentials.</p>
  </section>;
}
function Approach() {
  const steps=[["01","Understand the problem","I start by asking who it’s for and what the software actually needs to do."],["02","Find the moving parts","I break things down into screens, data, APIs and the cases that might go wrong."],["03","Build & connect","AI coding tools help me move faster. I still review the changes and how everything fits together."],["04","Try it for real","I test the complete flow, find what feels off and keep improving it."]];
  return <section className="approach-section section-pad" id="approach"><div className="container">
    <SectionLabel index="02">HOW I WORK</SectionLabel>
    <div className="approach-heading" data-reveal><h2>Curiosity first.<br/><em>Then the details.</em></h2><p>I’m interested in the whole journey—from figuring out what to build to testing it on an actual device.</p></div>
    <div className="process-grid">{steps.map(s=><div className="process-step" data-reveal key={s[0]}><span className="process-no">{s[0]}</span><div className="process-icon"><ArrowUpRight size={21}/></div><h3>{s[1]}</h3><p>{s[2]}</p></div>)}</div>
    <div className="process-bottom"><span>MY APPROACH</span><strong>Understand it. Build it. Make it better.</strong><span>STILL LEARNING ↗</span></div>
  </div></section>;
}
function About() {
  return <section className="about-section section-pad container" id="about">
    <SectionLabel index="03">ABOUT THE BUILDER</SectionLabel>
    <div className="about-grid" data-reveal><div><h2>I like figuring<br/><em>things out.</em></h2></div><div className="about-copy">
      <p className="about-lead">I’m Moustapha. I enjoy taking a complicated task and finding a simpler way to get it done.</p>
      <p>I use AI coding tools to help build faster, but I stay close to the work: understanding the code, connecting services, checking what happens when something fails and polishing the experience until it makes sense.</p>
      <p>I’d like to bring that mindset to a full-time engineering team, learn from people who have been doing this longer than I have and contribute to products over the long run.</p>
      <div className="about-practice"><span>WHAT I BRING</span><div><strong>React & TypeScript</strong><strong>Swift & SwiftUI</strong><strong>AI integrations</strong><strong>APIs & workflows</strong><strong>Debugging & QA</strong></div></div>
    </div></div>
  </section>;
}
function Contact() {
  return <section className="contact-wrap" id="contact"><div className="container contact-inner"><div className="contact-top"><span>LET'S WORK TOGETHER</span><CareerBadge text="Open to full-time roles"/></div><div className="contact-main" data-reveal><h2>Let’s make something <em>useful together.</em></h2><p>I’m looking for a long-term software role where I can solve real problems, work with a good team and keep getting better at the craft.</p><a className="button button-light" href={profileUrl} rel="noreferrer" target="_blank">View my GitHub <ArrowUpRight size={19}/></a></div><div className="contact-bottom"><span>UNITED STATES · REMOTE & ON-SITE OPEN</span><span>ENGINEERING · COLLABORATION · QUALITY</span></div></div></section>;
}
function Footer() {
  return <footer className="site-footer"><div className="container footer-content"><Brand/><span>Selected software projects · {activeYear}</span><a href={profileUrl} target="_blank" rel="noreferrer" aria-label="GitHub profile"><GitBranch size={19}/><ArrowUpRight size={14}/></a></div></footer>;
}
function HomePage() {
  useEffect(()=>{document.title="Moustapha Adebigni — Software Developer & AI Integrations";},[]);
  return <><Hero/><Work/><Approach/><About/><Contact/></>;
}
function ProjectPage() {
  const {slug}=useParams();
  const project=projects.find(p=>p.slug===slug);
  useEffect(()=>{document.title=project?project.name+" — Moustapha Adebigni | Case Study":"Project not found";},[project]);
  if(!project)return <div className="container not-found"><span>404 / NOT FOUND</span><h1>That project isn't here.</h1><Link className="button button-dark" to="/">Back to portfolio <ArrowLeft size={18}/></Link></div>;
  const index=projects.findIndex(p=>p.slug===project.slug);
  const next=projects[(index+1)%projects.length];
  return <div className="case-study">
    <ReadingProgress />
    <div className="container case-intro"><Link className="back-link" to="/#work"><ArrowLeft size={17}/> All selected work</Link><div className="case-kicker"><span>{project.number} / CASE STUDY</span><span>{project.discipline}</span></div><div className="case-headline" data-reveal><h1>{project.headline}</h1><p>{project.summary}</p></div></div>
    <div className="container case-visual"><ProjectVisual project={project}/></div>
    <div className="container case-facts">{project.facts.map(f=><div key={f[1]}><strong>{f[0]}</strong><span>{f[1]}</span></div>)}<div className="case-fact-type"><span>PROJECT</span><strong>{project.name}</strong></div></div>
    <section className="container case-section case-two-col" data-reveal><div className="case-aside">01 / CONTEXT</div><div className="case-body"><h2>The problem</h2><p>{project.challenge}</p><h2>What I built</h2><p>{project.solution}</p></div></section>
    <section className="case-decisions"><div className="container"><div className="case-heading"><span>02 / THE IMPORTANT CHOICES</span><h2>Why I built it <em>this way.</em></h2></div><div className="decisions-grid" data-reveal>{project.decisions.map((d,i)=><article key={d[0]}><span>0{i+1} / DECISION</span><h3>{d[0]}</h3><p>{d[1]}</p></article>)}</div></div></section>
    <section className="container case-section case-two-col" data-reveal><div className="case-aside">03 / SYSTEM FLOW</div><div className="case-body"><h2>How the system works</h2><p className="flow-note">Here’s the flow at a glance, without exposing private code.</p><div className="pipeline">{project.flow.map((stage,i)=><div className="pipeline-item" key={stage}><span>{String(i+1).padStart(2,"0")}</span><strong>{stage}</strong>{i<project.flow.length-1&&<ArrowRight size={16} aria-hidden="true"/>}</div>)}</div><div className="case-stack"><span>TOOLS & TECHNOLOGIES</span><div>{project.stack.map(tech=><span key={tech}>{tech}</span>)}</div></div></div></section>
    <section className="container case-section case-two-col" data-reveal><div className="case-aside">04 / BUILD & RESULTS</div><div className="case-body"><h2>What I worked on</h2><p>{project.contribution}</p><div className="case-status"><span className="status-label"><i/> WHAT YOU CAN DO WITH IT</span><p>{project.status}</p></div><div className="case-learning"><span>ONE THING THIS PROJECT TAUGHT ME</span><blockquote>“{project.lesson}”</blockquote></div></div></section>
    <section className="next-project"><div className="container"><span>UP NEXT / {next.number}</span><Link to={"/projects/"+next.slug}><span>{next.name}</span><ArrowUpRight size={32}/></Link></div></section>
  </div>;
}

export default function App(){
  return <><a className="skip-link" href="#main">Skip to content</a><ScrollManager/><RevealOnScroll/><Header/><main id="main"><Routes><Route path="/" element={<HomePage/>}/><Route path="/projects/:slug" element={<ProjectPage/>}/><Route path="*" element={<div className="container not-found"><h1>Page not found.</h1><Link to="/">Return home <ArrowRight size={16}/></Link></div>}/></Routes></main><Footer/></>;
}
