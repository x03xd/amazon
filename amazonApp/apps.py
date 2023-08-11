from django.apps import AppConfig

class AmazonappConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'amazonApp'

    def ready(self):
        from .background_tasks import background_task  
        background_task() 