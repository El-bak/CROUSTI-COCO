/* ============================================================
   CROUSTI COCO — script.js
   Utilisé par : tous les fichiers HTML
   ============================================================ */

/* ── EmailJS (optionnel — configurez sur emailjs.com) ──
   Remplacez les 3 valeurs ci-dessous :
   - YOUR_PUBLIC_KEY   → Account > Public Key
   - YOUR_SERVICE_ID   → Email Services > Service ID
   - YOUR_TEMPLATE_ID  → Email Templates > Template ID
   --------------------------------------------------------- */
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';

try { emailjs.init(EMAILJS_PUBLIC_KEY); } catch(e) {}


/* ── Curseur personnalisé ──────────────────────────────── */
const cur = document.getElementById('c');
const crr = document.getElementById('cr');

if (cur && crr) {
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cur.style.left = mx + 'px';
    cur.style.top  = my + 'px';
  });

  (function loop() {
    rx += (mx - rx) * .12;
    ry += (my - ry) * .12;
    crr.style.left = rx + 'px';
    crr.style.top  = ry + 'px';
    requestAnimationFrame(loop);
  })();

  document.querySelectorAll('a, button, input, textarea, select, .card, .hero-card, .garantie-card, .sortie-card')
    .forEach(el => {
      el.addEventListener('mouseenter', () => { cur.classList.add('grow'); crr.classList.add('grow'); });
      el.addEventListener('mouseleave', () => { cur.classList.remove('grow'); crr.classList.remove('grow'); });
    });
}


/* ── Navbar scroll ─────────────────────────────────────── */
const navEl = document.getElementById('nav');
if (navEl) {
  window.addEventListener('scroll', () => {
    navEl.classList.toggle('scrolled', window.scrollY > 40);
  });
}


/* ── Menu mobile ───────────────────────────────────────── */
const menuBtn = document.getElementById('mt');
const navList = document.getElementById('nl');
if (menuBtn && navList) {
  menuBtn.addEventListener('click', () => navList.classList.toggle('open'));
  // Fermer quand on clique sur un lien
  navList.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navList.classList.remove('open'));
  });
}


/* ── Animations au scroll (reveal) ────────────────────── */
function reveal() {
  document.querySelectorAll('.rv:not(.in)').forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 50) {
      el.classList.add('in');
    }
  });
}
window.addEventListener('scroll', reveal, { passive: true });
// Déclencher aussi au chargement (éléments déjà visibles)
setTimeout(reveal, 150);


/* ── Formulaire de contact (Contact.html uniquement) ───── */
const form = document.getElementById('cForm');
if (form) {
  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const sb = document.getElementById('sb');
    const st = document.getElementById('st');
    const si = document.getElementById('si');

    const prenom = document.getElementById('fp').value.trim();
    const nom    = document.getElementById('fn').value.trim();
    const email  = document.getElementById('fe').value.trim();
    const tel    = document.getElementById('ft').value.trim() || 'Non renseigné';
    const subj   = document.getElementById('fs').value;
    const msg    = document.getElementById('fm').value.trim();

    sb.disabled = true;
    st.textContent = 'Envoi en cours...';
    si.textContent = '⏳';

    const params = {
      from_name:  prenom + ' ' + nom,
      from_email: email,
      from_tel:   tel,
      subject:    subj,
      message:    msg,
      reply_to:   email
    };

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params);
      form.style.display = 'none';
      document.getElementById('fok').style.display = 'block';
    } catch (err) {
      // Fallback : ouvre le client mail natif avec tout pré-rempli
      const body = `Expéditeur : ${prenom} ${nom}\nEmail : ${email}\nTél : ${tel}\nObjet : ${subj}\n\n${msg}`;
      window.location.href =
        `mailto:said.choudjay@crousticoco.com` +
        `?subject=${encodeURIComponent('[CroustiCoco] ' + subj + ' — ' + prenom + ' ' + nom)}` +
        `&body=${encodeURIComponent(body)}`;
      sb.disabled = false;
      st.textContent = 'Envoyer le message';
      si.textContent = '→';
    }
  });
}
