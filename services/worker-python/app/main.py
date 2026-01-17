import os
import time
from logger import log
from metrics import jobs_processed, start_metrics_server

METRICS_PORT = int(os.getenv("METRICS_PORT", "9000"))
INTERVAL_SECONDS = int(os.getenv("JOB_INTERVAL_SECONDS", "10"))
ENV = os.getenv("ENV", "unknown")

def run_job():
    log("info", "background job executed", env=ENV)
    jobs_processed.inc()

def main():
    log("info", "worker started", env=ENV)

    start_metrics_server(METRICS_PORT)

    while True:
        run_job()
        time.sleep(INTERVAL_SECONDS)

if __name__ == "__main__":
    main()
