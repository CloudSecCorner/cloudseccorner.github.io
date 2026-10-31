// Progressive enhancements matching KubeDaily architecture
// Reading-width preference persists across visits.
const readingToggle = document.querySelector('[data-reading-toggle]');
if (readingToggle) {
  const label = readingToggle.querySelector('span');
  readingToggle.hidden = false;
  const apply = wide => {
    document.body.classList.toggle('kube-wide-reading', wide);
    label.textContent = wide ? 'wide' : 'standard';
    readingToggle.setAttribute('aria-pressed', String(wide));
    try { localStorage.setItem('csc-reading-width', wide ? 'wide' : 'standard'); } catch {}
  };
  let wide = false;
  try { wide = localStorage.getItem('csc-reading-width') === 'wide'; } catch {}
  apply(wide);
  readingToggle.addEventListener('click', () => apply(!document.body.classList.contains('kube-wide-reading')));
}

// All cards remain available when JavaScript is disabled. Client-side library filter.
for (const library of document.querySelectorAll('[data-content-library]')) {
  const input = library.querySelector('[data-library-search]');
  const cards = [...library.querySelectorAll('[data-library-card]')];
  const contents = cards.map(card => card.textContent.toLocaleLowerCase());
  const controls = library.querySelector('[data-library-controls]');
  if (controls) controls.hidden = false;
  if (input) {
    input.addEventListener('input', () => {
      const words = input.value.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
      let visible = 0;
      cards.forEach((card, i) => {
        const matches = words.every(word => contents[i].includes(word));
        card.hidden = !matches;
        if (matches) visible++;
      });
      const countEl = library.querySelector('[data-library-count]');
      if (countEl) countEl.textContent = `${visible} of ${cards.length} shown`;
      const emptyEl = library.querySelector('[data-library-empty]');
      if (emptyEl) emptyEl.hidden = visible !== 0;
    });
  }
}

// Active navigation highlight
const path = location.pathname.replace(/\/$/, "") || "/";
for (const link of document.querySelectorAll('.kube-nav-link')) {
  const target = new URL(link.href, location.origin).pathname.replace(/\/$/, "") || "/";
  if (target === path || (target !== "/" && path.startsWith(target + "/"))) {
    link.classList.add('bg-purple', 'text-white', 'shadow-sm');
    link.classList.remove('hover:bg-white', 'hover:text-purple');
  }
}
for (const link of document.querySelectorAll('.kube-dropdown-link')) {
  const target = new URL(link.href, location.origin).pathname.replace(/\/$/, "") || "/";
  if (target === path || (target !== "/" && path.startsWith(target + "/"))) {
    link.classList.add('bg-purple-100', 'text-purple-700', 'dark:bg-[#44354f]', 'dark:text-[#c4b5fd]');
  }
}

// Code block copy buttons
const status = document.createElement("p");
status.className = "kube-copy-status";
status.setAttribute("role", "status");
status.setAttribute("aria-live", "polite");
if (document.querySelector('.kube-markdown pre')) document.querySelector('main')?.append(status);
for (const pre of document.querySelectorAll('.kube-markdown pre')) {
  const code = pre.querySelector('code');
  if (!code || !navigator.clipboard) continue;
  const wrapper = document.createElement('div');
  wrapper.className = 'kube-code-wrapper relative';
  pre.before(wrapper); wrapper.append(pre);
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'kube-copy-code absolute right-2 top-2 px-2.5 py-1 text-xs font-semibold rounded bg-slate-700/80 text-white hover:bg-slate-600 transition';
  button.textContent = 'Copy code';
  button.setAttribute('aria-label', 'Copy this code block');
  wrapper.prepend(button);
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(code.textContent);
      button.textContent = 'Copied';
      status.textContent = 'Code copied. Review it before running in a disposable environment.';
    } catch {
      button.textContent = 'Select code to copy';
      status.textContent = 'Clipboard unavailable. Select the code and copy manually.';
    }
    setTimeout(() => { button.textContent = 'Copy code'; }, 2500);
  });
}

// Theme toggle
const themeToggleBtn = document.getElementById('theme-toggle');
const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

const themeToggleMobileBtn = document.getElementById('theme-toggle-mobile');
const themeToggleMobileDarkIcon = document.getElementById('theme-toggle-mobile-dark-icon');
const themeToggleMobileLightIcon = document.getElementById('theme-toggle-mobile-light-icon');

function updateThemeIcons() {
  const isDark = document.documentElement.classList.contains('dark');
  if (themeToggleDarkIcon && themeToggleLightIcon) {
    if (isDark) {
      themeToggleDarkIcon.classList.add('hidden');
      themeToggleLightIcon.classList.remove('hidden');
    } else {
      themeToggleDarkIcon.classList.remove('hidden');
      themeToggleLightIcon.classList.add('hidden');
    }
  }
  if (themeToggleMobileDarkIcon && themeToggleMobileLightIcon) {
    if (isDark) {
      themeToggleMobileDarkIcon.classList.add('hidden');
      themeToggleMobileLightIcon.classList.remove('hidden');
    } else {
      themeToggleMobileDarkIcon.classList.remove('hidden');
      themeToggleMobileLightIcon.classList.add('hidden');
    }
  }
}
updateThemeIcons();

const handleThemeToggle = () => {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateThemeIcons();
};

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', handleThemeToggle);
}
if (themeToggleMobileBtn) {
  themeToggleMobileBtn.addEventListener('click', handleThemeToggle);
}

// Desktop Architectures Dropdown
const desktopArchToggle = document.getElementById('desktop-architectures-toggle');
const desktopArchMenu = document.getElementById('desktop-architectures-menu');
const desktopArchChevron = document.getElementById('desktop-architectures-chevron');
const desktopArchWrapper = desktopArchToggle?.closest('.kube-desktop-dropdown-wrapper');

function openDesktopArchitecturesDropdown() {
  if (!desktopArchMenu) return;
  desktopArchMenu.classList.add('is-open');
  desktopArchMenu.classList.remove('hidden');
  desktopArchToggle?.setAttribute('aria-expanded', 'true');
  desktopArchChevron?.classList.add('rotate-180');
}

function closeDesktopArchitecturesDropdown() {
  if (!desktopArchMenu) return;
  desktopArchMenu.classList.remove('is-open');
  desktopArchMenu.classList.add('hidden');
  desktopArchToggle?.setAttribute('aria-expanded', 'false');
  desktopArchChevron?.classList.remove('rotate-180');
}

function toggleDesktopArchitecturesDropdown() {
  if (!desktopArchMenu) return;
  if (desktopArchMenu.classList.contains('is-open')) {
    closeDesktopArchitecturesDropdown();
  } else {
    openDesktopArchitecturesDropdown();
  }
}

if (desktopArchToggle) {
  desktopArchToggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleDesktopArchitecturesDropdown();
  });
}

if (desktopArchWrapper) {
  let closeTimeout;
  desktopArchWrapper.addEventListener('mouseenter', () => {
    clearTimeout(closeTimeout);
    openDesktopArchitecturesDropdown();
  });
  desktopArchWrapper.addEventListener('mouseleave', () => {
    closeTimeout = setTimeout(() => {
      closeDesktopArchitecturesDropdown();
    }, 150);
  });
}

for (const link of document.querySelectorAll('#desktop-architectures-menu a')) {
  link.addEventListener('click', closeDesktopArchitecturesDropdown);
}

// Mobile Dropdown attached directly below navbar
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileDropdown = document.getElementById('mobile-dropdown-menu');
const mobileBackdrop = document.getElementById('mobile-dropdown-backdrop');
const hamburgerIcon = document.getElementById('mobile-menu-hamburger-icon');
const closeIcon = document.getElementById('mobile-menu-close-icon');

function closeMobileDropdown() {
  if (!mobileDropdown) return;
  mobileDropdown.classList.remove('is-open');
  mobileDropdown.classList.add('hidden');
  mobileBackdrop?.classList.remove('is-open');
  mobileBackdrop?.classList.add('hidden');
  mobileMenuToggle?.setAttribute('aria-expanded', 'false');
  hamburgerIcon?.classList.remove('hidden');
  closeIcon?.classList.add('hidden');
}

function openMobileDropdown() {
  if (!mobileDropdown) return;
  mobileDropdown.classList.add('is-open');
  mobileDropdown.classList.remove('hidden');
  mobileBackdrop?.classList.add('is-open');
  mobileBackdrop?.classList.remove('hidden');
  mobileMenuToggle?.setAttribute('aria-expanded', 'true');
  hamburgerIcon?.classList.add('hidden');
  closeIcon?.classList.remove('hidden');
}

function toggleMobileDropdown() {
  if (!mobileDropdown) return;
  if (mobileDropdown.classList.contains('is-open')) {
    closeMobileDropdown();
  } else {
    openMobileDropdown();
  }
}

if (mobileMenuToggle) {
  mobileMenuToggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleMobileDropdown();
  });
}

if (mobileBackdrop) {
  mobileBackdrop.addEventListener('click', closeMobileDropdown);
}

document.addEventListener('click', (e) => {
  if (desktopArchMenu && desktopArchMenu.classList.contains('is-open')) {
    if (desktopArchWrapper && !desktopArchWrapper.contains(e.target)) {
      closeDesktopArchitecturesDropdown();
    }
  }
  if (!mobileDropdown || !mobileDropdown.classList.contains('is-open')) return;
  const header = document.querySelector('.kube-site-header');
  if (header && !header.contains(e.target)) {
    closeMobileDropdown();
  }
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeDesktopArchitecturesDropdown();
    closeMobileDropdown();
  }
});

for (const link of document.querySelectorAll('#mobile-dropdown-menu a')) {
  link.addEventListener('click', closeMobileDropdown);
}
