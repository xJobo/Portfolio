// mode sombre
const themeToggle = document.getElementById('themeToggle');
const htmlEl = document.documentElement;

const saved = localStorage.getItem('theme');
if (saved) htmlEl.setAttribute('data-theme', saved);

themeToggle.addEventListener('click', () => {
    const current = htmlEl.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    htmlEl.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
});


// terminal kali
(function initTerminal() {
    const body = document.getElementById('terminalBody');
    if (!body) return;

    const lines = [
        { prompt: 'kali@jordan:~$ ', cmd: 'nmap -sV 192.168.1.0/24', delay: 60 },
        { out: 'Starting Nmap 7.94 ( https://nmap.org )' },
        { out: 'Discovered open port 22/tcp on 192.168.1.1' },
        { out: 'Discovered open port 80/tcp on 192.168.1.1' },
        { out: 'Discovered open port 443/tcp on 192.168.1.5' },
        { out: 'Nmap done: 256 hosts scanned in 4.28s' },
        { prompt: 'kali@jordan:~$ ', cmd: 'msfconsole -q', delay: 80 },
        { out: 'msf6 > search eternalblue' },
        { out: '[*] 3 results for eternalblue' },
        { prompt: 'msf6 > ', cmd: 'use exploit/windows/smb/ms17_010', delay: 50 },
        { out: '[*] Using configured payload windows/x64/meterpreter/reverse_tcp' },
        { prompt: 'msf6 exploit(ms17_010) > ', cmd: 'set RHOSTS 192.168.1.5', delay: 40 },
        { prompt: 'msf6 exploit(ms17_010) > ', cmd: 'exploit', delay: 70 },
        { out: '[*] Started reverse TCP handler on 192.168.1.100:4444' },
        { out: '[+] Session 1 opened at 2026-04-24 14:00:03' },
    ];

    let lineIdx = 0;
    let charIdx = 0;
    let currentDiv = null;

    function typeLine() {
        if (lineIdx >= lines.length) {
            const cursor = document.createElement('span');
            cursor.className = 't-cursor';
            body.appendChild(cursor);
            return;
        }

        const line = lines[lineIdx];

        if (line.out) {
            const div = document.createElement('div');
            div.innerHTML = '<span class="t-out">' + line.out + '</span>';
            body.appendChild(div);
            body.scrollTop = body.scrollHeight;
            lineIdx++;
            setTimeout(typeLine, 300 + Math.random() * 200);
            return;
        }

        if (!currentDiv) {
            currentDiv = document.createElement('div');
            currentDiv.innerHTML = '<span class="t-prompt">' + line.prompt + '</span><span class="t-cmd"></span>';
            body.appendChild(currentDiv);
            charIdx = 0;
        }

        const cmdSpan = currentDiv.querySelector('.t-cmd');
        if (charIdx < line.cmd.length) {
            cmdSpan.textContent += line.cmd[charIdx];
            charIdx++;
            body.scrollTop = body.scrollHeight;
            setTimeout(typeLine, (line.delay || 50) + Math.random() * 30);
        } else {
            currentDiv = null;
            lineIdx++;
            setTimeout(typeLine, 600);
        }
    }

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            observer.disconnect();
            setTimeout(typeLine, 500);
        }
    }, { threshold: 0.3 });
    observer.observe(body.closest('.terminal-wrap'));
})();


// couleur des icones au hover
document.querySelectorAll('.tech-icon').forEach(item => {
    const color = item.getAttribute('data-color');
    const icon = item.querySelector('i') || item.querySelector('svg');
    if (!icon || !color) return;

    item.addEventListener('mouseenter', () => {
        icon.style.color = color;
    });
    item.addEventListener('mouseleave', () => {
        icon.style.color = '';
    });
});


// tilt 3d cartes
document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotateX = ((y - cy) / cy) * -4;
        const rotateY = ((x - cx) / cx) * 4;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        card.style.setProperty('--mouse-x', (x / rect.width * 100) + '%');
        card.style.setProperty('--mouse-y', (y / rect.height * 100) + '%');
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.setProperty('--mouse-x', '50%');
        card.style.setProperty('--mouse-y', '50%');
    });
});


// reveal au scroll
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


// nav scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
});


// menu mobile
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
    });
});


// smooth scroll ancres
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.getBoundingClientRect().top + window.scrollY - 60,
                behavior: 'smooth'
            });
        }
    });
});