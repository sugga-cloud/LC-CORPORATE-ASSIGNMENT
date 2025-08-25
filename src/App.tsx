import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import UrlShortener from './components/UrlShortener';
import AdminPanel from './components/AdminPanel';

function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [refreshAdmin, setRefreshAdmin] = useState(0);

  const handleUrlShortened = () => {
    // Trigger admin panel refresh
    setRefreshAdmin(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800">LinkShort</h1>
            </div>
            <button
              onClick={() => setShowAdmin(!showAdmin)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                showAdmin
                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Settings className="w-4 h-4" />
              {showAdmin ? 'URL Shortener' : 'Admin Panel'}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {showAdmin ? (
            <AdminPanel key={refreshAdmin} />
          ) : (
            <UrlShortener onUrlShortened={handleUrlShortened} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-white/20 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              Built with React, TypeScript, and Express.js
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;