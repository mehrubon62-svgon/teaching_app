import random
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'omuz_project.settings')
django.setup()

from accounts.models import User
from courses.models import Category, Course, Module, Lesson, Enrollment
from quizzes.models import Quiz, Question, Answer
from gamification.models import Badge, UserGameProfile, UserBadge
from notifications.models import Notification
from resume_builder.models import Resume

YOUTUBE_VIDEOS = [
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    'https://www.youtube.com/watch?v=9bZkp7q19n0',
    'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
    'https://www.youtube.com/watch?v=RgKAFKj4LkE',
    'https://www.youtube.com/watch?v=OPf0YbXqDm0',
    'https://www.youtube.com/watch?v=60ItHLz5WEA',
    'https://www.youtube.com/watch?v=1qwsi77s9oc',
    'https://www.youtube.com/watch?v=Hug0rfFC_L8',
    'https://www.youtube.com/watch?v=y8Kyi0WzoCE',
]

OCCUPATIONS = [
    ('Веб-разработка', '💻'), ('Мобильная разработка', '📱'),
    ('Data Science', '📊'), ('Дизайн', '🎨'), ('DevOps', '⚙️'),
    ('Кибербезопасность', '🔒'), ('Game Development', '🎮'),
    ('Machine Learning', '🤖'), ('Backend разработка', '🔧'),
    ('Frontend разработка', '🌐'), ('QA тестирование', '🧪'),
    ('Project Management', '📋'), ('Аналитика данных', '📈'),
    ('Cloud Engineering', '☁️'), ('Blockchain', '⛓️'),
]

SCHOOL_SUBJECTS = [
    ('Математика', '🔢'), ('Физика', '⚡'), ('Химия', '🧪'),
    ('Биология', '🧬'), ('История', '📜'), ('География', '🌍'),
    ('Литература', '📚'), ('Английский язык', '🇬🇧'), ('Русский язык', '🇷🇺'),
    ('Информатика', '💻'), ('Экономика', '💰'), ('Правоведение', '⚖️'),
]

COURSE_DATA = [
    ('Python для начинающих', 'Полный курс Python с нуля. Изучите основы программирования, работу с данными, ООП и создайте свои первые проекты.', 'Веб-разработка', 'beginner', 0, True),
    ('React Native Мастер', 'Создавайте мобильные приложения для iOS и Android используя React Native и Expo.', 'Мобильная разработка', 'intermediate', 150, False),
    ('Django REST Framework', 'Построение мощных API с Django REST Framework. Аутентификация, сериализация, вьюсеты.', 'Backend разработка', 'intermediate', 120, True),
    ('JavaScript Продвинутый', 'Глубокое погружение в JavaScript: замыкания, промисы, async/await, паттерны.', 'Frontend разработка', 'advanced', 200, False),
    ('UI/UX Дизайн', 'Основы дизайна интерфейсов: Figma, прототипирование, пользовательские исследования.', 'Дизайн', 'beginner', 0, True),
    ('Data Science с Python', 'Анализ данных, визуализация, статистика. Pandas, NumPy, Matplotlib.', 'Data Science', 'intermediate', 100, True),
    ('Machine Learning', 'Алгоритмы машинного обучения: регрессия, классификация, кластеризация, нейросети.', 'Machine Learning', 'advanced', 250, False),
    ('DevOps Essentials', 'Docker, Kubernetes, CI/CD, мониторинг. Полный курс DevOps инженера.', 'DevOps', 'intermediate', 130, True),
    ('Кибербезопасность 101', 'Основы информационной безопасности: криптография, сетевая безопасность, пентестинг.', 'Кибербезопасность', 'beginner', 0, False),
    ('Flutter Разработка', 'Создавайте красивые мобильные приложения с Flutter и Dart.', 'Мобильная разработка', 'intermediate', 180, True),
    ('SQL и Базы данных', 'SQL запросы, проектирование БД, PostgreSQL, оптимизация запросов.', 'Backend разработка', 'beginner', 0, True),
    ('React.js Полный курс', 'Компоненты, хуки, роутинг, состояние. Создайте полноценное веб-приложение.', 'Frontend разработка', 'intermediate', 140, False),
    ('Алгоритмы и структуры', 'Сортировки, графы, деревья, динамическое программирование. Подготовка к собеседованиям.', 'Информатика', 'advanced', 220, True),
    ('Figma для дизайнеров', 'Автолейаут, компоненты, дизайн-системы, прототипирование в Figma.', 'Дизайн', 'beginner', 50, True),
    ('Node.js Backend', 'Express, MongoDB, авторизация, WebSocket. Создание серверных приложений.', 'Backend разработка', 'intermediate', 120, False),
    ('Математика для IT', 'Линейная алгебра, матанализ, дискретная математика для программистов.', 'Математика', 'intermediate', 0, True),
    ('Физика квантовых вычислений', 'Кубиты, суперпозиция, запутанность. Введение в квантовые вычисления.', 'Физика', 'advanced', 300, False),
    ('Английский для IT', 'Технический английский: чтение документации, общение, написание email.', 'Английский язык', 'beginner', 0, True),
    ('Game Dev с Unity', 'Создание 2D и 3D игр на Unity. C#, физика, анимация.', 'Game Development', 'intermediate', 180, True),
    ('Cloud AWS', 'AWS сервисы: EC2, S3, Lambda, RDS. Подготовка к сертификации.', 'Cloud Engineering', 'advanced', 250, False),
    ('QA Автоматизация', 'Selenium, Cypress, Appium. Автоматизированное тестирование веб и мобайл.', 'QA тестирование', 'intermediate', 100, True),
    ('Blockchain разработка', 'Solidity, смарт-контракты, Web3.js, DeFi приложения.', 'Blockchain', 'advanced', 280, False),
    ('Docker с нуля', 'Контейнеризация, Docker Compose, многоступенчатые сборки, оптимизация образов.', 'DevOps', 'beginner', 0, True),
    ('TypeScript Мастер', 'Типы, дженерики, декораторы, utility types. Полное руководство.', 'Frontend разработка', 'intermediate', 140, True),
    ('Аналитика данных', 'Excel, SQL, Python, визуализация. От данных к решениям.', 'Аналитика данных', 'beginner', 0, False),
]

BADGE_DATA = [
    ('Первый шаг', 'Пройдите первый урок', '🎯', 10),
    ('Ученик', 'Завершите 5 уроков', '📚', 50),
    ('Знаток', 'Завершите 25 уроков', '🎓', 150),
    ('Мастер', 'Завершите 50 уроков', '🏆', 500),
    ('Квиз-мастер', 'Получите 100% на квизе', '💯', 100),
    ('Серийный ученик', '7 дней подряд', '🔥', 200),
    ('Исследователь', 'Запишитесь на 5 курсов', '🧭', 75),
    ('Наставник', 'Помогите 3 студентам', '🤝', 300),
    ('Новичок', 'Зарегистрируйтесь', '⭐', 5),
    ('Комментатор', 'Оставьте 10 комментариев', '💬', 50),
    ('Вице-президент', 'Наберите 1000 XP', '💎', 1000),
    ('Легенда', 'Наберите 5000 XP', '👑', 5000),
]

def run():
    # Create categories
    print('Creating categories...')
    for name, icon in OCCUPATIONS:
        Category.objects.get_or_create(name=name, defaults={'category_type': 'occupation'})
    for name, icon in SCHOOL_SUBJECTS:
        Category.objects.get_or_create(name=name, defaults={'category_type': 'school_subject'})
    print(f'  Categories: {Category.objects.count()}')

    # Create test users
    print('Creating users...')
    users_data = [
        ('992901234567', 'Али Каримов'),
        ('992902345678', 'Малика Рашидова'),
        ('992903456789', 'Бобур Тошматов'),
        ('992904567890', 'Дилноза Умарова'),
        ('992905678901', 'Эркин Базаров'),
        ('992906789012', 'Феруза Камилова'),
        ('992907890123', 'Гулноза Хасанова'),
        ('992908901234', 'Жасур Мирзаев'),
        ('992909012345', 'Зульфия Ахмедова'),
        ('992910123456', 'Камолиддин Рахимов'),
    ]
    for phone, name in users_data:
        User.objects.get_or_create(
            phone_number=phone,
            defaults={'full_name': name, 'role': 'student'}
        )
    print(f'  Users: {User.objects.count()}')

    # Create courses
    print('Creating courses...')
    instructor = User.objects.filter(role='moderator').first() or User.objects.first()
    courses = []
    for title, desc, cat_name, level, price, promoted in COURSE_DATA:
        cat = Category.objects.filter(name=cat_name).first()
        course, created = Course.objects.get_or_create(
            title=title,
            defaults={
                'description': desc,
                'category': cat,
                'instructor': instructor,
                'price': price,
                'is_promoted': promoted,
                'is_popular': random.random() > 0.6,
                'is_published': True,
            }
        )
        if created:
            courses.append(course)
    print(f'  Courses: {Course.objects.count()}')

    # Create modules and lessons for each course
    print('Creating modules & lessons...')
    lesson_count = 0
    for course in Course.objects.all():
        num_modules = random.randint(3, 6)
        for m_idx in range(num_modules):
            module, _ = Module.objects.get_or_create(
                course=course,
                order=m_idx + 1,
                defaults={'title': f'Модуль {m_idx + 1}: {random.choice(["Основы", "Практика", "Продвинутые темы", "Проект", "Закрепление", "Экзамен"])}'}
            )
            num_lessons = random.randint(3, 7)
            for l_idx in range(num_lessons):
                lesson_title = random.choice([
                    'Введение в тему', 'Теоретическая часть', 'Практическое задание',
                    'Разбор примеров', 'Домашнее задание', 'Обзор решений',
                    'Дополнительные материалы', 'Видео-лекция', 'Мини-проект',
                ])
                Lesson.objects.get_or_create(
                    module=module,
                    order=l_idx + 1,
                    defaults={
                        'title': f'{lesson_title} {l_idx + 1}',
                        'description': f'Содержание урока "{lesson_title}" по курсу "{course.title}". Здесь будет подробный обучающий материал с примерами кода и иллюстрациями.',
                        'video_url': random.choice(YOUTUBE_VIDEOS),
                        'video_type': 'youtube',
                        'is_locked': l_idx > 2 and random.random() > 0.5,
                        'xp_reward': random.randint(10, 50),
                    }
                )
                lesson_count += 1
    print(f'  Lessons: {lesson_count}')

    # Create quizzes (one per lesson, randomly)
    print('Creating quizzes...')
    for course in Course.objects.all():
        lessons = Lesson.objects.filter(module__course=course)
        for lesson in lessons.order_by('?')[:1]:  # 1 quiz per course
            quiz, _ = Quiz.objects.get_or_create(
                lesson=lesson,
                defaults={
                    'title': f'Тест: {course.title}',
                    'passing_score': 70,
                    'xp_reward': random.randint(20, 100),
                }
            )
            for q_idx in range(random.randint(5, 10)):
                question = Question.objects.create(
                    quiz=quiz,
                    text=f'Вопрос {q_idx + 1} по курсу "{course.title}": {random.choice(["Что такое", "Как работает", "В чём разница", "Какой результат", "Для чего используется"])} {random.choice(["переменная", "функция", "класс", "метод", "модуль", "API", "компонент"])}?',
                    order=q_idx + 1,
                )
                correct = random.randint(0, 3)
                options = [
                    random.choice(['Вариант А', 'Ответ 1', 'Первый вариант', 'Опция Alpha']),
                    random.choice(['Вариант Б', 'Ответ 2', 'Второй вариант', 'Опция Beta']),
                    random.choice(['Вариант В', 'Ответ 3', 'Третий вариант', 'Опция Gamma']),
                    random.choice(['Вариант Г', 'Ответ 4', 'Четвёртый вариант', 'Опция Delta']),
                ]
                for i, opt in enumerate(options):
                    Answer.objects.create(question=question, text=opt, is_correct=(i == correct))
    print(f'  Quizzes: {Quiz.objects.count()}, Questions: {Question.objects.count()}')

    # Create badges
    print('Creating badges...')
    for name, desc, icon, xp in BADGE_DATA:
        Badge.objects.get_or_create(name=name, defaults={'description': desc, 'icon': icon, 'required_xp': xp})
    print(f'  Badges: {Badge.objects.count()}')

    # Create user game profiles
    print('Creating game profiles...')
    for user in User.objects.filter(role='student')[:5]:
        profile, _ = UserGameProfile.objects.get_or_create(
            user=user,
            defaults={
                'xp_points': random.randint(100, 3000),
                'level': random.randint(1, 10),
                'streak_days': random.randint(0, 14),
            }
        )
        # Award some badges
        for badge in Badge.objects.order_by('?')[:random.randint(1, 4)]:
            UserBadge.objects.get_or_create(user_profile=profile, badge=badge)
        # Enroll in some courses
        for course in Course.objects.order_by('?')[:random.randint(2, 5)]:
            Enrollment.objects.get_or_create(user=user, course=course)
    print(f'  Game profiles: {UserGameProfile.objects.count()}')

    # Create notifications
    print('Creating notifications...')
    notif_types = ['info', 'achievement', 'reminder', 'system']
    notif_msgs = [
        ('Новый курс!', 'Запишитесь на новый курс "Python для начинающих"'),
        ('Достижение!', 'Вы получили значок "Первый шаг"'),
        ('Напоминание', 'Не забудьте завершить урок сегодня'),
        ('Обновление', 'Добавлены новые материалы в курс'),
        ('Приглашение', 'Ваш друг присоединился к платформе'),
        ('Скидка!', 'Специальное предложение -50% на курсы'),
        ('Квиз готов', 'Новый тест доступен в курсе'),
        ('Завершение', 'Поздравляем с завершением модуля!'),
    ]
    for user in User.objects.filter(role='student')[:5]:
        for _ in range(random.randint(3, 8)):
            ntype, (title, msg) = random.choice(list(zip(notif_types, notif_msgs)))
            Notification.objects.create(user=user, title=title, message=msg, notification_type=ntype)
    print(f'  Notifications: {Notification.objects.count()}')

    # Create resumes
    print('Creating resumes...')
    for user in User.objects.filter(role='student')[:3]:
        Resume.objects.get_or_create(
            user=user,
            defaults={
                'full_name': user.full_name,
                'bio': f'Студент платформы Omuz. Изучаю программирование и IT технологии.',
                'skills': 'Python, JavaScript, SQL, Git, Docker',
                'email': f'{user.full_name.split()[0].lower()}@example.com',
                'phone': user.phone_number,
            }
        )
    print(f'  Resumes: {Resume.objects.count()}')

    print('\n✅ DONE! Database populated successfully!')

if __name__ == '__main__':
    run()
