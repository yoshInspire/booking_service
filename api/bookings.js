const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'data', 'bookings.json');
const REDIS_KEY = 'bookings';

function useRedis() {
    return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

let _redis = null;
function getRedis() {
    if (_redis) return _redis;
    const { Redis } = require('@upstash/redis');
    _redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN
    });
    return _redis;
}

async function readBookings() {
    if (useRedis()) {
        try {
            const raw = await getRedis().get(REDIS_KEY);
            if (raw == null || raw === '') return [];
            const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
            return Array.isArray(data) ? data : [];
        } catch (e) {
            console.warn('Redis readBookings:', e.message);
            return [];
        }
    }
    try {
        const raw = fs.readFileSync(DATA_PATH, 'utf8').trim();
        if (!raw) return [];
        const data = JSON.parse(raw);
        return Array.isArray(data) ? data : [];
    } catch (e) {
        if (e.code === 'ENOENT') return [];
        return [];
    }
}

async function writeBookings(bookings) {
    if (useRedis()) {
        await getRedis().set(REDIS_KEY, JSON.stringify(bookings));
        return;
    }
    try {
        fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
        fs.writeFileSync(DATA_PATH, JSON.stringify(bookings, null, 2), 'utf8');
    } catch (e) {
        console.warn('writeBookings (file):', e.message);
        throw e;
    }
}

function parseBody(req) {
    if (!req.body) return {};
    if (typeof req.body === 'string') {
        try { return JSON.parse(req.body); } catch (_) { return {}; }
    }
    return req.body || {};
}

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        if (req.method === 'POST') {
            const body = parseBody(req);
            const teacher = body.teacher;
            const date = body.date;
            const selectedTime = body.selectedTime;

            if (!teacher || !date || !selectedTime) {
                return res.status(400).json({ error: 'Неполные данные' });
            }

            const bookings = await readBookings();
            const id = Date.now();
            const newBooking = {
                id,
                teacher: String(teacher),
                date: String(date),
                selectedTime: String(selectedTime),
                parentName: String(body.parentName || ''),
                phone: String(body.phone || ''),
                email: String(body.email || ''),
                studentName: String(body.studentName || ''),
                studentClass: String(body.studentClass || ''),
                comment: String(body.comment || ''),
                status: body.status || 'новая',
                createdAt: body.createdAt || new Date().toISOString()
            };
            bookings.push(newBooking);
            await writeBookings(bookings);

            return res.status(201).json({
                success: true,
                id,
                message: 'Запись создана успешно'
            });
        }

        if (req.method === 'GET' && req.query && req.query.teacher && req.query.date) {
            const bookings = await readBookings();
            const t = String(req.query.teacher).trim();
            const d = String(req.query.date).trim();
            const occupiedSlots = bookings
                .filter(b => String(b.teacher).trim() === t && String(b.date) === d)
                .map(b => b.selectedTime)
                .filter(Boolean);
            return res.status(200).json({ occupiedSlots });
        }

        if (req.method === 'GET') {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ error: 'Требуется авторизация' });
            }
            const bookings = await readBookings();
            return res.status(200).json(bookings);
        }

        const id = req.query && req.query.id ? String(req.query.id).trim() : null;

        if (req.method === 'PUT' && id) {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ error: 'Требуется авторизация' });
            }
            const body = parseBody(req);
            const status = body.status;
            if (!status) return res.status(400).json({ error: 'Не указан статус' });
            const valid = ['новая', 'подтверждена', 'отменена', 'завершена'];
            if (!valid.includes(status)) return res.status(400).json({ error: 'Недопустимый статус' });
            const bookings = await readBookings();
            const idx = bookings.findIndex(b => String(b.id) === id);
            if (idx === -1) return res.status(404).json({ error: 'Запись не найдена' });
            bookings[idx].status = status;
            await writeBookings(bookings);
            return res.status(200).json({ success: true });
        }

        if (req.method === 'DELETE' && id) {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ error: 'Требуется авторизация' });
            }
            const bookings = await readBookings();
            const filtered = bookings.filter(b => String(b.id) !== id);
            if (filtered.length === bookings.length) return res.status(404).json({ error: 'Запись не найдена' });
            await writeBookings(filtered);
            return res.status(200).json({ success: true });
        }

        return res.status(405).json({ error: 'Метод не разрешен' });
    } catch (error) {
        console.error('Ошибка API bookings:', error);
        return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
};
