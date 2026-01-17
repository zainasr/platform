import json
import time
import sys

def log(level, message, **fields):
    entry = {
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "level": level,
        "service": "worker-python",
        "message": message,
        **fields,
    }
    sys.stdout.write(json.dumps(entry) + "\n")
    sys.stdout.flush()
