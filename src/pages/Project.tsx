import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Upload, 
  Code2, 
  GitBranch, 
  Download, 
  Plus,
  ChevronRight,
  ExternalLink,
  Clock
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Project {
  id: string;
  name: string;
  description: string;
}

interface ApiVersion {
  id: string;
  version_name: string;
  status: string;
  created_at: string;
}

function Project() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [versions, setVersions] = useState<ApiVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewVersion, setShowNewVersion] = useState(false);
  const [newVersion, setNewVersion] = useState({ name: '', file: null });

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      // Fetch project details
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (projectError) throw projectError;
      setProject(projectData);

      // Fetch API versions
      const { data: versionsData, error: versionsError } = await supabase
        .from('api_versions')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: false });

      if (versionsError) throw versionsError;
      setVersions(versionsData || []);
    } catch (error) {
      console.error('Error fetching project details:', error);
    } finally {
      setLoading(false);
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

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="text-center text-white">Project not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Link to="/dashboard" className="text-slate-400 hover:text-white">
                Dashboard
              </Link>
              <ChevronRight className="h-4 w-4 text-slate-600" />
              <h1 className="text-xl font-bold text-white">{project.name}</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 grid gap-6 lg:grid-cols-3">
          <div className="col-span-2 space-y-6">
            <div className="rounded-lg bg-slate-800 p-6">
              <h2 className="mb-4 text-xl font-bold text-white">Project Overview</h2>
              <p className="text-slate-300">{project.description}</p>
            </div>

            <div className="rounded-lg bg-slate-800 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">API Versions</h2>
                <button
                  onClick={() => setShowNewVersion(true)}
                  className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
                >
                  <Plus className="h-4 w-4" />
                  New Version
                </button>
              </div>

              <div className="space-y-4">
                {versions.map((version) => (
                  <div
                    key={version.id}
                    className="flex items-center justify-between rounded-lg border border-slate-700 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                        <GitBranch className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{version.version_name}</h3>
                        <p className="text-sm text-slate-400">
                          Created {new Date(version.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          version.status === 'published'
                            ? 'bg-green-500/10 text-green-400'
                            : version.status === 'draft'
                            ? 'bg-yellow-500/10 text-yellow-400'
                            : 'bg-slate-500/10 text-slate-400'
                        }`}
                      >
                        {version.status}
                      </span>
                      <Link
                        to={`/docs/${version.id}`}
                        className="flex items-center gap-2 rounded-lg border border-slate-600 px-3 py-1.5 text-sm text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
                      >
                        <ExternalLink className="h-4 w-4" />
                        View Docs
                      </Link>
                    </div>
                  </div>
                ))}

                {versions.length === 0 && !showNewVersion && (
                  <div className="rounded-lg border border-dashed border-slate-700 p-8 text-center">
                    <GitBranch className="mx-auto mb-4 h-12 w-12 text-slate-600" />
                    <h3 className="mb-2 text-lg font-semibold text-white">No versions yet</h3>
                    <p className="mb-4 text-slate-400">
                      Create your first API version to start generating documentation
                    </p>
                    <button
                      onClick={() => setShowNewVersion(true)}
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-600"
                    >
                      <Plus className="h-5 w-5" />
                      New Version
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg bg-slate-800 p-6">
              <h2 className="mb-4 text-xl font-bold text-white">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => setShowNewVersion(true)}
                  className="flex w-full items-center gap-3 rounded-lg border border-slate-700 p-3 text-left transition-colors hover:border-slate-600"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                    <Upload className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Upload API Spec</h3>
                    <p className="text-sm text-slate-400">
                      Import OpenAPI/Swagger specification
                    </p>
                  </div>
                </button>

                <button className="flex w-full items-center gap-3 rounded-lg border border-slate-700 p-3 text-left transition-colors hover:border-slate-600">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                    <Code2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Paste API Code</h3>
                    <p className="text-sm text-slate-400">
                      Manually input your API details
                    </p>
                  </div>
                </button>

                <button className="flex w-full items-center gap-3 rounded-lg border border-slate-700 p-3 text-left transition-colors hover:border-slate-600">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                    <Download className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Export Docs</h3>
                    <p className="text-sm text-slate-400">
                      Download documentation in various formats
                    </p>
                  </div>
                </button>
              </div>
            </div>

            <div className="rounded-lg bg-slate-800 p-6">
              <h2 className="mb-4 text-xl font-bold text-white">Recent Activity</h2>
              <div className="space-y-4">
                {versions.slice(0, 3).map((version) => (
                  <div key={version.id} className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm text-white">
                        New version <span className="font-medium">{version.version_name}</span> created
                      </p>
                      <p className="text-xs text-slate-400">
                        {new Date(version.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Project;