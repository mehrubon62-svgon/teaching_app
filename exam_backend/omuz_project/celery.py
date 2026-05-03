import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'omuz_project.settings')

app = Celery('omuz_project')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
