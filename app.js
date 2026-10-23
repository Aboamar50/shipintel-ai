let currentLang = 'ar';
let activeFilter = 'all';

let shipments = [
    {
        bl: "MSKU-982341",
        container: "MSKU7382910",
        carrier: "Maersk Line",
        origin: "شنغهاي (الصين)",
        dest: "عدن / المكلا",
        eta: "2026-11-02",
        status: "sea",
        statusTextAr: "في الطريق البحري",
        statusTextEn: "In Transit",
        timeline: [
            { titleAr: "مغادرة الميناء", titleEn: "Departed Port", date: "2026-10-15", done: true },
            { titleAr: "في عرض البحر", titleEn: "In Transit", date: "2026-10-20", done: true },
            { titleAr: "الوصول المتوقع للميناء", titleEn: "Expected Arrival", date: "2026-11-02", done: false }
        ]
    },
    {
        bl: "CMAU-441029",
        container: "CMAU1029384",
        carrier: "CMA CGM",
        origin: "جبل علي (دبي)",
        dest: "جدة الإسلامي",
        eta: "2026-10-24",
        status: "customs",
        statusTextAr: "تم الفسح الجمركي",
        statusTextEn: "Customs Cleared",
        timeline: [
            { titleAr: "وصول الميناء", titleEn: "Arrived Port", date: "2026-10-21", done: true },
            { titleAr: "بدء التخليص الجمركي", titleEn: "Customs Inspection", date: "2026-10-22", done: true },
            { titleAr: "جاهز للاستلام", titleEn: "Ready for Pickup", date: "2026-10-24", done: false }
        ]
    },
    {
        bl: "HLCU-109283",
        container: "HLCU5562019",
        carrier: "Hapag-Lloyd",
        origin: "إسطنبول (تركيا)",
        dest: "الحديدة / المكلا",
        eta: "2026-11-10",
        status: "sea",
        statusTextAr: "في الطريق البحري",
        statusTextEn: "In Transit",
        timeline: [
            { titleAr: "تحميل الحاوية", titleEn: "Loaded on Vessel", date: "2026-10-18", done: true },
            { titleAr: "عبور البحر الأحمر", titleEn: "Red Sea Transit", date: "2026-10-28", done: false },
            { titleAr: "الوصول النهائي", titleEn: "Final Delivery", date: "2026-11-10", done: false }
        ]
    },
    {
        bl: "MSCU-883019",
        container: "MSCU9940123",
        carrier: "MSC",
        origin: "صلالة (عمان)",
        dest: "المكلا",
        eta: "2026-10-29",
        status: "sea",
        statusTextAr: "في الطريق البحري",
        statusTextEn: "In Transit",
        timeline: [
            { titleAr: "مغادرة صلالة", titleEn: "Departed Salalah", date: "2026-10-22", done: true },
            { titleAr: "الوصول لميناء المكلا", titleEn: "Arrival Mukalla Port", date: "2026-10-29", done: false }
        ]
    }
];

function renderTable(data = shipments) {
    const tbody = document.getElementById("shipmentsTable");
    if (!tbody) return;
    tbody.innerHTML = "";

    data.forEach((s, index) => {
        const badgeClass = s.status === 'sea' ? 'badge-sea' : 'badge-customs';
        const statusLabel = currentLang === 'ar' ? s.statusTextAr : s.statusTextEn;
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td style="font-weight: bold; color: #fff;">${s.bl}</td>
            <td>${s.container}</td>
            <td class="carrier-tag">${s.carrier || ''}</td>
            <td>${s.origin}</td>
            <td>${s.dest}</td>
            <td>${s.eta}</td>
            <td><span class="badge ${badgeClass}">${statusLabel}</span></td>
            <td>
                <div style="display: flex; gap: 6px;">
                    <button onclick="openTrackingModal(${index})" style="background: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.4); color: #38bdf8; padding: 4px 10px; border-radius: 6px; font-size: 11px; cursor: pointer;">${currentLang === 'ar' ? 'تتبع' : 'Track'}</button>
                    <button onclick="openEditModal(${index})" style="background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.2); color: #fff; padding: 4px 10px; border-radius: 6px; font-size: 11px; cursor: pointer;">${currentLang === 'ar' ? 'تعديل' : 'Edit'}</button>
                    <button onclick="deleteShipment(${index})" style="background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4); color: #ef4444; padding: 4px 10px; border-radius: 6px; font-size: 11px; cursor: pointer;">${currentLang === 'ar' ? 'حذف' : 'Del'}</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function setFilter(type) {
    activeFilter = type;
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    if (type === 'all') document.getElementById("filterAll")?.classList.add("active");
    if (type === 'sea') document.getElementById("filterSea")?.classList.add("active");
    if (type === 'customs') document.getElementById("filterCustoms")?.classList.add("active");

    if (type === 'all') {
        renderTable(shipments);
    } else {
        renderTable(shipments.filter(s => s.status === type));
    }
}

function runFilter() {
    const val = document.getElementById("searchInput").value.toLowerCase().trim();
    const filtered = shipments.filter(s => 
        s.bl.toLowerCase().includes(val) || 
        s.container.toLowerCase().includes(val) || 
        (s.carrier && s.carrier.toLowerCase().includes(val)) ||
        s.origin.toLowerCase().includes(val) ||
        s.dest.toLowerCase().includes(val)
    );
    renderTable(filtered);
}

function trackShipmentAction() {
    runFilter();
}

function openTrackingModal(index) {
    const s = shipments[index];
    const modal = document.getElementById("trackingModal");
    const details = document.getElementById("modalDetails");
    const timeline = document.getElementById("modalTimeline");

    if (!modal) return;

    if (details) {
        details.innerHTML = `
            <div class="detail-item"><span>${currentLang === 'ar' ? 'رقم البوليصة' : 'B/L Number'}</span><strong>${s.bl}</strong></div>
            <div class="detail-item"><span>${currentLang === 'ar' ? 'رقم الحاوية' : 'Container'}</span><strong>${s.container}</strong></div>
            <div class="detail-item"><span>${currentLang === 'ar' ? 'الخط الملاحي' : 'Carrier'}</span><strong>${s.carrier || ''}</strong></div>
            <div class="detail-item"><span>${currentLang === 'ar' ? 'موعد الوصول المتوقع' : 'ETA'}</span><strong>${s.eta}</strong></div>
        `;
    }

    if (timeline) {
        timeline.innerHTML = (s.timeline || []).map(step => `
            <div class="timeline-step ${step.done ? 'completed' : ''}">
                <div class="timeline-title">${currentLang === 'ar' ? step.titleAr : step.titleEn}</div>
                <div class="timeline-desc">${step.date}</div>
            </div>
        `).join("");
    }

    modal.style.display = "flex";
}

function closeTrackingModal() {
    const modal = document.getElementById("trackingModal");
    if (modal) modal.style.display = "none";
}

function openAddModal() {
    const form = document.getElementById("addShipmentForm");
    if (form) form.reset();
    const editIdx = document.getElementById("editIndex");
    if (editIdx) editIdx.value = "-1";
    const modal = document.getElementById("addModal");
    if (modal) modal.style.display = "flex";
}

function openEditModal(index) {
    const s = shipments[index];
    const editIdx = document.getElementById("editIndex");
    if (editIdx) editIdx.value = index;
    if (document.getElementById("fBL")) document.getElementById("fBL").value = s.bl;
    if (document.getElementById("fCont")) document.getElementById("fCont").value = s.container;
    if (document.getElementById("fCarrier")) document.getElementById("fCarrier").value = s.carrier || "Maersk Line";
    if (document.getElementById("fETA")) document.getElementById("fETA").value = s.eta;
    if (document.getElementById("fOrigin")) document.getElementById("fOrigin").value = s.origin;
    if (document.getElementById("fDest")) document.getElementById("fDest").value = s.dest;
    if (document.getElementById("fStatus")) document.getElementById("fStatus").value = s.status;
    const modal = document.getElementById("addModal");
    if (modal) modal.style.display = "flex";
}

function closeAddModal() {
    const modal = document.getElementById("addModal");
    if (modal) modal.style.display = "none";
}

function saveShipment(e) {
    e.preventDefault();
    const editIdx = parseInt(document.getElementById("editIndex").value);
    const stVal = document.getElementById("fStatus").value;
    const newShipment = {
        bl: document.getElementById("fBL").value,
        container: document.getElementById("fCont").value,
        carrier: document.getElementById("fCarrier").value,
        eta: document.getElementById("fETA").value,
        origin: document.getElementById("fOrigin").value,
        dest: document.getElementById("fDest").value,
        status: stVal,
        statusTextAr: stVal === 'sea' ? 'في الطريق البحري' : 'تم الفسح الجمركي',
        statusTextEn: stVal === 'sea' ? 'In Transit' : 'Customs Cleared',
        timeline: [
            { titleAr: "تسجيل الشحنة بالنظام", titleEn: "Registered in System", date: new Date().toISOString().split('T')[0], done: true }
        ]
    };

    if (editIdx >= 0) {
        shipments[editIdx] = newShipment;
    } else {
        shipments.unshift(newShipment);
    }
    closeAddModal();
    renderTable();
}

function deleteShipment(index) {
    if (confirm(currentLang === 'ar' ? 'هل أنت متأكد من حذف هذه الشحنة؟' : 'Are you sure you want to delete this shipment?')) {
        shipments.splice(index, 1);
        renderTable();
    }
}

function exportShipmentsToCSV() {
    let csv = "\uFEFFرقم البوليصة,رقم الحاوية,الخط الملاحي,ميناء المغادرة,ميناء الوصول,موعد الوصول,الحالة\n";
    shipments.forEach(s => {
        csv += `"${s.bl}","${s.container}","${s.carrier || ''}","${s.origin}","${s.dest}","${s.eta}","${s.statusTextAr}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `Shipments_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

window.addEventListener('DOMContentLoaded', ()