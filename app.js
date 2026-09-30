/**
 * CLOVER 7 - Knitted Apparel & T-Shirt Manufacturer Scripts
 * Factory: Tirupur, Tamil Nadu, India
 */

// ── Mobile Menu: Global open/close functions ──────────────────────────
// These are called by onclick="openCloverMobileMenu(event)" / closeCloverMobileMenu(event)
// and also wired up via the DOMContentLoaded listener below.

function openCloverMobileMenu(e) {
  if (e) { e.preventDefault(); e.stopPropagation(); }
  var overlay = document.querySelector('.menu_mobile_overlay');
  var drawer  = document.querySelector('.menu_mobile');
  if (overlay) overlay.classList.add('opened');
  if (drawer)  { drawer.classList.add('opened'); }
  document.body.style.overflow = 'hidden';
}

function closeCloverMobileMenu(e) {
  if (e) { e.preventDefault(); e.stopPropagation(); }
  var overlay = document.querySelector('.menu_mobile_overlay');
  var drawer  = document.querySelector('.menu_mobile');
  if (overlay) overlay.classList.remove('opened');
  if (drawer)  drawer.classList.remove('opened');
  document.body.style.overflow = '';
}

// Expose globally so onclick attributes work
window.openCloverMobileMenu  = openCloverMobileMenu;
window.closeCloverMobileMenu = closeCloverMobileMenu;
// ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. THEME SWITCHER (White B&W default / Dark B&W)
  // ==========================================
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const htmlRoot = document.documentElement;

  // Default to pure White background and Black text theme
  const savedTheme = localStorage.getItem('clover7_theme') || 'light';
  htmlRoot.setAttribute('data-theme', savedTheme);
  updateThemeButtonUI(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('clover7_theme', newTheme);
      updateThemeButtonUI(newTheme);
    });
  }

  function updateThemeButtonUI(theme) {
    if (!themeToggleBtn) return;
    const textSpan = themeToggleBtn.querySelector('.theme-toggle-text');
    if (textSpan) {
      textSpan.textContent = theme === 'light' ? 'Dark Mode' : 'Light Mode';
    }
  }

  // ==========================================
  // 2. MOBILE NAVIGATION DRAWER (Clover 7 drawer)
  // ==========================================
  // Wire up the Elementor hamburger burger button to open the .menu_mobile drawer
  const cloverBurgerBtns = document.querySelectorAll(
    '.sc_layouts_menu_mobile_button_burger a, .menu_mobile_button a, .sc_layouts_menu_mobile_button a'
  );
  cloverBurgerBtns.forEach(function(btn) {
    btn.addEventListener('click', openCloverMobileMenu);
  });

  // Overlay click closes the drawer
  const cloverOverlay = document.querySelector('.menu_mobile_overlay');
  if (cloverOverlay) {
    cloverOverlay.addEventListener('click', closeCloverMobileMenu);
  }

  // Also wire the close button(s) inside the drawer
  const cloverCloseBtns = document.querySelectorAll('.menu_mobile_close, .menu_button_close');
  cloverCloseBtns.forEach(function(btn) {
    btn.addEventListener('click', closeCloverMobileMenu);
  });

  // Close drawer when any nav link inside it is clicked (navigate away)
  const cloverNavLinks = document.querySelectorAll('.menu_mobile_nav_area a');
  cloverNavLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      closeCloverMobileMenu();
    });
  });

  // ── Legacy app.js drawer (id-based) ──
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const drawerClose = document.getElementById('drawerClose');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileDrawerOverlay = document.getElementById('mobileDrawerOverlay');

  function openMobileDrawer() {
    mobileDrawer?.classList.add('active');
    mobileDrawerOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileDrawer() {
    mobileDrawer?.classList.remove('active');
    mobileDrawerOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  mobileNavToggle?.addEventListener('click', openMobileDrawer);
  drawerClose?.addEventListener('click', closeMobileDrawer);
  mobileDrawerOverlay?.addEventListener('click', closeMobileDrawer);

  // Close drawer when any internal link is clicked
  const drawerLinks = document.querySelectorAll('.drawer-link');
  drawerLinks.forEach(link => {
    link.addEventListener('click', closeMobileDrawer);
  });

  // ==========================================
  // 3. SAMPLE REQUEST MODAL
  // ==========================================
  const sampleModal = document.getElementById('sampleModal');
  const sampleModalClose = document.getElementById('sampleModalClose');
  const sampleTriggers = document.querySelectorAll('.open-sample-modal-trigger');
  const modalSampleForm = document.getElementById('modalSampleForm');
  const modalAlert = document.getElementById('modalAlert');

  sampleTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobileDrawer();
      openSampleModal();
    });
  });

  window.openSampleModal = function openSampleModal() {
    const modal = document.getElementById('sampleModal') || sampleModal;
    if (!modal) return;
    modal.style.display = 'flex';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeSampleModal = function closeSampleModal() {
    const modal = document.getElementById('sampleModal') || sampleModal;
    if (!modal) return;
    modal.style.display = 'none';
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  sampleModalClose?.addEventListener('click', window.closeSampleModal);
  sampleModal?.addEventListener('click', (e) => {
    if (e.target === sampleModal) window.closeSampleModal();
  });

    // Captcha Control for Modal Form
    const modalCaptchaControl = setupCaptcha(
      'modalCaptcha',
      'modalCaptchaCheck',
      'modalHumanVerified',
      'modalCaptchaError'
    );

  if (modalSampleForm) {
    modalSampleForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Honeypot check
      const hp = modalSampleForm.querySelector('input[name="modal_tax_id_hp"]');
      if (hp && hp.value) return; // Silent bot reject

      // Human Verification Check (only if captcha element is present in DOM)
      if (modalCaptchaControl && !modalCaptchaControl.isVerified()) {
        modalCaptchaControl.showError('Please check "I\'m not a robot" to continue');
        return;
      }

      const submitBtn = modalSampleForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing Request...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        if (modalAlert) {
          modalAlert.innerHTML = '<i class="fa-solid fa-circle-check"></i> <strong>Sample Request Received!</strong> Our Clover 7 Tirupur sampling team will connect on WhatsApp (+91 95783 28551) within 2 hours.';
          modalAlert.classList.add('show');
        }
        modalSampleForm.reset();
        modalCaptchaControl?.reset();
        setTimeout(() => {
          closeSampleModal();
          modalAlert?.classList.remove('show');
        }, 3500);
      }, 1000);
    });
  }

  // ==========================================
  // 4. FABRIC DETAILS MODAL
  // ==========================================
  const fabricModal = document.getElementById('fabricModal');
  const fabricModalClose = document.getElementById('fabricModalClose');
  const fabricModalContent = document.getElementById('fabricModalContent');

  const FABRIC_DATA = {
    supima: {
      title: "Supima Cotton (American ELS)",
      origin: "Grown exclusively in the American Southwest & California",
      gsmRange: "180 GSM to 320 GSM (Single Jersey & Heavy Interlock)",
      desc: "Supima cotton represents the top 1% of cotton in the world. It features extra-long staple (ELS) fibers that give the yarn twice the tensile strength of regular cotton, preventing pilling and ensuring brilliant dye retention wash after wash.",
      specs: [
        "Extra-long staple (35% longer than standard cotton)",
        "Exceptional natural luster and silken drape",
        "Resistant to fraying, tearing, and shape loss",
        "Best suited for: Luxury streetwear, heavy interlock tees, quiet luxury collections"
      ]
    },
    organic: {
      title: "100% Organic Cotton (GOTS-Grade)",
      origin: "Ethically cultivated non-GMO rain-fed crops",
      gsmRange: "160 GSM to 280 GSM",
      desc: "Grown entirely without toxic pesticides, chemical fertilizers, or genetically modified seeds. Sourced from Global Organic Textile Standard (GOTS) certified spinning mills through eco-conscious dyeing.",
      specs: [
        "Hypoallergenic & gentle on sensitive skin",
        "Sourced from certified organic supply chain partners",
        "Low water and low environmental impact profile",
        "Best suited for: Conscious fashion labels, everyday luxury essentials, babywear"
      ]
    },
    bamboo: {
      title: "Bamboo Cotton Blend",
      origin: "70% Organic Bamboo Fiber / 30% Combed Cotton",
      gsmRange: "190 GSM to 240 GSM",
      desc: "Combines the breathable cooling sensation and silk hand of natural bamboo viscose with the structural stability and strength of combed cotton. Naturally antibacterial and odor-resistant.",
      specs: [
        "Thermal-regulating and ultra-breathable",
        "3x more absorbent than pure cotton",
        "Silky soft handfeel with liquid drape",
        "Best suited for: Athleisure, active polos, premium lounge and travel wear"
      ]
    },
    tencel: {
      title: "Tencel Cotton Blend",
      origin: "Eco-certified Eucalyptus wood pulp blended with combed cotton",
      gsmRange: "180 GSM to 260 GSM",
      desc: "Tencel lyocell fibers are manufactured using a closed-loop solvent spinning process that recycles 99.5% of water and solvent. Blended with cotton to offer smooth fluid drape and cool touch.",
      specs: [
        "Unrivaled moisture management",
        "Wrinkle-resistant and smooth on skin",
        "Sustainably harvested from certified forests",
        "Best suited for: Summer polos, fluid oversized drape tees, resort shirts"
      ]
    },
    suvin: {
      title: "Indian Suvin Cotton",
      origin: "Tamil Nadu, India (The Jewel of Indian Cottons)",
      gsmRange: "180 GSM to 300 GSM",
      desc: "A rare cross between Egyptian Karnak and Sea Island cotton. Suvin has the finest fiber micronaire in the world, enabling micro-gauge spinning for an unmistakably rich, cashmere-soft finish.",
      specs: [
        "Micronaire fineness of 2.8ΓÇô3.0",
        "Superlative yarn luster comparable to raw silk",
        "Unmatched dye absorption yielding deep pitch blacks",
        "Best suited for: Heritage couture, high-end private label fashion"
      ]
    },
    australian: {
      title: "Australian Cotton",
      origin: "Sustainably grown in Australian cotton valleys",
      gsmRange: "180 GSM to 450 GSM (Fleece & French Terry)",
      desc: "Recognized globally for its pristine white fiber, uniform staple length, and minimal contamination. Yields a crisp, consistent finish that accepts screen and puff prints with pinpoint sharpness.",
      specs: [
        "Ultra-clean raw fiber with consistent micronaire",
        "Superior tensile resistance against heavy wash treatments",
        "Optimized for high-density puff, screen, and discharge printing",
        "Best suited for: Heavyweight sweatshirts, graphic streetwear, drop-shoulder tees"
      ]
    },
    mercerized: {
      title: "Mercerized Cotton",
      origin: "Premium combed cotton treated with caustic soda under tension",
      gsmRange: "160 GSM to 280 GSM (Single Jersey & Piqu├⌐)",
      desc: "Mercerized cotton undergoes a chemical treatment process that permanently swells the fiber, improving its luster, dye uptake, and tensile strength. The result is a silky smooth surface with a natural sheen, superior color retention wash after wash.",
      specs: [
        "Natural silk-like luster without synthetic coating",
        "Superior dye absorption yielding vivid, long-lasting colors",
        "Stronger and smoother than untreated cotton",
        "Best suited for: Premium polos, luxury basics, fashion-forward T-shirts"
      ]
    }
  };

  window.openFabricModal = function(fabricKey) {
    const data = FABRIC_DATA[fabricKey];
    if (!data || !fabricModalContent || !fabricModal) return;

    fabricModalContent.innerHTML = `
      <div class="modal-header">
        <div class="badge-disclaimer">FABRIC SPECIFICATION</div>
        <h3 class="modal-title">${data.title}</h3>
        <p class="modal-desc"><i class="fa-solid fa-location-dot"></i> ${data.origin}</p>
      </div>
      <div style="font-size: 0.95rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1.5rem;">
        <p style="margin-bottom: 1rem;">${data.desc}</p>
        <div style="background: var(--bg-surface); padding: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); margin-bottom: 1.25rem;">
          <strong style="color: var(--text-main); font-size: 0.85rem; display: block; margin-bottom: 0.35rem;">AVAILABLE GSM WEIGHTS:</strong>
          <span style="color: var(--text-main); font-weight: 600;">${data.gsmRange}</span>
        </div>
        <strong style="color: var(--text-main); font-size: 0.85rem; display: block; margin-bottom: 0.5rem;">KEY PROPERTIES:</strong>
        <ul style="padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.35rem;">
          ${data.specs.map(s => `<li>${s}</li>`).join('')}
        </ul>
      </div>
      <div style="display: flex; gap: 0.85rem; margin-top: 1.5rem;">
        <button class="btn btn-primary btn-block open-sample-modal-trigger" onclick="document.getElementById('fabricModal').classList.remove('active'); document.body.style.overflow=''; window.openSampleModal();">
          Request Sample Swatch
        </button>
      </div>
    `;

    fabricModal.style.display = 'flex';
    fabricModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeFabricModal = function closeFabricModal() {
    const modal = document.getElementById('fabricModal') || fabricModal;
    if (!modal) return;
    modal.style.display = 'none';
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  fabricModalClose?.addEventListener('click', window.closeFabricModal);

  fabricModal?.addEventListener('click', (e) => {
    if (e.target === fabricModal) {
      window.closeFabricModal();
    }
  });

  // ==========================================
  // 6. MAIN CONTACT / INQUIRY FORM VALIDATION
  // ==========================================
  // 6. CONTACT / RFQ INQUIRY FORM
  // ==========================================
  const inquiryForm = document.getElementById('inquiryForm');
  const formStatusAlert = document.getElementById('formStatusAlert');

  // Captcha Control for Inquiry Form
  const inquiryCaptchaControl = setupCaptcha(
    'inquiryCaptcha',
    'inquiryCaptchaCheck',
    'inquiryHumanVerified',
    'inquiryCaptchaError'
  );

  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Honeypot check
      const hp = inquiryForm.querySelector('input[name="company_tax_id_hp"]');
      if (hp && hp.value) return; // Silent bot reject

      let isValid = true;
      const firstName = document.getElementById('firstName');
      const lastName = document.getElementById('lastName');
      const email = document.getElementById('email');
      const phone = document.getElementById('phone');
      const message = document.getElementById('message');
      const garmentType = document.getElementById('garmentType');

      // Simple validations
      if (firstName && !firstName.value.trim()) {
        const err = document.getElementById('firstNameError');
        if (err) err.textContent = 'First name is required';
        isValid = false;
      } else {
        const err = document.getElementById('firstNameError');
        if (err) err.textContent = '';
      }

      if (lastName && !lastName.value.trim()) {
        const err = document.getElementById('lastNameError');
        if (err) err.textContent = 'Last name is required';
        isValid = false;
      } else {
        const err = document.getElementById('lastNameError');
        if (err) err.textContent = '';
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email && (!email.value.trim() || !emailRegex.test(email.value))) {
        const err = document.getElementById('emailError');
        if (err) err.textContent = 'Valid business email is required';
        isValid = false;
      } else {
        const err = document.getElementById('emailError');
        if (err) err.textContent = '';
      }

      if (phone && !phone.value.trim()) {
        const err = document.getElementById('phoneError');
        if (err) err.textContent = 'Phone / WhatsApp number is required';
        isValid = false;
      } else {
        const err = document.getElementById('phoneError');
        if (err) err.textContent = '';
      }

      if (message && !message.value.trim()) {
        const err = document.getElementById('messageError');
        if (err) err.textContent = 'Please tell us about your required quantity and specs';
        isValid = false;
      } else {
        const err = document.getElementById('messageError');
        if (err) err.textContent = '';
      }

      // Human verification check (only if captcha element is present in DOM)
      if (inquiryCaptchaControl && !inquiryCaptchaControl.isVerified()) {
        inquiryCaptchaControl.showError('Please check "I\'m not a robot" to continue');
        isValid = false;
      }

      if (!isValid) return;

      const submitBtn = document.getElementById('submitBtn');
      const origBtnHtml = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Transmitting Specification...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origBtnHtml;
        
        if (formStatusAlert) {
          formStatusAlert.className = 'form-status-alert success';
          formStatusAlert.innerHTML = `
            <div style="font-size: 1.1rem; margin-bottom: 0.35rem;"><i class="fa-solid fa-circle-check"></i> <strong>Manufacturing Inquiry Submitted!</strong></div>
            <div>Thank you, ${firstName.value}. Our technical apparel merchandiser at our Tirupur factory has received your specs and will follow up within 2 hours.</div>
            <div style="margin-top: 0.85rem;">
              <a href="https://wa.me/919578328551?text=Hi%20Clover%207%20Team%2C%20I%20just%20submitted%20an%20inquiry%20for%20${encodeURIComponent(garmentType ? garmentType.value : 'Custom Apparel')}." 
                 target="_blank" class="btn" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1.25rem; font-size: 0.9rem; font-weight: 600; background: #25d366; color: #ffffff; border-radius: var(--radius-sm); border: none; text-decoration: none;">
                <i class="fa-brands fa-whatsapp" style="font-size: 1.15rem;"></i> Instant Chat on WhatsApp (+91 95783 28551)
              </a>
            </div>
          `;
          formStatusAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        inquiryForm.reset();
        inquiryCaptchaControl?.reset();
      }, 1200);
    });
  }

  // ==========================================
  // Helper: HUMAN VERIFICATION / CAPTCHA CONTROLLER
  // ==========================================
  function setupCaptcha(boxId, checkId, hiddenInputId, errorId) {
    const box = document.getElementById(boxId);
    const hidden = document.getElementById(hiddenInputId);
    const err = document.getElementById(errorId);
    if (!box || !hidden) return null;

    let isVerified = false;
    let isVerifying = false;

    function verify(e) {
      if (e && e.type === 'touchend') {
        e.preventDefault();
      }
      if (isVerified || isVerifying) return;
      isVerifying = true;
      box.classList.remove('captcha-error');
      box.classList.add('verifying');
      if (err) err.textContent = '';

      setTimeout(() => {
        isVerifying = false;
        isVerified = true;
        hidden.value = 'true';
        box.classList.remove('verifying');
        box.classList.add('verified');
        box.setAttribute('aria-checked', 'true');
      }, 250);
    }

    // Touch event listener for mobile devices
    let touchHandled = false;
    box.addEventListener('touchend', (e) => {
      touchHandled = true;
      verify(e);
      setTimeout(() => { touchHandled = false; }, 400);
    }, { passive: false });

    // Standard click listener (with touch duplicate guard)
    box.addEventListener('click', (e) => {
      if (touchHandled) return;
      verify(e);
    });

    box.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        verify(e);
      }
    });

    return {
      isVerified: () => isVerified,
      reset: () => {
        isVerified = false;
        isVerifying = false;
        hidden.value = 'false';
        box.classList.remove('verified', 'verifying', 'captcha-error');
        box.setAttribute('aria-checked', 'false');
      },
      showError: (msg) => {
        box.classList.add('captcha-error');
        if (err) err.textContent = msg || 'Please verify that you are not a robot';
      }
    };
  }

  // ==========================================
  // 7. STICKY HEADER SCROLL SHADOW
  // ==========================================
  const siteHeader = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      siteHeader?.style.setProperty('box-shadow', '0 4px 20px rgba(0,0,0,0.5)');
    } else {
      siteHeader?.style.removeProperty('box-shadow');
    }
  });

});