const config = window.techtilSupabase;
if (config?.url && config.publishableKey) {
  connect().catch(() => {
    document.querySelector('#cloud-account').hidden = false;
    document.querySelector('#cloud-sign-in').hidden = true;
    document.querySelector('#cloud-status').textContent = 'Cloud sync unavailable · بۇلۇتقا ئۇلىنىش مۇمكىن بولمىدى.';
  });
}

async function connect() {
  const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.119.2/+esm');
  const client = createClient(config.url, config.publishableKey);
  const progress = window.techtilProgress;
  const panel = document.querySelector('#cloud-account');
  const form = document.querySelector('#cloud-sign-in');
  const userPanel = document.querySelector('#cloud-user');
  const email = document.querySelector('#cloud-email');
  const status = document.querySelector('#cloud-status');
  const importButton = document.querySelector('#cloud-import');
  let userId = '';
  let generation = 0;
  let queued = Promise.resolve();
  let pendingSpeed;
  panel.hidden = false;

  function schedule() {
    const account = userId;
    const revision = generation;
    if (!account) return;
    queued = queued.then(async () => {
      if (revision !== generation) return;
      const cloud = new Set();
      for (let offset = 0; ; offset += 500) {
        const { data, error } = await client.from('lesson_completions').select('lesson_id')
          .eq('user_id', account).order('lesson_id').range(offset, offset + 499);
        if (error) throw error;
        if (revision !== generation) return;
        data.forEach(row => cloud.add(row.lesson_id));
        if (data.length < 500) break;
      }

      progress.merge(cloud);
      const missing = progress.completed().filter(id => !cloud.has(id));
      for (let offset = 0; offset < missing.length; offset += 500) {
        if (revision !== generation) return;
        const { error } = await client.from('lesson_completions').upsert(
          missing.slice(offset, offset + 500).map(lesson_id => ({user_id: account, lesson_id})),
          {onConflict: 'user_id,lesson_id', ignoreDuplicates: true}
        );
        if (error) throw error;
      }

      if (revision !== generation) return;
      if (pendingSpeed) {
        const speed = pendingSpeed;
        const { error } = await client.from('learning_preferences')
          .upsert({user_id: account, playback_speed: speed});
        if (error) throw error;
        if (revision === generation && speed === pendingSpeed) {
          pendingSpeed = undefined;
          try { localStorage.removeItem('techtil-pending-speed:' + account); } catch {}
        }
      } else {
        const { data, error } = await client.from('learning_preferences').select('playback_speed')
          .eq('user_id', account).maybeSingle();
        if (error) throw error;
        if (revision === generation && !pendingSpeed && data) progress.setSpeed(data.playback_speed);
      }
      if (revision === generation) status.textContent = 'Synced · ماسقەدەملەندى';
    }).catch(() => {
      if (revision === generation) status.textContent = 'Saved on this browser. Sync will retry. · نەتىجە بۇ كۆرگۈچتە ساقلاندى.';
    });
  }

  client.auth.onAuthStateChange((event, session) => {
    const account = session?.user?.id ?? '';
    if (account === userId) return;
    generation += 1;
    userId = account;
    pendingSpeed = undefined;
    try { if (account) pendingSpeed = localStorage.getItem('techtil-pending-speed:' + account); } catch {}
    progress.useAccount(account);
    form.hidden = Boolean(account);
    userPanel.hidden = !account;
    document.querySelector('#cloud-email-display').textContent = session?.user?.email ?? '';
    importButton.hidden = !progress.guest().length;
    status.textContent = account ? 'Syncing… · ماسقەدەملەۋاتىدۇ…' : '';
    setTimeout(schedule, 0);
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const button = form.querySelector('button');
    button.disabled = true;
    try {
      const {error} = await client.auth.signInWithOtp({
        email: email.value.trim(),
        options: {emailRedirectTo: location.origin + '/'}
      });
      status.textContent = error ? error.message : 'Check your email for the sign-in link. · كىرىش ئۇلانمىسىنى ئېلخېتىڭىزدىن كۆرۈڭ.';
    } catch {
      status.textContent = 'Could not send the sign-in link. · كىرىش ئۇلانمىسى ئەۋەتىلمىدى.';
    } finally {
      button.disabled = false;
    }
  });
  document.querySelector('#cloud-sign-out').addEventListener('click', async () => {
    try {
      const {error} = await client.auth.signOut({scope: 'local'});
      if (error) throw error;
    } catch {
      status.textContent = 'Could not sign out. · چىقىش مۇمكىن بولمىدى.';
    }
  });
  importButton.addEventListener('click', () => {
    if (!userId) return;
    progress.merge(progress.guest());
    importButton.hidden = true;
    schedule();
  });
  window.addEventListener('techtil-completion', schedule);
  window.addEventListener('online', schedule);
  window.addEventListener('focus', schedule);
  window.addEventListener('techtil-speed', () => {
    if (!userId) return;
    pendingSpeed = progress.speed();
    try { localStorage.setItem('techtil-pending-speed:' + userId, pendingSpeed); } catch {}
    schedule();
  });
}
