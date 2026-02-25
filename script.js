
  const CLERK_KEY = 'pk_test_c21vb3RoLWxvYnN0ZXItNzguY2xlcmsuYWNjb3VudHMuZGV2JA';
  const overlay = document.getElementById('clerk-overlay');

  ['signInBtn','registerBtn','heroLoginBtn','heroRegisterBtn'].forEach(id => {
    document.getElementById(id).addEventListener('click', () => overlay.classList.add('open'));
  });
  document.getElementById('closeModal').addEventListener('click', () => overlay.classList.remove('open'));
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('open'); });

  function showDashboard(user) {
    document.getElementById('landing').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    overlay.classList.remove('open');
    const email = user?.primaryEmailAddress?.emailAddress
      || (user?.emailAddresses && user.emailAddresses[0]?.emailAddress)
      || 'Player';
    document.getElementById('userEmailDisplay').textContent = email;
  }

  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/@clerk/clerk-js@latest/dist/clerk.browser.js';
  s.async = true;
  s.onload = async () => {
    try {
      const clerk = new window.Clerk(CLERK_KEY);
      await clerk.load();
      if (clerk.user) showDashboard(clerk.user);

      clerk.mountSignIn(document.getElementById('clerk-signin'), {
        routing: 'virtual',
        appearance: {
          variables: {
            colorPrimary: '#f5c400',
            colorBackground: '#111826',
            colorInputBackground: '#1a2236',
            colorInputText: '#e2e8f0',
            colorText: '#e2e8f0',
            colorTextSecondary: '#8896b0',
            borderRadius: '8px',
          },
          elements: { card: { boxShadow: 'none', background: 'transparent' } }
        }
      });

      clerk.addListener(({ user }) => { if (user) showDashboard(user); });

      document.getElementById('signOutBtn').addEventListener('click', async () => {
        await clerk.signOut();
        document.getElementById('landing').style.display = 'block';
        document.getElementById('dashboard').style.display = 'none';
      });
    } catch (err) {
      document.getElementById('clerk-signin').innerHTML =
        `<div style="color:#8896b0;text-align:center;padding:24px;font-size:13px;">
          <p>⚠️ Sign-in unavailable. Ensure this domain is authorized in your Clerk dashboard.</p>
          <p style="color:#e8313a;font-size:11px;margin-top:8px;">${err.message || ''}</p>
        </div>`;
    }
  };
  document.head.appendChild(s);
