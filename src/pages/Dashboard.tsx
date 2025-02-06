import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FolderGit2, Clock, Settings } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('projects').insert([
        {
          name: newProject.name,
          description: newProject.description,
          user_id: user?.id,
        },
      ]);

      if (error) throw error;

      setNewProject({ name: '', description: '' });
      setShowNewProject(false);
      fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold text-white">Dashboard</h1>
          <div className="flex items-center gap-4">
            <Link
              to="/settings"
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-slate-300 transition-colors hover:text-white"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Your Projects</h2>
          <button
            onClick={() => setShowNewProject(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-600"
          >
            <Plus className="h-5 w-5" />
            New Project
          </button>
        </div>

        {showNewProject && (
          <div className="mb-8 rounded-lg bg-slate-800 p-6">
            <form onSubmit={createProject} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300">
                  Project Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-300">
                  Description
                </label>
                <textarea
                  id="description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewProject(false)}
                  className="rounded-lg border border-slate-600 px-4 py-2 text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-600"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/project/${project.id}`}
              className="group rounded-lg bg-slate-800 p-6 transition-all hover:bg-slate-700"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                <FolderGit2 className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">{project.name}</h3>
              {project.description && (
                <p className="mb-4 text-sm text-slate-400">{project.description}</p>
              )}
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Clock className="h-4 w-4" />
                <span>
                  Updated {new Date(project.updated_at).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {projects.length === 0 && !showNewProject && (
          <div className="rounded-lg border border-dashed border-slate-700 p-8 text-center">
            <FolderGit2 className="mx-auto mb-4 h-12 w-12 text-slate-600" />
            <h3 className="mb-2 text-lg font-semibold text-white">No projects yet</h3>
            <p className="mb-4 text-slate-400">
              Create your first project to start generating API documentation
            </p>
            <button
              onClick={() => setShowNewProject(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-600"
            >
              <Plus className="h-5 w-5" />
              New Project
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;