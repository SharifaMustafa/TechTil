"""Build the static pronunciation assets from the glossary.

Run with Python, numpy, torch, transformers, kokoro-onnx, Node and FFmpeg.
Pass the local ixxan/mms-tts-uig-script_arabic-UQSpeech model directory
and the Kokoro v1.0 ONNX and voices files.
"""
import argparse
import json
from pathlib import Path
import re
import subprocess
import tempfile
import wave

import numpy as np

ROOT = Path(__file__).resolve().parents[1]
RATES = {"ug": 16000, "en": 24000}


def read_entries():
    javascript = """
const fs = require('node:fs');
const vm = require('node:vm');
const read = name => fs.readFileSync('dist/' + name, 'utf8');
const lessonSource = read('lessons.js');
const starter = lessonSource.slice(0, lessonSource.indexOf('const interviewStart'));
const extract = `
const plans = {en: [], ug: [], examples: []};
for (const entry of starterLessons) {
  plans.en.push([entry.term]);
  plans.examples.push([entry.example]);
  plans.ug.push([entry.translation]);
}
for (const group of vocabularyGroups) {
  for (const [subjectIndex, [en, ug]] of group.subjects.entries()) {
    for (const [termIndex, [term, translation]] of group.terms.entries()) {
      const [before, after] = contexts[(subjectIndex + termIndex) % contexts.length];
      plans.examples.push([before.trim(), en, term, after.trim()]);
      plans.en.push([en, term]);
      plans.ug.push([ug + 'نىڭ', translation]);
    }
  }
}
console.log(JSON.stringify(plans));`;
vm.runInNewContext(read('vocabulary.js') + starter + extract, {console});
"""
    return json.loads(subprocess.check_output(["node", "-e", javascript], cwd=ROOT))


def uyghur_synthesizer(model_path):
    import torch
    from transformers import AutoTokenizer, VitsModel

    torch.set_num_threads(2)
    torch.manual_seed(42)
    tokenizer = AutoTokenizer.from_pretrained(model_path)
    model = VitsModel.from_pretrained(model_path).eval()
    acronyms = {
        "API": "ئەي پى ئاي", "CPU": "سى پى يۇ", "DNS": "دى ئېن ئېس",
        "IP": "ئاي پى", "IT": "ئاي تى", "AI": "ئەي ئاي", "VPN": "ۋى پى ئېن",
        "HTTP": "ئەيچ تى تى پى", "SQL": "ئېس كىيۇ ئېل",
    }

    def synthesize(text):
        text = re.sub(r'[A-Z]+', lambda match: acronyms[match[0]], text)
        inputs = tokenizer(text, return_tensors="pt")
        with torch.inference_mode():
            result = model(**inputs).waveform[0].numpy()
        return result

    assert model.config.sampling_rate == RATES["ug"]
    return synthesize


def english_synthesizer(model_path, voice_path):
    import onnxruntime
    from kokoro_onnx import Kokoro

    options = onnxruntime.SessionOptions()
    options.intra_op_num_threads = 2
    options.inter_op_num_threads = 1
    session = onnxruntime.InferenceSession(
        str(model_path), sess_options=options, providers=["CPUExecutionProvider"]
    )
    kokoro = Kokoro.from_session(session, str(voice_path))

    def synthesize(text):
        text = re.sub(r"\b[A-Z]{2,}\b", lambda match: " ".join(match[0]), text)
        samples, rate = kokoro.create(text, voice="af_heart", speed=0.98, lang="en-us")
        assert rate == RATES["en"]
        return samples

    return synthesize


def trim(samples, rate):
    active = np.flatnonzero(np.abs(samples) > max(0.001, np.max(np.abs(samples)) * 0.008))
    if not len(active):
        raise ValueError("The synthesizer generated silence")
    return samples[max(0, active[0] - rate // 65):active[-1] + rate // 40]


def build_audio(language, entries, synthesize, temp_dir, examples=(), suffix="natural"):
    rate = RATES[language]
    gap = rate // 5
    ids = dict.fromkeys(text for entry in (*entries, *examples) for text in entry)
    ids = {text: index for index, text in enumerate(ids)}
    clips = []
    offset = 0
    wav = temp_dir / (language + ".wav")
    with wave.open(str(wav), "wb") as output:
        output.setparams((1, 2, rate, 0, "NONE", "not compressed"))
        for index, text in enumerate(ids):
            samples = trim(synthesize(text), rate)
            clips.append([round(offset / rate, 5), round(len(samples) / rate, 5)])
            output.writeframesraw((samples.clip(-1, 1) * 32767).astype("<i2").tobytes())
            output.writeframesraw(bytes(gap * 2))
            offset += len(samples) + gap
            if (index + 1) % 40 == 0:
                print(f"{language}: {index + 1}/{len(ids)} clips", flush=True)
    subprocess.run([
        "ffmpeg", "-nostdin", "-v", "error", "-y", "-i", str(wav),
        "-c:a", "libmp3lame", "-b:a", "48k", str(ROOT / "dist/audio" / (language + "-" + suffix + ".mp3")),
    ], check=True)
    track = {"segments": clips, "entries": [[ids[text] for text in entry] for entry in entries]}
    if examples:
        track["examples"] = [[ids[text] for text in entry] for entry in examples]
    return track


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("uyghur_model", type=Path)
    parser.add_argument("english_model", type=Path)
    parser.add_argument("english_voices", type=Path)
    args = parser.parse_args()
    entries = read_entries()
    with tempfile.TemporaryDirectory() as directory:
        temp_dir = Path(directory)
        pronunciation = {
            "ug": build_audio("ug", entries["ug"], uyghur_synthesizer(args.uyghur_model), temp_dir),
            "en": build_audio(
                "en", entries["en"], english_synthesizer(args.english_model, args.english_voices),
                temp_dir, entries["examples"],
            ),
        }
    (ROOT / "dist/audio/pronunciation-natural.js").write_text(
        "const pronunciation = " + json.dumps(pronunciation, separators=(",", ":")) + ";\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
