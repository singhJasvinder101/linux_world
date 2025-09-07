'use client';

import { useState, useRef } from 'react';
import Terminal, { TerminalHandle } from '@/components/Terminal';
import { Challenge } from '../../@types';


interface ChallengePageProps {
  challenges: Challenge[];
}

export default function ChallengePage({ challenges }: ChallengePageProps) {
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const terminalRef = useRef<TerminalHandle>(null);

  console.log(challenges)

  const handleCommand = async (command: string) => {
    if (!command) return;

    setIsLoading(true);
    setFeedback('');
    terminalRef.current?.writeln(`Executing: ${command}${challenges[currentChallengeIndex]?.id}`)

    try {
      console.log(challenges[currentChallengeIndex]?.id)
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command,
          challengeId: currentChallengeIndex
        }),
      });

      const data = await res.json();

      if (data.stdout) {
        terminalRef.current?.writeln(`\x1b[37m${data.stdout.replace(/\n/g, '\r\n')}\x1b[0m`);
      }
      if (data.stderr) {
        terminalRef.current?.writeln(`\x1b[31m${data.stderr.replace(/\n/g, '\r\n')}\x1b[0m`);
      }

      if (data.success) {
        setFeedback('Correct! Well done.');
      } else {
        setFeedback('Not quite. Try again!');
      }

    } catch (error) {
      console.error('Error executing command:', error);
      setFeedback('An error occurred. Please check the console.');
    } finally {
      setIsLoading(false);
      terminalRef.current?.prompt();
    }
  };

  const goToNextChallenge = () => {
    if (currentChallengeIndex < challenges.length - 1) {
      setCurrentChallengeIndex(currentChallengeIndex + 1);
      setFeedback('');
      terminalRef.current?.clear();
      terminalRef.current?.writeln(`Challenge ${currentChallengeIndex + 2}: ${challenges[currentChallengeIndex + 1].title}`);
      terminalRef.current?.prompt();
    }
  };

  const currentChallenge = challenges[currentChallengeIndex];

  if (challenges.length === 0) {
    return <div>Loading challenges...</div>
  }


  return (
    <main className="container mx-auto p-4 font-sans">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-4">
        <h1 className="text-2xl font-bold mb-2">Challenge {currentChallenge?.id}: {currentChallenge?.title}</h1>
        <p className="text-gray-300">{currentChallenge?.description}</p>
      </div>

      <Terminal ref={terminalRef} onCommand={handleCommand} />

      {feedback && (
        <div className={`mt-4 p-4 rounded-lg ${feedback === 'Correct! Well done.' ? 'bg-green-700' : 'bg-red-700'}`}>
          <p className="font-semibold">{feedback}</p>
          {feedback === 'Correct! Well done.' && currentChallengeIndex < challenges.length - 1 && (
            <button
              onClick={goToNextChallenge}
              className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-bold"
            >
              Next Challenge
            </button>
          )}
        </div>
      )}

      {isLoading && <div className="mt-4">Executing...</div>}
    </main>
  );
}