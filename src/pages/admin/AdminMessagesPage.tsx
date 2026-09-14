import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, User, ChevronRight } from 'lucide-react';
import { store } from '../../lib/store';
import { Project, Message } from '../../types';

export const AdminMessagesPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(store.getProjects());
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatText, setChatText] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setProjects(store.getProjects());
      if (selectedProjectId) {
        setMessages(store.getMessages(selectedProjectId));
      }
    });
    return () => unsubscribe();
  }, [selectedProjectId]);

  useEffect(() => {
    if (selectedProjectId) {
      setMessages(store.getMessages(selectedProjectId));
    }
  }, [selectedProjectId]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatText.trim() || !selectedProjectId) return;

    store.sendMessage(
      selectedProjectId,
      chatText.trim(),
      'admin',
      'NSK Engineering Lead',
      'admin-1'
    );
    setChatText('');
  };

  return (
    <div className="rounded-3xl bg-white border border-slate-200/90 shadow-card overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[600px] animate-in fade-in duration-200">
      
      {/* Left List of Projects */}
      <div className="border-r border-slate-100 flex flex-col h-full bg-slate-50/50">
        <div className="p-4 border-b border-slate-100 bg-white">
          <h3 className="font-extrabold text-slate-900 text-sm">Project Communication Threads</h3>
          <p className="text-[11px] text-slate-400">Direct client chat per project</p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {projects.map(p => (
            <div
              key={p.id}
              onClick={() => setSelectedProjectId(p.id)}
              className={`p-4 cursor-pointer transition-all ${
                selectedProjectId === p.id ? 'bg-blue-50/80 border-l-4 border-blue-600' : 'hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-bold text-[10px] text-blue-600">{p.request_code}</span>
                <span className="text-[10px] font-bold text-slate-400">{p.status}</span>
              </div>
              <div className="font-bold text-xs text-slate-900 truncate">{p.project_title}</div>
              <div className="text-[11px] text-slate-500 truncate">{p.client_name} ({p.client_email})</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Chat Console */}
      <div className="md:col-span-2 flex flex-col h-full bg-white">
        {selectedProject ? (
          <>
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div>
                <span className="font-mono text-xs font-bold text-blue-600">{selectedProject.request_code}</span>
                <h4 className="font-bold text-sm text-slate-900">{selectedProject.project_title}</h4>
                <p className="text-[11px] text-slate-500">Client: {selectedProject.client_name} • {selectedProject.client_email}</p>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/20">
              {messages.length === 0 ? (
                <div className="py-20 text-center text-xs text-slate-400">
                  No messages yet. Send a message to start communicating with the client.
                </div>
              ) : (
                messages.map(m => {
                  const isMe = m.sender_role === 'admin';
                  return (
                    <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className="text-[10px] font-bold text-slate-400 mb-0.5 px-1">
                        {m.sender_name} ({m.sender_role}) • {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isMe 
                          ? 'bg-blue-600 text-white rounded-tr-none shadow-sm' 
                          : 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-none shadow-subtle'
                      }`}>
                        {m.message}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatBottomRef}></div>
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-slate-100 flex gap-2">
              <input
                type="text"
                value={chatText}
                onChange={e => setChatText(e.target.value)}
                placeholder={`Message ${selectedProject.client_name}...`}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
            Select a project thread to start chatting.
          </div>
        )}
      </div>

    </div>
  );
};
