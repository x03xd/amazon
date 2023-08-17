import subprocess
import concurrent.futures

def run_command(config):
    location = config["location"]
    command = config["command"]

    process = subprocess.Popen(command, cwd=location, shell=True, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    stdout, stderr = process.communicate()


cmd_configs = [
    {"location": "C:/Users/ja/Desktop/amazon-poprawki", "command": "celery -A amazon worker -l info -P eventlet"},
    {"location": "C:/Users/ja/Desktop/amazon-poprawki", "command": "celery -A amazon beat -l info"},
    {"location": "C:/Users/ja/Desktop/amazon-poprawki", "command": "python manage.py runserver"},
    {"location": "C:/Users/ja/Desktop/amazon-poprawki/frontend", "command": "npm start"},
]

with concurrent.futures.ThreadPoolExecutor(max_workers=len(cmd_configs)) as executor:
    results = list(executor.map(run_command, cmd_configs))
