import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import LandingPage from '../components/LandingPage';
import AuthModal from '../components/AuthModal';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const { sendMessage } = useChat();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Transition between 'landing' and 'chat' view modes
  const [viewMode, setViewMode] = useState(() => {
    return isAuthenticated ? 'chat' : 'landing';
  });

  // Auth modal triggers
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pendingMessage, setPendingMessage] = useState('');
  const [prefilledInput, setPrefilledInput] = useState('');

  // Sync viewMode when authenticated status changes (e.g. user logs out -> landing page)
  useEffect(() => {
    if (isAuthenticated) {
      setViewMode('chat');
    } else {
      setViewMode('landing');
    }
  }, [isAuthenticated]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleStartChat = (suggestionTitle) => {
    setViewMode('chat');
    if (typeof suggestionTitle === 'string' && suggestionTitle.trim() !== '') {
      setPrefilledInput(suggestionTitle);
    }
  };

  const handleOpenAuth = () => {
    setAuthModalOpen(true);
  };

  // Triggers when a guest user logs in successfully inside the modal
  const handleAuthSuccess = () => {
    if (pendingMessage.trim() !== '') {
      sendMessage(pendingMessage.trim());
      setPendingMessage('');
    }
  };

  // If in landing mode, show the LandingPage component
  if (viewMode === 'landing') {
    return (
      <div className="min-h-screen font-sans relative">
        {/* Clean White Background */}
        <div className="gradient-bg bg-white" />

        <LandingPage
          onStartChat={handleStartChat}
          onOpenAuth={handleOpenAuth}
        />

        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      </div>
    );
  }

  // If in chat mode, show the Workspace (Sidebar + ChatWindow)
  return (
    <div className="flex h-screen w-screen overflow-hidden font-sans relative transition-colors duration-300">
      {/* Clean White Background */}
      <div className="gradient-bg bg-white" />

      {/* Mobile Sidebar backdrop overlay */}
      {sidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="md:hidden fixed inset-0 z-30 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        />
      )}

      {/* Sidebar Component */}
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={toggleSidebarCollapse}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main Chat Workspace */}
      <div className="flex flex-col flex-grow h-full w-full overflow-hidden">
        <ChatWindow
          onToggleSidebar={toggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
          toggleSidebarCollapse={toggleSidebarCollapse}
          onOpenAuth={handleOpenAuth}
          setPendingMessage={setPendingMessage}
          prefilledInput={prefilledInput}
          setPrefilledInput={setPrefilledInput}
        />
      </div>

      {/* Auth Modal for Sandbox message queuing */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false);
          setPendingMessage(''); // Clear buffered prompt if they cancel
        }}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default Home;
