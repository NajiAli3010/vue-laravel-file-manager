export default {
    /**
     * Set config
     * @param state
     * @param data
     */
    manualSettings(state, data) {
        // overwrite headers - Axios
        if (Object.prototype.hasOwnProperty.call(data, 'headers')) {
            state.headers = data.headers;
        }
        // base url - axios
        if (Object.prototype.hasOwnProperty.call(data, 'baseUrl')) {
            state.baseUrl = data.baseUrl;
        }
        // windows config
        if (Object.prototype.hasOwnProperty.call(data, 'windowsConfig')) {
            state.windowsConfig = data.windowsConfig;
        }
        // language
        if (Object.prototype.hasOwnProperty.call(data, 'lang')) {
            state.lang = data.lang;
        }
        // add new translation
        if (Object.prototype.hasOwnProperty.call(data, 'translation')) {
            state.translations[data.translation.name] = Object.freeze(data.translation.content);
        }
    },

    /**
     * Initiate Axios baseUrl and headers
     * @param state
     */
    initAxiosSettings(state) {
        // initiate base url, if not set manually
        if (!state.baseUrl) {
            if (import.meta.env.VITE_APP_LFM_AXIOS_BASE_URL) {
                // vue .env
                state.baseUrl = import.meta.env.VITE_APP_LFM_AXIOS_BASE_URL;
            } else if (import.meta.env.VITE_LFM_BASE_URL) {
                // laravel .env
                state.baseUrl = import.meta.env.VITE_LFM_BASE_URL;
            } else {
                let baseUrl = `${window.location.protocol}//${window.location.hostname}`;

                if (window.location.port.length) {
                    baseUrl += `:${window.location.port}/file-manager/`;
                } else {
                    baseUrl += '/file-manager/';
                }

                state.baseUrl = baseUrl;
            }
            console.log('LFM Base URL:', state.baseUrl);
        }

        // initiate headers, if not set manually
        if (Object.keys(state.headers).length === 0) {
            // off laravel csrf-token if need
            if (import.meta.env.VITE_APP_LFM_CSRF_TOKEN === 'OFF' || import.meta.env.VITE_LFM_CSRF_TOKEN === 'OFF') {
                state.headers = { 'X-Requested-With': 'XMLHttpRequest' };
                console.log('[CSRF] CSRF token disabled by env, using only X-Requested-With');
            } else {
                // Laravel CSRF token
                const token = document.head.querySelector('meta[name="csrf-token"]');
                console.log('[CSRF] Token meta tag:', token);
                if (!token) {
                    state.headers = {
                        'X-Requested-With': 'XMLHttpRequest',
                    };
                    // eslint-disable-next-line
                    console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
                } else {
                    state.headers = {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN': token.content,
                    };
                    console.log('[CSRF] Using token:', token.content);
                }
            }
        }
    },

    /**
     * Initialize App settings from server
     * @param state
     * @param data
     */
    initSettings(state, data) {
        if (!state.lang) state.lang = data.lang;
        if (!state.windowsConfig) state.windowsConfig = data.windowsConfig;
        state.acl = data.acl;
        state.hiddenFiles = data.hiddenFiles;
    },

    /**
     * Set Hide or Show hidden files
     * @param state
     */
    toggleHiddenFiles(state) {
        state.hiddenFiles = !state.hiddenFiles;
    },
};
