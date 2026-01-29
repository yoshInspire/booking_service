// /api/auth.js - УПРОЩЕННЫЙ РАБОЧИЙ ВАРИАНТ
module.exports = async (req, res) => {
    // Включаем CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    
    // Обрабатываем предварительный CORS запрос
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    console.log(`[AUTH API] ${req.method} ${req.url}`);
    
    // ПРОСТОЙ ЛОГИН - ВСЕГДА РАБОТАЕТ
    if (req.method === 'POST') {
        // Жестко закодированные учетные данные
        const VALID_USERNAME = 'admin';
        const VALID_PASSWORD = 'school123'; // Измените этот пароль!
        
        try {
            // Парсим тело запроса
            let body;
            if (typeof req.body === 'string') {
                body = JSON.parse(req.body);
            } else {
                body = req.body;
            }
            
            const { username, password } = body || {};
            
            console.log(`Login attempt: ${username} / ${password ? '***' : 'empty'}`);
            
            // Простая проверка
            if (username === VALID_USERNAME && password === VALID_PASSWORD) {
                // Генерируем токен
                const token = `admin-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                
                console.log(`Login SUCCESS for ${username}, token: ${token.substring(0, 20)}...`);
                
                return res.status(200).json({
                    success: true,
                    token: token,
                    message: 'Вход выполнен успешно'
                });
            }
            
            console.log(`Login FAILED for ${username}`);
            return res.status(401).json({
                success: false,
                error: 'Неверный логин или пароль. Используйте: admin / school123'
            });
            
        } catch (error) {
            console.error('Login parse error:', error);
            return res.status(400).json({
                success: false,
                error: 'Ошибка в данных запроса'
            });
        }
    }
    
    // ПРОВЕРКА ТОКЕНА
    if (req.method === 'GET') {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'Токен не предоставлен'
            });
        }
        
        const token = authHeader.split(' ')[1];
        
        // Принимаем любой токен, который начинается с 'admin-'
        if (token && token.startsWith('admin-')) {
            return res.status(200).json({
                success: true,
                valid: true,
                message: 'Токен действителен'
            });
        }
        
        return res.status(401).json({
            success: false,
            error: 'Недействительный токен'
        });
    }
    
    // Если метод не поддерживается
    return res.status(405).json({
        success: false,
        error: 'Метод не поддерживается'
    });
};