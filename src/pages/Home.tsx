import React from 'react';
import { Code2, Upload, Sparkles, Share2, ChevronRight, Github, FileCode2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Hero Section */}
      <header className="container mx-auto px-6 py-16 text-center">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-white sm:text-6xl">
            Generate API Documentation
            <span className="text-blue-400"> Effortlessly with AI</span>
          </h1>
          <p className="mb-10 text-xl text-slate-300">
            Upload your API, and let Kerl generate detailed, readable, and customizable docs for you!
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/register"
              className="group flex items-center gap-2 rounded-full bg-blue-500 px-6 py-3 text-lg font-semibold text-white transition-all hover:bg-blue-600"
            >
              Get Started Free
              <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <button className="flex items-center gap-2 rounded-full border border-slate-600 px-6 py-3 text-lg font-semibold text-white transition-all hover:bg-slate-800">
              See Demo
            </button>
          </div>
        </div>
      </header>

      {/* How It Works Section */}
      <section className="bg-slate-800 py-20">
        <div className="container mx-auto px-6">
          <h2 className="mb-12 text-center text-3xl font-bold text-white sm:text-4xl">How It Works</h2>
          <div className="grid gap-8 md:grid-cols-4">
            {[
              { icon: Upload, title: 'Upload API', desc: 'Upload your API specification or connect your GitHub repository' },
              { icon: Code2, title: 'AI Analysis', desc: 'Our AI analyzes your API structure and endpoints' },
              { icon: Sparkles, title: 'Generate Docs', desc: 'Get beautifully formatted documentation in seconds' },
              { icon: Share2, title: 'Share & Export', desc: 'Export to multiple formats or share via URL' },
            ].map(({ icon: Icon, title, desc }, index) => (
              <div key={index} className="rounded-xl bg-slate-700 p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
                <p className="text-slate-300">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="mb-12 text-center text-3xl font-bold text-white sm:text-4xl">Key Features</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: FileCode2,
                title: 'Auto-Generated Code Snippets',
                desc: 'Get example code in multiple programming languages automatically',
              },
              {
                icon: Github,
                title: 'Version Control Support',
                desc: 'Track changes and maintain multiple versions of your documentation',
              },
              {
                icon: Sparkles,
                title: 'AI-Powered Customization',
                desc: 'Smart suggestions and automatic improvements for your documentation',
              },
            ].map(({ icon: Icon, title, desc }, index) => (
              <div key={index} className="rounded-xl bg-slate-700/50 p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                  <Icon className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
                <p className="text-slate-300">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-slate-800 py-20">
        <div className="container mx-auto px-6">
          <h2 className="mb-12 text-center text-3xl font-bold text-white sm:text-4xl">What Developers Say</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                quote: "Kerl has completely transformed how we handle API documentation. It's a game-changer!",
                author: "Sarah Chen",
                role: "Senior Developer at TechCorp",
              },
              {
                quote: "The AI-powered suggestions have helped us improve our documentation quality significantly.",
                author: "Michael Rodriguez",
                role: "API Architect at DevFlow",
              },
              {
                quote: "Setting up API documentation used to take days. With Kerl, it takes minutes.",
                author: "Alex Thompson",
                role: "Lead Developer at StartupX",
              },
            ].map(({ quote, author, role }, index) => (
              <div key={index} className="rounded-xl bg-slate-700/50 p-6">
                <p className="mb-4 text-lg text-slate-300">"{quote}"</p>
                <div>
                  <p className="font-semibold text-white">{author}</p>
                  <p className="text-sm text-slate-400">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="rounded-2xl bg-blue-500 p-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Ready to Get Started?</h2>
            <p className="mb-8 text-xl text-blue-100">
              Join thousands of developers who trust Kerl for their API documentation needs.
            </p>
            <Link
              to="/register"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-semibold text-blue-500 transition-all hover:bg-blue-50"
            >
              Try Kerl for Free
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-800 py-12">
        <div className="container mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">Product</h3>
              <ul className="space-y-2 text-slate-300">
                <li><a href="#" className="hover:text-blue-400">Features</a></li>
                <li><a href="#" className="hover:text-blue-400">Pricing</a></li>
                <li><a href="#" className="hover:text-blue-400">Documentation</a></li>
                <li><a href="#" className="hover:text-blue-400">API Reference</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">Company</h3>
              <ul className="space-y-2 text-slate-300">
                <li><a href="#" className="hover:text-blue-400">About</a></li>
                <li><a href="#" className="hover:text-blue-400">Blog</a></li>
                <li><a href="#" className="hover:text-blue-400">Careers</a></li>
                <li><a href="#" className="hover:text-blue-400">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">Resources</h3>
              <ul className="space-y-2 text-slate-300">
                <li><a href="#" className="hover:text-blue-400">Community</a></li>
                <li><a href="#" className="hover:text-blue-400">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-400">Status</a></li>
                <li><a href="#" className="hover:text-blue-400">Security</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">Legal</h3>
              <ul className="space-y-2 text-slate-300">
                <li><a href="#" className="hover:text-blue-400">Privacy</a></li>
                <li><a href="#" className="hover:text-blue-400">Terms</a></li>
                <li><a href="#" className="hover:text-blue-400">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-blue-400">Licenses</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-slate-700 pt-8 text-center text-slate-400">
            <p>© 2025 Kerl. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;