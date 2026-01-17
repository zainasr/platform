from prometheus_client import Counter, start_http_server

jobs_processed = Counter(
    "worker_jobs_processed_total",
    "Total background jobs processed"
)

def start_metrics_server(port: int):
    start_http_server(port)
