
import { promises as fs } from 'fs';
import path from 'path';
import ChallengePage from './challenge-page';
import { challenges } from '../data/challenges';



export default async function HomePage() {
  return <ChallengePage challenges={challenges} />;
}
