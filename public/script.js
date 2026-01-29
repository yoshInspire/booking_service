// script.js - Полностью обновленный скрипт для работы с API
const API_BASE_URL = '/api';

document.addEventListener('DOMContentLoaded', function() {
    console.log('Документ загружен, инициализация приложения...');
    initApp();
});

// Основная функция инициализации приложения
function initApp() {
    console.log('Инициализация приложения...');
    
    // Инициализация формы записи
    if (document.getElementById('bookingForm')) {
        console.log('Найдена форма записи, инициализируем...');
        initBookingForm();
    }
    
    // Инициализация админ-панели
    if (document.getElementById('adminLoginForm') || document.getElementById('adminPanel')) {
        console.log('Найдена админ-панель, инициализируем...');
        initAdminPanel();
    }
    
    // Инициализация обработчиков модальных окон
    initModalHandlers();
}

// Функция для инициализации формы записи
function initBookingForm() {
    console.log('Инициализация формы записи...');
    
    // Загружаем список учителей
    loadTeachers();
    
    // Загружаем список классов
    loadClassOptions();
    
    // Инициализируем календарь с выбором только суббот
    initSaturdayCalendar();
    
    // Инициализируем слоты времени
    updateTimeSlots();
    
    // Обработчик отправки формы
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        console.log('Добавляем обработчик отправки формы записи...');
        bookingForm.addEventListener('submit', handleBookingSubmit);
    }
    
    // Обработчик кнопки сброса
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetForm);
    }
    
    // Обработчик изменения выбора учителя
    const teacherSelect = document.getElementById('teacher');
    if (teacherSelect) {
        teacherSelect.addEventListener('change', function() {
            updateTimeSlots();
        });
    }
    
    // Добавляем маску для телефона
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', formatPhone);
    }
}

// Функция для загрузки учителей через API
async function loadTeachers() {
    const teacherSelect = document.getElementById('teacher');
    if (!teacherSelect) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/teachers`);
        if (!response.ok) throw new Error('Ошибка загрузки учителей');
        
        const teachers = await response.json();
        
        teacherSelect.innerHTML = '<option value="">-- Выберите учителя --</option>';
        
        // Сортируем учителей по фамилии
        teachers.sort((a, b) => {
            const lastNameA = a.name.split(' ')[0];
            const lastNameB = b.name.split(' ')[0];
            return lastNameA.localeCompare(lastNameB);
        });
        
        teachers.forEach(teacher => {
            const option = document.createElement('option');
            const roomInfo = teacher.room ? ` (каб. ${teacher.room})` : '';
            option.value = `${teacher.name}|${teacher.room || ''}`;
            option.textContent = teacher.name + roomInfo;
            teacherSelect.appendChild(option);
        });
        
        console.log('Учителя загружены:', teachers.length);
    } catch (error) {
        console.error('Ошибка загрузки учителей:', error);
        // Локальный резервный список
        loadLocalTeachers();
    }
}

// Резервный локальный список учителей
function loadLocalTeachers() {
    const teacherSelect = document.getElementById('teacher');
    const teachers = [
        {"name": "Акимова В. А.", "room": "1040"},
        {"name": "Александрова В. А.", "room": "3016"},
        {"name": "Антипина С. В.", "room": "3033"},
        {"name": "Антипова Е. О.", "room": ""},
        {"name": "Афанасьева О. В.", "room": "4015"},
        {"name": "Бабкина Е. А.", "room": "3035"},
        {"name": "Балшикая Ю. А.", "room": "1014"},
        {"name": "Балтачева Д. А.", "room": "1080"},
        {"name": "Бондаренко И. М.", "room": "2010"},
        {"name": "Бугушева З. М.", "room": "4022"},
        {"name": "Вагина А. О.", "room": "2007"},
        {"name": "Вакушина Е. В.", "room": "2012"},
        {"name": "Гапанович Е. А.", "room": "4019"},
        {"name": "Голдырева П. И.", "room": "3032"},
        {"name": "Горбачева И. А.", "room": "1085"},
        {"name": "Груздева Н. В.", "room": "4010"},
        {"name": "Гусельникова И. В.", "room": "1084"},
        {"name": "Дубичник Л. М.", "room": "4021"},
        {"name": "Егорова М. И.", "room": "1083"},
        {"name": "Загорская Л. В.", "room": "3034"},
        {"name": "Закалюкина Е. А.", "room": "3014"},
        {"name": "Засыпкина А. В.", "room": "2017"},
        {"name": "Зефирова Е. В.", "room": "1015"},
        {"name": "Зуева Ю. Н.", "room": ""},
        {"name": "Зырянова И. В.", "room": "3054"},
        {"name": "Игнатова Е. Ю.", "room": "2009"},
        {"name": "Ивачёв Е. А.", "room": "3011"},
        {"name": "Ивачёва М. О.", "room": ""},
        {"name": "Ищенко К. А.", "room": "3035"},
        {"name": "Казакова В. В.", "room": "4010"},
        {"name": "Калугина А. В.", "room": "4019"},
        {"name": "Кизирева В. С.", "room": ""},
        {"name": "Кизерова В. С.", "room": ""},
        {"name": "Колодчевская Е. А.", "room": "3013"},
        {"name": "Колпылова П. И.", "room": "2007"},
        {"name": "Кондрашова З. В.", "room": "5012"},
        {"name": "Конищева А. И.", "room": ""},
        {"name": "Кононец Д. С.", "room": "3009"},
        {"name": "Красулина Т. В.", "room": "2018"},
        {"name": "Кропотова М. Ю.", "room": "1081"},
        {"name": "Крутикова А. П.", "room": "4020"},
        {"name": "Кузнецова К. М.", "room": "5013"},
        {"name": "Кунщикова Н. Г.", "room": "3032"},
        {"name": "Липина Ю. С.", "room": "3017"},
        {"name": "Макарова Д. Е.", "room": ""},
        {"name": "Макеева А. О.", "room": "1015"},
        {"name": "Макушина А. В.", "room": ""},
        {"name": "Малышева О. Д.", "room": "3036"},
        {"name": "Малышева Т. В.", "room": "3006"},
        {"name": "Марарова М. С.", "room": ""},
        {"name": "Медведева К. Д.", "room": "2006"},
        {"name": "Мордань Е. В.", "room": "4013"},
        {"name": "Московская Д. Д.", "room": "5014"},
        {"name": "Москалева А. В.", "room": "2083"},
        {"name": "Мусихина И. Д.", "room": "2019"},
        {"name": "Овчинников Д. И.", "room": "2083"},
        {"name": "Опарина А. Ю.", "room": "2082"},
        {"name": "Панченко М. Н.", "room": "2011"},
        {"name": "Павлова К. А.", "room": "2020"},
        {"name": "Пелевина Е. А.", "room": "4006"},
        {"name": "Плетенёва С. А.", "room": "4023"},
        {"name": "Подлисецкая Д. В.", "room": "2015"},
        {"name": "Попович Е. А.", "room": "1017"},
        {"name": "Россов А. В.", "room": "1044"},
        {"name": "Светлакова А. А.", "room": "2065"},
        {"name": "Семенова О. А.", "room": "1016"},
        {"name": "Семянинкова И. Н.", "room": "2015"},
        {"name": "Смирнова И. Р.", "room": "4012"},
        {"name": "Смирнова И. А.", "room": "1082"},
        {"name": "Соловьева Д. О.", "room": "2008"},
        {"name": "Сысолятина М. В.", "room": "3032"},
        {"name": "Толстикова А. С.", "room": "2006"},
        {"name": "Торопова Н. А.", "room": "5014"},
        {"name": "Усольцева А. Д.", "room": "3033"},
        {"name": "Филиппова В. Д.", "room": "3017"},
        {"name": "Фоминова В. А.", "room": "5005"},
        {"name": "Халивина К. В.", "room": "3032"},
        {"name": "Хлопина А. М.", "room": ""},
        {"name": "Цее Л. Ю.", "room": "4018"},
        {"name": "Червов Д. В.", "room": "2013"},
        {"name": "Чиркова В. В.", "room": "3037"},
        {"name": "Чукашина А. В.", "room": "1080"},
        {"name": "Шаблюк О. К.", "room": "2008"},
        {"name": "Шамордина М. С.", "room": "4016"},
        {"name": "Шералиева Б. Х.", "room": "3015"},
        {"name": "Шербакова А. М.", "room": "5007"},
        {"name": "Шипулина Н. Л.", "room": "2083"},
        {"name": "Штуркина Н. С.", "room": "3016"},
        {"name": "Юрина Н. Е.", "room": "1085"},
        {"name": "Ярочкина А. В.", "room": "5005"},
        {"name": "Ярунина О. Ф.", "room": "2016"},
        {"name": "Яхнова Я. Д.", "room": "2065"}
    ];
    
    teacherSelect.innerHTML = '<option value="">-- Выберите учителя --</option>';
    
    teachers.sort((a, b) => {
        const lastNameA = a.name.split(' ')[0];
        const lastNameB = b.name.split(' ')[0];
        return lastNameA.localeCompare(lastNameB);
    });
    
    teachers.forEach(teacher => {
        const option = document.createElement('option');
        const roomInfo = teacher.room ? ` (каб. ${teacher.room})` : '';
        option.value = `${teacher.name}|${teacher.room || ''}`;
        option.textContent = teacher.name + roomInfo;
        teacherSelect.appendChild(option);
    });
}

// Функция для загрузки классов
function loadClassOptions() {
    const classSelect = document.getElementById('studentClass');
    if (!classSelect) return;
    
    classSelect.innerHTML = '<option value="">-- Выберите класс --</option>';
    
    const classes = [
        '1а', '1б', '1в', '1г', '1д', '1е', '1ж', '1з', '1и', '1к', '1л', '1м', '1н', '1р',
        '2а', '2б', '2в', '2г', '2д', '2е', '2ж', '2з', '2и', '2к', '2л', '2м', '2н', '2о',
        '3а', '3б', '3в', '3г', '3д',
        '4а', '4б', '4в', '4г', '4д',
        '5а', '5б', '5в', '5г', '5д', '5е', '5и',
        '6а', '6б', '6в', '6г', '6д', '6е',
        '7а', '7б', '7в', '7г', '7д',
        '8а', '8б', '8в', '8г', '8и',
        '9а', '9б', '9в',
        '10а', '10б Ест-нау', '10б Соц-эко',
        '11а', '11б', '11в'
    ];
    
    classes.forEach(className => {
        const option = document.createElement('option');
        option.value = className;
        option.textContent = className;
        classSelect.appendChild(option);
    });
    
    console.log('Список классов загружен:', classes.length);
}

// Функция для инициализации календаря с выбором только суббот
function initSaturdayCalendar() {
    const dateInput = document.getElementById('date');
    if (!dateInput) return;
    
    console.log('Инициализация календаря с выбором только суббот...');
    
    // Получаем ближайшую субботу
    const nextSaturday = getNextSaturday();
    
    // Настраиваем Flatpickr для выбора только суббот
    const calendar = flatpickr(dateInput, {
        locale: "ru",
        dateFormat: "Y-m-d",
        minDate: nextSaturday,
        maxDate: new Date().fp_incr(90), // 90 дней вперед
        disable: [
            function(date) {
                // Разрешаем только субботы
                return date.getDay() !== 6;
            }
        ],
        onChange: function(selectedDates, dateStr, instance) {
            console.log('Выбрана дата:', dateStr);
            if (dateStr) {
                updateTimeSlots();
            }
        },
        onReady: function(selectedDates, dateStr, instance) {
            // Устанавливаем ближайшую субботу по умолчанию
            instance.setDate(nextSaturday, false);
            console.log('Дата по умолчанию установлена:', nextSaturday);
            
            // Добавляем класс для суббот в календаре
            setTimeout(() => {
                const calendarContainer = instance.calendarContainer;
                if (calendarContainer) {
                    // Помечаем все субботы
                    const saturdays = calendarContainer.querySelectorAll('.flatpickr-day:not(.disabled)');
                    saturdays.forEach(day => {
                        const date = new Date(day.dateObj);
                        if (date.getDay() === 6) {
                            day.classList.add('saturday');
                        }
                    });
                }
            }, 100);
        }
    });
    
    // Сохраняем ссылку на календарь
    window.bookingCalendar = calendar;
    
    console.log('Календарь инициализирован');
}

// Функция для получения ближайшей субботы
function getNextSaturday() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 - воскресенье, 6 - суббота
    const daysUntilSaturday = dayOfWeek === 6 ? 0 : (6 - dayOfWeek + 7) % 7;
    
    const nextSaturday = new Date(today);
    nextSaturday.setDate(today.getDate() + daysUntilSaturday);
    nextSaturday.setHours(0, 0, 0, 0);
    
    return nextSaturday;
}

// Функция обновления слотов времени с учетом занятых времен
async function updateTimeSlots() {
    const timeSlotsContainer = document.querySelector('.time-slots');
    const selectedTimeInput = document.getElementById('selectedTime');
    const teacherSelect = document.getElementById('teacher');
    const dateInput = document.getElementById('date');
    const occupiedSlotsInfo = document.getElementById('occupiedSlotsInfo');
    
    if (!timeSlotsContainer || !teacherSelect || !dateInput) return;
    
    // Получаем выбранного учителя и дату
    const selectedTeacher = teacherSelect.value;
    const selectedDate = dateInput.value;
    
    // Если учитель или дата не выбраны, показываем все слоты как недоступные
    if (!selectedTeacher || !selectedDate) {
        createAllTimeSlots(timeSlotsContainer, selectedTimeInput, [], true);
        if (occupiedSlotsInfo) {
            occupiedSlotsInfo.textContent = 'Выберите учителя и дату';
            occupiedSlotsInfo.style.color = '#dc3545';
        }
        return;
    }
    
    console.log('Обновление слотов времени для:', selectedTeacher, 'на дату:', selectedDate);
    
    try {
        // Получаем занятые слоты для выбранного учителя и даты
        const occupiedSlots = await getOccupiedTimeSlots(selectedTeacher, selectedDate);
        
        // Создаем слоты времени
        createAllTimeSlots(timeSlotsContainer, selectedTimeInput, occupiedSlots, false);
        
        // Обновляем информацию о занятых слотах
        if (occupiedSlotsInfo) {
            if (occupiedSlots.length > 0) {
                occupiedSlotsInfo.textContent = `Занятые слоты: ${occupiedSlots.join(', ')}`;
                occupiedSlotsInfo.style.color = '#dc3545';
            } else {
                occupiedSlotsInfo.textContent = 'Все слоты свободны';
                occupiedSlotsInfo.style.color = '#28a745';
            }
        }
    } catch (error) {
        console.error('Ошибка обновления слотов:', error);
        createAllTimeSlots(timeSlotsContainer, selectedTimeInput, [], true);
    }
}

// Функция получения занятых слотов времени через API
async function getOccupiedTimeSlots(teacher, date) {
    try {
        const response = await fetch(`${API_BASE_URL}/bookings?teacher=${encodeURIComponent(teacher)}&date=${date}`);
        if (!response.ok) throw new Error('Ошибка получения занятых слотов');
        
        const data = await response.json();
        return data.occupiedSlots || [];
    } catch (error) {
        console.error('Ошибка получения занятых слотов:', error);
        return [];
    }
}

// Функция создания всех слотов времени
function createAllTimeSlots(container, selectedTimeInput, occupiedSlots, disabledAll = false) {
    // Сохраняем информационный блок
    const timeInfo = container.querySelector('.time-info');
    container.innerHTML = '';
    if (timeInfo) {
        container.appendChild(timeInfo);
    }
    
    // Время начала и окончания консультации
    const startTime = { hour: 11, minute: 30 };
    const endTime = { hour: 13, minute: 0 };
    
    // Создаем слоты по 20 минут
    let currentHour = startTime.hour;
    let currentMinute = startTime.minute;
    let hasAvailableSlots = false;
    
    while (currentHour < endTime.hour || (currentHour === endTime.hour && currentMinute < endTime.minute)) {
        // Форматируем время начала
        const startHourStr = currentHour.toString().padStart(2, '0');
        const startMinuteStr = currentMinute.toString().padStart(2, '0');
        
        // Рассчитываем время окончания
        let endHour = currentHour;
        let endMinute = currentMinute + 20;
        
        if (endMinute >= 60) {
            endHour += 1;
            endMinute -= 60;
        }
        
        // Проверяем, что слот не выходит за пределы 13:00
        if (endHour > endTime.hour || (endHour === endTime.hour && endMinute > endTime.minute)) {
            break;
        }
        
        const endHourStr = endHour.toString().padStart(2, '0');
        const endMinuteStr = endMinute.toString().padStart(2, '0');
        
        // Формируем строку времени
        const timeSlotStr = `${startHourStr}:${startMinuteStr}-${endHourStr}:${endMinuteStr}`;
        
        // Проверяем, занят ли слот
        const isOccupied = occupiedSlots.includes(timeSlotStr) || disabledAll;
        
        // Создаем слот
        const timeSlot = document.createElement('div');
        timeSlot.className = `time-slot ${isOccupied ? 'occupied' : 'available'}`;
        timeSlot.setAttribute('data-time', timeSlotStr);
        timeSlot.textContent = `${startHourStr}:${startMinuteStr} - ${endHourStr}:${endMinuteStr}`;
        
        if (!isOccupied) {
            timeSlot.title = 'Доступно для записи';
            hasAvailableSlots = true;
            
            // Добавляем обработчик только для доступных слотов
            timeSlot.addEventListener('click', function() {
                // Убираем выбранный класс у всех слотов
                document.querySelectorAll('.time-slot').forEach(s => {
                    s.classList.remove('selected');
                    s.classList.remove('active');
                });
                
                // Добавляем выбранный класс к выбранному слоту
                this.classList.add('selected');
                this.classList.add('active');
                
                // Записываем выбранное время в скрытое поле
                if (selectedTimeInput) {
                    selectedTimeInput.value = this.getAttribute('data-time');
                    console.log('Выбрано время:', selectedTimeInput.value);
                }
            });
        } else {
            timeSlot.title = 'Время занято';
            timeSlot.style.cursor = 'not-allowed';
        }
        
        container.appendChild(timeSlot);
        
        // Переходим к следующему интервалу
        currentMinute += 20;
        if (currentMinute >= 60) {
            currentHour += 1;
            currentMinute -= 60;
        }
    }
    
    // Выбираем первый доступный слот по умолчанию
    if (!disabledAll && hasAvailableSlots) {
        const firstAvailableSlot = container.querySelector('.time-slot.available');
        if (firstAvailableSlot && selectedTimeInput) {
            firstAvailableSlot.classList.add('selected');
            firstAvailableSlot.classList.add('active');
            selectedTimeInput.value = firstAvailableSlot.getAttribute('data-time');
            console.log('Время по умолчанию установлено:', selectedTimeInput.value);
        }
    } else if (disabledAll) {
        // Если все слоты отключены, очищаем выбранное время
        if (selectedTimeInput) {
            selectedTimeInput.value = '';
        }
    }
    
    console.log('Создано слотов времени:', container.querySelectorAll('.time-slot').length);
    console.log('Доступных слотов:', container.querySelectorAll('.time-slot.available').length);
}

// Инициализация обработчиков модальных окон
function initModalHandlers() {
    // Обработчик закрытия модального окна
    const closeModalBtn = document.getElementById('closeModal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    // Закрытие модального окна при клике вне его
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModal();
            }
        });
    }
}

// Обработчик отправки формы записи
async function handleBookingSubmit(event) {
    event.preventDefault();
    console.log('Отправка формы записи...');
    
    // Валидация формы
    if (!validateBookingForm()) return;
    
    // Собираем данные формы
    const formData = new FormData(event.target);
    const bookingData = {};
    
    for (let [key, value] of formData.entries()) {
        bookingData[key] = value;
    }
    
    // Добавляем дополнительные данные
    bookingData.status = 'новая';
    bookingData.createdAt = new Date().toISOString();
    
    try {
        const response = await fetch(`${API_BASE_URL}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData)
        });
        
        if (response.ok) {
            const result = await response.json();
            
            // Показываем модальное окно с деталями записи
            showBookingDetails({...bookingData, id: result.id});
            
            // Обновляем слоты времени
            updateTimeSlots();
            
            // Показываем уведомление
            showNotification('Запись успешно отправлена! Ожидайте подтверждения.', 'success');
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Ошибка сервера');
        }
    } catch (error) {
        console.error('Ошибка при создании записи:', error);
        showNotification('Ошибка при отправке записи: ' + error.message, 'error');
    }
}

// Валидация формы записи
function validateBookingForm() {
    // Проверяем, выбран ли учитель
    const teacherSelect = document.getElementById('teacher');
    if (!teacherSelect || teacherSelect.value === '') {
        showNotification('Пожалуйста, выберите учителя.', 'error');
        teacherSelect.focus();
        return false;
    }
    
    // Проверяем, выбрана ли дата
    const dateInput = document.getElementById('date');
    if (!dateInput || !dateInput.value) {
        showNotification('Пожалуйста, выберите субботу.', 'error');
        dateInput.focus();
        return false;
    }
    
    // Проверяем, что выбранная дата - суббота
    const selectedDate = new Date(dateInput.value);
    if (selectedDate.getDay() !== 6) {
        showNotification('Запись возможна только по субботам!', 'error');
        
        // Находим ближайшую субботу
        const nextSaturday = getNextSaturday();
        if (window.bookingCalendar) {
            window.bookingCalendar.setDate(nextSaturday, false);
        }
        return false;
    }
    
    // Проверяем, выбрано ли время
    const selectedTimeInput = document.getElementById('selectedTime');
    if (!selectedTimeInput || !selectedTimeInput.value) {
        showNotification('Пожалуйста, выберите время консультации.', 'error');
        return false;
    }
    
    // Проверяем ФИО родителя
    const parentNameInput = document.getElementById('parentName');
    if (!parentNameInput.value.trim()) {
        showNotification('Пожалуйста, введите ФИО родителя.', 'error');
        parentNameInput.focus();
        return false;
    }
    
    // Проверяем ФИО ученика
    const studentNameInput = document.getElementById('studentName');
    if (!studentNameInput.value.trim()) {
        showNotification('Пожалуйста, введите ФИО ученика.', 'error');
        studentNameInput.focus();
        return false;
    }
    
    // Проверяем класс
    const studentClassSelect = document.getElementById('studentClass');
    if (!studentClassSelect.value) {
        showNotification('Пожалуйста, выберите класс ученика.', 'error');
        studentClassSelect.focus();
        return false;
    }
    
    // Проверяем телефон
    const phoneInput = document.getElementById('phone');
    const phoneRegex = /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/;
    if (!phoneRegex.test(phoneInput.value)) {
        showNotification('Пожалуйста, введите корректный номер телефона в формате +7 (XXX) XXX-XX-XX', 'error');
        phoneInput.focus();
        return false;
    }
    
    // Проверяем email
    const emailInput = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
        showNotification('Пожалуйста, введите корректный email адрес.', 'error');
        emailInput.focus();
        return false;
    }
    
    return true;
}

// Функция показа деталей записи в модальном окне
function showBookingDetails(bookingData) {
    const modal = document.getElementById('successModal');
    const detailsContainer = document.getElementById('bookingDetails');
    
    if (modal && detailsContainer) {
        // Разделяем данные учителя
        const teacherParts = bookingData.teacher.split('|');
        const teacherName = teacherParts[0];
        const teacherRoom = teacherParts[1] || 'не указан';
        
        // Форматируем дату
        const date = new Date(bookingData.date);
        const formattedDate = date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            weekday: 'long'
        });
        
        // Создаем HTML с деталями записи
        detailsContainer.innerHTML = `
            <div class="booking-summary">
                <p><strong>Учитель:</strong> ${teacherName} (каб. ${teacherRoom})</p>
                <p><strong>Дата:</strong> ${formattedDate}</p>
                <p><strong>Время консультации:</strong> ${bookingData.selectedTime} (20 минут)</p>
                <p><strong>Родитель:</strong> ${bookingData.parentName}</p>
                <p><strong>Ученик:</strong> ${bookingData.studentName} (${bookingData.studentClass} класс)</p>
                <p><strong>Контактный телефон:</strong> ${bookingData.phone}</p>
                <p><strong>Email:</strong> ${bookingData.email}</p>
                ${bookingData.comment ? `<p><strong>Комментарий:</strong> ${bookingData.comment}</p>` : ''}
                <p><strong>Номер записи:</strong> ${bookingData.id}</p>
                <div class="booking-note">
                    <p><i class="fas fa-info-circle"></i> <strong>Важно:</strong> Консультации родителей проводятся только по субботам с 11:30 до 13:00. Продолжительность консультации - 20 минут.</p>
                </div>
            </div>
        `;
        
        // Показываем модальное окно
        modal.style.display = 'flex';
        console.log('Показано модальное окно с деталями записи');
    }
}

// Функция закрытия модального окна
function closeModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.style.display = 'none';
        console.log('Модальное окно закрыто');
    }
}

// Функция сброса формы
function resetForm() {
    const form = document.getElementById('bookingForm');
    if (form) {
        // Сбрасываем форму
        form.reset();
        
        // Сбрасываем календарь на ближайшую субботу
        if (window.bookingCalendar) {
            const nextSaturday = getNextSaturday();
            window.bookingCalendar.setDate(nextSaturday, false);
        }
        
        // Обновляем слоты времени
        updateTimeSlots();
        
        console.log('Форма сброшена (дата установлена на ближайшую субботу)');
        
        // Показываем уведомление
        showNotification('Форма очищена', 'info');
    }
}

// Функция форматирования телефона
function formatPhone(event) {
    let phone = event.target.value.replace(/\D/g, '');
    
    if (phone.length === 0) return '';
    
    let formattedPhone = '+7 ';
    
    if (phone.length > 1) {
        formattedPhone += '(' + phone.substring(1, 4);
    }
    
    if (phone.length >= 5) {
        formattedPhone += ') ' + phone.substring(4, 7);
    }
    
    if (phone.length >= 8) {
        formattedPhone += '-' + phone.substring(7, 9);
    }
    
    if (phone.length >= 10) {
        formattedPhone += '-' + phone.substring(9, 11);
    }
    
    event.target.value = formattedPhone;
}

// Функция инициализации админ-панели
async function initAdminPanel() {
    console.log('Инициализация админ-панели...');
    
    // Проверяем токен авторизации
    const token = localStorage.getItem('adminToken');
    
    if (token) {
        try {
            // Проверяем валидность токена
            const response = await fetch(`${API_BASE_URL}/auth`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                showAdminPanel();
                setupAdminPanel();
                return;
            } else {
                // Токен невалидный, удаляем его
                localStorage.removeItem('adminToken');
            }
        } catch (error) {
            console.error('Ошибка проверки токена:', error);
            localStorage.removeItem('adminToken');
        }
    }
    
    showLoginForm();
    
    // Обработчик формы входа
    const loginForm = document.getElementById('adminLoginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleAdminLogin);
    }
}

// Функция показа формы входа
function showLoginForm() {
    const loginSection = document.getElementById('loginSection');
    const adminPanel = document.getElementById('adminPanel');
    
    if (loginSection) {
        loginSection.style.display = 'block';
        console.log('Форма входа показана');
    }
    if (adminPanel) {
        adminPanel.style.display = 'none';
    }
}

// Функция показа панели администратора
function showAdminPanel() {
    const loginSection = document.getElementById('loginSection');
    const adminPanel = document.getElementById('adminPanel');
    
    if (loginSection) {
        loginSection.style.display = 'none';
    }
    if (adminPanel) {
        adminPanel.style.display = 'block';
        console.log('Панель администратора показана');
    }
}

// Обработчик входа администратора
async function handleAdminLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });
        
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('adminToken', data.token);
            showAdminPanel();
            setupAdminPanel();
            showNotification('Вы успешно вошли в систему как администратор!', 'success');
        } else {
            const errorData = await response.json();
            showNotification(errorData.error || 'Неверные учетные данные', 'error');
        }
    } catch (error) {
        console.error('Ошибка входа:', error);
        showNotification('Ошибка соединения с сервером', 'error');
    }
}

// Настройка админ-панели
function setupAdminPanel() {
    console.log('Настройка панели администратора...');
    
    // Настраиваем даты в фильтрах
    setupFilterDates();
    
    // Загружаем записи
    loadBookings();
    
    // Обработчик кнопки выхода
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleAdminLogout);
        console.log('Обработчик кнопки выхода добавлен');
    }
    
    // Обработчик кнопки экспорта всех записей
    const exportExcelBtn = document.getElementById('exportExcelBtn');
    if (exportExcelBtn) {
        exportExcelBtn.addEventListener('click', exportAllToExcel);
        console.log('Обработчик кнопки экспорта всех записей добавлен');
    }
    
    // Обработчик кнопки экспорта отфильтрованных записей
    const exportFilteredBtn = document.getElementById('exportFilteredBtn');
    if (exportFilteredBtn) {
        exportFilteredBtn.addEventListener('click', exportFilteredToExcel);
        console.log('Обработчик кнопки экспорта отфильтрованных записей добавлен');
    }
    
    // Обработчик фильтров
    const filterForm = document.getElementById('filterForm');
    if (filterForm) {
        filterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Применение фильтров...');
            loadBookings();
        });
        
        // Обработчик сброса фильтров
        const resetFilterBtn = document.getElementById('resetFilter');
        if (resetFilterBtn) {
            resetFilterBtn.addEventListener('click', function() {
                filterForm.reset();
                console.log('Фильтры сброшены');
                loadBookings();
            });
        }
    }
}

// Функция настройки дат в фильтрах
function setupFilterDates() {
    const filterDateInput = document.getElementById('filterDate');
    if (filterDateInput) {
        // Минимальная дата для фильтра (год назад)
        const minDate = new Date();
        minDate.setFullYear(minDate.getFullYear() - 1);
        filterDateInput.min = minDate.toISOString().split('T')[0];
        
        // Максимальная дата для фильтра (сегодня + 3 месяца)
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        filterDateInput.max = maxDate.toISOString().split('T')[0];
        
        console.log('Фильтр дат настроен: от', filterDateInput.min, 'до', filterDateInput.max);
    }
}

// Обработчик выхода администратора
function handleAdminLogout() {
    if (confirm('Вы уверены, что хотите выйти из системы?')) {
        localStorage.removeItem('adminToken');
        showLoginForm();
        console.log('Администратор вышел из системы');
        showNotification('Вы успешно вышли из системы.', 'info');
    }
}

// Функция загрузки записей для админ-панели
async function loadBookings() {
    const bookingsTableBody = document.getElementById('bookingsTableBody');
    const noBookingsMessage = document.getElementById('noBookingsMessage');
    const token = localStorage.getItem('adminToken');
    
    if (!bookingsTableBody || !token) {
        console.log('Таблица записей не найдена или нет токена');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/bookings`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                // Неавторизован, показываем форму входа
                localStorage.removeItem('adminToken');
                showLoginForm();
                showNotification('Сессия истекла. Пожалуйста, войдите снова.', 'error');
                return;
            }
            throw new Error('Ошибка загрузки записей');
        }
        
        let bookings = await response.json();
        
        // Применяем фильтры
        bookings = applyFilters(bookings);
        
        // Сохраняем отфильтрованные записи для экспорта
        window.currentFilteredBookings = bookings;
        
        // Очищаем таблицу
        bookingsTableBody.innerHTML = '';
        
        // Если записей нет, показываем сообщение
        if (bookings.length === 0) {
            if (noBookingsMessage) {
                noBookingsMessage.style.display = 'block';
            }
            updateBookingsCounter(0);
            return;
        }
        
        // Скрываем сообщение об отсутствии записей
        if (noBookingsMessage) {
            noBookingsMessage.style.display = 'none';
        }
        
        // Сортируем записи по дате создания (новые сверху)
        bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Заполняем таблицу
        bookings.forEach(booking => {
            const row = document.createElement('tr');
            
            // Разделяем данные учителя
            const teacherParts = booking.teacher.split('|');
            const teacherName = teacherParts[0];
            const teacherRoom = teacherParts[1] || 'не указан';
            
            // Форматируем дату
            const date = new Date(booking.date);
            const formattedDate = date.toLocaleDateString('ru-RU');
            
            // Определяем день недели
            const dayOfWeek = date.getDay();
            const weekdays = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
            const weekday = weekdays[dayOfWeek];
            
            // Форматируем дату создания
            const createdAt = new Date(booking.createdAt);
            const formattedCreatedAt = createdAt.toLocaleDateString('ru-RU') + ' ' + 
                                      createdAt.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'});
            
            // Определяем класс статуса
            let statusClass = '';
            switch(booking.status) {
                case 'новая':
                    statusClass = 'status-new';
                    break;
                case 'подтверждена':
                    statusClass = 'status-confirmed';
                    break;
                case 'отменена':
                    statusClass = 'status-cancelled';
                    break;
                case 'завершена':
                    statusClass = 'status-completed';
                    break;
            }
            
            row.innerHTML = `
                <td>${booking.id}</td>
                <td>${teacherName}<br><small>Каб. ${teacherRoom}</small></td>
                <td>${formattedDate}<br><small>${weekday}, ${booking.selectedTime}</small></td>
                <td>${booking.parentName}<br><small>${booking.phone}</small></td>
                <td>${booking.studentName}<br><small>${booking.studentClass} класс</small></td>
                <td>
                    <select class="status-select ${statusClass}" data-id="${booking.id}">
                        <option value="новая" ${booking.status === 'новая' ? 'selected' : ''}>Новая</option>
                        <option value="подтверждена" ${booking.status === 'подтверждена' ? 'selected' : ''}>Подтверждена</option>
                        <option value="отменена" ${booking.status === 'отменена' ? 'selected' : ''}>Отменена</option>
                        <option value="завершена" ${booking.status === 'завершена' ? 'selected' : ''}>Завершена</option>
                    </select>
                </td>
                <td>${formattedCreatedAt}</td>
                <td>
                    <button class="btn-delete" data-id="${booking.id}" title="Удалить запись">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            bookingsTableBody.appendChild(row);
        });
        
        // Добавляем обработчики для изменения статуса
        document.querySelectorAll('.status-select').forEach(select => {
            select.addEventListener('change', handleStatusChange);
        });
        
        // Добавляем обработчики для удаления записей
        document.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', handleDeleteBooking);
        });
        
        // Обновляем счетчик записей
        updateBookingsCounter(bookings.length);
        
    } catch (error) {
        console.error('Ошибка загрузки записей:', error);
        showNotification('Ошибка загрузки записей', 'error');
    }
}

// Функция применения фильтров
function applyFilters(bookings) {
    const teacherFilter = document.getElementById('filterTeacher');
    const dateFilter = document.getElementById('filterDate');
    const statusFilter = document.getElementById('filterStatus');
    
    let filteredBookings = [...bookings];
    
    // Фильтр по учителю
    if (teacherFilter && teacherFilter.value) {
        const searchTerm = teacherFilter.value.toLowerCase();
        filteredBookings = filteredBookings.filter(booking => {
            const teacherParts = booking.teacher.split('|');
            const teacherName = teacherParts[0].toLowerCase();
            return teacherName.includes(searchTerm);
        });
        console.log('Применен фильтр по учителю:', teacherFilter.value);
    }
    
    // Фильтр по дате
    if (dateFilter && dateFilter.value) {
        filteredBookings = filteredBookings.filter(booking => 
            booking.date === dateFilter.value
        );
        console.log('Применен фильтр по дате:', dateFilter.value);
    }
    
    // Фильтр по статусу
    if (statusFilter && statusFilter.value) {
        filteredBookings = filteredBookings.filter(booking => 
            booking.status === statusFilter.value
        );
        console.log('Применен фильтр по статусу:', statusFilter.value);
    }
    
    return filteredBookings;
}

// Обработчик изменения статуса записи
async function handleStatusChange(event) {
    const bookingId = parseInt(event.target.getAttribute('data-id'));
    const newStatus = event.target.value;
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
        showNotification('Требуется авторизация', 'error');
        return;
    }
    
    console.log('Изменение статуса записи', bookingId, 'на', newStatus);
    
    try {
        const response = await fetch(`${API_BASE_URL}/bookings?id=${bookingId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: newStatus })
        });
        
        if (response.ok) {
            // Обновляем класс статуса
            event.target.className = `status-select status-${getStatusClass(newStatus)}`;
            
            console.log(`Статус записи ${bookingId} изменен на: ${newStatus}`);
            
            // Показываем уведомление
            showNotification(`Статус записи #${bookingId} изменен на "${newStatus}"`, 'success');
        } else {
            throw new Error('Ошибка изменения статуса');
        }
    } catch (error) {
        console.error('Ошибка изменения статуса:', error);
        showNotification('Ошибка изменения статуса', 'error');
    }
}

// Функция получения класса для статуса
function getStatusClass(status) {
    switch(status) {
        case 'новая': return 'new';
        case 'подтверждена': return 'confirmed';
        case 'отменена': return 'cancelled';
        case 'завершена': return 'completed';
        default: return '';
    }
}

// Обработчик удаления записи
async function handleDeleteBooking(event) {
    const bookingId = parseInt(event.currentTarget.getAttribute('data-id'));
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
        showNotification('Требуется авторизация', 'error');
        return;
    }
    
    if (!confirm(`Вы уверены, что хотите удалить запись #${bookingId}?`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/bookings?id=${bookingId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            // Перезагружаем таблицу
            loadBookings();
            
            console.log(`Запись ${bookingId} удалена`);
            
            // Показываем уведомление
            showNotification(`Запись #${bookingId} удалена`, 'info');
        } else {
            throw new Error('Ошибка удаления записи');
        }
    } catch (error) {
        console.error('Ошибка удаления записи:', error);
        showNotification('Ошибка удаления записи', 'error');
    }
}

// Функция обновления счетчика записей
function updateBookingsCounter(count) {
    const counterElement = document.getElementById('bookingsCounter');
    if (counterElement) {
        counterElement.textContent = `Найдено записей: ${count}`;
        console.log('Счетчик записей обновлен:', count);
    }
}

// Функция экспорта всех записей в Excel
async function exportAllToExcel() {
    console.log('Экспорт всех записей в Excel...');
    
    const token = localStorage.getItem('adminToken');
    if (!token) {
        showNotification('Требуется авторизация', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/bookings`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) throw new Error('Ошибка загрузки записей');
        
        const bookings = await response.json();
        
        if (bookings.length === 0) {
            showNotification('Нет записей для экспорта!', 'info');
            return;
        }
        
        console.log('Экспортируется записей:', bookings.length);
        
        // Экспортируем записи
        exportBookingsToExcel(bookings, 'все_записи_на_консультацию');
        
    } catch (error) {
        console.error('Ошибка экспорта:', error);
        showNotification('Ошибка при экспорте записей', 'error');
    }
}

// Функция экспорта отфильтрованных записей в Excel
function exportFilteredToExcel() {
    console.log('Экспорт отфильтрованных записей в Excel...');
    
    // Используем текущие отфильтрованные записи
    const bookings = window.currentFilteredBookings || [];
    
    if (bookings.length === 0) {
        showNotification('Нет отфильтрованных записей для экспорта!', 'info');
        return;
    }
    
    console.log('Экспортируется отфильтрованных записей:', bookings.length);
    
    // Экспортируем записи
    exportBookingsToExcel(bookings, 'отфильтрованные_записи_на_консультацию');
}

// Основная функция экспорта в Excel
function exportBookingsToExcel(bookings, filename) {
    try {
        console.log('Начало экспорта в Excel...');
        
        // Подготовка данных для Excel
        const excelData = bookings.map(booking => {
            // Разделяем данные учителя
            const teacherParts = booking.teacher.split('|');
            const teacherName = teacherParts[0];
            const teacherRoom = teacherParts[1] || 'не указан';
            
            // Форматируем дату для отображения
            const date = new Date(booking.date);
            const formattedDate = date.toLocaleDateString('ru-RU');
            
            // Определяем день недели
            const dayOfWeek = date.getDay();
            const weekdays = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
            const weekday = weekdays[dayOfWeek];
            
            // Форматируем дату создания
            const createdAt = new Date(booking.createdAt);
            const formattedCreatedAt = createdAt.toLocaleDateString('ru-RU') + ' ' + 
                                      createdAt.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'});
            
            return {
                'ID записи': booking.id,
                'Учитель': teacherName,
                'Кабинет': teacherRoom,
                'Дата консультации': formattedDate,
                'День недели': weekday,
                'Время консультации': booking.selectedTime,
                'Длительность': '20 минут',
                'ФИО родителя': booking.parentName,
                'Телефон родителя': booking.phone,
                'Email родителя': booking.email,
                'ФИО ученика': booking.studentName,
                'Класс ученика': booking.studentClass,
                'Статус записи': booking.status,
                'Дата создания записи': formattedCreatedAt,
                'Комментарий': booking.comment || ''
            };
        });
        
        console.log('Данные подготовлены для Excel:', excelData.length, 'строк');
        
        // Создаем новую книгу Excel
        const wb = XLSX.utils.book_new();
        
        // Создаем новый лист с данными
        const ws = XLSX.utils.json_to_sheet(excelData);
        
        // Настраиваем ширину колонок
        const wscols = [
            {wch: 12}, // ID записи
            {wch: 25}, // Учитель
            {wch: 8},  // Кабинет
            {wch: 12}, // Дата консультации
            {wch: 15}, // День недели
            {wch: 15}, // Время консультации
            {wch: 12}, // Длительность
            {wch: 25}, // ФИО родителя
            {wch: 18}, // Телефон родителя
            {wch: 25}, // Email родителя
            {wch: 25}, // ФИО ученика
            {wch: 12}, // Класс ученика
            {wch: 15}, // Статус записи
            {wch: 20}, // Дата создания записи
            {wch: 40}  // Комментарий
        ];
        ws['!cols'] = wscols;
        
        // Добавляем лист в книгу
        XLSX.utils.book_append_sheet(wb, ws, "Записи на консультацию");
        
        // Генерируем имя файла с датой
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
        const finalFilename = `${filename}_${dateStr}.xlsx`;
        
        console.log('Создание файла:', finalFilename);
        
        // Записываем файл и предлагаем скачать
        XLSX.writeFile(wb, finalFilename);
        
        console.log(`Экспорт завершен. Файл "${finalFilename}" скачан.`);
        
        // Показываем уведомление
        showNotification(`Экспорт завершен! Скачан файл: ${finalFilename}`, 'success');
        
    } catch (error) {
        console.error('Ошибка при экспорте в Excel:', error);
        showNotification('Ошибка при экспорте в Excel. Пожалуйста, попробуйте еще раз.', 'error');
    }
}

// Функция показа уведомления
function showNotification(message, type = 'info') {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Добавляем стили, если их еще нет
    if (!document.getElementById('notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                padding: 15px 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                min-width: 300px;
                max-width: 400px;
                z-index: 10000;
                animation: slideIn 0.3s ease-out;
                border-left: 4px solid #1e3c72;
            }
            .notification-success {
                border-left-color: #28a745;
            }
            .notification-error {
                border-left-color: #dc3545;
            }
            .notification-info {
                border-left-color: #17a2b8;
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
                flex: 1;
            }
            .notification-close {
                background: none;
                border: none;
                color: #666;
                cursor: pointer;
                font-size: 14px;
                padding: 5px;
                margin-left: 10px;
            }
            .notification-close:hover {
                color: #333;
            }
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Добавляем уведомление на страницу
    document.body.appendChild(notification);
    
    // Автоматически удаляем уведомление через 5 секунд
    const autoRemove = setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
    
    // Обработчик закрытия уведомления
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        clearTimeout(autoRemove);
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
}