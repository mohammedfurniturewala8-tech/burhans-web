import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { WorkSection } from './components/WorkSection';
import { AboutSection } from './components/AboutSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { Footer } from './components/Footer';
import { VideoModal } from './components/VideoModal';
import { Admin } from './components/Admin';
import type { Project } from './data/projects';

export function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [route, setRoute] = useState<'home' | 'admin'>('home');

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin' || window.location.pathname === '/admin') {
        setRoute('admin');
      } else {
        setRoute('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToAdmin = () => {
    window.location.hash = 'admin';
    setRoute('admin');
  };

  const navigateToHome = () => {
    window.location.hash = '';
    setRoute('home');
  };

  if (route === 'admin') {
    return <Admin onNavigateHome={navigateToHome} />;
  }

  return (
    <div className="min-h-screen bg-[#0C0B0A] text-[#F2F0EC] selection:bg-[#C9A227] selection:text-[#0C0B0A]">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Content Sections */}
      <main>
        <Hero />
        <WorkSection onSelectProject={(project) => setSelectedProject(project)} />
        <AboutSection />
        <TestimonialsSection />
      </main>

      {/* Contact Footer */}
      <Footer onNavigateAdmin={navigateToAdmin} />

      {/* Video Embed Modal */}
      <VideoModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}

export default App;
