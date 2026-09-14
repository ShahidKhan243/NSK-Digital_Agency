import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ProjectDetailView } from '../../components/portal/ProjectDetailView';
import { store } from '../../lib/store';

export const ProjectWorkspacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const currentUser = store.getCurrentUser();
  if (!currentUser) {
    return (
      <div className="pt-36 pb-24 text-center max-w-md mx-auto px-4 space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Sign In Required</h2>
        <p className="text-xs text-slate-500">Please sign in to access your project workspace, deliverables, and communication channel.</p>
        <Link 
          to="/login" 
          className="inline-block px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors"
        >
          Sign In to Portal
        </Link>
      </div>
    );
  }

  if (!id) {
    return (
      <div className="pt-36 pb-24 text-center">
        <p className="text-slate-500">Invalid project URL.</p>
        <Link to="/dashboard" className="text-blue-600 font-bold underline text-xs">Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-gradient-to-b from-slate-50 via-white to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProjectDetailView
          projectId={id}
          currentUser={currentUser}
          onBack={() => navigate(currentUser.role === 'admin' ? '/admin' : '/dashboard')}
        />
      </div>
    </div>
  );
};
