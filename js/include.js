// Simple HTML include loader for partials
async function includeHTML() {
  const includeEls = document.querySelectorAll('[data-include]');
  for (const el of includeEls) {
    const file = el.getAttribute('data-include');
    if (!file) continue;
    try {
      const res = await fetch(file);
      if (!res.ok) throw new Error('Failed to load ' + file);
      el.innerHTML = await res.text();
    } catch (err) {
      console.error(err);
    }
  }
}
includeHTML();
