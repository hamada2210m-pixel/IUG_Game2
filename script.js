/**
 * @file script.js
 * @description Frontend logic for the Family Aid System.
 * @version 5.3 - Unified login modals, custom prompts, and improved admin features.
 */

document.addEventListener('DOMContentLoaded', () => {
    const App = {
        WEB_APP_URL: 'https://script.google.com/macros/s/AKfycbwb7-O3Tn8aVrEz2kQVli8_40mVwSGNPTxQSroFgrAu3mcdnmZXFsNuJt0xmsYL8SbS/exec',
        aidCategories: {
            "مساعدات مالية": ["نقد مباشر للعائلات المحتاجة", "دفع فواتير (كهرباء، ماء، إيجار)", "قروض حسنة أو صناديق دوارة"],
            "مساعدات غذائية": ["طرود غذائية أساسية", "وجبات جاهزة / مطبوخة", "توزيع مياه للشرب"],
            "مساعدات صحية": ["أدوية وعلاجات", "فحوصات طبية مجانية", "تغطية تكاليف العمليات", "أدوات مساعدة (نظارات، كراسي متحركة)"],
            "مساعدات تعليمية": ["منح دراسية", "توفير قرطاسية وحقائب مدرسية", "تغطية رسوم جامعية أو مدرسية", "دورات تدريبية وتأهيل مهني"],
            "مساعدات إغاثية (طارئة)": ["خيم وأغطية في حالات النزوح", "ملابس وأحذية", "أدوات نظافة وتعقيم", "تدخل عاجل في الكوارث"],
            "مساعدات سكنية": ["بناء أو ترميم منازل", "دفع إيجارات", "توفير أثاث أو أجهزة كهربائية"],
            "مساعدات تشغيلية": ["تمويل مشاريع صغيرة", "تدريب مهني", "أدوات عمل أو معدات إنتاج"]
        },
        searchTimeout: null,
        currentPage: 1,
        pageSize: 10,
        setPasswordModal: null,
        loginPasswordModal: null,
        confirmationModal: null,
        promptModal: null,
        membersList: [],
        allAidRecords: [],
        allCompletedAidRecords: [],
        allFutureAidRecords: [],
        futureAidCurrentPage: 1,
        futureAidPageSize: 10,
        bulkCompleteModal: null,

        init() {
            this.initPageBasedOnURL();
            const setPasswordModalElement = document.getElementById('setPasswordModal');
            const loginPasswordModalElement = document.getElementById('loginPasswordModal');
            const confirmationModalElement = document.getElementById('confirmationModal');
            const promptModalElement = document.getElementById('promptModal');
            if (setPasswordModalElement) {
                this.setPasswordModal = new bootstrap.Modal(setPasswordModalElement);
            }
            if (loginPasswordModalElement) {
                this.loginPasswordModal = new bootstrap.Modal(loginPasswordModalElement);
            }
            if (confirmationModalElement) {
                this.confirmationModal = new bootstrap.Modal(confirmationModalElement);
            }
            if (promptModalElement) {
                this.promptModal = new bootstrap.Modal(promptModalElement);
            }
            const bulkModalElement = document.getElementById('confirmBulkCompleteModal');
            if (bulkModalElement) {
                this.bulkCompleteModal = new bootstrap.Modal(bulkModalElement);
            }
        },

        showConfirmationModal(message) {
            return new Promise((resolve) => {
                const modalBody = document.getElementById('confirmationModalBody');
                const confirmBtn = document.getElementById('confirmActionBtn');
                modalBody.textContent = message;

                const onConfirm = () => {
                    this.confirmationModal.hide();
                    confirmBtn.removeEventListener('click', onConfirm);
                    resolve(true);
                };

                const onCancel = () => {
                    this.confirmationModal.hide();
                    confirmBtn.removeEventListener('click', onConfirm);
                    resolve(false);
                };

                confirmBtn.addEventListener('click', onConfirm);
                document.getElementById('confirmationModal').addEventListener('hidden.bs.modal', onCancel, { once: true });
                this.confirmationModal.show();
            });
        },

        formatDateToEnglish(dateString) {
            if (!dateString) return '-';
            try {
                const date = new Date(dateString);
                if (isNaN(date.getTime())) return 'Invalid Date';
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            } catch (error) {
                return dateString;
            }
        },

        formatDateTimeToEnglish(dateString) {
            if (!dateString) return '-';
            try {
                const date = new Date(dateString);
                if (isNaN(date.getTime())) return 'Invalid Date';
                const datePart = this.formatDateToEnglish(date);
                const timePart = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
                return `${datePart} ${timePart}`;
            } catch (error) {
                return dateString;
            }
        },

        async apiCall(payload, showSuccessToast = false) {
            const activeSubmitButton = (document.activeElement.tagName === 'BUTTON' && document.activeElement.type === 'submit') ? document.activeElement : document.querySelector('button[type="submit"]:not(:disabled)');
            const isButtonTriggered = ['createAdmin', 'addAid', 'adminLogin', 'userLogin', 'setMemberPassword', 'bulkAddAidFromXLSX', 'updateMember', 'clearMemberPassword', 'checkPasswordStatus', 'userLoginWithPassword', 'updateAdminStatus', 'generateReport', 'updateAidStatus', 'bulkProcessAid'].includes(payload.action);
            if (isButtonTriggered) this.toggleButtonSpinner(true, activeSubmitButton);
            try {
                const response = await fetch(this.WEB_APP_URL, { method: 'POST', mode: 'cors', redirect: 'follow', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) });
                if (!response.ok) throw new Error(`خطأ في الشبكة: ${response.statusText}`);
                const result = await response.json();
                if (!result.success) throw new Error(result.message || 'حدث خطأ غير معروف في الخادم.');
                if (showSuccessToast && result.message) this.showToast(result.message, true);
                return result;
            } catch (error) { console.error('API Call Failed:', error); this.showToast(error.message, false); return null; } finally { if (isButtonTriggered) this.toggleButtonSpinner(false, activeSubmitButton); }
        },

        initPageBasedOnURL() {
            const path = window.location.pathname.split('/').pop();
            this.checkServerStatus();
            if (path === 'index.html' || path === '') this.initIndexPage();
            else if (path === 'admin.html') this.initAdminPage();
            else if (path === 'dashboard.html') this.initDashboardPage();
            else if (path === 'superadmin.html') this.initSuperAdminPage();
        },

        showToast(message, isSuccess = true) { Toastify({ text: message, duration: 4000, gravity: "top", position: "center", style: { background: isSuccess ? "#28a745" : "#dc3545", boxShadow: "none" } }).showToast(); },
        toggleButtonSpinner(show, button) { const btn = button || document.querySelector('button[type="submit"]'); if (!btn) return; btn.disabled = show; const spinner = btn.querySelector('.spinner-border'); if (spinner) spinner.classList.toggle('d-none', !show); const buttonText = btn.querySelector('.button-text'); if(buttonText) buttonText.style.opacity = show ? 0.5 : 1; },
        async checkServerStatus() { const statusEl = document.getElementById('server-status'); if (!statusEl) return; const statusText = statusEl.querySelector('.status-text'); try { const response = await fetch(this.WEB_APP_URL); if(!response.ok) throw new Error("Server not reachable"); const data = await response.json(); if (data.status === 'success') { statusEl.classList.add('connected'); statusText.textContent = `متصل (إصدار: ${data.version})`; } else { throw new Error('Invalid response'); } } catch (error) { statusEl.classList.add('disconnected'); statusText.textContent = 'غير متصل بالخادم'; } },

        initIndexPage() {
            document.getElementById('loginForm')?.addEventListener('submit', (e) => this.handleUserLogin(e));
            document.getElementById('adminLoginForm')?.addEventListener('submit', (e) => this.handleAdminLogin(e));
            document.getElementById('setPasswordForm')?.addEventListener('submit', (e) => this.handleModalSetPassword(e));
            document.getElementById('userPasswordForm')?.addEventListener('submit', (e) => this.handleModalLogin(e));
            document.getElementById('loginModalForgotPassword')?.addEventListener('click', (e) => this.handleForgotPassword(e));
        },
        toggleAuthForm(showUser) {
            document.getElementById('user-card').classList.toggle('active', showUser);
            document.getElementById('admin-card').classList.toggle('active', !showUser);
            document.getElementById('user-login-form').classList.toggle('d-none', !showUser);
            document.getElementById('admin-login-form').classList.toggle('d-none', showUser);
        },
        async handleUserLogin(e) {
            e.preventDefault();
            const form = e.target;
            const userId = form.querySelector('#userId').value;
            const spouseId = form.querySelector('#spouseId').value;
            const result = await this.apiCall({ action: 'checkPasswordStatus', id: userId, spouse_id: spouseId });
            if (!result) return;
            if (result.message === 'password_required') {
                document.getElementById('modalUserId').value = userId;
                this.setPasswordModal.show();
            } else if (result.message === 'password_exists') {
                document.getElementById('loginModalUserId').value = userId;
                document.getElementById('loginModalSpouseId').value = spouseId;
                this.loginPasswordModal.show();
            }
        },
        async handleModalSetPassword(e) {
            e.preventDefault();
            const userId = document.getElementById('modalUserId').value;
            const newPassword = document.getElementById('modalNewPassword').value;
            const confirmPassword = document.getElementById('modalConfirmPassword').value;
            if (newPassword !== confirmPassword) {
                this.showToast('كلمة المرور وتأكيدها غير متطابقين.', false);
                return;
            }
            if (newPassword.length < 6) {
                this.showToast('كلمة المرور يجب أن لا تقل عن 6 أحرف.', false);
                return;
            }
            const result = await this.apiCall({ action: 'setMemberPassword', userId: userId, password: newPassword }, true);
            if (result) {
                this.setPasswordModal.hide();
                this.showToast('تم حفظ كلمة المرور بنجاح. سيتم توجيهك الآن.', true);
                setTimeout(() => {
                    localStorage.setItem('loggedInUserId', userId);
                    localStorage.setItem('loggedInUserName', result.userName);
                    window.location.href = 'dashboard.html';
                }, 2000);
            }
        },
        async handleModalLogin(e) {
            e.preventDefault();
            const userId = document.getElementById('loginModalUserId').value;
            const spouseId = document.getElementById('loginModalSpouseId').value;
            const password = document.getElementById('loginModalPassword').value;
            const result = await this.apiCall({ action: 'userLoginWithPassword', id: userId, spouse_id: spouseId, password: password });
            if (result) {
                this.loginPasswordModal.hide();
                this.showToast(`أهلاً بك، ${result.user_name}`, true);
                localStorage.setItem('loggedInUserId', result.user_id);
                localStorage.setItem('loggedInUserName', result.user_name);
                setTimeout(() => { window.location.href = 'dashboard.html'; }, 1000);
            }
        },
        async handleAdminLogin(e) { 
            e.preventDefault(); 
            const result = await this.apiCall({ action: 'adminLogin', username: document.getElementById('username').value, password: document.getElementById('password').value }); 
            if (result) { 
                this.showToast("تم تسجيل الدخول بنجاح.", true); 
                sessionStorage.setItem('adminToken', result.token); 
                sessionStorage.setItem('adminRole', result.role); 
                window.location.href = result.role === 'superadmin' ? 'superadmin.html' : 'admin.html'; 
            }
        },
        async handleForgotPassword(e) {
            e.preventDefault();
            
            // Hide the previous modal (loginPasswordModal) before showing the new one
            if (this.loginPasswordModal) {
                this.loginPasswordModal.hide();
            }
            
            const promptUserIdInput = document.getElementById('promptUserId');
            const promptConfirmBtn = document.getElementById('promptConfirmBtn');
            
            this.promptModal.show();
            
            const resultPromise = new Promise((resolve) => {
                promptConfirmBtn.onclick = () => {
                    const userId = promptUserIdInput.value;
                    this.promptModal.hide();
                    resolve(userId);
                };
                document.getElementById('promptModal').addEventListener('hidden.bs.modal', () => {
                    resolve(null);
                }, { once: true });
            });
            
            const userId = await resultPromise;
            
            if (userId) {
                const result = await this.apiCall({ action: 'requestPasswordReset', userId });
                if (result) this.showToast(result.message, true);
            }
            promptUserIdInput.value = '';
        },

        initDashboardPage() {
            const userId = localStorage.getItem('loggedInUserId');
            if (!userId) {
                window.location.href = 'index.html';
                return;
            }
            this.loadUserData(userId);
        },
        async loadUserData(userId) {
            const userDataResult = await this.apiCall({ action: 'getUserData', userId });
            if (userDataResult) this.renderUserInfo(userDataResult.data);
            const aidHistoryResult = await this.apiCall({ action: 'getUserAidHistory', userId });
            if (aidHistoryResult) this.renderAidHistory(aidHistoryResult.data);
        },
        renderUserInfo(data) {
            const container = document.getElementById('userInfo');
            document.getElementById('userName').textContent = data['الاسم الكامل'] || 'عضو العائلة';
            document.getElementById('userTitle').textContent = `رقم الهوية: ${data['رقم الهوية'] || '---'}`;
            container.innerHTML = `<div class="col-md-6 mb-3"><div class="info-item"><strong><i class="bi bi-person-heart me-2"></i>الاسم الكامل:</strong><span>${data['الاسم الكامل'] || '-'}</span></div></div><div class="col-md-6 mb-3"><div class="info-item"><strong><i class="bi bi-person-badge me-2"></i>رقم الهوية:</strong><span>${data['رقم الهوية'] || '-'}</span></div></div><div class="col-md-6 mb-3"><div class="info-item"><strong><i class="bi bi-person-heart me-2"></i>اسم الزوجة:</strong><span>${data['اسم الزوجة رباعي'] || '-'}</span></div></div><div class="col-md-6 mb-3"><div class="info-item"><strong><i class="bi bi-person-badge me-2"></i>رقم هوية الزوجة:</strong><span>${data['رقم هوية الزوجة'] || '-'}</span></div></div><div class="col-md-6 mb-3"><div class="info-item"><strong><i class="bi bi-geo-alt-fill me-2"></i>مكان الإقامة:</strong><span>${data['مكان الإقامة'] || '-'}</span></div></div><div class="col-md-6 mb-3"><div class="info-item"><strong><i class="bi bi-telephone-fill me-2"></i>رقم الجوال:</strong><span>${data['رقم الجوال'] || '-'}</span></div></div><div class="col-md-6 mb-3"><div class="info-item"><strong><i class="bi bi-calendar-check me-2"></i>تاريخ الميلاد:</strong><span>${this.formatDateToEnglish(data['تاريخ الميلاد'])}</span></div></div><div class="col-md-6 mb-3"><div class="info-item"><strong><i class="bi bi-heart-fill me-2"></i>الحالة الاجتماعية:</strong><span>${data['الحالة الاجتماعية'] || '-'}</span></div></div><div class="col-md-6 mb-3"><div class="info-item"><strong><i class="bi bi-people-fill me-2"></i>عدد الأولاد:</strong><span>${data['عدد الأولاد'] || '-'}</span></div></div>`;
        },
        renderAidHistory(history) {
            const tableBody = document.getElementById('aidHistoryTableBody');
            if (history.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="4" class="text-center">لا يوجد سجل مساعدات لعرضه.</td></tr>';
                return;
            }
            tableBody.innerHTML = history.map(item => `<tr><td>${item['نوع المساعدة']}</td><td>${this.formatDateToEnglish(item['تاريخ الاستلام'])}</td><td>${item['مصدر المساعدة'] || '-'}</td><td>${item['ملاحظات'] || '-'}</td></tr>`).join('');
        },

        initAdminPage() {
            const token = sessionStorage.getItem('adminToken');
            if (!token) {
                window.location.href = 'index.html';
                return;
            }
            if (sessionStorage.getItem('adminRole') === 'superadmin') {
                document.getElementById('superadmin-link')?.classList.remove('d-none');
            }
            this.setupAdminListeners(token);
            this.loadAdminDashboard(token);
        },
        
        setupAdminListeners(token) {
            document.getElementById('memberSearchInput')?.addEventListener('input', e => this.handleSearch(e, token));
            document.getElementById('pageSizeSelect')?.addEventListener('change', (e) => { this.pageSize = e.target.value; this.currentPage = 1; this.loadMembers(token); });
            document.getElementById('memberPagination')?.addEventListener('click', (e) => { if (e.target.dataset.page) { this.currentPage = parseInt(e.target.dataset.page); this.loadMembers(token); } });
            document.getElementById('addAidForm')?.addEventListener('submit', e => this.handleAddAid(e, token));
            document.getElementById('bulkUploadForm')?.addEventListener('submit', e => this.handleAidFileUpload(e, token));
            document.getElementById('reportForm')?.addEventListener('submit', e => this.handleReportGeneration(e, token));
            document.getElementById('exportReportBtn')?.addEventListener('click', () => this.exportReportToExcel());
            document.getElementById('exportTemplateBtn')?.addEventListener('click', () => this.exportAidTemplateToExcel());
            
            const searchInput = document.getElementById('aidMemberSearch');
            searchInput?.addEventListener('input', () => {
                const searchTerm = searchInput.value.toLowerCase();
                const filteredMembers = this.membersList.filter(member => member.name.toLowerCase().includes(searchTerm) || String(member.id).includes(searchTerm));
                this.populateBeneficiaryList(filteredMembers);
            });
            document.getElementById('clearSearchBtn')?.addEventListener('click', () => { searchInput.value = ''; this.populateBeneficiaryList(this.membersList); });
            
            const categorySelect = document.getElementById('aidCategory');
            const typeSelect = document.getElementById('aidType');
            for (const category in this.aidCategories) {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categorySelect?.appendChild(option);
            }
            categorySelect?.addEventListener('change', () => {
                const selectedCategory = categorySelect.value;
                typeSelect.innerHTML = '<option value="" disabled selected>-- اختر النوع الفرعي --</option>';
                typeSelect.disabled = true;
                if (selectedCategory && this.aidCategories[selectedCategory]) {
                    this.aidCategories[selectedCategory].forEach(subType => {
                        const option = document.createElement('option');
                        option.value = subType;
                        option.textContent = subType;
                        typeSelect.appendChild(option);
                    });
                    typeSelect.disabled = false;
                }
            });

            document.getElementById('futureAidSearchInput')?.addEventListener('input', () => this.loadFutureAidData());
            document.getElementById('futureAidPageSizeSelect')?.addEventListener('change', (e) => { this.futureAidPageSize = parseInt(e.target.value, 10); this.futureAidCurrentPage = 1; this.loadFutureAidData(); });
            document.getElementById('futureAidPagination')?.addEventListener('click', (e) => { if (e.target.dataset.page) { this.futureAidCurrentPage = parseInt(e.target.dataset.page, 10); this.loadFutureAidData(); } });
            document.getElementById('futureAidsTableBody')?.addEventListener('click', e => { if (e.target.closest('.complete-aid-btn')) this.handleCompleteSingleAid(e, token); });
            document.getElementById('completeAllAidBtn')?.addEventListener('click', () => this.handleBulkComplete());
            document.getElementById('confirmBulkProcessBtn')?.addEventListener('click', () => this.handleConfirmBulkProcess(token));
            document.getElementById('resetRequestsTableBody')?.addEventListener('click', e => this.handleClearPassword(e, token));
            document.getElementById('membersTableBody')?.addEventListener('click', e => { 
                if (e.target.closest('.reset-password-btn')) this.handleResetPassword(e, token); 
                if (e.target.closest('.print-member-btn')) this.handlePrintMemberReport(e);
            });
            document.getElementById('startPrintBtn')?.addEventListener('click', () => {
                const printContent = document.getElementById('printReportContent').innerHTML;
                const originalContent = document.body.innerHTML;
                document.body.innerHTML = printContent;
                window.print();
                document.body.innerHTML = originalContent;
                window.location.reload(); 
            });
            document.getElementById('completedAidSearchInput')?.addEventListener('input', () => this.loadCompletedAidData());
            document.getElementById('completedAidPageSizeSelect')?.addEventListener('change', () => this.loadCompletedAidData());
        },

        async loadAdminDashboard(token) {
            this.loadAllMembersForSearch();
            const statsResult = await this.apiCall({ action: 'getAdminStats', token });
            if (statsResult && statsResult.stats) {
                document.getElementById('totalMembers').textContent = statsResult.stats.totalIndividuals;
                document.getElementById('totalAid').textContent = statsResult.stats.totalAid;
            }
            this.loadMembers(token);
            this.fetchAidDataAndPopulateTables(token);
            this.fetchResetRequests(token);
        },
        
        async loadAllMembersForSearch() {
            const result = await this.apiCall({ action: 'getAllMembers', token: sessionStorage.getItem('adminToken'), page: 1, pageSize: 5000 }); 
            if (result && result.members) {
                this.membersList = result.members.map(member => ({ id: member['رقم الهوية'], name: member['الاسم الكامل'] }));
                this.populateBeneficiaryList(this.membersList);
            }
        },
        populateBeneficiaryList(members) {
            const selectList = document.getElementById('aidMemberSelect');
            selectList.innerHTML = '';
            if (members.length === 0) {
                selectList.innerHTML = '<option disabled>لا توجد نتائج تطابق البحث</option>';
                return;
            }
            members.forEach(member => {
                const option = document.createElement('option');
                option.value = member.id;
                option.textContent = `${member.name} | ${member.id}`;
                selectList.appendChild(option);
            });
        },
        
        async loadMembers(token) {
            const tableBody = document.getElementById('membersTableBody');
            tableBody.innerHTML = '<tr><td colspan="5" class="text-center">جاري تحميل الأفراد...</td></tr>';
            const result = await this.apiCall({ action: 'getAllMembers', token: token, searchTerm: document.getElementById('memberSearchInput').value, page: this.currentPage, pageSize: this.pageSize });
            if (result && result.members) {
                this.renderMembersTable(result.members);
                document.getElementById('membersTotalCount').textContent = `إجمالي الأفراد: ${result.total}`;
                this.renderPagination(result.total, document.getElementById('memberPagination'));
            } else {
                tableBody.innerHTML = '<tr><td colspan="5" class="text-center">لا يوجد أفراد لعرضهم.</td></tr>';
                document.getElementById('membersTotalCount').textContent = 'إجمالي الأفراد: 0';
                document.getElementById('memberPagination').innerHTML = '';
            }
        },
        async handleSearch(e, token, isButtonClick = false) {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => { this.currentPage = 1; this.loadMembers(token); }, isButtonClick ? 0 : 500);
        },
        renderMembersTable(members) {
            const tableBody = document.getElementById('membersTableBody');
            if (members.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="5" class="text-center">لا يوجد أفراد لعرضهم.</td></tr>';
                return;
            }
            tableBody.innerHTML = members.map(member => `<tr><td>${member['الاسم الكامل']}</td><td>${member['رقم الهوية']}</td><td>${member['رقم الجوال'] || '-'}</td><td>${member['مكان الإقامة'] || '-'}</td><td><button class="btn btn-sm btn-info edit-member-btn" data-member='${JSON.stringify(member)}' data-bs-toggle="modal" data-bs-target="#editMemberModal"><i class="bi bi-pencil-square"></i></button><button class="btn btn-sm btn-warning reset-password-btn" data-id="${member['رقم الهوية']}"><i class="bi bi-key-fill"></i></button><button class="btn btn-sm btn-secondary print-member-btn" data-id="${member['رقم الهوية']}" data-name="${member['الاسم الكامل']}"><i class="bi bi-printer-fill"></i></button></td></tr>`).join('');
        },
        renderPagination(total, container) {
            const totalPages = Math.ceil(total / this.pageSize);
            let html = '';
            if (totalPages > 1) {
                html = '<nav><ul class="pagination pagination-sm">';
                for (let i = 1; i <= totalPages; i++) {
                    html += `<li class="page-item ${i === this.currentPage ? 'active' : ''}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
                }
                html += '</ul></nav>';
            }
            container.innerHTML = html;
        },
        
        async handlePrintMemberReport(e) {
            const button = e.target.closest('.print-member-btn');
            const userId = button.dataset.id;
            const userName = button.dataset.name;

            const [userDataResult, aidHistoryResult, futureAidResult] = await Promise.all([
                this.apiCall({ action: 'getUserData', userId, token: sessionStorage.getItem('adminToken') }),
                this.apiCall({ action: 'getUserAidHistory', userId, token: sessionStorage.getItem('adminToken') }),
                this.apiCall({ action: 'getUserFutureAid', userId, token: sessionStorage.getItem('adminToken') })
            ]);

            if (userDataResult && aidHistoryResult && futureAidResult) {
                const userData = userDataResult.data;
                const aidHistory = aidHistoryResult.data;
                const futureAid = futureAidResult.data;

                const modalBody = document.getElementById('printReportContent');
                modalBody.innerHTML = this.generateReportHTML(userData, aidHistory, futureAid);

                const printModal = new bootstrap.Modal(document.getElementById('printReportModal'));
                printModal.show();
            }
        },
        
        generateReportHTML(userData, aidHistory, futureAid) {
            const userInfoHTML = `
                <h5><i class="bi bi-person-fill me-2"></i>البيانات الشخصية</h5>
                <table class="table table-bordered table-sm mb-4">
                    <tr><th>الاسم الكامل</th><td>${userData['الاسم الكامل'] || '-'}</td></tr>
                    <tr><th>رقم الهوية</th><td>${userData['رقم الهوية'] || '-'}</td></tr>
                    <tr><th>رقم الجوال</th><td>${userData['رقم الجوال'] || '-'}</td></tr>
                    <tr><th>مكان الإقامة</th><td>${userData['مكان الإقامة'] || '-'}</td></tr>
                    <tr><th>اسم الزوجة</th><td>${userData['اسم الزوجة رباعي'] || '-'}</td></tr>
                    <tr><th>رقم هوية الزوجة</th><td>${userData['رقم هوية الزوجة'] || '-'}</td></tr>
                </table>
            `;
            
            const aidHistoryHTML = `
                <h5><i class="bi bi-card-list me-2"></i>سجل المساعدات المكتملة</h5>
                <table class="table table-bordered table-sm">
                    <thead><tr><th>نوع المساعدة</th><th>التاريخ</th><th>المصدر</th></tr></thead>
                    <tbody>
                        ${aidHistory.length > 0 ?
                            aidHistory.map(item => `
                                <tr>
                                    <td>${item['نوع المساعدة']}</td>
                                    <td>${this.formatDateToEnglish(item['تاريخ الاستلام'])}</td>
                                    <td>${item['مصدر المساعدة'] || '-'}</td>
                                </tr>
                            `).join('')
                            : '<tr><td colspan="3" class="text-center">لا يوجد سجل مساعدات.</td></tr>'
                        }
                    </tbody>
                </table>
            `;

            const futureAidHTML = `
                <h5><i class="bi bi-calendar-check me-2"></i>المساعدات المستقبلية</h5>
                <table class="table table-bordered table-sm">
                    <thead><tr><th>نوع المساعدة</th><th>التاريخ</th><th>المصدر</th></tr></thead>
                    <tbody>
                        ${futureAid.length > 0 ?
                            futureAid.map(item => `
                                <tr>
                                    <td>${item['نوع المساعدة']}</td>
                                    <td>${this.formatDateToEnglish(item['تاريخ الاستلام'])}</td>
                                    <td>${item['مصدر المساعدة'] || '-'}</td>
                                </tr>
                            `).join('')
                            : '<tr><td colspan="3" class="text-center">لا توجد مساعدات مستقبلية.</td></tr>'
                        }
                    </tbody>
                </table>
            `;

            return `
                <div class="print-container">
                    <div class="text-center mb-4">
                        <img src="logo.webp" alt="شعار عائلة أبو رجيلة" style="max-width: 80px;">
                        <h4 class="mt-2">تقرير الفرد: ${userData['الاسم الكامل']}</h4>
                    </div>
                    ${userInfoHTML}
                    ${aidHistoryHTML}
                    ${futureAidHTML}
                </div>
            `;
        },

        async fetchAidDataAndPopulateTables(token) {
            const aidResult = await this.apiCall({ action: 'getAllAidRecords', token });
            if (aidResult && aidResult.data) {
                this.allAidRecords = aidResult.data;
                this.allFutureAidRecords = aidResult.data.filter(aid => String(aid['حالة المساعدة']).trim() === 'Future');
                this.allCompletedAidRecords = aidResult.data.filter(aid => String(aid['حالة المساعدة']).trim() === 'Completed');
                
                this.futureAidCurrentPage = 1;
                this.loadFutureAidData();
                this.loadCompletedAidData();
            }
        },
        loadFutureAidData() {
            const searchTerm = document.getElementById('futureAidSearchInput')?.value.toLowerCase() || '';
            let filteredRecords = this.allFutureAidRecords.filter(record => 
                (record['اسم المستفيد'] || '').toLowerCase().includes(searchTerm) ||
                (record['نوع المساعدة'] || '').toLowerCase().includes(searchTerm)
            );
            document.getElementById('futureAidTotalCount').textContent = `إجمالي السجلات: ${filteredRecords.length}`;
            const startIndex = (this.futureAidCurrentPage - 1) * this.futureAidPageSize;
            const paginatedRecords = filteredRecords.slice(startIndex, startIndex + this.futureAidPageSize);
            this.renderFutureAidTable(paginatedRecords);
            this.renderFutureAidPagination(filteredRecords.length);
        },
        loadCompletedAidData() {
            const tableBody = document.getElementById('completedAidsTableBody');
            const searchTerm = document.getElementById('completedAidSearchInput')?.value.toLowerCase() || '';
            const pageSize = parseInt(document.getElementById('completedAidPageSizeSelect')?.value, 10) || 10;
            
            const filteredRecords = this.allCompletedAidRecords.filter(record => 
                (record['اسم المستفيد'] || '').toLowerCase().includes(searchTerm) ||
                (record['نوع المساعدة'] || '').toLowerCase().includes(searchTerm)
            );
            
            document.getElementById('completedAidTotalCount').textContent = `إجمالي السجلات: ${filteredRecords.length}`;
            
            const paginatedRecords = filteredRecords.slice(0, pageSize);
            
            this.renderCompletedAidTable(paginatedRecords);
        },
        renderFutureAidTable(records) {
            const tableBody = document.getElementById('futureAidsTableBody');
            if (records.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="6" class="text-center">لا توجد سجلات.</td></tr>';
                return;
            }
            tableBody.innerHTML = records.map(aid => `<tr data-beneficiary-id="${aid['معرف المستفيد']}"><td>${aid['اسم المستفيد'] || '-'}</td><td>${aid['معرف المستفيد']}</td><td>${aid['نوع المساعدة']}</td><td>${this.formatDateToEnglish(aid['تاريخ الاستلام'])}</td><td>${aid['مصدر المساعدة'] || '-'}</td><td><button class="btn btn-sm btn-success complete-aid-btn" data-id="${aid['معرف المساعدة']}"><i class="bi bi-check-lg"></i></button></td></tr>`).join('');
        },
        renderCompletedAidTable(records) {
            const tableBody = document.getElementById('completedAidsTableBody');
            if (records.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="5" class="text-center">لا توجد سجلات.</td></tr>';
                return;
            }
            tableBody.innerHTML = records.map(aid => `
                <tr>
                    <td>${aid['اسم المستفيد'] || '-'}</td>
                    <td>${aid['معرف المستفيد']}</td>
                    <td>${aid['نوع المساعدة']}</td>
                    <td>${this.formatDateToEnglish(aid['تاريخ الاستلام'])}</td>
                    <td>${aid['مصدر المساعدة'] || '-'}</td>
                </tr>
            `).join('');
        },
        renderFutureAidPagination(total) {
            const container = document.getElementById('futureAidPagination');
            const totalPages = Math.ceil(total / this.futureAidPageSize);
            let html = '';
            if (totalPages > 1) {
                html = '<nav><ul class="pagination pagination-sm">';
                for (let i = 1; i <= totalPages; i++) {
                    html += `<li class="page-item ${i === this.futureAidCurrentPage ? 'active' : ''}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
                }
                html += '</ul></nav>';
            }
            container.innerHTML = html;
        },
        async handleCompleteSingleAid(e, token) {
            const aidId = e.target.closest('.complete-aid-btn').dataset.id;
            const confirmed = await this.showConfirmationModal('هل أنت متأكد من تسليم هذه المساعدة؟');
            if (confirmed) {
                const result = await this.apiCall({ action: 'updateAidStatus', token, aidId, newStatus: 'Completed' }, true);
                if (result) this.fetchAidDataAndPopulateTables(token);
            }
        },
        handleBulkComplete() {
            document.getElementById('exceptionIdsTextarea').value = '';
            this.bulkCompleteModal.show();
        },
        async handleConfirmBulkProcess(token) {
            const visibleRows = document.querySelectorAll('#futureAidsTableBody tr[data-beneficiary-id]');
            const allVisibleBeneficiaryIds = Array.from(visibleRows).map(row => row.dataset.beneficiaryId);
            const aidRecordsToDelete = document.getElementById('exceptionIdsTextarea').value.split('\n').map(id => id.trim()).filter(id => id);
            const beneficiaryIdsToComplete = allVisibleBeneficiaryIds.filter(id => !aidRecordsToDelete.includes(id));

            if (beneficiaryIdsToComplete.length === 0 && aidRecordsToDelete.length === 0) {
                 this.showToast('لم يتم تحديد أي إجراء.', false);
                 return;
            }
            const result = await this.apiCall({ action: 'bulkProcessAid', token, beneficiaryIdsToComplete, aidRecordsToDelete }, true);
            if (result) {
                this.bulkCompleteModal.hide();
                this.fetchAidDataAndPopulateTables(token);
            }
        },

        async handleAddAid(e, token) {
            e.preventDefault();
            const form = e.target;
            const aidData = {
                aidMemberId: document.getElementById('aidMemberSelect').value,
                aidType: document.getElementById('aidType').value,
                aidStatus: document.getElementById('aidStatus').value,
                aidDate: document.getElementById('aidDate').value,
                aidSource: document.getElementById('aidSource').value,
                aidNotes: document.getElementById('aidNotes').value,
            };
            if (!aidData.aidMemberId || !aidData.aidType) {
                this.showToast('الرجاء اختيار مستفيد ونوع المساعدة.', false);
                return;
            }
            const result = await this.apiCall({ ...aidData, action: 'addAid', token }, true);
            if (result) {
                form.reset();
                document.getElementById('aidType').innerHTML = '<option value="" disabled selected>-- اختر النوع الفرعي --</option>';
                document.getElementById('aidType').disabled = true;
                this.populateBeneficiaryList(this.membersList);
            }
        },
        async handleAidFileUpload(e, token) {
            e.preventDefault();
            const file = document.getElementById('xlsxFile').files[0];
            if (!file) { this.showToast('الرجاء اختيار ملف أولاً.', false); return; }
            const reader = new FileReader();
            reader.onload = async (event) => {
                const result = await this.apiCall({ action: 'bulkAddAidFromXLSX', token: token, fileContent: btoa(event.target.result) }, true);
                if (result) e.target.reset();
            };
            reader.readAsBinaryString(file);
        },
        async handleReportGeneration(e, token) {
            e.preventDefault();
            const startDate = document.getElementById('startDate').value;
            const endDate = document.getElementById('endDate').value;
            if (!startDate || !endDate) {
                this.showToast('الرجاء تحديد تاريخ البدء والانتهاء للتقرير.', false);
                return;
            }
            const result = await this.apiCall({ action: 'generateReport', token, reportType: 'aidByDateRange', filters: { startDate, endDate } });
            if (result && result.data) this.renderReportResults(result.data);
        },
        renderReportResults(data) {
            const tableBody = document.getElementById('reportTableBody');
            const exportBtn = document.getElementById('exportReportBtn');
            if (data.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="5" class="text-center">لا توجد بيانات لهذه الفترة.</td></tr>';
                exportBtn.style.display = 'none';
            } else {
                tableBody.innerHTML = data.map(record => `<tr><td>${record['اسم المستفيد']}</td><td>${record['معرف المستفيد']}</td><td>${record['نوع المساعدة']}</td><td>${this.formatDateToEnglish(record['تاريخ الاستلام'])}</td><td>${record['مصدر المساعدة']}</td></tr>`).join('');
                exportBtn.style.display = 'inline-block';
            }
            document.getElementById('reportResults').classList.remove('d-none');
        },
        exportReportToExcel() {
            const table = document.getElementById('reportResults');
            if (!table) {
                this.showToast('لا توجد بيانات في التقرير للتصدير.', false);
                return;
            }
    
            const wb = XLSX.utils.book_new();
            const ws_data = [
                Array.from(table.querySelector('thead tr').children).map(th => th.innerText),
                ...Array.from(table.querySelector('tbody').rows).map(row => 
                    Array.from(row.cells).map(cell => cell.innerText)
                )
            ];
            
            const ws = XLSX.utils.aoa_to_sheet(ws_data);
            XLSX.utils.book_append_sheet(wb, ws, "تقرير المساعدات");
            XLSX.writeFile(wb, "تقرير-المساعدات.xlsx");
        },

        exportAidTemplateToExcel() {
            const headers = ['معرف المستفيد', 'نوع المساعدة', 'تاريخ الاستلام', 'مصدر المساعدة', 'ملاحظات', 'حالة المساعدة'];
            const exampleRow = ['123456789', 'نقد مباشر للعائلات المحتاجة', '2025-09-06', 'قسائم/دهش/عضوية', 'ملاحظات حول المساعدة', 'Completed'];
            
            // إنشاء مصفوفة تحتوي على العناوين والصف النموذجي
            const data = [headers, exampleRow];
            
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet(data);
            XLSX.utils.book_append_sheet(wb, ws, "قالب المساعدات");
            XLSX.writeFile(wb, "قالب-المساعدات.xlsx");
        },

        initSuperAdminPage() {
            const token = sessionStorage.getItem('adminToken');
            if (!token || sessionStorage.getItem('adminRole') !== 'superadmin') {
                window.location.href = 'admin.html';
                return;
            }
            this.renderCreateAdminForm();
            this.loadAdmins(token);
            document.getElementById('createAdminForm').addEventListener('submit', (e) => this.handleCreateAdminSubmit(e, token));
            document.getElementById('adminsTable').addEventListener('click', (e) => { 
                if (e.target.closest('.toggle-status-btn')) {
                    this.handleStatusChange(e, token);
                }
            });
        },
        async handleStatusChange(event, token) {
            const button = event.target.closest('.toggle-status-btn');
            const username = button.dataset.username;
            const currentStatus = button.dataset.status;
            const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
            
            const confirmed = await this.showConfirmationModal(`هل أنت متأكد من تغيير حالة المدير ${username} إلى ${newStatus === 'Active' ? 'نشط' : 'غير نشط'}؟`);
            
            if (confirmed) {
                const result = await this.apiCall({ action: 'updateAdminStatus', token, username, newStatus }, true);
                if (result) {
                    this.loadAdmins(token);
                }
            }
        },
        renderCreateAdminForm() { document.getElementById('createAdminForm').innerHTML = `<div class="row"><div class="col-md-4 mb-3"><label for="newUsername" class="form-label">اسم المستخدم</label><input type="text" class="form-control" id="newUsername" required></div><div class="col-md-4 mb-3"><label for="newPassword" class="form-label">كلمة المرور</label><input type="password" class="form-control" id="newPassword" required></div><div class="col-md-4 mb-3"><label for="newRole" class="form-label">الصلاحية</label><select id="newRole" class="form-select" required><option value="admin">Admin</option><option value="superadmin">Super Admin</option></select></div></div><button type="submit" class="btn btn-primary">إنشاء حساب</button>`; },
        async handleCreateAdminSubmit(e, token) { e.preventDefault(); const result = await this.apiCall({ action: 'createAdmin', token, username: document.getElementById('newUsername').value, password: document.getElementById('newPassword').value, role: document.getElementById('newRole').value }, true); if (result) { e.target.reset(); this.loadAdmins(token); } },
        async loadAdmins(token) { const tableBody = document.getElementById('adminsTable'); tableBody.innerHTML = '<tr><td colspan="5" class="text-center">جاري التحميل...</td></tr>'; const result = await this.apiCall({ action: 'getAdmins', token }); if (result && result.admins) this.renderAdminsTable(result.admins); else tableBody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">فشل تحميل القائمة.</td></tr>'; },
        renderAdminsTable(admins) { 
            document.getElementById('adminsTable').innerHTML = admins.map(admin => {
                const statusBadge = admin['الحالة'] === 'Active' ? '<span class="badge bg-success">نشط</span>' : '<span class="badge bg-danger">غير نشط</span>';
                const actionButton = admin['الحالة'] === 'Active' 
                    ? `<button class="btn btn-sm btn-danger toggle-status-btn" data-username="${admin['اسم المستخدم']}" data-status="Active"><i class="bi bi-person-x-fill"></i> غير نشط</button>` 
                    : `<button class="btn btn-sm btn-success toggle-status-btn" data-username="${admin['اسم المستخدم']}" data-status="Inactive"><i class="bi bi-person-check-fill"></i> نشط</button>`;
                return `<tr><td>${admin['اسم المستخدم']}</td><td><span class="badge bg-primary">${admin['الصلاحية']}</span></td><td>${this.formatDateToEnglish(admin['تاريخ الإنشاء'])}</td><td>${statusBadge}</td><td>${actionButton}</td></tr>`;
            }).join('');
        },
        
        async fetchResetRequests(token) {
            const result = await this.apiCall({ action: 'getResetRequests', token });
            if (result && result.data) this.renderResetRequests(result.data);
        },
        renderResetRequests(requests) {
            const tableBody = document.getElementById('resetRequestsTableBody');
            if (requests.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="3" class="text-center">لا يوجد طلبات جديدة.</td></tr>';
                return;
            }
            tableBody.innerHTML = requests.map(req => `<tr><td>${this.formatDateTimeToEnglish(req['التاريخ والوقت'])}</td><td>${req['رقم الهوية']}</td><td><button class="btn btn-sm btn-success clear-password-btn" data-userid="${req['رقم الهوية']}" data-timestamp="${req['التاريخ والوقت']}"><i class="bi bi-check-circle-fill me-1"></i> موافقة ومسح</button></td></tr>`).join('');
        },
        async handleClearPassword(e, token) {
            const button = e.target.closest('.clear-password-btn');
            const { userid, timestamp } = button.dataset;
            const confirmed = await this.showConfirmationModal(`هل أنت متأكد من مسح كلمة مرور المستخدم ${userid}؟`);
            if (confirmed) {
                const result = await this.apiCall({ action: 'clearMemberPassword', token, userId: userid, timestamp }, true);
                if (result) this.fetchResetRequests(token);
            }
        },
        async handleResetPassword(e, token) {
            const userId = e.target.closest('.reset-password-btn').dataset.id;
            const confirmed = await this.showConfirmationModal(`هل أنت متأكد من مسح كلمة مرور المستخدم ${userId}؟`);
            if (confirmed) {
                const result = await this.apiCall({ action: 'clearMemberPassword', token, userId }, true);
                if (result) this.showToast(`تم مسح كلمة مرور ${userId} بنجاح.`, true);
            }
        },
    };

    App.init();
});