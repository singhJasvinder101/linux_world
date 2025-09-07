'use client';

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

interface TerminalProps {
  onCommand: (command: string) => void;
}

export interface TerminalHandle {
  write: (text: string) => void;
  writeln: (text: string) => void;
  prompt: () => void;
  clear: () => void;
}

const TerminalComponent = forwardRef<TerminalHandle, TerminalProps>(({ onCommand }, ref) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const term = useRef<Terminal | null>(null);
  const fitAddon = useRef(new FitAddon());
  const command = useRef('');

  useEffect(() => {
    if (terminalRef.current && !term.current) {
      const xterm = new Terminal({
        cursorBlink: true,
        convertEol: true,
        fontFamily: `Consolas, 'Courier New', monospace`,
        fontSize: 15,
        theme: {
          background: '#1e1e1e',
          foreground: '#d4d4d4',
        }
      });
      term.current = xterm;

      xterm.loadAddon(fitAddon.current);
      xterm.open(terminalRef.current);
      fitAddon.current.fit();

      xterm.onKey(({ key, domEvent }) => {
        const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

        if (domEvent.keyCode === 13) { // for Enter
          if (command.current.length > 0) {
            xterm.write('\r\n');
            onCommand(command.current);
            command.current = '';
          } else {
            (xterm as any).prompt();
          }
        } else if (domEvent.keyCode === 8) { // for Backspace
          if (command.current.length > 0) {
            xterm.write('\b \b');
            command.current = command.current.slice(0, -1);
          }
        } else if (printable) {
          command.current += key;
          xterm.write(key);
        }
      });

      (xterm as any).prompt = () => {
        xterm.write('\r\n\x1b[1;32mlinux-world\x1b[0m:\x1b[1;34m~\x1b[0m$ ');
      };
      
      xterm.writeln('Welcome to Linux World!');
    }

    const handleResize = () => {
        fitAddon.current.fit();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [onCommand]);

  useImperativeHandle(ref, () => ({
    write: (text) => {
      term.current?.write(text);
    },
    writeln: (text) => {
      term.current?.writeln(text);
    },
    prompt: () => {
      (term.current as any)?.prompt();
    },
    clear: () => {
      term.current?.clear();
    }
  }));

  return <div ref={terminalRef} className="w-full h-[50vh] p-2 bg-[#1e1e1e] rounded-b-lg" />;
});

TerminalComponent.displayName = 'TerminalComponent';
export default TerminalComponent;