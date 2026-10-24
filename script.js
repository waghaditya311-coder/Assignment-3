// ───────────────────────────────────────────────────
// WT Assignment 3 – Electricity Bill Calculator
// Servlet simulation logic (runs client-side)
// ───────────────────────────────────────────────────

// Create floating particles
(function initParticles() {
  const container = document.getElementById('particles');
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (8 + Math.random() * 12) + 's';
    p.style.animationDelay = Math.random() * 10 + 's';
    p.style.width = p.style.height = (2 + Math.random() * 3) + 'px';
    container.appendChild(p);
  }
})();

// Set default month
document.getElementById('billMonth').value = new Date().toISOString().slice(0, 7);

// Tariff configuration
const TARIFFS = {
  residential: {
    slabs: [
      { from: 0,   to: 100, rate: 3.50 },
      { from: 101, to: 300, rate: 5.50 },
      { from: 301, to: 500, rate: 7.00 },
      { from: 501, to: Infinity, rate: 8.50 }
    ],
    fixed: 50,
    label: '🏠 Residential'
  },
  commercial: {
    slabs: [
      { from: 0, to: Infinity, rate: 8.00 }
    ],
    fixed: 200,
    label: '🏢 Commercial'
  },
  industrial: {
    slabs: [
      { from: 0, to: Infinity, rate: 7.50 }
    ],
    fixed: 350,
    label: '🏭 Industrial'
  }
};

function calculateBill(e) {
  e.preventDefault();

  const name = document.getElementById('consumerName').value.trim();
  const consumerNo = document.getElementById('consumerNo').value.trim();
  const meterNo = document.getElementById('meterNo').value.trim();
  const prevReading = parseInt(document.getElementById('prevReading').value);
  const currReading = parseInt(document.getElementById('currReading').value);
  const billMonth = document.getElementById('billMonth').value;
  const category = document.getElementById('category').value;

  if (currReading < prevReading) {
    alert('Current reading must be greater than or equal to previous reading!');
    return false;
  }

  const units = currReading - prevReading;
  const tariff = TARIFFS[category];

  // Calculate slab-wise breakdown
  let remaining = units;
  let energyCharge = 0;
  const slabBreakdowns = [];

  for (const slab of tariff.slabs) {
    if (remaining <= 0) break;
    const slabMax = slab.to === Infinity ? remaining : Math.min(slab.to, remaining > (slab.to - slab.from + 1) ? (slab.to - slab.from + 1) : remaining);
    let unitsInSlab;

    if (slab.to === Infinity) {
      unitsInSlab = remaining;
    } else {
      const slabSize = slab.to - slab.from + 1;
      unitsInSlab = Math.min(remaining, slabSize);
    }

    const charge = unitsInSlab * slab.rate;
    energyCharge += charge;
    slabBreakdowns.push({
      label: slab.to === Infinity ? `${slab.from}+ kWh` : `${slab.from}–${slab.to} kWh`,
      units: unitsInSlab,
      rate: slab.rate,
      charge
    });
    remaining -= unitsInSlab;
  }

  const fixedCharge = tariff.fixed;
  const duty = energyCharge * 0.10;
  const fuelSurcharge = energyCharge * 0.02;
  const total = energyCharge + fixedCharge + duty + fuelSurcharge;

  // Format month
  const [yr, mo] = billMonth.split('-');
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const monthStr = monthNames[parseInt(mo) - 1] + ' ' + yr;

  // Due date (15 days from now)
  const due = new Date();
  due.setDate(due.getDate() + 15);
  const dueStr = due.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  // Populate result
  document.getElementById('rName').textContent = name;
  document.getElementById('rConsumerNo').textContent = consumerNo;
  document.getElementById('rMeterNo').textContent = meterNo;
  document.getElementById('rPeriod').textContent = monthStr;
  document.getElementById('rCategory').textContent = tariff.label;
  document.getElementById('rPrev').textContent = prevReading + ' kWh';
  document.getElementById('rCurr').textContent = currReading + ' kWh';
  document.getElementById('rUnits').textContent = units + ' kWh';
  document.getElementById('rEnergy').textContent = '₹' + energyCharge.toFixed(2);
  document.getElementById('rFixed').textContent = '₹' + fixedCharge.toFixed(2);
  document.getElementById('rDuty').textContent = '₹' + duty.toFixed(2);
  document.getElementById('rFuel').textContent = '₹' + fuelSurcharge.toFixed(2);
  document.getElementById('rTotal').textContent = '₹' + total.toFixed(2);
  document.getElementById('totalAmount').textContent = '₹' + total.toFixed(2);
  document.getElementById('dueDate').textContent = 'Due by ' + dueStr;

  // Slab breakdown
  const slabHtml = slabBreakdowns.map(s => `
    <div class="bill-row">
      <span>${s.label} × ${s.units} units @ ₹${s.rate.toFixed(2)}</span>
      <span>₹${s.charge.toFixed(2)}</span>
    </div>
  `).join('');
  document.getElementById('slabBreakdown').innerHTML = slabHtml;

  // Show result card
  document.getElementById('resultCard').style.display = 'block';
  document.getElementById('resultCard').scrollIntoView({ behavior: 'smooth', block: 'start' });

  return false;
}

function resetForm() {
  document.getElementById('billForm').reset();
  document.getElementById('resultCard').style.display = 'none';
  document.getElementById('billMonth').value = new Date().toISOString().slice(0, 7);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showTab(tab) {
  const tabs = document.querySelectorAll('.code-tab');
  tabs.forEach(t => t.classList.remove('active'));

  if (tab === 'servlet') {
    document.getElementById('servletCode').style.display = 'block';
    document.getElementById('webxmlCode').style.display = 'none';
    tabs[0].classList.add('active');
  } else {
    document.getElementById('servletCode').style.display = 'none';
    document.getElementById('webxmlCode').style.display = 'block';
    tabs[1].classList.add('active');
  }
}
