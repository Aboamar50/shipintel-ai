(function () {
    const config = window.SHIPINTEL_SUPABASE_CONFIG || {};
    const url = typeof config.url === 'string' ? config.url.trim() : '';
    const anonKey = typeof config.anonKey === 'string' ? config.anonKey.trim() : '';
    const configured = Boolean(
        url &&
        anonKey &&
        url !== 'YOUR_SUPABASE_PROJECT_URL' &&
        anonKey !== 'YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY'
    );
    let client = null;
    let authListener = null;

    function requireClient() {
        if (!client) throw new Error('خدمة Supabase غير مهيأة. تحقق من إعدادات المشروع والاتصال.');
        return client;
    }

    function mapShipment(row) {
        return {
            id: row.id,
            bl: row.bl,
            container: row.container,
            carrier: row.carrier,
            origin: row.origin,
            dest: row.dest,
            eta: row.eta,
            status: row.status,
            timeline: row.timeline,
            statusTextAr: row.status === 'customs' ? 'قيد التخليص الجمركي' : '',
            statusTextEn: row.status === 'customs' ? 'Customs clearance' : ''
        };
    }

    async function initialize() {
        if (!configured) return { configured: false, user: null };
        if (!window.supabase || typeof window.supabase.createClient !== 'function') {
            throw new Error('تعذر تحميل مكتبة Supabase. تحقق من اتصال الإنترنت أو إعدادات حظر المحتوى.');
        }
        if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(url)) {
            throw new Error('رابط Supabase غير صالح. استخدم Project URL الظاهر في إعدادات مشروعك.');
        }

        client = window.supabase.createClient(url, anonKey, {
            auth: {
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: true
            }
        });

        const { data, error } = await client.auth.getSession();
        if (error) throw error;
        client.auth.onAuthStateChange((event, session) => {
            if (authListener) {
                window.setTimeout(() => {
                    if (authListener) authListener(session ? session.user : null, event);
                }, 0);
            }
        });
        return { configured: true, user: data.session ? data.session.user : null };
    }

    async function getProfile() {
        const activeClient = requireClient();
        const { data, error } = await activeClient
            .from('profiles')
            .select('display_name, role')
            .single();
        if (error) throw error;
        return data;
    }

    async function getShipments() {
        const activeClient = requireClient();
        const { data, error } = await activeClient
            .from('shipments')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data.map(mapShipment);
    }

    async function saveShipment(shipment) {
        const activeClient = requireClient();
        const record = {
            bl: shipment.bl,
            container: shipment.container,
            carrier: shipment.carrier,
            origin: shipment.origin,
            dest: shipment.dest,
            eta: shipment.eta,
            status: shipment.status,
            timeline: shipment.timeline || []
        };
        const request = shipment.id
            ? activeClient.from('shipments').update(record).eq('id', shipment.id)
            : activeClient.from('shipments').insert(record);
        const { data, error } = await request.select('*').single();
        if (error) throw error;
        return mapShipment(data);
    }

    async function deleteShipment(id) {
        const { data, error } = await requireClient()
            .from('shipments')
            .delete()
            .eq('id', id)
            .select('id')
            .maybeSingle();
        if (error) throw error;
        if (!data) throw new Error('لم يتم حذف الشحنة؛ قد تكون غير موجودة أو لا تملك صلاحية تعديلها.');
    }

    window.shipIntelBackend = Object.freeze({
        configured,
        initialize,
        getProfile,
        getShipments,
        saveShipment,
        deleteShipment,
        onAuthStateChange(callback) {
            authListener = callback;
        },
        signIn(email, password) {
            return requireClient().auth.signInWithPassword({ email, password });
        },
        signUp(email, password, fullName) {
            return requireClient().auth.signUp({
                email,
                password,
                options: {
                    data: { full_name: fullName },
                    emailRedirectTo: new URL('dashboard.html', window.location.href).href
                }
            });
        },
        signOut() {
            return requireClient().auth.signOut();
        },
        resetPassword(email, redirectTo) {
            return requireClient().auth.resetPasswordForEmail(email, { redirectTo });
        },
        updatePassword(password) {
            return requireClient().auth.updateUser({ password });
        }
    });
})();
