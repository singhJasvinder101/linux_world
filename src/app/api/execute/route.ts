'use server'

import Docker from 'dockerode';
import { NextRequest, NextResponse } from 'next/server';
import { challenges } from '../../../data/challenges';


const checkImageExists = async (docker: Docker, image: string) => {
  try {
    await docker.getImage(image).inspect();
  } catch (error: any) {
    if (error.statusCode !== 404) {
      throw error;
    }
    await new Promise<void>((resolve, reject) => {
      docker.pull(image, (err: Error | null, stream?: NodeJS.ReadableStream) => {
        
        if (err) return reject(err);

        if (!stream) return reject(new Error("Pull stream not available"));
        
        docker.modem.followProgress(stream, (err: Error | null) => {
          if (err) return reject(err);
          resolve();
        });
      });
    });
  }
};


export async function POST(request: NextRequest) {
  const { command, challengeId } = await request.json();

  if (typeof command !== 'string' || typeof challengeId !== 'number') {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const challenge = challenges[challengeId];

  if (!challenge) {
    return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
  }

  const docker = new Docker();

  await checkImageExists(docker, "alpine:latest");

  try {
    const container = await docker.createContainer({
      Image: "alpine:latest",
      Tty: true,
    });

    
    await container.start();
    

    const exec = await container.exec({
      Cmd: ["/bin/sh", "-c", command], 
      AttachStdout: true,
      AttachStderr: true,
    });

    const stream = await exec.start({ hijack: true, stdin: false });

    let stdout = "";
    let stderr = "";

    stream.on("data", (chunk) => {
      const type = chunk[0];
      const data = chunk.slice(8).toString();
      if (type === 1) stdout += data;
      else if (type === 2) stderr += data;
    });

    await new Promise((resolve) => stream.on("end", resolve));

    await container.remove({ force: true });

    return NextResponse.json({
      success: true,
      stdout,
      stderr,
    });
    
  } catch (error) {
    console.error('Error executing command:', error);
    return NextResponse.json({ error: 'Failed to execute command', details: (error as Error).message }, { status: 500 });
  } 
}