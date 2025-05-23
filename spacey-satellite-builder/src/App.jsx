import { useState, useEffect } from 'react';
import LessonPage from './pages/LessonPage';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading resources
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="loading-screen min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-float mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-space-accent mx-auto" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Spacey Satellite Builder</h1>
          <p className="text-blue-200">Loading your space adventure...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header py-4 bg-space-dark shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-space-accent mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <h1 className="text-xl font-bold text-white">Spacey Satellite Builder</h1>
          </div>
        </div>
      </header>
      
      <main>
        <LessonPage />
      </main>
      
      <footer className="app-footer py-6 bg-space-dark mt-12">
        <div className="container mx-auto px-4 text-center text-slate-400">
          <p>&copy; {new Date().getFullYear()} Spacey Satellite Builder. All rights reserved.</p>
          <p className="mt-2 text-sm">An interactive educational experience for space enthusiasts of all ages.</p>
        </div>
      </footer>
    </div>
  );
}

export default App; 