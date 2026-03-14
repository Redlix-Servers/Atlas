'use client';

import React, { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

type Message = {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
};

type PortalDev = {
  id: string;
  name: string;
  email: string;
  isPortalActive: boolean;
};

type SocketUser = {
  id: string;
  name: string;
};

export default function DevChatClient({
  token,
  developer,
  allDevelopers,
}: {
  token: string;
  developer: { id: string; name: string; email: string };
  allDevelopers: PortalDev[];
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatOnlineIds, setChatOnlineIds] = useState<Set<string>>(new Set());
  const [input, setInput] = useState('');
  const [connected, setConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<SocketUser[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const CHAT_URL = process.env.NEXT_PUBLIC_CHAT_SERVER_URL || 'http://localhost:4001';
    const socket = io(CHAT_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });
    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => { setConnected(false); setChatOnlineIds(new Set()); });
    socket.on('receive_message', (msg: Message) => setMessages(prev => [...prev, msg]));
    socket.on('online_users', (users: SocketUser[]) => setChatOnlineIds(new Set(users.map(u => u.id))));
    socket.on('developer_typing', (user: SocketUser) =>
      setTypingUsers(prev => prev.find(u => u.id === user.id) ? prev : [...prev, user])
    );
    socket.on('developer_stop_typing', (user: { id: string }) =>
      setTypingUsers(prev => prev.filter(u => u.id !== user.id))
    );
    return () => { socket.disconnect(); };
  }, [token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  const sendMessage = () => {
    if (!input.trim() || !socketRef.current) return;
    socketRef.current.emit('send_message', { text: input.trim() });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    socketRef.current.emit('stop_typing');
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') return sendMessage();
    socketRef.current?.emit('typing');
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => socketRef.current?.emit('stop_typing'), 2000);
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  // Deterministic avatar color per name
  const avatarColor = (name: string) => {
    const palette = [
      '#5865F2', // blurple
      '#eb459e', // fuchsia
      '#57F287', // green
      '#FEE75C', // yellow
      '#ED4245', // red
      '#EB459E', // fuchsia
      '#3BA55C', // dark green
    ];
    let h = 0;
    for (const c of name) h = c.charCodeAt(0) + ((h << 5) - h);
    return palette[Math.abs(h) % palette.length];
  };

  const onlineDevs = allDevelopers.filter(d => chatOnlineIds.has(d.id));
  const activeDevs = allDevelopers.filter(d => !chatOnlineIds.has(d.id) && d.isPortalActive);
  const offlineDevs = allDevelopers.filter(d => !chatOnlineIds.has(d.id) && !d.isPortalActive);

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ fontFamily: "'gg sans', 'Noto Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      {/* ─── Left: Channel / Server Panel ─── */}
      <div className="w-60 flex flex-col shrink-0" style={{ backgroundColor: '#2b2d31' }}>
        {/* Server Header */}
        <div
          className="h-12 flex items-center px-4 border-b cursor-pointer hover:opacity-80 transition-opacity"
          style={{ borderColor: '#1e1f22', boxShadow: '0 1px 0 rgba(0,0,0,0.3)' }}
        >
          <span className="text-white font-bold text-sm flex-1 truncate">Atlas Dev Space</span>
          <svg className="w-4 h-4 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <div className="flex-1 overflow-y-auto py-2 space-y-0.5">
          {/* Channel Category */}
          <div className="flex items-center gap-1 px-4 pt-4 pb-1">
            <svg className="w-3 h-3 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
            <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#949ba4' }}>
              Text Channels
            </span>
          </div>

          {/* Channel Row */}
          <div
            className="flex items-center gap-1.5 mx-2 px-2 py-1.5 rounded cursor-pointer"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
          >
            <span className="text-xl font-light" style={{ color: '#949ba4', lineHeight: 1 }}>#</span>
            <span className="text-sm font-medium" style={{ color: '#dbdee1' }}>atlas-dev-lounge</span>
          </div>
        </div>

        {/* User Pane at Bottom */}
        <div
          className="h-14 flex items-center px-2 gap-2 shrink-0"
          style={{ backgroundColor: '#232428' }}
        >
          <div className="relative shrink-0">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black text-white"
              style={{ backgroundColor: avatarColor(developer.name) }}
            >
              {getInitials(developer.name)}
            </div>
            <span
              className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center"
              style={{ backgroundColor: '#23a559', borderColor: '#232428' }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate" style={{ color: '#dbdee1' }}>{developer.name}</p>
            <p className="text-[9px]" style={{ color: '#949ba4' }}>Developer</p>
          </div>
          <div className="flex gap-1 shrink-0">
            <button className="w-7 h-7 rounded flex items-center justify-center hover:opacity-60 transition-opacity" style={{ color: '#b5bac1' }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
            </button>
            <button className="w-7 h-7 rounded flex items-center justify-center hover:opacity-60 transition-opacity" style={{ color: '#b5bac1' }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* ─── Center: Chat Messages ─── */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: '#313338' }}>
        {/* Channel topbar */}
        <div
          className="h-12 flex items-center px-4 gap-2 shrink-0 border-b"
          style={{ borderColor: '#1e1f22', boxShadow: '0 1px 0 rgba(0,0,0,0.3)' }}
        >
          <span className="text-xl font-light" style={{ color: '#949ba4' }}>#</span>
          <span className="font-bold text-white text-sm">atlas-dev-lounge</span>
          <div className="h-4 w-px mx-2" style={{ backgroundColor: '#3f4147' }}></div>
          <span className="text-xs" style={{ color: '#949ba4' }}>Internal developer broadcast · {allDevelopers.length} members</span>

          {!connected && (
            <div className="ml-auto flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold" style={{ backgroundColor: 'rgba(250,166,26,0.1)', color: '#faa61a' }}>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              Chat server offline — run <code className="font-mono ml-1">npm run chat:dev</code>
            </div>
          )}
        </div>

        {/* Messages list */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-0.5">
          {messages.length === 0 && (
            <div className="flex flex-col items-start gap-2 mb-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: '#5865F2' }}>
                #
              </div>
              <h2 className="text-2xl font-black text-white">Welcome to #atlas-dev-lounge!</h2>
              <p className="text-sm" style={{ color: '#949ba4' }}>This is the start of the Atlas developer team channel.</p>
              <div className="h-px w-full mt-4" style={{ backgroundColor: '#3f4147' }}></div>
            </div>
          )}

          {messages.map((msg, i) => {
            const isOwn = msg.senderId === developer.id;
            const prev = messages[i - 1];
            const grouped = prev && prev.senderId === msg.senderId &&
              (new Date(msg.timestamp).getTime() - new Date(prev.timestamp).getTime()) < 5 * 60 * 1000;

            return (
              <div
                key={msg.id}
                className="flex gap-4 px-2 py-0.5 rounded hover:bg-black/10 group"
                style={{ marginTop: grouped ? 0 : '16px' }}
              >
                {!grouped ? (
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-black text-white shrink-0 mt-0.5"
                    style={{ backgroundColor: avatarColor(msg.senderName) }}
                  >
                    {getInitials(msg.senderName)}
                  </div>
                ) : (
                  <div className="w-10 shrink-0 flex items-center justify-center">
                    <span className="text-[9px] font-mono opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#949ba4' }}>
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                )}

                <div className="flex flex-col flex-1 min-w-0">
                  {!grouped && (
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <span
                        className="text-sm font-semibold hover:underline cursor-pointer"
                        style={{ color: isOwn ? '#fff' : '#dbdee1' }}
                      >
                        {isOwn ? developer.name : msg.senderName}
                      </span>
                      <span className="text-[10px] font-medium" style={{ color: '#949ba4' }}>
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                  )}
                  <p className="text-sm leading-[1.375] break-words" style={{ color: '#dbdee1' }}>
                    {msg.text}
                  </p>
                </div>
              </div>
            );
          })}

          {typingUsers.filter(u => u.id !== developer.id).length > 0 && (
            <div className="flex items-center gap-2 px-4 pb-1">
              <div className="flex gap-0.5">
                {[0, 150, 300].map(delay => (
                  <span
                    key={delay}
                    className="w-1.5 h-1.5 rounded-full animate-bounce"
                    style={{ backgroundColor: '#949ba4', animationDelay: `${delay}ms` }}
                  />
                ))}
              </div>
              <span className="text-xs" style={{ color: '#949ba4' }}>
                <strong style={{ color: '#dbdee1' }}>
                  {typingUsers.filter(u => u.id !== developer.id).map(u => u.name).join(', ')}
                </strong>
                {' '}is typing...
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-4 pb-6 pt-2 shrink-0">
          <div
            className="flex items-center gap-3 rounded-lg px-4 py-3"
            style={{ backgroundColor: '#383a40' }}
          >
            <button className="w-6 h-6 shrink-0 hover:opacity-70 transition-opacity" style={{ color: '#b5bac1' }}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </button>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={connected ? `Message #atlas-dev-lounge` : 'Chat server is offline...'}
              disabled={!connected}
              className="flex-1 bg-transparent text-sm outline-none disabled:opacity-40"
              style={{ color: '#dbdee1' }}
            />
            <button
              onClick={sendMessage}
              disabled={!connected || !input.trim()}
              className="w-6 h-6 shrink-0 disabled:opacity-20 transition-opacity hover:opacity-70"
              style={{ color: input.trim() ? '#5865F2' : '#b5bac1' }}
            >
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ─── Right: Members List (Discord style) ─── */}
      <div className="w-60 shrink-0 overflow-y-auto py-4" style={{ backgroundColor: '#2b2d31' }}>

        {/* In Chat — actively in socket room */}
        {onlineDevs.length > 0 && (
          <div className="px-3 mb-1">
            <p className="text-[11px] font-bold uppercase tracking-wider mb-2 px-2" style={{ color: '#949ba4' }}>
              In Chat — {onlineDevs.length}
            </p>
            {onlineDevs.map(dev => (
              <MemberRow key={dev.id} dev={dev} isSelf={dev.id === developer.id} status="online" avatarColor={avatarColor} getInitials={getInitials} />
            ))}
          </div>
        )}

        {/* Active in Portal */}
        {activeDevs.length > 0 && (
          <div className="px-3 mb-1 mt-4">
            <p className="text-[11px] font-bold uppercase tracking-wider mb-2 px-2" style={{ color: '#949ba4' }}>
              In Portal — {activeDevs.length}
            </p>
            {activeDevs.map(dev => (
              <MemberRow key={dev.id} dev={dev} isSelf={dev.id === developer.id} status="idle" avatarColor={avatarColor} getInitials={getInitials} />
            ))}
          </div>
        )}

        {/* Offline */}
        {offlineDevs.length > 0 && (
          <div className="px-3 mt-4">
            <p className="text-[11px] font-bold uppercase tracking-wider mb-2 px-2" style={{ color: '#949ba4' }}>
              Offline — {offlineDevs.length}
            </p>
            {offlineDevs.map(dev => (
              <MemberRow key={dev.id} dev={dev} isSelf={false} status="offline" avatarColor={avatarColor} getInitials={getInitials} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MemberRow({
  dev,
  isSelf,
  status,
  avatarColor,
  getInitials,
}: {
  dev: PortalDev;
  isSelf: boolean;
  status: 'online' | 'idle' | 'offline';
  avatarColor: (name: string) => string;
  getInitials: (name: string) => string;
}) {
  const dotStyle: Record<string, { bg: string }> = {
    online: { bg: '#23a559' },
    idle: { bg: '#f0b232' },
    offline: { bg: '#80848e' },
  };

  return (
    <div
      className="flex items-center gap-3 px-2 py-1.5 rounded cursor-pointer transition-colors"
      style={{ opacity: status === 'offline' ? 0.5 : 1 }}
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)')}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      <div className="relative shrink-0">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black text-white"
          style={{ backgroundColor: status === 'offline' ? '#36393f' : avatarColor(dev.name) }}
        >
          {getInitials(dev.name)}
        </div>
        <span
          className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2"
          style={{ backgroundColor: dotStyle[status].bg, borderColor: '#2b2d31' }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-medium truncate"
          style={{ color: status === 'offline' ? '#949ba4' : '#dbdee1' }}
        >
          {dev.name}{isSelf ? ' (You)' : ''}
        </p>
      </div>
    </div>
  );
}
