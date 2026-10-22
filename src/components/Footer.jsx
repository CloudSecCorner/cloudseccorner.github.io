import { Link } from "react-router-dom";
import { REPOSITORY_URL } from "../utils/socialSharing";

function Footer() {
  return (
    <footer className="border-t border-slate-700 bg-bgGray text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <p className="text-lg font-bold text-white">Cloud Security Corner</p>
          <p className="mt-3 max-w-md leading-7 text-slate-400">
            Open resources for securing AI agents, autonomous cloud workloads, and the infrastructure they can access.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-white">Explore</p>
          <nav className="mt-4 flex flex-col gap-3 text-sm" aria-label="Footer navigation">
            <Link className="hover:text-cyan-300" to="/tools">Security tools</Link>
            <Link className="hover:text-cyan-300" to="/labs">Hands-on labs</Link>
            <Link className="hover:text-cyan-300" to="/blog">Research & field notes</Link>
          </nav>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-white">Community</p>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            <a className="hover:text-cyan-300" href={REPOSITORY_URL} target="_blank" rel="noopener noreferrer">GitHub repository</a>
            <a className="hover:text-cyan-300" href={`${REPOSITORY_URL}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noopener noreferrer">Contribution guide</a>
            <a className="hover:text-cyan-300" href="https://discord.gg/aUD4hkYYGt" target="_blank" rel="noopener noreferrer">Discord community</a>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-700/80 px-6 py-5 text-center text-sm text-slate-500">
        Community-built guidance for practical agentic cloud security.
      </div>
    </footer>
  );
}

export default Footer;
