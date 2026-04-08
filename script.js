const SERVER_URL = "https://feedback-monitor-production.up.railway.app"; 
const API_KEY = "LND-5fa94ba3b6d86cc2d4beb51bf160fb8f;

let DEVICE_ID = localStorage.getItem('liand_device_id');
if (!DEVICE_ID) {
    DEVICE_ID = 'DEV-' + Math.random().toString(36).substr(2, 9) + Date.now();
    localStorage.setItem('liand_device_id', DEVICE_ID);
}

let currentProjectId = ""; 
let currentProjectName = "";
let isEditMode = false;    

function timeAgo(dateString) {
    const date = new Date(dateString);
    const seconds = Math.round((new Date() - date) / 1000);
    if (seconds < 60) return "Baru saja";
    if (seconds < 3600) return `${Math.round(seconds/60)} menit lalu`;
    if (seconds < 86400) return `${Math.round(seconds/3600)} jam lalu`;
    return date.toLocaleDateString('id-ID');
}

function renderStars(rating) {
    if (!rating) return '';
    let starsHtml = '';
    for(let i=1; i<=5; i++) { 
        starsHtml += i <= rating ? '<i class="fa-solid fa-star" style="color: #f59e0b;"></i>' : '<i class="fa-regular fa-star" style="color: #d1d5db;"></i>'; 
    }
    return starsHtml;
}

function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function showError(message, inputElement = null) {
    const reviewErrorMessage = document.getElementById('reviewErrorMessage');
    if(reviewErrorMessage) {
        reviewErrorMessage.textContent = message;
        reviewErrorMessage.style.display = 'block';
    }
    if(inputElement) {
        inputElement.classList.add('input-error');
        inputElement.focus();
    }
}

function hideError() {
    const reviewErrorMessage = document.getElementById('reviewErrorMessage');
    if(reviewErrorMessage) reviewErrorMessage.style.display = 'none';
    document.getElementById('reviewerName')?.classList.remove('input-error');
    document.getElementById('reviewText')?.classList.remove('input-error');
}

try {
    if(document.getElementById("typing")) {
        new Typed("#typing", {
            strings: [
                "Hai saya Liand al haq, selamat datang di website personal saya untuk melihat serta menilai proyek dan pengalaman saya.",
                "LiandHub — All my projects, links, and work in one place, instantly accessible.",
                "Ready to craft modern web experiences. Mari terhubung dan ciptakan sesuatu yang luar biasa bersama!"
            ],
            typeSpeed: 60,
            backSpeed: 50,
            backDelay: 2500,
            loop: false
        });
    }
} catch(e) { console.warn("Typed.js belum termuat."); }

const themeBtn = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
if (themeBtn && themeIcon) {
    themeBtn.addEventListener("click", e => {
        e.preventDefault();
        document.body.classList.toggle("dark-mode");
        if (document.body.classList.contains("dark-mode")) {
            themeIcon.classList.replace("fa-sun", "fa-moon");
            themeIcon.style.color = "#60A5FA";
        } else {
            themeIcon.classList.replace("fa-moon", "fa-sun");
            themeIcon.style.color = "orange";
        }
    });
}

const profileWrapper = document.querySelector(".wrapper");
const profileCardInner = document.querySelector(".profile-card-inner");
let isMatrixRunning = false;

if (profileWrapper && profileCardInner) {
    profileWrapper.addEventListener("click", () => {
        profileCardInner.classList.toggle("is-flipped");
        const isBackSide = profileCardInner.classList.contains("is-flipped");
        if (isBackSide && !isMatrixRunning) {
            startMatrixEasterEgg();
        }
    });
}

function startMatrixEasterEgg() {
    isMatrixRunning = true;

    const canvas = document.createElement('canvas');
    canvas.id = 'matrixCanvas';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '999998'; 
    canvas.style.pointerEvents = 'none'; 
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレゲゼデベペオォコソトノホモヨョロゴゾドボポヴッン'.split('');
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = [];
    for (let x = 0; x < columns; x++) drops[x] = 1;

    const audio = new Audio('sounds/matrix.mp3'); 
    audio.volume = 0.6;
    
    audio.play().catch(e => console.warn("Browser menahan audio autoplay"));

    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#0F0';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }

        ctx.fillStyle = 'rgba(0, 255, 0, 0.9)';
        ctx.font = 'bold clamp(1.2rem, 5vw, 3.5rem) monospace'; 
        ctx.textAlign = 'center';
        ctx.shadowColor = '#0F0';
        ctx.shadowBlur = 15; 
        ctx.fillText('Liand.fullstackdev', canvas.width / 2, canvas.height / 2);
        ctx.shadowBlur = 0; 
        ctx.textAlign = 'left';
    }

    const matrixInterval = setInterval(drawMatrix, 35); 

    setTimeout(() => {
        canvas.style.transition = 'opacity 1s ease-out';
        canvas.style.opacity = '0';

        let fadeAudio = setInterval(() => {
            if (audio.volume > 0.05) {
                audio.volume -= 0.05;
            } else {
                audio.pause();
                audio.currentTime = 0;
                clearInterval(fadeAudio);
            }
        }, 100);

        setTimeout(() => {
            clearInterval(matrixInterval);
            canvas.remove();
            isMatrixRunning = false; 
        }, 1000);

    }, 5000); 
}

const selectTrigger = document.querySelector(".select-trigger");
const customOptions = document.querySelector(".custom-options");
const hiddenInput = document.getElementById("feedbackTypeHidden");
const bugSection = document.getElementById("bugSection");
const triggerText = document.getElementById("triggerText");

if (selectTrigger && customOptions) {
    selectTrigger.addEventListener("click", () => customOptions.classList.toggle("open"));

    document.querySelectorAll(".custom-options li").forEach(option => {
        option.addEventListener("click", function () {
            const value = this.getAttribute("data-value");
            if(hiddenInput) hiddenInput.value = value;
            if(triggerText) triggerText.innerHTML = this.innerHTML;
            customOptions.classList.remove("open");
            
            if(bugSection) bugSection.style.display = value === "bug" ? "flex" : "none";
            
            if(value !== "bug") {
                const buktiEl = document.getElementById("bukti");
                if(buktiEl) buktiEl.value = "";
                const rmBtn = document.getElementById("removeBuktiBtn");
                if(rmBtn) rmBtn.style.display = "none";
            }
        });
    });

    document.addEventListener("click", e => {
        const customSelect = document.getElementById("customSelect");
        if (customSelect && !customSelect.contains(e.target)) customOptions.classList.remove("open");
    });
}

const buktiInput = document.getElementById("bukti");
const removeBuktiBtn = document.getElementById("removeBuktiBtn");
if (buktiInput && removeBuktiBtn) {
    buktiInput.addEventListener("change", function() {
        if (this.files && this.files.length > 0) {
            removeBuktiBtn.style.display = "flex";
        } else {
            removeBuktiBtn.style.display = "none";
        }
    });
    removeBuktiBtn.addEventListener("click", function() {
        buktiInput.value = ""; 
        this.style.display = "none"; 
    });
}

const feedbackForm = document.getElementById("feedbackForm");
const btnSubmit = document.querySelector(".button-submit");

if (feedbackForm && btnSubmit) {
    feedbackForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const type = hiddenInput ? hiddenInput.value : "";
        const name = document.getElementById("nama") ? document.getElementById("nama").value.trim() : "";
        const message = document.getElementById("pesan") ? document.getElementById("pesan").value.trim() : "";
        const fileInput = document.getElementById("bukti");

        if (!type) {
            showDynamicToast("Pilih jenis feedback terlebih dahulu.", "error");
            return;
        }

        const originalBtnContent = btnSubmit.innerHTML;
        btnSubmit.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Mengirim...';
        btnSubmit.disabled = true; btnSubmit.style.opacity = "0.7"; btnSubmit.style.cursor = "not-allowed";

        try {
            let base64Image = null;
            if (type === "bug" && fileInput && fileInput.files.length > 0) {
                const file = fileInput.files[0];
                if (file.size > 4.5 * 1024 * 1024) throw new Error("Ukuran gambar maksimal 4.5MB.");
                base64Image = await convertImageToBase64(file);
            }

            const response = await fetch(`${SERVER_URL}/api/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY, 'x-device-id': DEVICE_ID },
                body: JSON.stringify({ type, senderName: name, message, imageUrl: base64Image })
            });

            const data = await response.json();
            if (data.success) {
                showDynamicToast("Feedback berhasil dikirim!", "success");
                feedbackForm.reset(); 
                if(triggerText) triggerText.innerHTML = "Pilih jenis feedback";
                if(hiddenInput) hiddenInput.value = ""; 
                if(bugSection) bugSection.style.display = "none";
            } else throw new Error(data.error || "Gagal mengirim laporan.");
        } catch (error) {
            showDynamicToast(error.message, "error");
        } finally {
            btnSubmit.innerHTML = originalBtnContent; btnSubmit.style.opacity = "1";
            btnSubmit.style.cursor = "pointer"; btnSubmit.disabled = false;
        }
    });
}

function showDynamicToast(message, type = "success") {
    const toastElement = document.getElementById("toastNotification");
    if(!toastElement) return;
    
    toastElement.style.zIndex = "999999"; 

    const icon = toastElement.querySelector("i");
    const span = toastElement.querySelector("span");
    if(span) span.textContent = message;
    
    if (type === "success") {
        toastElement.style.backgroundColor = "#10b981";
        if(icon) icon.className = "fa-solid fa-circle-check";
    } else {
        toastElement.style.backgroundColor = "#ef4444";
        if(icon) icon.className = "fa-solid fa-circle-exclamation";
    }
    
    toastElement.classList.add("show");
    setTimeout(() => toastElement.classList.remove("show"), 3000);
}

function showHubConfirm(message) {
    return new Promise((resolve) => {
        const modal = document.getElementById('hubConfirmModal');
        if(!modal) return resolve(true); 
        
        document.getElementById('hubConfirmMessage').innerText = message;
        modal.classList.add('active');

        const btnOk = document.getElementById('btnHubConfirmOk');
        const btnCancel = document.getElementById('btnHubConfirmCancel');

        const newBtnOk = btnOk.cloneNode(true);
        const newBtnCancel = btnCancel.cloneNode(true);
        btnOk.parentNode.replaceChild(newBtnOk, btnOk);
        btnCancel.parentNode.replaceChild(newBtnCancel, btnCancel);

        newBtnCancel.addEventListener('click', () => { modal.classList.remove('active'); resolve(false); });
        newBtnOk.addEventListener('click', () => { modal.classList.remove('active'); resolve(true); });
    });
}

async function initVisitorCounter() {
    const visitorText = document.getElementById('visitorCountText');
    if(!visitorText) return;
    const hasVisited = localStorage.getItem('liand_hub_visited');
    try {
        let response;
        if (!hasVisited) {
            response = await fetch(`${SERVER_URL}/api/visitors/increment`, { method: 'POST', headers: { 'Content-Type': 'application/json' }});
            localStorage.setItem('liand_hub_visited', 'true');
        } else response = await fetch(`${SERVER_URL}/api/visitors`);
        
        if (!response.ok) throw new Error("Gagal mengambil data");
        const data = await response.json();
        if (data.success) visitorText.innerHTML = `<span class="count-animate">${data.total.toLocaleString('id-ID')}</span>`;
        else throw new Error("Format salah");
    } catch (error) {
        visitorText.innerHTML = `<span style="color:#ef4444; font-size:0.85rem;"><i class="fa-solid fa-triangle-exclamation"></i> Offline</span>`; 
    }
}

async function checkServerStatus(elementId) {
    const statusEl = document.getElementById(elementId);
    if (!statusEl) return;
    statusEl.className = "server-status"; statusEl.style.opacity = "1";
    statusEl.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Menghubungkan...';
    try {
        const response = await fetch(`${SERVER_URL}/api/status`, { method: 'GET', headers: { 'x-api-key': API_KEY }});
        if (response.ok && (await response.json()).status === "online") {
            statusEl.className = "server-status online"; statusEl.innerHTML = '<span class="dot"></span> Server Online';
        } else throw new Error("Offline");
    } catch (error) {
        statusEl.className = "server-status offline"; statusEl.innerHTML = '<span class="dot"></span> Server Offline';
    }
}

window.openReviewModal = function(htmlId, projectName, action) {
    currentProjectId = htmlId; 
    currentProjectName = projectName; 
    
    const titleEl = document.getElementById('modalProjectTitle');
    if(titleEl) titleEl.textContent = "Ulasan: " + projectName;
    
    hideError();
    const revName = document.getElementById('reviewerName');
    const revText = document.getElementById('reviewText');
    if(revName) revName.value = ""; 
    if(revText) revText.value = "";
    
    document.querySelectorAll('#starRating i').forEach(s => { 
        s.classList.remove('fa-solid', 'active'); 
        s.classList.add('fa-regular'); 
    });

    const modal = document.getElementById('reviewModal');
    if(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    loadProjectReviews(currentProjectId);
    checkServerStatus('modalServerStatus');

    setTimeout(() => {
        if (action === 'rate' && revName) revName.focus();
        else if (action === 'view') {
            const list = document.querySelector('.reviews-list');
            if(list) list.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 100);
};

window.closeReviewModal = function() {
    const modal = document.getElementById('reviewModal');
    if(modal) modal.classList.remove('active');
    document.body.style.overflow = 'auto'; 
};

const reviewModal = document.getElementById('reviewModal');
if(reviewModal) {
    reviewModal.addEventListener('click', e => { if (e.target === reviewModal) closeReviewModal(); });
}

const starInputs = document.querySelectorAll('#starRating i');
starInputs.forEach(star => {
    star.addEventListener('click', function() {
        let value = this.getAttribute('data-value');
        starInputs.forEach(s => { s.classList.remove('fa-solid', 'active'); s.classList.add('fa-regular'); });
        for(let i = 0; i < value; i++) { starInputs[i].classList.remove('fa-regular'); starInputs[i].classList.add('fa-solid', 'active'); }
    });
});

async function loadProjectReviews(projectId) {
    const container = document.querySelector('.reviews-list');
    if(!container) return;
    container.innerHTML = `<p style="text-align:center; padding:20px; color:#64748b;"><i class="fa-solid fa-circle-notch fa-spin"></i> Menarik data ulasan...</p>`;
    
    try {
        const res = await fetch(`${SERVER_URL}/api/reviews/${projectId}`, {
            headers: { 'x-device-id': DEVICE_ID }
        });
        const data = await res.json();
        if (data.success) {
            const scoreH1 = document.querySelector('.score-big h1');
            const scoreP = document.querySelector('.score-big p');
            if(scoreH1) scoreH1.textContent = data.stats.avg;
            if(scoreP) scoreP.textContent = `${data.stats.total} Total`;
            
            const barFills = document.querySelectorAll('.bar-fill');
            if(barFills.length > 0) {
                data.stats.bars.forEach((val, index) => {
                    const percentage = data.stats.total > 0 ? (val / data.stats.total) * 100 : 0;
                    if(barFills[index]) barFills[index].style.width = percentage + "%";
                });
            }

            const submitBtn = document.getElementById('submitReviewBtn');
            const formTitle = document.getElementById('formReviewTitle');
            const revName = document.getElementById('reviewerName');
            const revText = document.getElementById('reviewText');
            
            const existingDelBtn = document.getElementById('btnDeleteMyReview');
            if (existingDelBtn) existingDelBtn.remove();
            
            if (data.myReview) {
                isEditMode = true;
                if(formTitle) formTitle.textContent = "Edit Ulasan Anda";
                if(submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Simpan Perubahan';
                if(revName) revName.value = data.myReview.name;
                if(revText) revText.value = data.myReview.message;
                
                const sInputs = document.querySelectorAll('#starRating i');
                sInputs.forEach((s, i) => {
                    if (i < data.myReview.rating) { s.classList.add('fa-solid', 'active'); s.classList.remove('fa-regular'); }
                    else { s.classList.remove('fa-solid', 'active'); s.classList.add('fa-regular'); }
                });
            } else {
                isEditMode = false; 
                if(formTitle) formTitle.textContent = "Beri Rating";
                if(submitBtn) submitBtn.innerHTML = 'Kirim Ulasan';
            }

            let html = `<h4>Ulasan Terbaru</h4>`;
            if (data.reviews.length === 0) {
                html += `<p style="color: #64748b; font-size: 0.9rem;">Belum ada ulasan. Jadilah yang pertama!</p>`;
            } else {
                data.reviews.forEach(rev => {
                    const mineBadge = rev.isMine ? `<span style="font-size:0.65rem; background:#3b82f6; color:white; padding:2px 6px; border-radius:4px; margin-left:6px;">Ulasan Anda</span>` : "";
                    
                    let actionButtons = "";
                    if (rev.isMine) {
                        actionButtons = `
                        <div style="margin-top: 12px; display: flex; gap: 8px; justify-content: flex-end; border-top: 1px dashed rgba(148, 163, 184, 0.3); padding-top: 10px;">
                            <button onclick="document.querySelector('.review-input-section').scrollIntoView({behavior: 'smooth', block: 'center'}); document.getElementById('reviewText').focus();" style="background: transparent; color: #3b82f6; border: 1px solid #3b82f6; padding: 5px 12px; border-radius: 6px; font-size: 0.8rem; cursor: pointer; font-weight: 600; transition: 0.2s;"><i class="fa-solid fa-pen"></i> Edit</button>
                            <button onclick="deleteMyReview()" style="background: rgba(239, 68, 68, 0.1); color: #ef4444; border: none; padding: 6px 12px; border-radius: 6px; font-size: 0.8rem; cursor: pointer; font-weight: 600; transition: 0.2s;"><i class="fa-solid fa-trash-can"></i> Hapus</button>
                        </div>`;
                    }

                    let replyHtml = "";
                    if (rev.reply) {
                        replyHtml = `
                        <div class="developer-reply" style="margin-top: 12px; padding: 10px 12px; border-radius: 6px; font-size: 0.85rem; border-left: 3px solid #10b981; background: rgba(16, 185, 129, 0.1);">
                            <div style="font-weight: 700; color: #10b981; margin-bottom: 4px; display: flex; align-items: center; justify-content: space-between;">
                                <span><i class="fa-solid fa-code"></i> Respon Developer</span>
                                <span style="font-size: 0.7rem; opacity: 0.8; font-weight: normal;">${timeAgo(rev.replyDate)}</span>
                            </div>
                            <p style="margin: 0; line-height: 1.5; opacity: 0.9;">${sanitizeHTML(rev.reply)}</p>
                        </div>
                        `;
                    }

                    html += `
                    <div class="review-item" style="${rev.isMine ? 'border-left: 3px solid #3b82f6; padding-left: 10px; background: rgba(59, 130, 246, 0.05); padding-right: 10px; border-radius: 0 8px 8px 0;' : ''}">
                      <div class="review-head">
                        <div class="reviewer-info">
                          <div class="avatar"><i class="fa-solid fa-user"></i></div>
                          <div><span class="name">${sanitizeHTML(rev.name)}${mineBadge}</span> <span class="date">${timeAgo(rev.date)}</span></div>
                        </div>
                        <div class="stars-small">${renderStars(rev.rating)}</div>
                      </div>
                      <p class="review-text">${sanitizeHTML(rev.message)}</p>
                      ${replyHtml} 
                      ${actionButtons}
                    </div>`;
                });
            }
            container.innerHTML = html;
        }
    } catch (e) { container.innerHTML = `<p style="color:#ef4444;">Gagal terhubung ke server.</p>`; }
}

const submitReviewBtn = document.getElementById('submitReviewBtn');
if (submitReviewBtn) {
    submitReviewBtn.addEventListener('click', async function() {
        hideError(); 
        const activeStars = document.querySelectorAll('#starRating i.active').length;
        const revNameEl = document.getElementById('reviewerName');
        const revTextEl = document.getElementById('reviewText');
        const nameVal = revNameEl ? revNameEl.value.trim() : "";
        const textVal = revTextEl ? revTextEl.value.trim() : "";
        
        if (activeStars === 0) return showError("Mohon berikan rating bintang (1-5) terlebih dahulu.");
        if (nameVal.length < 3) return showError("Nama terlalu pendek. Minimal 3 karakter.", revNameEl);
        if (textVal.length < 4) return showError("Ulasan terlalu singkat.", revTextEl);

        const originalText = this.innerHTML;
        this.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Menyimpan...';
        this.disabled = true;

        try {
            const method = isEditMode ? 'PUT' : 'POST';
            const endpoint = isEditMode ? '/api/feedback/client' : '/api/feedback';
            
            const res = await fetch(`${SERVER_URL}${endpoint}`, {
                method: method,
                headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY, 'x-device-id': DEVICE_ID },
                body: JSON.stringify({ 
                    type: 'review', 
                    projectId: currentProjectId, 
                    projectName: currentProjectName,
                    senderName: nameVal, 
                    message: textVal, 
                    rating: activeStars 
                })
            });

            const data = await res.json();
            if (data.success) {
                showDynamicToast(isEditMode ? "Ulasan diperbarui!" : "Ulasan berhasil dikirim!", "success");
                loadProjectReviews(currentProjectId);
            } else {
                showDynamicToast(data.error || "Gagal mengirim ulasan.", "error");
            }
        } catch (error) { 
            showDynamicToast("Terjadi kesalahan koneksi ke server.", "error"); 
        } finally { 
            this.innerHTML = originalText; this.disabled = false; 
        }
    });
}

window.deleteMyReview = async function() {
    const isConfirmed = await showHubConfirm("Apakah Anda yakin ingin menghapus ulasan ini secara permanen?");
    if (!isConfirmed) return;

    try {
        const res = await fetch(`${SERVER_URL}/api/feedback/client`, { 
            method: 'DELETE', 
            headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY, 'x-device-id': DEVICE_ID },
            body: JSON.stringify({ projectId: currentProjectId })
        });
        const data = await res.json();
        if (data.success) {
            showDynamicToast("Ulasan berhasil dihapus.", "success");
            const revName = document.getElementById('reviewerName');
            const revText = document.getElementById('reviewText');
            if(revName) revName.value = ""; 
            if(revText) revText.value = "";
            document.querySelectorAll('#starRating i').forEach(s => { s.classList.remove('fa-solid', 'active'); s.classList.add('fa-regular'); });
            loadProjectReviews(currentProjectId); 
        } else {
            showDynamicToast(data.error || "Gagal menghapus ulasan.", "error");
        }
    } catch (e) { 
        showDynamicToast("Koneksi server gagal saat menghapus.", "error"); 
    }
}

async function initProjectCards() {
    const ratingContainers = document.querySelectorAll('.rating-display-modern');
    
    ratingContainers.forEach(async (container) => {
        const projectId = container.getAttribute('data-project-id');
        if (!projectId || projectId.includes('GANTI_ID')) return;

        const summaryDiv = container.querySelector('.stars-summary');
        if(!summaryDiv) return;
        
        try {
            const res = await fetch(`${SERVER_URL}/api/reviews/${projectId}`);
            const data = await res.json();
            
            if (data.success) {
                summaryDiv.innerHTML = `
                    <span class="stars-gold"><i class="fa-solid fa-star"></i> ${data.stats.avg}</span>
                    <span class="rating-count">(${data.stats.total} Ulasan)</span>
                `;
            } else {
                summaryDiv.innerHTML = `<span class="rating-count" style="color:#ef4444;">Gagal memuat</span>`;
            }
        } catch(e) {
            summaryDiv.innerHTML = `<span class="rating-count" style="color:#ef4444;">Offline</span>`;
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    try { initVisitorCounter(); } catch(e) {}
    try { initProjectCards(); } catch(e) {}
    
    const feedbackSection = document.querySelector('.card-feedback');
    if (feedbackSection && window.IntersectionObserver) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) { 
                checkServerStatus('feedbackServerStatus'); 
                observer.disconnect(); 
            }
        }, { threshold: 0.3 }); 
        observer.observe(feedbackSection);
    } else {
        checkServerStatus('feedbackServerStatus');
    }
});

window.addEventListener('load', function() {
    const loader = document.getElementById('loader-wrapper');
    
    setTimeout(() => {
        if(loader) {
            loader.classList.add('loader-hidden');
            setTimeout(() => {
                loader.remove();
            }, 600); 
        }
    }, 1800); 
});

document.querySelectorAll('.btn-trakteer').forEach(link => {
    link.addEventListener('click', function(e) {
        if (typeof trbtnOverlay !== 'undefined') {
            e.preventDefault();
            const trbtnId = 'trbtn-1'; 
            trbtnOverlay.showModal(trbtnId);
        }
    });
});

window.addEventListener('load', () => {
    if (typeof trbtnOverlay !== 'undefined') {
        trbtnOverlay.init(
            'Dukung Saya di Trakteer',
            '#be1e2d',
            'https://trakteer.id/v1/liand-fullstack-dev/tip/embed/modal',
            'https://edge-cdn.trakteer.id/images/embed/trbtn-icon.png',
            '40',
            'inline'
        );
    }
});

document.addEventListener("DOMContentLoaded", () => {
    try { initVisitorCounter(); } catch(e) {}
    try { initProjectCards(); } catch(e) {}
    
    setInterval(() => {
        initVisitorCounter();
        initProjectCards();  
    }, 10000); 
});