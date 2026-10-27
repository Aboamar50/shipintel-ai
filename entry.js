(function () {
    const allowedRoles = new Set(['admin', 'customs_agent']);
    const localDemoSessionKey = 'shipintel-local-demo-session';
    const feedback = document.getElementById('entryFeedback');
    const form = document.getElementById('entryAuthForm');
    const emailInput = document.getElementById('entryEmail');
    const passwordInput = document.getElementById('entryPassword');
    const submitButton = document.getElementById('entrySubmit');
    const resetButton = document.getElementById('entryForgotPassword');
    const backend = window.shipIntelBackend;
    const isLocalHost = location.protocol === 'file:' ||
        ['localhost', '127.0.0.1', '::1'].includes(location.hostname);
    const localDemoAvailable = isLocalHost && !(backend && backend.configured);

    function showFeedback(key, isError) {
        feedback.dataset.i18n = key || '';
        feedback.textContent = key ? t(key) : '';
        feedback.hidden = !key;
        feedback.classList.toggle('error', Boolean(isError));
    }

    function configureContactLinks() {
        const phone = String(window.SHIPINTEL_CONTACT_CONFIG?.whatsappPhone || '').replace(/\D/g, '');
        const validPhone = /^\d{10,15}$/.test(phone);
        document.querySelectorAll('[data-whatsapp-link]').forEach(link => {
            if (!validPhone) {
                link.removeAttribute('href');
                link.setAttribute('aria-disabled', 'true');
                link.setAttribute('tabindex', '-1');
                return;
            }
            link.href = `https://wa.me/${phone}?text=${encodeURIComponent(
                t('whatsappMessage')
            )}`;
        });
        document.querySelectorAll('[data-phone-link]').forEach(link => {
            if (!validPhone) {
                link.removeAttribute('href');
                link.setAttribute('aria-disabled', 'true');
                link.setAttribute('tabindex', '-1');
                return;
            }
            link.href = `tel:+${phone}`;
        });
    }

    async function redirectIfAuthorized(user) {
        const profile = await backend.getProfile(user.id);
        if (!profile || !allowedRoles.has(profile.role)) {
            const { error } = await backend.signOut();
            if (error) console.error('تعذر إنهاء جلسة حساب غير مخوّل.', error);
            showFeedback('entryUnauthorized', true);
            return false;
        }
        window.location.replace(`dashboard.html?lang=${currentLang}`);
        return true;
    }

    function showServiceError(error) {
        console.error('تعذرت تهيئة خدمة الدخول الآمن.', error);
        showFeedback('entryServiceError', true);
    }

    async function initialize() {
        configureContactLinks();
        emailInput.type = localDemoAvailable ? 'text' : 'email';
        form.addEventListener('submit', async event => {
            event.preventDefault();
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            if (localDemoAvailable) {
                if (email !== 'admin' || password !== '12345678') {
                    showFeedback('entryLocalInvalid', true);
                    return;
                }
                try {
                    sessionStorage.setItem(localDemoSessionKey, 'admin');
                } catch (error) {
                    console.error('تعذر حفظ جلسة العرض المحلية.', error);
                    showFeedback('entrySessionError', true);
                    return;
                }
                window.location.replace(`dashboard.html?lang=${currentLang}`);
                return;
            }
            if (!email || !emailInput.validity.valid) {
                showFeedback('entryEmailInvalid', true);
                emailInput.focus();
                return;
            }
            if (password.length < 8) {
                showFeedback('entryPasswordInvalid', true);
                passwordInput.focus();
                return;
            }
            submitButton.disabled = true;
            showFeedback('');
            try {
                const { data, error } = await backend.signIn(email, password);
                if (error) throw error;
                if (!data.user) throw new Error('لم تُرجع خدمة الدخول بيانات المستخدم.');
                await redirectIfAuthorized(data.user);
            } catch (error) {
                console.error('فشلت عملية تسجيل الدخول.', error);
                showFeedback('entrySignInError', true);
            } finally {
                submitButton.disabled = false;
            }
        });

        resetButton.addEventListener('click', async () => {
            const email = emailInput.value.trim();
            if (!email || !emailInput.validity.valid) {
                showFeedback('entryForgotEmail', true);
                emailInput.focus();
                return;
            }
            resetButton.disabled = true;
            try {
                const redirectTo = new URL('dashboard.html', window.location.href).href;
                const { error } = await backend.resetPassword(email, redirectTo);
                if (error) throw error;
                showFeedback('entryResetSent');
            } catch (error) {
                console.error('تعذر إرسال رابط إعادة تعيين كلمة المرور.', error);
                showFeedback('entryResetError', true);
            } finally {
                resetButton.disabled = false;
            }
        });

        if (!backend || !backend.configured) {
            if (localDemoAvailable) {
                resetButton.hidden = true;
                resetButton.parentElement.hidden = true;
                return;
            }
            showFeedback('entryUnavailable', true);
            submitButton.disabled = true;
            resetButton.disabled = true;
            return;
        }
        try {
            const { user } = await backend.initialize();
            if (user) await redirectIfAuthorized(user);
        } catch (error) {
            showServiceError(error);
        }
    }

    window.addEventListener('DOMContentLoaded', () => {
        void initialize();
    });
})();
