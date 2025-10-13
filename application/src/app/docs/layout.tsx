import React from 'react';

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex">
          {/* Sidebar Navigation */}
          <aside className="w-64 min-h-screen bg-white shadow-sm border-r border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">📱 ClientJO Docs</h2>
            <nav className="space-y-2">
              <a href="/docs" className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                🏠 Accueil
              </a>
              <a href="/docs/installation" className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                🔧 Installation
              </a>
              <a href="/docs/architecture" className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                🏗️ Architecture
              </a>
              <a href="/docs/components" className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                🧩 Composants
              </a>
              <a href="/docs/api" className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                🌐 API & Services
              </a>
              <a href="/docs/tests" className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                🧪 Tests
              </a>
              <a href="/docs/deployment" className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                🚀 Déploiement
              </a>
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 p-8">
            <div className="prose prose-lg max-w-none">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
