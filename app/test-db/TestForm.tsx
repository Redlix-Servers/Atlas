'use client';

import { useState, useTransition } from 'react';
import { submitTestMessage } from './actions';

export function TestForm() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim()) return;

    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await submitTestMessage(formData);
      if (res.error) {
        setStatus({ type: 'error', text: res.error });
      } else {
        setStatus({ type: 'success', text: 'Message saved successfully!' });
        setMessage('');
      }
    });
  };

  return (
    <div className="w-full max-w-md mx-auto bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl backdrop-blur-sm">
      <h2 className="text-2xl font-bold mb-6 text-white text-center">Write to the Database</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="message" className="sr-only">Test Message</label>
          <input
            type="text"
            id="message"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter a test message..."
            className="w-full bg-zinc-950 border border-zinc-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zinc-400 transition-all placeholder:text-zinc-500"
            disabled={isPending}
          />
        </div>
        
        {status && (
          <p className={`text-sm text-center ${status.type === 'error' ? 'text-red-400' : 'text-emerald-400'}`}>
            {status.text}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending || !message.trim()}
          className="w-full bg-white text-black font-semibold rounded-xl py-3 hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : 'Save Data'}
        </button>
      </form>
    </div>
  );
}
