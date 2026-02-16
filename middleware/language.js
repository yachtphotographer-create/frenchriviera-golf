const en = require('../locales/en.json');
const fr = require('../locales/fr.json');

const translations = { en, fr };
const supportedLanguages = ['en', 'fr'];
const defaultLanguage = 'en';

/**
 * Language middleware - detects and sets the user's language preference
 * Priority: 1. Query param (?lang=fr), 2. Cookie, 3. Accept-Language header, 4. Default (en)
 */
const languageMiddleware = (req, res, next) => {
    let lang = defaultLanguage;

    // 1. Check for query parameter (allows switching language via ?lang=fr)
    if (req.query.lang && supportedLanguages.includes(req.query.lang)) {
        lang = req.query.lang;
        // Set cookie to remember preference (1 year)
        res.cookie('lang', lang, {
            maxAge: 365 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'lax'
        });
    }
    // 2. Check for existing cookie
    else if (req.cookies && req.cookies.lang && supportedLanguages.includes(req.cookies.lang)) {
        lang = req.cookies.lang;
    }
    // 3. Check Accept-Language header
    else if (req.headers['accept-language']) {
        const acceptedLangs = req.headers['accept-language'].split(',');
        for (const acceptedLang of acceptedLangs) {
            const langCode = acceptedLang.split(';')[0].trim().substring(0, 2).toLowerCase();
            if (supportedLanguages.includes(langCode)) {
                lang = langCode;
                break;
            }
        }
    }

    // Set language in request and response locals
    req.lang = lang;
    res.locals.lang = lang;
    res.locals.t = translations[lang];
    res.locals.translations = translations[lang];

    // Helper function for getting translated content from database fields
    res.locals.getLocalizedField = (obj, fieldBaseName) => {
        const fieldName = `${fieldBaseName}_${lang}`;
        const fallbackField = `${fieldBaseName}_en`;
        return obj[fieldName] || obj[fallbackField] || obj[fieldBaseName] || '';
    };

    // Set HTML lang attribute
    res.locals.htmlLang = lang;

    next();
};

module.exports = languageMiddleware;
