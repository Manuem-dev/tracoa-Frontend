from django.apps import AppConfig


class TracabilityConfig(AppConfig):
    name = 'tracability'
    
    def ready(self):
        import tracability.signals
