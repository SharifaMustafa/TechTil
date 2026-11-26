'use strict';

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const parts = new Set(['translation', 'meaning', 'explanation', 'questionUg']);
const voiceIdPattern = /^[A-Za-z0-9_-]{1,80}$/;
let lessons;

function getText(id, part) {
  if (!lessons) {
    const dataDirectory = path.join(__dirname, '..', 'dist');
    const source = ['vocabulary.js', 'interview.js', 'lessons.js'].map(file =>
      fs.readFileSync(path.join(dataDirectory, file), 'utf8')
    ).join('\n');
    // Evaluate bundled lesson data only. Requests can select an entry by ID.
    lessons = vm.runInNewContext(source + '\nlessons;', Object.create(null));
  }
  return lessons[id]?.[part];
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({error: 'Use GET'});
  }

  const {id, part} = req.query;
  if (typeof id !== 'string' || !/^(0|[1-9]\d{0,5})$/.test(id) || !parts.has(part)
      || Object.keys(req.query).length !== 2) {
    return res.status(400).json({error: 'Invalid lesson or audio selection'});
  }
  const text = getText(Number(id), part);
  if (!text) return res.status(404).json({error: 'This lesson has no such audio'});

  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID || 'JBFqnCBsd6RMkjVDRZzb';
  if (!apiKey || !voiceIdPattern.test(voiceId)) {
    return res.status(503).json({error: 'ElevenLabs audio is not configured'});
  }

  try {
    const response = await fetch('https://api.elevenlabs.io/v1/text-to-dialogue?output_format=mp3_44100_64', {
      method: 'POST',
      headers: {'xi-api-key': apiKey, 'Content-Type': 'application/json', Accept: 'audio/mpeg'},
      body: JSON.stringify({
        model_id: 'eleven_v4',
        inputs: [{text, voice_id: voiceId}]
      }),
      signal: AbortSignal.timeout(20000)
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      const reason = payload?.detail?.status ?? payload?.detail?.code ?? payload?.error?.code;
      const safeReason = typeof reason === 'string' && /^[a-z][a-z0-9_-]{0,79}$/i.test(reason) ? reason : undefined;
      return res.status(502).json({
        error: 'ElevenLabs could not generate audio',
        providerStatus: response.status,
        providerCode: safeReason
      });
    }
    if (!response.headers.get('content-type')?.startsWith('audio/')) {
      return res.status(502).json({error: 'ElevenLabs returned a non-audio response'});
    }

    const audio = Buffer.from(await response.arrayBuffer());
    if (!audio.length) return res.status(502).json({error: 'ElevenLabs returned empty audio'});
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=604800');
    return res.status(200).send(audio);
  } catch {
    return res.status(502).json({error: 'ElevenLabs audio is unavailable'});
  }
};
