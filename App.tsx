import React from 'react';
import TableEditor from './components/TableEditor';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </div>
            <h1 className="text-xl font-bold text-gray-800">المصطفي هدهد</h1>
          </div>
          <div className="text-sm text-gray-500 hidden sm:block">
           جرد المصطفي ل pdf
          </div>
        </div>
      </header>

      <main className="flex-grow py-8">
        <TableEditor />
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()}   المصطفي. صمم للمشاركة السريعة.</p>
      </footer>
    </div>
  );
};

export default App;