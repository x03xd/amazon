def run_command(config):
    location = config["location"]
    command = config["command"]

    process = subprocess.Popen(command, cwd=location, shell=True, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    process.communicate()

