document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initPestEncyclopedia();
  initProcessAccordion();
  initSectorTabs();
  initContactForm();
});

/* ==========================================================================
   Navigation & View Switching
   ========================================================================== */
function initNavigation() {
  const navLinks = document.querySelector('.nav-links');

  // Hamburger menu toggle
  const hamburgerBtn = document.getElementById('hamburger-btn');
  if (hamburgerBtn && navLinks) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle('mobile-open');
      document.body.classList.toggle('no-scroll', isOpen);
      hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu when a nav link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
        document.body.classList.remove('no-scroll');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('mobile-open') &&
          !navLinks.contains(e.target) &&
          !hamburgerBtn.contains(e.target)) {
        navLinks.classList.remove('mobile-open');
        document.body.classList.remove('no-scroll');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

/* ==========================================================================
   Pest Encyclopedia (Enciclopedia de Plagas)
   ========================================================================== */
const PESTS_DATA = {
  cucarachas: {
    title: 'Cucarachas (Blattodea)',
    desc: 'Vectores de patógenos que contaminan alimentos y superficies. Prefieren áreas cálidas, húmedas y oscuras como motores de electrodomésticos y desagües.',
    prevention: [
      'Eliminar restos de alimentos e higiene diaria de cocinas.',
      'Sellar grietas y hendiduras en paredes y zócalos.',
      'Instalar mallas mosquiteras y rejillas finas en desagües.',
      'Controlar la humedad y reparar fugas de tuberías.'
    ],
    treatment: 'Aplicación dirigida de geles cebos de alta palatabilidad en zonas críticas (sin necesidad de desocupar el área) y pulverizaciones residuales perimetrales de seguridad.'
  },
  hormigas: {
    title: 'Hormigas (Formicidae)',
    desc: 'Especies excavadoras y coloniales. Aunque algunas son inofensivas, plagas como la hormiga argentina o carpintera pueden dañar estructuras o contaminar áreas limpias.',
    prevention: [
      'Almacenar alimentos dulces y grasas en recipientes herméticos.',
      'Limpiar derrames de jugos o azúcares de forma inmediata.',
      'Podar ramas de árboles que toquen la fachada de la estructura.',
      'Sellar juntas de dilatación y puntos de entrada de cables.'
    ],
    treatment: 'Identificación de senderos de alimentación e inoculación de micro-cebos granulados o gelificados que transportan al nido, destruyendo la colonia desde su reina.'
  },
  aranas: {
    title: 'Arañas (Araneae)',
    desc: 'Depredadores que tejen telas de araña. Destacan por su importancia médica la Loxosceles (araña de rincón) y Latrodectus (viuda negra).',
    prevention: [
      'Sacudir prendas y calzado antes de usarlos si han estado guardados.',
      'Separar las camas de las paredes y limpiar detrás de cuadros y muebles.',
      'Evitar acumular cartón, leña o cacharros en interiores y patios.',
      'Mantener desmalezados los perímetros del hogar.'
    ],
    treatment: 'Tratamiento por aspersión localizada de insecticidas piretroides con alto poder de volteo y residualidad en techos, zócalos, taparrollos y depósitos.'
  },
  mosquitos: {
    title: 'Mosquitos (Culicidae)',
    desc: 'Transmisores de virus graves como el Dengue, Zika y Chikungunya. Su ciclo biológico requiere agua estancada para el desarrollo larvario.',
    prevention: [
      'Eliminar cualquier recipiente que pueda acumular agua (descacharrado).',
      'Renovar diariamente el agua de floreros y bebederos de mascotas.',
      'Colocar mosquiteros en todas las aberturas de ventilación.',
      'Mantener piscinas cloradas y canaletas limpias.'
    ],
    treatment: 'Termoniebla en áreas abiertas de vegetación densa para adultos, combinado con la aplicación de larvicidas biológicos (Bti) en aguas de retención inevitable.'
  },
  roedores: {
    title: 'Roedores (Muridae)',
    desc: 'Portadores de hantavirus, leptospirosis y parásitos. Altamente destructivos para cables, aislamientos y mercancías.',
    prevention: [
      'Mantener la basura en tachos cerrados y elevados.',
      'Cortar el césped perimetral y despejar un cordón sanitario de 1 metro.',
      'Sellar aberturas mayores a 6 mm con malla metálica o lana de acero.',
      'Almacenar alimentos y forraje en silos o contenedores seguros.'
    ],
    treatment: 'Instalación perimetral interna y externa de estaciones de cebado de seguridad (cajas de monitoreo cerradas con llave) que albergan bloques de cebos anticoagulantes de última generación.'
  },
  avispas: {
    title: 'Avispas e Himnópteros',
    desc: 'Insectos sociales con aguijón defensivo. El veneno puede desencadenar reacciones alérgicas severas (shock anafiláctico) en personas sensibles.',
    prevention: [
      'No dejar residuos orgánicos ni botellas de bebidas azucaradas al aire libre.',
      'Revisar cornisas, techos de madera y aleros al comienzo de la primavera.',
      'Tapar grietas en fachadas antes de que inicien nidos.'
    ],
    treatment: 'Tratamiento localizado a primera o última hora del día mediante pulverización directa sobre el avispero y posterior remoción segura de la estructura física del panal.'
  }
};

function initPestEncyclopedia() {
  const cards = document.querySelectorAll('.plaga-card');
  
  // Create Modal elements programmatically if they don't exist
  let modalOverlay = document.querySelector('.modal-overlay');
  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = `
      <div class="modal">
        <button class="modal-close" aria-label="Cerrar">&times;</button>
        <div class="modal-header">
          <div class="modal-icon"></div>
          <div class="modal-title">
            <h3 id="m-title">Nombre de la Plaga</h3>
          </div>
        </div>
        <div class="modal-body">
          <p id="m-desc" style="font-weight: 500; font-size: 1.05rem; color: var(--text); margin-bottom: 1rem;"></p>
          <h4>Medidas de Prevención Recomendadas</h4>
          <ul id="m-prev"></ul>
          <h4>Método de Control Profesional</h4>
          <p id="m-treat" style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.5;"></p>
        </div>
      </div>
    `;
    document.body.appendChild(modalOverlay);
  }

  const modalClose = modalOverlay.querySelector('.modal-close');
  const mTitle = document.getElementById('m-title');
  const mDesc = document.getElementById('m-desc');
  const mPrev = document.getElementById('m-prev');
  const mTreat = document.getElementById('m-treat');
  const mIcon = modalOverlay.querySelector('.modal-icon');

  function openModal(pestKey) {
    const pest = PESTS_DATA[pestKey];
    if (!pest) return;

    mTitle.innerText = pest.title;
    mDesc.innerText = pest.desc;
    mTreat.innerText = pest.treatment;
    
    // Copy the SVG icon from the original card
    const originCard = document.querySelector(`.plaga-card[data-pest="${pestKey}"]`);
    if (originCard) {
      const originalSvg = originCard.querySelector('.plaga-icon-wrapper').innerHTML;
      mIcon.innerHTML = originalSvg;
    }

    // Populate prevention bullets
    mPrev.innerHTML = '';
    pest.prevention.forEach(bullet => {
      const li = document.createElement('li');
      li.innerText = bullet;
      mPrev.appendChild(li);
    });

    modalOverlay.classList.add('active');
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
  }

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const pestKey = card.getAttribute('data-pest');
      openModal(pestKey);
    });
  });

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  
  // Close on Esc key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   FAQ & Process Accordeons
   ========================================================================== */
function initProcessAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all others
      faqItems.forEach(i => i.classList.remove('active'));
      
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   Sector Tabs Switcher
   ========================================================================== */
function initSectorTabs() {
  const tabButtons = document.querySelectorAll('.sector-tab-btn');
  const panes = document.querySelectorAll('.sector-pane');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetSector = btn.getAttribute('data-sector');

      tabButtons.forEach(b => b.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const activePane = document.getElementById(`sector-${targetSector}`);
      if (activePane) activePane.classList.add('active');
    });
  });
}

/* ==========================================================================
   Contact Form Validation & Simulation
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success-msg');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Basic input acquisition
      const name = document.getElementById('c-name').value.trim();
      const email = document.getElementById('c-email').value.trim();
      const msg = document.getElementById('c-message').value.trim();

      if (name === '' || email === '' || msg === '') {
        showToast('Por favor, complete todos los campos obligatorios.', true);
        return;
      }

      // Simulate API submit
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Enviando...';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        form.reset();
        
        if (successMsg) {
          successMsg.style.display = 'block';
          setTimeout(() => {
            successMsg.style.display = 'none';
          }, 6000);
        }
        
        showToast('Solicitud enviada con éxito. Un técnico se contactará en breve.');
      }, 1500);
    });
  }
}

/* ==========================================================================
   Clipboard Copy Utilities & Toast
   ========================================================================== */
function showToast(message, isError = false) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  // Set message and icon
  toast.innerHTML = `
    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none">
      ${isError 
        ? '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>' 
        : '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'}
    </svg>
    <span>${message}</span>
  `;

  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function initColorCopy() {
  const colorCards = document.querySelectorAll('.color-card');
  colorCards.forEach(card => {
    card.addEventListener('click', () => {
      const hex = card.getAttribute('data-hex');
      navigator.clipboard.writeText(hex)
        .then(() => {
          showToast(`Color ${hex} copiado al portapapeles.`);
        })
        .catch(err => {
          console.error('Error al copiar color:', err);
        });
    });
  });
}

function initIconCopy() {
  const iconCards = document.querySelectorAll('.icon-card');
  iconCards.forEach(card => {
    card.addEventListener('click', () => {
      const svgElement = card.querySelector('svg');
      if (svgElement) {
        const svgString = svgElement.outerHTML;
        navigator.clipboard.writeText(svgString)
          .then(() => {
            const name = card.querySelector('.icon-name').innerText;
            showToast(`Icono "${name}" copiado como SVG vectorial.`);
          })
          .catch(err => {
            console.error('Error al copiar icono:', err);
          });
      }
    });
  });

  // Logo copy triggers
  const logoCopyButtons = document.querySelectorAll('.logo-copy-svg');
  logoCopyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.logo-display-card');
      const svg = card.querySelector('svg');
      if (svg) {
        navigator.clipboard.writeText(svg.outerHTML)
          .then(() => {
            const label = card.querySelector('.logo-card-label').innerText;
            showToast(`Logotipo (${label}) copiado al portapapeles.`);
          });
      }
    });
  });
}

/* ==========================================================================
   Mockup Visualizer Section
   ========================================================================== */
function initMockupVisualizer() {
  const options = document.querySelectorAll('.mockup-opt-btn');
  const canvas = document.getElementById('mockup-render-canvas');
  
  const poloColors = {
    black: '#111111',
    navy: '#0A1E3F',
    grey: '#55555A',
    white: '#F5F5F7'
  };

  const truckColors = {
    black: '#111111',
    grey: '#55555A',
    white: '#FFFFFF'
  };

  let activeMockup = 'card'; // card, polo, truck
  let activePoloColor = 'black';
  let activeTruckColor = 'black';

  // SVG Logo Strings to embed inside mockups
  const SVG_LOGO_DARK = `
    <svg viewBox="0 0 320 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(10, 10) scale(0.6)">
        <path d="M50 8L85 18V55C85 75 50 92 50 92C50 92 15 75 15 55V18L50 8Z" stroke="#FFFFFF" stroke-width="4.5" stroke-linejoin="round"/>
        <path d="M50 22L75 36.5V65.5L50 80L25 65.5V36.5L50 22Z" stroke="#0A5CFF" stroke-width="2" stroke-dasharray="3 2" stroke-linejoin="round"/>
        <circle cx="50" cy="51" r="14" stroke="#0A5CFF" stroke-width="2"/>
        <circle cx="50" cy="51" r="6" fill="#0A5CFF"/>
        <line x1="50" y1="31" x2="50" y2="43" stroke="#0A5CFF" stroke-width="2" stroke-linecap="round"/>
        <line x1="50" y1="59" x2="50" y2="71" stroke="#0A5CFF" stroke-width="2" stroke-linecap="round"/>
        <line x1="30" y1="51" x2="42" y2="51" stroke="#0A5CFF" stroke-width="2" stroke-linecap="round"/>
        <line x1="58" y1="51" x2="70" y2="51" stroke="#0A5CFF" stroke-width="2" stroke-linecap="round"/>
      </g>
      <text x="80" y="38" font-family="'Outfit', sans-serif" font-size="28" font-weight="800" fill="#FFFFFF" letter-spacing="1">APEX</text>
      <text x="80" y="58" font-family="'Outfit', sans-serif" font-size="11" font-weight="600" fill="#0A5CFF" letter-spacing="3.5">CONTROL INTEGRAL</text>
    </svg>
  `;

  const SVG_LOGO_LIGHT = `
    <svg viewBox="0 0 320 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(10, 10) scale(0.6)">
        <path d="M50 8L85 18V55C85 75 50 92 50 92C50 92 15 75 15 55V18L50 8Z" stroke="#111111" stroke-width="4.5" stroke-linejoin="round"/>
        <path d="M50 22L75 36.5V65.5L50 80L25 65.5V36.5L50 22Z" stroke="#0A5CFF" stroke-width="2" stroke-dasharray="3 2" stroke-linejoin="round"/>
        <circle cx="50" cy="51" r="14" stroke="#0A5CFF" stroke-width="2"/>
        <circle cx="50" cy="51" r="6" fill="#0A5CFF"/>
        <line x1="50" y1="31" x2="50" y2="43" stroke="#0A5CFF" stroke-width="2" stroke-linecap="round"/>
        <line x1="50" y1="59" x2="50" y2="71" stroke="#0A5CFF" stroke-width="2" stroke-linecap="round"/>
        <line x1="30" y1="51" x2="42" y2="51" stroke="#0A5CFF" stroke-width="2" stroke-linecap="round"/>
        <line x1="58" y1="51" x2="70" y2="51" stroke="#0A5CFF" stroke-width="2" stroke-linecap="round"/>
      </g>
      <text x="80" y="38" font-family="'Outfit', sans-serif" font-size="28" font-weight="800" fill="#111111" letter-spacing="1">APEX</text>
      <text x="80" y="58" font-family="'Outfit', sans-serif" font-size="11" font-weight="600" fill="#0A5CFF" letter-spacing="3.5">CONTROL INTEGRAL</text>
    </svg>
  `;

  const SVG_ISOTIPO_BLUE = `
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 8L85 18V55C85 75 50 92 50 92C50 92 15 75 15 55V18L50 8Z" stroke="#FFFFFF" stroke-width="5" stroke-linejoin="round"/>
      <path d="M50 22L75 36.5V65.5L50 80L25 65.5V36.5L50 22Z" stroke="#0A5CFF" stroke-width="2" stroke-dasharray="3 2" stroke-linejoin="round"/>
      <circle cx="50" cy="51" r="14" stroke="#0A5CFF" stroke-width="2"/>
      <circle cx="50" cy="51" r="6" fill="#0A5CFF"/>
      <line x1="50" y1="31" x2="50" y2="43" stroke="#0A5CFF" stroke-width="2" stroke-linecap="round"/>
      <line x1="50" y1="59" x2="50" y2="71" stroke="#0A5CFF" stroke-width="2" stroke-linecap="round"/>
      <line x1="30" y1="51" x2="42" y2="51" stroke="#0A5CFF" stroke-width="2" stroke-linecap="round"/>
      <line x1="58" y1="51" x2="70" y2="51" stroke="#0A5CFF" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `;

  const SVG_ISOTIPO_DARK = `
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 8L85 18V55C85 75 50 92 50 92C50 92 15 75 15 55V18L50 8Z" stroke="#111111" stroke-width="5" stroke-linejoin="round"/>
      <path d="M50 22L75 36.5V65.5L50 80L25 65.5V36.5L50 22Z" stroke="#0A5CFF" stroke-width="2" stroke-dasharray="3 2" stroke-linejoin="round"/>
      <circle cx="50" cy="51" r="14" stroke="#0A5CFF" stroke-width="2"/>
      <circle cx="50" cy="51" r="6" fill="#0A5CFF"/>
      <line x1="50" y1="31" x2="50" y2="43" stroke="#0A5CFF" stroke-width="2" stroke-linecap="round"/>
      <line x1="50" y1="59" x2="50" y2="71" stroke="#0A5CFF" stroke-width="2" stroke-linecap="round"/>
      <line x1="30" y1="51" x2="42" y2="51" stroke="#0A5CFF" stroke-width="2" stroke-linecap="round"/>
      <line x1="58" y1="51" x2="70" y2="51" stroke="#0A5CFF" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `;

  function renderMockup() {
    canvas.innerHTML = '';
    
    // Select color control elements
    const colorControl = document.getElementById('mockup-color-control');
    const colorLabel = document.getElementById('mockup-color-label');
    const dotsContainer = document.getElementById('mockup-dots');

    if (activeMockup === 'card') {
      // Hide color controls for business card (has standard black layout)
      colorControl.style.display = 'none';

      const card = document.createElement('div');
      card.className = 'mockup-card-front';
      card.innerHTML = `
        <div class="card-logo">${SVG_LOGO_DARK}</div>
        <div class="card-details">
          <div>
            <div class="card-name">Ing. Carlos Mendoza</div>
            <div class="card-title">Consultor Técnico Senior</div>
          </div>
          <div class="card-contact">
            <div>+34 900 123 456</div>
            <div>c.mendoza@apexcontrol.com</div>
            <div>www.apexcontrol.com</div>
          </div>
        </div>
      `;
      canvas.appendChild(card);
    } 
    else if (activeMockup === 'polo') {
      colorControl.style.display = 'flex';
      colorLabel.innerText = 'Color del Uniforme:';
      
      // Build dots
      dotsContainer.innerHTML = '';
      Object.keys(poloColors).forEach(cName => {
        const dot = document.createElement('div');
        dot.className = `color-dot ${activePoloColor === cName ? 'active' : ''}`;
        dot.style.backgroundColor = poloColors[cName];
        dot.setAttribute('title', cName);
        dot.addEventListener('click', () => {
          activePoloColor = cName;
          renderMockup();
        });
        dotsContainer.appendChild(dot);
      });

      const hex = poloColors[activePoloColor];
      const isWhitePolo = activePoloColor === 'white';

      const poloContainer = document.createElement('div');
      poloContainer.className = 'mockup-polo';
      
      // Clean vector polo outline
      poloContainer.innerHTML = `
        <svg class="polo-svg-container" viewBox="0 0 400 450" fill="none" xmlns="http://www.w3.org/2000/svg" style="color: ${hex}">
          <!-- Mangas y hombros -->
          <path d="M60 140 L110 90 L150 110 L140 190 L95 180 Z" fill="currentColor" stroke="#333" stroke-width="2"/>
          <path d="M340 140 L290 90 L250 110 L260 190 L305 180 Z" fill="currentColor" stroke="#333" stroke-width="2"/>
          <!-- Cuerpo Principal -->
          <path d="M120 120 L280 120 L300 420 L100 420 Z" fill="currentColor" stroke="#333" stroke-width="3" stroke-linejoin="round"/>
          <!-- Cuello y solapas -->
          <path d="M160 120 L200 170 L240 120 Z" fill="#ffffff" stroke="#333" stroke-width="2"/>
          <path d="M150 90 L200 120 L250 90 L200 140 Z" fill="${isWhitePolo ? '#111' : '#0A5CFF'}" stroke="#333" stroke-width="2"/>
          <path d="M196 140 L196 190 L204 190 L204 140 Z" fill="#333"/>
        </svg>
        <div class="polo-logo-chest">
          ${isWhitePolo ? SVG_ISOTIPO_DARK : SVG_ISOTIPO_BLUE}
        </div>
      `;
      canvas.appendChild(poloContainer);
    } 
    else if (activeMockup === 'truck') {
      colorControl.style.display = 'flex';
      colorLabel.innerText = 'Color del Vehículo:';

      // Build dots
      dotsContainer.innerHTML = '';
      Object.keys(truckColors).forEach(cName => {
        const dot = document.createElement('div');
        dot.className = `color-dot ${activeTruckColor === cName ? 'active' : ''}`;
        dot.style.backgroundColor = truckColors[cName];
        dot.setAttribute('title', cName);
        dot.addEventListener('click', () => {
          activeTruckColor = cName;
          renderMockup();
        });
        dotsContainer.appendChild(dot);
      });

      const hex = truckColors[activeTruckColor];
      const isWhiteTruck = activeTruckColor === 'white';

      const truckContainer = document.createElement('div');
      truckContainer.className = 'mockup-truck';

      // Clean modern vehicle profile SVG
      truckContainer.innerHTML = `
        <svg class="truck-svg-container" viewBox="0 0 500 280" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Sombra suelo -->
          <ellipse cx="250" cy="225" rx="200" ry="12" fill="rgba(0,0,0,0.15)"/>
          
          <!-- Carrocería principal (color personalizable) -->
          <path d="M50 180 L70 125 L160 120 L220 90 L340 90 L440 125 L450 185 L445 205 L60 205 Z" fill="${hex}" stroke="#222" stroke-width="3" stroke-linejoin="round"/>
          
          <!-- Cristales / Ventanillas -->
          <path d="M225 96 L335 96 L395 125 L290 125 Z" fill="#1C1C1E" stroke="#222" stroke-width="2"/>
          <path d="M168 122 L220 96 L280 96 L280 125 Z" fill="#1C1C1E" stroke="#222" stroke-width="2"/>
          
          <!-- Ruedas -->
          <circle cx="120" cy="205" r="32" fill="#111" stroke="#333" stroke-width="4"/>
          <circle cx="120" cy="205" r="16" fill="#8E8E93" stroke="#222" stroke-width="2"/>
          <circle cx="370" cy="205" r="32" fill="#111" stroke="#333" stroke-width="4"/>
          <circle cx="370" cy="205" r="16" fill="#8E8E93" stroke="#222" stroke-width="2"/>
          
          <!-- Detalles (Faros, Paragolpes) -->
          <path d="M48 180 L56 180 L56 190 L48 190 Z" fill="#FFCC00" stroke="#222"/>
          <path d="M444 140 L448 140 L448 152 L444 152 Z" fill="#FF3B30"/>
          <path d="M50 198 L75 198" stroke="#8E8E93" stroke-width="4" stroke-linecap="round"/>
          <path d="M435 205 L452 205" stroke="#8E8E93" stroke-width="4" stroke-linecap="round"/>
          
          <!-- Decoración azul corporativa (Vinilado) -->
          <path d="M150 203 L280 203 L320 145 L190 145 Z" fill="#0A5CFF" opacity="0.8"/>
        </svg>
        <div class="truck-logo-side">
          ${isWhiteTruck ? SVG_LOGO_LIGHT : SVG_LOGO_DARK}
        </div>
      `;
      canvas.appendChild(truckContainer);
    }
  }

  options.forEach(opt => {
    opt.addEventListener('click', () => {
      options.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      activeMockup = opt.getAttribute('data-item');
      renderMockup();
    });
  });

  // Initial render
  renderMockup();
}
