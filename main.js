// wait for html to fully load
document.addEventListener('DOMContentLoaded', () => {
    
  // hardcoded users array
  let users = [
    { username: 'John', password: 'pass1' },
    { username: 'Sarah', password: 'pass2' },
    { username: 'Bob', password: 'pass3' }
  ];

  // elements (singup/login modals, forms, inputs, results)
  const signupModal = document.getElementById('signupModal');
  const signupForm = document.getElementById('signupForm');
  const closeSignup = document.getElementById('closeSignup');
  const emailInput = document.getElementById('signup-email');
  const pwInput = document.getElementById('signup-password');
  const signupResult = document.getElementById('signup-result');
  const checkLen = document.getElementById('signup-len');
  const checkUpper = document.getElementById('signup-upper');
  const checkSpecial = document.getElementById('signup-special');

  const loginModal = document.getElementById('loginModal');
  const closeModal = document.getElementById('closeModal');
  const loginForm = document.getElementById('loginForm');

  const navLinks = document.querySelectorAll('.navlinks a');

  // email and password validation regexes
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const pwLenRegex = /^.{7,}$/;
  const pwUpperRegex = /[A-Z]/;
  const pwSpecialRegex = /[!@#$%^&*()_\-+=[\]{};':"\\|,.<>\/?`~]/;

  // function to validate email and password
  function validateEmail(v) { return emailRegex.test((v||'').trim()); }
  function validatePassword(v) {
    return {
      len: pwLenRegex.test(v),
      upper: pwUpperRegex.test(v),
      special: pwSpecialRegex.test(v)
    };
  }

  function updatePwChecks() {
    const v = pwInput?.value || '';
    const res = validatePassword(v);
    if (checkLen) checkLen.className = res.len ? 'valid' : 'invalid';
    if (checkUpper) checkUpper.className = res.upper ? 'valid' : 'invalid';
    if (checkSpecial) checkSpecial.className = res.special ? 'valid' : 'invalid';
  }

  // navlinks functionality (signup, login, logout)
  if (navLinks && navLinks.length) {
    navLinks.forEach(link => {
      const txt = (link.textContent || '').trim();
      // if signup link clicked show signup modal
      if (txt === 'Signup') {
        link.addEventListener('click', e => {
          e.preventDefault();
          if (signupModal) { signupModal.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
        });
      }
      // if login link clicked show login modal
      if (txt === 'Login') {
        link.addEventListener('click', e => {
          e.preventDefault();
          if (loginModal) { loginModal.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
        });
      }
      // if logout link clicked, show pop out to confirm and logout
      if (txt === 'Logout') {
        link.style.display = 'none';
        link.addEventListener('click', e => {
          e.preventDefault();
          if (confirm('Are you sure you want to logout?')) {
            navLinks.forEach(l => {
              const t = (l.textContent||'').trim();
              if (t === 'Login') l.style.display = '';
             // also show Signup again on logout
             if (t === 'Signup') l.style.display = '';
              if (t.startsWith('Logout')) { l.style.display = 'none'; l.textContent = 'Logout'; }
            });
            alert('You have been logged out.');
          }
        });
      }
    });
}

  // sign up modal
  pwInput?.addEventListener('input', updatePwChecks);

  // close signup modal when clicking close button or outside modal
  if (closeSignup && signupModal) {
    closeSignup.addEventListener('click', () => {
      signupModal.style.display = 'none';
      document.body.style.overflow = '';
    });
  }
  // close signup modal when clicking outside modal content
  if (signupModal) {
    signupModal.addEventListener('click', e => {
      if (e.target === signupModal) { signupModal.style.display = 'none'; document.body.style.overflow = ''; }
    });
  }

  // signup form submit
  if (signupForm) {
    signupForm.addEventListener('submit', e => {
      e.preventDefault();
      if (!signupResult) return;
      signupResult.textContent = '';
      const email = (emailInput?.value || '').trim();
      const pw = pwInput?.value || '';

      // if email invalid, show error message in red
      if (!validateEmail(email)) {
        signupResult.textContent = 'Please enter a valid email address.';
        signupResult.style.color = 'red';
        return;
      }

      // if password invalid, show error message in red
      const pwRes = validatePassword(pw);
      if (!pwRes.len || !pwRes.upper || !pwRes.special) {
        signupResult.textContent = 'Password does not meet requirements.';
        signupResult.style.color = 'red';
        updatePwChecks();
        return;
      }

      // if both email and password ok, print success message in green
      signupResult.textContent = 'Validation passed. You can now login.';
      signupResult.style.color = 'green';

      // close modal after short delay
      setTimeout(() => {
        signupForm.reset();
        updatePwChecks();
        if (signupModal) { signupModal.style.display = 'none'; document.body.style.overflow = ''; }
      }, 700);
    });
  }

  // login modal
  // close login modal when clicking close button or outside modal
  if (closeModal && loginModal) {
    closeModal.addEventListener('click', () => {
      loginModal.style.display = 'none';
      document.body.style.overflow = '';
    });
  }
  // close login modal when clicking outside modal content
  if (loginModal) {
    loginModal.addEventListener('click', e => {
      if (e.target === loginModal) { loginModal.style.display = 'none'; document.body.style.overflow = ''; }
    });
  }

  // login form submit
  if (loginForm) {
        loginForm.addEventListener('submit', e => {
          e.preventDefault();
          const username = (document.getElementById('username')?.value || '').trim();
          const password = (document.getElementById('password')?.value || '').trim();
          // check if user exists in hardcoded users array
          const user = users.find(u => u.username === username && u.password === password);
          if (user) {
            alert(`Login successful! Welcome, ${username}.`);
            // if login successful, close modal and update navlinks (hide login, show logout with username)
            if (loginModal) { loginModal.style.display = 'none'; document.body.style.overflow = ''; }
            navLinks.forEach(link => {
              const t = (link.textContent||'').trim();
              if (t === 'Login') link.style.display = 'none';
             // hide Signup when logged in
             if (t === 'Signup') link.style.display = 'none';
              if (t === 'Logout') { link.style.display = ''; link.textContent = `Logout (${username})`; }
            });
            // if user input invalid, show alert
          } else {
            alert('Invalid username or password. Please try again.');
          }
        });
      }

  // car page filters
  (function initFilters() {
    const priceSelect = document.getElementById('price');
    const seatInputs = document.querySelectorAll('.filters input[name="seats"]');
    const rangeRadios = document.querySelectorAll('.filters input[name="range"]');
    const resetBtn = document.querySelector('.filters button[type="reset"]');
    const form = document.querySelector('.filters form');
    const cards = document.querySelectorAll('.cars-grid .car-card');

    if (!cards || !cards.length || !priceSelect) return;

    // function to parse price range from select value
    function parsePriceRange(value) {
      if (!value) return null;
      if (value.includes('-')) { const [a,b]=value.split('-').map(Number); return {min:a,max:b}; }
      if (value.endsWith('+')) return {min: Number(value.slice(0,-1)), max: Infinity};
      return null;
    }
    // get selected seats as array of numbers from checked checkboxes
    function selectedSeats() { return Array.from(seatInputs).filter(i=>i.checked).map(i=>Number(i.value)); }
    // get range from selected radio buttons
    function selectedRange() {
      const r = document.querySelector('.filters input[name="range"]:checked');
      if (!r) return null;
      switch (r.value) {
        case 'any': return null;
        case 'lte-500': return {min:0,max:500};
        case '500-600': return {min:500,max:600};
        case 'gt-600': return {min:601,max:Infinity};
        default: return null;
      }
    }

    // function to apply filters and update immediately
    function applyFilters(e) {
      if (e && e.type === 'submit') e.preventDefault();
      const priceRange = parsePriceRange(priceSelect.value);
      const seats = selectedSeats();
      const rangeFilter = selectedRange();

      // loop through cards and show or hide based on filters
      cards.forEach(card => {
        const price = Number(card.dataset.price||0);
        const cardSeats = Number(card.dataset.seats||0);
        const carRange = Number(card.dataset.range||0);
        let visible = true;
        // price filter check
        if (priceRange) {
          if (price < priceRange.min || price > priceRange.max) visible = false;
        }
        // seats check
        if (seats.length) {
          if (!seats.includes(cardSeats)) visible = false;
        }
        // range check
        if (rangeFilter) {
          if (typeof rangeFilter.min === 'number' && carRange < rangeFilter.min) visible = false;
          if (typeof rangeFilter.max === 'number' && carRange > rangeFilter.max) visible = false;
        }
        card.style.display = visible ? '' : 'none';
      });
    }

    // event listener for filter changes
    priceSelect.addEventListener('change', applyFilters);
    seatInputs.forEach(i => i.addEventListener('change', applyFilters));
    rangeRadios.forEach(r => r.addEventListener('change', applyFilters));
    if (form) form.addEventListener('submit', applyFilters);
    if (resetBtn) resetBtn.addEventListener('click', ()=> setTimeout(()=>applyFilters(),0));
    applyFilters(); // initial filter application
  })();

   // --- rental cost calculation (inclusive of day of rental) ---
  (function initRentalCost() {
    const msPerDay = 1000 * 60 * 60 * 24;
    // hardcoded daily rates per car model
    const rates = {
      'tesla-model-3': 70,
      'tesla-model-y': 50,
      'tesla-model-x': 55,
      'byd-atto-3': 80,
      'byd-seal': 85,
      'byd-e6': 75
    };

    // set up elements
    const pickupDate = document.getElementById('pickup-date');
    const dropDate = document.getElementById('drop-date');
    const carSelect = document.getElementById('car-model');
    const EstCostEl = document.getElementById('estimated-cost');

    if (!pickupDate || !dropDate || !carSelect || !EstCostEl) return;

    // calculate days between dates (inclusive of first day and last day)
    function daysBetweenInclusive(pick, drop) {
      const p = new Date(pick);
      const d = new Date(drop);
      if (isNaN(p) || isNaN(d)) return 1;
      // normalize to midnight to avoid DST/offset issues
      p.setHours(0,0,0,0);
      d.setHours(0,0,0,0);
      // calculate full day difference and add 1 to count both endpoints (inclusive)
      const diffDays = Math.floor((d - p) / msPerDay);
      return Math.max(1, diffDays + 1);
    }

    // update estimated cost based on selected car and dates
    function updateEstCost() {
      const carKey = carSelect.value;
      const rate = rates[carKey] || 0;
      const days = daysBetweenInclusive(pickupDate.value, dropDate.value);
      const total = rate * days;
      EstCostEl.value = `$${total}`;
    }

    // ensure dropDate cannot be earlier than pickupDate and update min
    pickupDate.addEventListener('change', () => {
      if (pickupDate.value) {
        dropDate.min = pickupDate.value;
        if (dropDate.value && new Date(dropDate.value) < new Date(pickupDate.value)) {
          // set drop to same day as pickup (keeps one inclusive rental day)
          dropDate.value = pickupDate.value;
        }
      }
      updateEstCost();
    });

    // event listener for cost calculation
    dropDate.addEventListener('change', updateEstCost);
    carSelect.addEventListener('change', updateEstCost);

    // initialize defaults and compute initial cost 
    if (!pickupDate.value) {
      pickupDate.value = new Date().toISOString().slice(0,10);
    }
    if (!dropDate.value) {
      const fallback = new Date(Date.now() + 1 * msPerDay);
      dropDate.value = fallback.toISOString().slice(0,10);
    }
    if (pickupDate.value) dropDate.min = pickupDate.value;
    updateEstCost(); // initial cost calculation
  })();

  // reset reservation forms on page load
  (function resetReservationForms() {
    const rentalForm = document.querySelector('.rental-details form');
    const paymentForm = document.querySelector('.payment-info form');
    if (!rentalForm && !paymentForm) return;

    // disable autocomplete + native reset
    [rentalForm, paymentForm].forEach(f => {
      if (!f) return;
      f.autocomplete = 'off';
      f.reset();
    });

    const pickup = document.getElementById('pickup-date');
    const drop = document.getElementById('drop-date');
    const car = document.getElementById('car-model');

    const today = new Date();
    const todayISO = today.toISOString().slice(0,10);
    const tomorrowISO = new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0,10);

    if (pickup) { pickup.value = todayISO; }
    if (drop)   { drop.value = tomorrowISO; drop.min = pickup?.value || todayISO; }
    if (car)    { car.selectedIndex = 0; }

    // notify listeners (updates totals etc.)
    [pickup, drop, car].forEach(el => { if (el) el.dispatchEvent(new Event('change', { bubbles: true })); 
    });
  })();

  // drop-off summary 
  (function initDropoff() {
    const returnForm = document.getElementById('returnForm');
    const reservationInput = document.getElementById('reservation-id');
    const detailsDiv = document.getElementById('reservation-details');
    const noReservationDiv = document.getElementById('no-reservation');

    if (!reservationInput && !returnForm) return;

    // hardcoded reservation data (include numeric cost in initialCostNum and additional fee)
    const mockReservations = {
      'AZ20250001': {
        name: 'John Tan',
        vehicle: 'Tesla Model 3',
        period: '15 Oct 2025 - 18 Oct 2025',
        initialCost: '$210',
        initialCostNum: 210,
        days: 4,
        additional: 0
      },
      'AZ20250002': {
        name: 'Sarah Lim',
        vehicle: 'BYD Atto 3',
        period: '31 Oct 2025 - 5 Nov 2025',
        initialCost: '$270',
        initialCostNum: 270,
        days: 6,
        additional: 50 // minor damage fee
      }
    };

    reservationInput?.addEventListener('input', function () {
      const reservationId = this.value.trim();
      const reservation = mockReservations[reservationId];

      if (reservation) {
        document.getElementById('summary-name').textContent = reservation.name;
        document.getElementById('summary-vehicle').textContent = reservation.vehicle;
        document.getElementById('summary-period').textContent = reservation.period;
        document.getElementById('summary-initial-cost').textContent = reservation.initialCost;
        detailsDiv.style.display = 'block';
        noReservationDiv.style.display = 'none';

        // show additional charges and compute total
        const add = reservation.additional || 0;
        const totalNum = (reservation.initialCostNum || 0) + add;
        const addEl = document.getElementById('summary-additional');
        const totalEl = document.getElementById('summary-total');

        if (addEl) addEl.textContent = add ? ('$' + add) : '-';
        if (totalEl) totalEl.textContent = '$' + totalNum;

        const additionalCharges = document.getElementById('additional-charges');
        if (additionalCharges) additionalCharges.style.display = add ? 'block' : 'none';
      } else if (reservationId.length > 0) {
        detailsDiv.style.display = 'none';
        noReservationDiv.innerHTML = '<p style="color: red;">Reservation not found. Please check your ID.</p>';
        noReservationDiv.style.display = 'block';
      } else {
        detailsDiv.style.display = 'none';
        noReservationDiv.innerHTML = '<p>Enter your reservation ID to view rental details</p>';
        noReservationDiv.style.display = 'block';
      }
    });

    returnForm?.addEventListener('submit', function (e) {
      e.preventDefault();
      const reservationId = (document.getElementById('reservation-id')?.value || '').trim();

      if (!mockReservations[reservationId]) {
        alert('Please enter a valid reservation ID');
        return;
      }

      alert('Vehicle returned successfully. Thank you for using AZoom EV Car Rental, we hope to see you again soon!');

      // reset UI
      returnForm.reset();
      detailsDiv.style.display = 'none';
      noReservationDiv.style.display = 'block';
      noReservationDiv.innerHTML = '<p>Enter your reservation ID to view rental details</p>';
    });
  })();

  // initialise functions when page loads
  updatePwChecks();
});