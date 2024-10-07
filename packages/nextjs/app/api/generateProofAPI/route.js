// app/api/generateProofAPI/route.js

import { NextResponse } from 'next/server';
import { generateProof } from '../../../../backend/generateProof';

export async function POST(request) {
  try {
    const body = await request.json();
    const { input } = body;

    const { proof, publicSignals } = await generateProof(input);

    return NextResponse.json({ proof, publicSignals }, { status: 200 });
  } catch (error) {
    console.error('Error generating proof:', error);
    return NextResponse.json({ error: 'Error generating proof' }, { status: 500 });
  }
}
