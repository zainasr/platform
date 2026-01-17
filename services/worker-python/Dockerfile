FROM python:3.12-alpine

WORKDIR /app

RUN addgroup -S app && adduser -S app -G app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

USER 65532:65532

ENV PYTHONUNBUFFERED=1

CMD ["python", "app/main.py"]
