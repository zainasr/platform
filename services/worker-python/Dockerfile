FROM python:3.12-alpine

WORKDIR /app

RUN addgroup -S app && adduser -S app -G app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

USER app

ENV PYTHONUNBUFFERED=1

CMD ["python", "app/main.py"]
