"""Build the interview vocabulary tracks using the main glossary voice models."""
import argparse
import json
from pathlib import Path
import runpy
import subprocess
import tempfile

audio = runpy.run_path(str(Path(__file__).with_name("generate-pronunciation.py")))
root = audio["ROOT"]

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("uyghur_model", type=Path)
parser.add_argument("english_model", type=Path)
parser.add_argument("english_voices", type=Path)
args = parser.parse_args()

data = json.loads(subprocess.check_output([
    "node", "-e",
    r"const fs=require('node:fs'); eval(fs.readFileSync('dist/interview.js','utf8')+'\nconsole.log(JSON.stringify(interviewVocabulary));')",
], cwd=root))
with tempfile.TemporaryDirectory() as directory:
    temp_dir = Path(directory)
    tracks = {
        "ug": audio["build_audio"](
            "ug", [[entry["translation"]] for entry in data],
            audio["uyghur_synthesizer"](args.uyghur_model), temp_dir, suffix="interview",
        ),
        "en": audio["build_audio"](
            "en", [[entry["term"]] for entry in data],
            audio["english_synthesizer"](args.english_model, args.english_voices),
            temp_dir, [[entry["example"]] for entry in data], suffix="interview",
        ),
    }
(root / "dist/audio/pronunciation-interview.js").write_text(
    "const interviewPronunciation = " + json.dumps(tracks, separators=(",", ":")) + ";\n",
    encoding="utf-8",
)
