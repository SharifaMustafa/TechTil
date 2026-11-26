'use strict';

const interviewLessons = lessons.slice(interviewStart);
const lessonGroups = new Map();
for (const lesson of lessons) {
  if (!lessonGroups.has(lesson.topic)) lessonGroups.set(lesson.topic, []);
  lessonGroups.get(lesson.topic).push(lesson);
}

const pages = {learn:'Lessons', glossary:'Glossary', practice:'Practice'};
const headings = {learn:'دەرسلەر', glossary:'سۆزلۈك', practice:'مەشىق'};
const interviewTopic = 'Job interviews';
const topics = ['All topics','AI','IT','Machine Learning',interviewTopic];
const glossaryPageSize = 24;
const pathSize = 8;
const workspace = document.querySelector('#workspace');
const storageKey = 'techtil-completed-v1';
const speedKey = 'techtil-audio-speed';
let progressAccount = '';

function localKey(key) {
  return progressAccount ? key + ':' + progressAccount : key;
}

function readLocal(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}

function writeLocal(key, value) {
  try { localStorage.setItem(key, value); } catch {}
}

function readLessons(key) {
  try {
    const saved = JSON.parse(readLocal(key));
    return Array.isArray(saved) ? saved.filter(id => Number.isInteger(id) && lessons[id]) : [];
  } catch { return []; }
}

let completed = new Set(readLessons(storageKey));
let page = 'learn';
let topic = topics[0];
let index = lessons.findIndex(lesson => !completed.has(lesson.id));
if (index < 0) index = 0;
let step = 0;
let selected = [];
let search = '';
let glossaryPage = 0;

function filtered() {
  if (topic === topics[0]) return lessons;
  if (topic === interviewTopic) return interviewLessons;
  return lessonGroups.get(topic);
}
const current = () => filtered()[index];
const ug = (value, cls = '') => '<p lang="ug" dir="rtl" class="' + cls + '">' + value + '</p>';
const btn = (action, label, cls = 'secondary', attrs = '') => '<button type="button" class="' + cls + '" data-act="' + action + '" ' + attrs + '>' + label + '</button>';
const spoken = (lesson, part, cls = '') => {
  const lang = part === 'term' ? 'en' : 'ug';
  return btn('sound', '<span>' + lesson[part] + '</span><span class="speaker" aria-hidden="true">◖))</span>',
    'spoken ' + cls, 'data-id="' + lesson.id + '" data-part="' + part + '" lang="' + lang + '" dir="' +
    (lang === 'ug' ? 'rtl' : 'ltr') + '"');
};
const soundStatus = document.querySelector('#sound-status');
const speedControl = document.querySelector('#audio-speed');
const playbackRates = {slow: 0.8, normal: 1, fast: 1.2};
function applySpeed(value) {
  speedControl.value = Object.hasOwn(playbackRates, value) ? value : 'normal';
}
applySpeed(readLocal(speedKey));
speedControl.addEventListener('change', () => {
  writeLocal(localKey(speedKey), speedControl.value);
  window.dispatchEvent(new Event('techtil-speed'));
});

window.techtilProgress = {
  useAccount(id) {
    progressAccount = id;
    completed = new Set(readLessons(localKey(storageKey)));
    applySpeed(readLocal(localKey(speedKey)));
    render();
  },
  completed: () => [...completed],
  merge(ids) {
    for (const id of ids) {
      if (Number.isInteger(id) && lessons[id]) completed.add(id);
    }
    writeLocal(localKey(storageKey), JSON.stringify([...completed]));
    document.querySelector('#score').textContent = completed.size + ' / ' + lessons.length;
    document.querySelector('#progress').value = completed.size;
    const pathList = workspace.querySelector('.path');
    if (pathList) pathList.outerHTML = path();
  },
  guest: () => readLessons(storageKey),
  speed: () => speedControl.value,
  setSpeed(value) {
    applySpeed(value);
    writeLocal(localKey(speedKey), speedControl.value);
  }
};
let playbackRequest = 0;
let soundContext;
let activeSource;
const audioBuffers = new Map();

async function playPronunciation(id, part, request) {
  const language = part === 'translation' ? 'ug' : 'en';
  const isInterview = id >= interviewStart;
  const track = isInterview ? interviewPronunciation[language] : pronunciation[language];
  const trackIndex = isInterview ? id - interviewStart : id;
  const asset = 'audio/' + language + (isInterview ? '-interview.mp3' : '-natural.mp3');
  const rate = playbackRates[speedControl.value] ?? playbackRates.normal;
  soundContext ??= new (window.AudioContext || window.webkitAudioContext)();
  // Resume while the click's user activation is still available.
  await soundContext.resume();
  if (!audioBuffers.has(asset)) {
    if (request === playbackRequest) soundStatus.textContent = 'ئاۋاز يۈكلىنىۋاتىدۇ… · Loading audio…';
    const loading = fetch(asset)
      .then(response => {
        if (!response.ok) throw Error('Audio could not be loaded');
        return response.arrayBuffer();
      })
      .then(bytes => soundContext.decodeAudioData(bytes))
      .catch(error => { audioBuffers.delete(asset); throw error; });
    audioBuffers.set(asset, loading);
  }
  const buffer = await audioBuffers.get(asset);
  if (request !== playbackRequest) return;
  const {segments, entries, examples} = track;
  const sequence = part === 'example' ? examples[trackIndex] : entries[trackIndex];
  let start = soundContext.currentTime + 0.015;
  const sources = sequence.map(segmentId => {
    const [offset, duration] = segments[segmentId];
    const source = soundContext.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = rate;
    source.connect(soundContext.destination);
    source.start(start, offset, duration);
    start += (duration + 0.022) / rate;
    return source;
  });
  activeSource = sources;
  soundStatus.textContent = '';
}

async function playUyghur(item, part, request) {
  const rate = playbackRates[speedControl.value] ?? playbackRates.normal;
  soundContext ??= new (window.AudioContext || window.webkitAudioContext)();
  await soundContext.resume();
  if (request !== playbackRequest) return;

  soundStatus.textContent = 'ئاۋاز يۈكلىنىۋاتىدۇ… · Loading audio…';
  const query = new URLSearchParams({id: item.id, part, v: '2'});
  const response = await fetch('/api/uyghur-speech?' + query);
  if (!response.ok || !response.headers.get('content-type')?.startsWith('audio/')) {
    throw Error('Uyghur audio could not be loaded');
  }

  const buffer = await soundContext.decodeAudioData(await response.arrayBuffer());
  if (request !== playbackRequest) return;
  const source = soundContext.createBufferSource();
  source.buffer = buffer;
  source.playbackRate.value = rate;
  source.connect(soundContext.destination);
  source.start();
  activeSource = [source];
  soundStatus.textContent = '';
}

function readAloud(item, part) {
  const request = ++playbackRequest;
  activeSource?.forEach(source => source.stop());
  activeSource = null;
  soundStatus.textContent = '';
  const playback = part === 'term' || part === 'example'
    ? playPronunciation(item.id, part, request)
    : playUyghur(item, part, request).catch(error => {
      if (part === 'translation' && request === playbackRequest) {
        return playPronunciation(item.id, part, request).then(() => {
          if (request === playbackRequest) soundStatus.textContent = 'زاپاس ئاۋاز قويۇلدى. · Played saved pronunciation.';
        });
      }
      throw error;
    });

  playback.catch(() => {
    if (request === playbackRequest) soundStatus.textContent = 'ئاۋازنى يۈكلىگىلى بولمىدى، قايتا سىناڭ. · Audio unavailable. Try again.';
  });
}

const example = lesson => '<div class="example"><div class="example-head"><span>EXAMPLE · مىسال</span>' + btn('sound', '◖)) Listen', 'sound', 'data-id="' + lesson.id + '" data-part="example" aria-label="Hear the English example"') +
  '</div><p lang="en">' + lesson.example + '</p>' + '<p dir="rtl">' + spoken(lesson, 'meaning') + '</p>' + '</div>';

function lessonExplanation(lesson) {
  const answer = '<p class="definition" lang="en">' + lesson.definition + '</p>' + '<p class="definition" dir="rtl">' + spoken(lesson, 'explanation') + '</p>';
  if (!lesson.question) return answer;
  return '<div class="interview-question"><p class="interview-label">' + lesson.topic + ' · Interview · خىزمەت سۆھبىتى</p>' +
    '<p lang="en">' + lesson.question + '</p>' + '<p dir="rtl">' + spoken(lesson, 'questionUg') + '</p>' +
    '<details><summary>Sample answer · جاۋاب مىسالى</summary>' + answer + '</details></div>';
}

function path() {
  const list = filtered();
  const start = Math.floor(index / pathSize) * pathSize;
  return '<aside class="path"><h3>Lesson words · دەرس سۆزلىرى</h3><div class="wordlist">' +
    list.slice(start, start + pathSize).map((lesson, offset) => {
      const i = start + offset;
      return btn('word', '<span class="number">' + String(i + 1).padStart(2,'0') + '</span><span lang="en">' + lesson.term + '</span>' +
      (completed.has(lesson.id) ? '<span class="done" aria-label="Completed">✓</span>' : ''), 'worditem',
      'data-index="' + i + '" aria-current="' + (i === index) + '"');
    }).join('') + '</div><div class="controls window-controls">' +
    btn('path-page', '‹', 'secondary', 'aria-label="Previous words" data-index="' + (start - pathSize) + '"' + (start ? '' : ' disabled')) +
    '<span>' + (start + 1) + '–' + Math.min(start + pathSize, list.length) + ' / ' + list.length + '</span>' +
    btn('path-page', '›', 'secondary', 'aria-label="Next words" data-index="' + (start + pathSize) + '"' + (start + pathSize < list.length ? '' : ' disabled')) +
    '</div></aside>';
}

function shuffled(items, seed) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const j = seed % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  if (result.length > 1 && result.every((item, i) => item === items[i])) result.push(result.shift());
  return result;
}

function build(lesson) {
  const words = lesson.example.split(' ');
  const order = shuffled(words.map((_, i) => i), lesson.id + 17);
  const token = (id, action) => btn(action, words[id], 'token', 'data-index="' + id + '"');
  return '<h3>Build the sentence</h3>' + ug('تۆۋەندىكى سۆزلەرنى چېكىپ ئىنگلىزچە جۈملە تۈزۈڭ.') + '<p class="hint" dir="rtl">' + spoken(lesson, 'meaning') + '</p>' +
    '<div class="sentence" aria-label="Your sentence">' + (selected.length ? selected.map(id => token(id, 'remove')).join('') : '<span class="definition">Your sentence appears here</span>') +
    '</div><div class="bank" aria-label="Word bank">' + order.filter(id => !selected.includes(id)).map(id => token(id, 'add')).join('') +
    '</div><div class="controls">' + btn('hint','Hint · يىپ ئۇچى') + btn('check','Check · تەكشۈرۈش','primary') + '</div>';
}

function quiz(lesson) {
  const peers = lessonGroups.get(lesson.topic);
  const position = peers.indexOf(lesson);
  const options = [lesson.id, ...[1, 2, 3].map(offset => peers[(position + offset) % peers.length].id)];
  const choices = shuffled(options, lesson.id + 42);
  return '<h3>Fill in the blank</h3>' + ug('بوش ئورۇنغا ماس كېلىدىغان سۆزنى تاللاڭ.') +
    '<div class="example"><p lang="en">' + lesson.example.replace(lesson.blank, '_____') + '</p>' + '<p dir="rtl">' + spoken(lesson, 'meaning') + '</p>' +
    '</div><div class="choices">' + choices.map(id => btn('answer', lessons[id].term, 'choice','data-id="' + id + '"')).join('') + '</div>';
}

function activeLesson() {
  const lesson = current();
  const steps = ['1. Learn','2. Build','3. Quiz'].map((label, i) => btn('step', label,'step' + (step === i ? ' current' : ''), 'data-index="' + i + '" aria-current="' + (step === i ? 'step' : 'false') + '"')).join('');
  const reading = '<h3 class="term">' + spoken(lesson, 'term') + '</h3>' +
    '<div class="translation" dir="rtl">' + spoken(lesson, 'translation') + '</div>' + lessonExplanation(lesson) + example(lesson) + '<div class="controls">' +
    btn('previous','Previous', 'secondary', index ? '' : 'disabled') + btn('build','Build a sentence · جۈملە تۈزۈش','primary') + '</div>';
  return '<div class="grid"><article class="card"><div class="steps" aria-label="Lesson steps">' + steps + '</div>' +
    [() => reading, () => build(lesson), () => quiz(lesson)][step]() + '<p class="feedback" role="status" hidden></p><div class="controls" id="followup" hidden></div></article>' + path() + '</div>';
}

function glossary() {
  const query = search.trim().toLocaleLowerCase();
  const matches = filtered().filter(lesson => [lesson.term, lesson.translation, lesson.definition, lesson.explanation, lesson.question, lesson.questionUg].some(value => value?.toLocaleLowerCase().includes(query)));
  const pages = Math.ceil(matches.length / glossaryPageSize);
  const start = glossaryPage * glossaryPageSize;
  const pagination = '<div class="controls glossary-pages">' +
    btn('glossary-page', 'Previous · ئالدىنقى', 'secondary', 'data-index="' + (glossaryPage - 1) + '"' + (glossaryPage ? '' : ' disabled')) +
    '<span role="status">' + (start + 1) + '–' + Math.min(start + glossaryPageSize, matches.length) + ' / ' + matches.length + '</span>' +
    btn('glossary-page', 'Next · كېيىنكى', 'secondary', 'data-index="' + (glossaryPage + 1) + '"' + (glossaryPage + 1 < pages ? '' : ' disabled')) + '</div>';
  return matches.length ? pagination + '<div class="glossary-grid">' + matches.slice(start, start + glossaryPageSize).map(lesson => '<article class="card"><h3>' + spoken(lesson, 'term') + '</h3>' +
    '<div class="translation" dir="rtl">' + spoken(lesson, 'translation') + '</div>' +
    lessonExplanation(lesson) + example(lesson) +
    '<div class="controls">' + btn('open','Open lesson · دەرسنى ئېچىش','primary','data-id="' + lesson.id + '"') + '</div></article>').join('') + '</div>' :
    '<p role="status">No matching terms · ماس كېلىدىغان سۆز تېپىلمىدى</p>';
}

function render() {
  document.querySelector('#crumb').textContent = pages[page];
  document.querySelector('#score').textContent = completed.size + ' / ' + lessons.length;
  document.querySelector('#progress').max = lessons.length;
  document.querySelector('#progress').value = completed.size;
  document.querySelectorAll('.nav').forEach(button => {
    const active = button.dataset.page === page;
    button.classList.toggle('active', active);
    button.setAttribute('aria-current', active ? 'page' : 'false');
  });
  const filters = topics.map((name, i) => btn('topic', name === interviewTopic ? 'Job interviews · خىزمەت سۆھبىتى' : name, 'topic', 'data-index="' + i + '" aria-pressed="' + (topic === name) + '"')).join('');
  const intro = page === 'learn' ? 'Learn the word, build a sentence, then try a quiz.' : page === 'glossary' ? 'Search in English or Uyghur.' : 'Recall a word and complete the example.';
  workspace.innerHTML = '<div class="sectionhead"><div><h2>' + pages[page] + '</h2><p>' + intro + '</p></div><strong lang="ug" dir="rtl">' +
    headings[page] + '</strong></div><div class="topics" aria-label="Topics">' + filters + '</div>' +
    (page === 'glossary' ? '<input class="search" type="search" aria-label="Search vocabulary" placeholder="Search words · سۆز ئىزدەش"><div class="glossary">' +
      glossary() + '</div>' : page === 'practice' ? '<div class="grid"><article class="card">' + quiz(current()) +
      '<p class="feedback" role="status" hidden></p><div class="controls">' + btn('next','Next question · كېيىنكى سوئال','primary') + '</div></article>' + path() + '</div>' : activeLesson());
  if (page === 'glossary') workspace.querySelector('.search').value = search;
}

function showFeedback(message, tone = '') {
  const feedback = workspace.querySelector('.feedback');
  if (!feedback) return;
  feedback.hidden = false;
  feedback.className = 'feedback ' + tone;
  feedback.textContent = message;
}

function followup(action, label) {
  const target = workspace.querySelector('#followup');
  if (!target) return;
  target.hidden = false;
  target.innerHTML = btn(action, label, 'primary');
}

function setWord(wordIndex, wordStep = 0) {
  index = wordIndex;
  step = wordStep;
  selected = [];
  render();
}

function navigate() {
  const next = location.hash.slice(1);
  if (next === 'interview') {
    page = 'glossary';
    topic = interviewTopic;
    index = 0;
    glossaryPage = 0;
    search = '';
  } else {
    page = Object.hasOwn(pages, next) ? next : 'learn';
  }
  render();
}

window.addEventListener('hashchange', navigate);
document.querySelector('nav').addEventListener('click', event => {
  const button = event.target.closest('[data-page]');
  if (button) location.hash = button.dataset.page;
});
workspace.addEventListener('input', event => {
  if (!event.target.matches('.search')) return;
  search = event.target.value;
  glossaryPage = 0;
  workspace.querySelector('.glossary').innerHTML = glossary();
});
workspace.addEventListener('click', event => {
  const button = event.target.closest('[data-act]');
  if (!button) return;
  const {act, id, part} = button.dataset;
  const targetIndex = Number(button.dataset.index);
  const lesson = current();
  switch (act) {
    case 'topic':
      if (page === 'glossary' && topics[targetIndex] === interviewTopic && location.hash !== '#interview') {
        location.hash = 'interview';
        break;
      }
      if (location.hash === '#interview' && topics[targetIndex] !== interviewTopic) location.hash = 'glossary';
      topic = topics[targetIndex];
      glossaryPage = 0;
      setWord(0);
      break;
    case 'open':
      if (topic !== interviewTopic) {
        topic = lessons[Number(id)].topic;
        glossaryPage = 0;
      }
      index = filtered().findIndex(item => item.id === Number(id));
      step = 0;
      selected = [];
      location.hash = 'learn';
      break;
    case 'word':
    case 'path-page': setWord(targetIndex); break;
    case 'glossary-page':
      glossaryPage = targetIndex;
      workspace.querySelector('.glossary').innerHTML = glossary();
      (workspace.querySelector('[data-act="glossary-page"]:not(:disabled)') || workspace.querySelector('.search')).focus({preventScroll:true});
      break;
    case 'step': setWord(index, targetIndex); break;
    case 'build': setWord(index, 1); break;
    case 'quiz': setWord(index, 2); break;
    case 'previous': setWord(index - 1); break;
    case 'next': setWord((index + 1) % filtered().length, page === 'practice' ? 2 : 0); break;
    case 'add':
    case 'remove':
      selected = act === 'add' ? [...selected, targetIndex] : selected.filter(item => item !== targetIndex);
      render();
      (workspace.querySelector('.bank button') || workspace.querySelector('[data-act=check]')).focus();
      break;
    case 'hint': showFeedback(lesson.example); break;
    case 'check': {
      const words = lesson.example.split(' ');
      if (selected.map(i => words[i]).join(' ') === lesson.example) {
        showFeedback('Correct! · توغرا!', 'good');
        followup('quiz','Try the quiz · سوئالغا جاۋاب بېرىش');
      } else {
        showFeedback(selected.length < words.length ? 'Use all the words. · بارلىق سۆزلەرنى ئىشلىتىڭ.' : 'Check the word order. · سۆز تەرتىپىنى تەكشۈرۈڭ.', 'error');
      }
      break;
    }
    case 'answer':
      if (Number(id) === lesson.id) {
        completed.add(lesson.id);
        writeLocal(localKey(storageKey), JSON.stringify([...completed]));
        window.dispatchEvent(new Event('techtil-completion'));
        document.querySelector('#score').textContent = completed.size + ' / ' + lessons.length;
        document.querySelector('#progress').value = completed.size;
        const pathList = workspace.querySelector('.path');
        pathList.outerHTML = path();
        workspace.querySelectorAll('[data-act=answer]').forEach(choice => { choice.disabled = true; });
        showFeedback('Correct! · توغرا! ' + lesson.example, 'good');
        if (index + 1 < filtered().length) followup('next','Next word · كېيىنكى سۆز');
        else if (page === 'learn') followup('review','Review vocabulary · سۆزلەرنى تەكرارلاش');
      } else {
        showFeedback('Try another word. · باشقا بىر سۆزنى سىناڭ.', 'error');
      }
      break;
    case 'review': location.hash = 'glossary'; break;
    case 'sound': readAloud(lessons[Number(id)], part); break;
  }
});
navigate();
