import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Download, Copy, Code2, ExternalLink } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';

interface Endpoint {
  id: string;
  path: string;
  method: string;
  summary: string;
  description: string;
  request_body: any;
  response_schema: any;
  examples: any;
}

function Documentation() {
  const { id } = useParams<{ id: string }>();
  const [apiVersion, setApiVersion] = useState<any>(null);
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeEndpoint, setActiveEndpoint] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('curl');

  useEffect(() => {
    fetchDocumentation();
  }, [id]);

  const fetchDocumentation = async () => {
    try {
      // Fetch API version details
      const { data: versionData, error: versionError } = await supabase
        .from('api_versions')
        .select(`
          *,
          project:projects(name)
        `)
        .eq('id', id)
        .single();

      if (versionError) throw versionError;
      setApiVersion(versionData);

      // Fetch endpoints
      const { data: endpointsData, error: endpointsError } = await supabase
        .from('endpoints')
        .select('*')
        .eq('api_version_id', id)
        .order('path');

      if (endpointsError) throw endpointsError;
      setEndpoints(endpointsData || []);
      if (endpointsData?.length > 0) {
        setActiveEndpoint(endpointsData[0].id);
      }
    } catch (error) {
      console.error('Error fetching documentation:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMethodColor = (method: string) => {
    const colors = {
      GET: 'bg-green-500/10 text-green-400',
      POST: 'bg-blue-500/10 text-blue-400',
      PUT: 'bg-yellow-500/10 text-yellow-400',
      DELETE: 'bg-red-500/10 text-red-400',
      PATCH: 'bg-purple-500/10 text-purple-400'
    };
    return colors[method as keyof typeof colors] || 'bg-slate-500/10 text-slate-400';
  };

  const generateCodeExample = (endpoint: Endpoint, language: string) => {
    const baseUrl = 'https://api.example.com'; // Replace with actual base URL
    const path = endpoint.path;
    const method = endpoint.method;
    const requestBody = endpoint.request_body;

    switch (language) {
      case 'curl':
        return `curl -X ${method} "${baseUrl}${path}" \\
${requestBody ? `-H "Content-Type: application/json" \\
-d '${JSON.stringify(requestBody, null, 2)}'` : ''}`;

      case 'javascript':
        return `fetch("${baseUrl}${path}", {
  method: "${method}",
  ${requestBody ? `headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(${JSON.stringify(requestBody, null, 2)})` : ''}
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`;

      case 'python':
        return `import requests

response = requests.${method.toLowerCase()}(
    "${baseUrl}${path}"${requestBody ? `,
    json=${JSON.stringify(requestBody, null, 2)}` : ''}
)

print(response.json())`;

      default:
        return '';
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

  const activeEndpointData = endpoints.find(e => e.id === activeEndpoint);

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">
                {apiVersion?.project?.name} - {apiVersion?.version_name}
              </h1>
              <p className="text-sm text-slate-400">API Documentation</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-slate-300 transition-colors hover:border-slate-600 hover:text-white">
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto grid grid-cols-12 gap-6 px-4 py-8">
        {/* Sidebar */}
        <div className="col-span-3">
          <div className="sticky top-8 space-y-6">
            <div className="rounded-lg bg-slate-800 p-4">
              <h2 className="mb-4 font-semibold text-white">Endpoints</h2>
              <nav className="space-y-1">
                {endpoints.map((endpoint) => (
                  <button
                    key={endpoint.id}
                    onClick={() => setActiveEndpoint(endpoint.id)}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm ${
                      activeEndpoint === endpoint.id
                        ? 'bg-blue-500/10 text-blue-400'
                        : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                    }`}
                  >
                    <span
                      className={`inline-flex h-6 items-center rounded px-2 text-xs font-medium ${getMethodColor(
                        endpoint.method
                      )}`}
                    >
                      {endpoint.method}
                    </span>
                    <span className="truncate">{endpoint.path}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="col-span-9">
          {activeEndpointData ? (
            <div className="space-y-6">
              {/* Endpoint header */}
              <div className="rounded-lg bg-slate-800 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <span
                    className={`inline-flex h-6 items-center rounded px-2 text-xs font-medium ${getMethodColor(
                      activeEndpointData.method
                    )}`}
                  >
                    {activeEndpointData.method}
                  </span>
                  <h2 className="text-lg font-semibold text-white">
                    {activeEndpointData.path}
                  </h2>
                </div>
                <p className="text-slate-300">{activeEndpointData.summary}</p>
              </div>

              {/* Description */}
              {activeEndpointData.description && (
                <div className="rounded-lg bg-slate-800 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-white">Description</h3>
                  <div className="prose prose-invert max-w-none">
                    <ReactMarkdown>{activeEndpointData.description}</ReactMarkdown>
                  </div>
                </div>
              )}

              {/* Request */}
              {activeEndpointData.request_body && (
                <div className="rounded-lg bg-slate-800 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-white">Request</h3>
                  <div className="rounded-lg bg-slate-900 p-4">
                    <SyntaxHighlighter
                      language="json"
                      style={oneDark}
                      customStyle={{ background: 'transparent', padding: 0 }}
                    >
                      {JSON.stringify(activeEndpointData.request_body, null, 2)}
                    </SyntaxHighlighter>
                  </div>
                </div>
              )}

              {/* Response */}
              {activeEndpointData.response_schema && (
                <div className="rounded-lg bg-slate-800 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-white">Response</h3>
                  <div className="rounded-lg bg-slate-900 p-4">
                    <SyntaxHighlighter
                      language="json"
                      style={oneDark}
                      customStyle={{ background: 'transparent', padding: 0 }}
                    >
                      {JSON.stringify(activeEndpointData.response_schema, null, 2)}
                    </SyntaxHighlighter>
                  </div>
                </div>
              )}

              {/* Code examples */}
              <div className="rounded-lg bg-slate-800 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Code Examples</h3>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="rounded-lg border border-slate-600 bg-slate-700 px-3 py-1.5 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="curl">cURL</option>
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                    </select>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          generateCodeExample(activeEndpointData, selectedLanguage)
                        );
                      }}
                      className="flex items-center gap-1 rounded-lg border border-slate-600 px-3 py-1.5 text-sm text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
                    >
                      <Copy className="h-4 w-4" />
                      Copy
                    </button>
                  </div>
                </div>
                <div className="rounded-lg bg-slate-900 p-4">
                  <SyntaxHighlighter
                    language={selectedLanguage === 'curl' ? 'bash' : selectedLanguage}
                    style={oneDark}
                    customStyle={{ background: 'transparent', padding: 0 }}
                  >
                    {generateCodeExample(activeEndpointData, selectedLanguage)}
                  </SyntaxHighlighter>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-700 p-8 text-center">
              <Code2 className="mx-auto mb-4 h-12 w-12 text-slate-600" />
              <h3 className="mb-2 text-lg font-semibold text-white">No endpoint selected</h3>
              <p className="text-slate-400">
                Select an endpoint from the sidebar to view its documentation
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Documentation;