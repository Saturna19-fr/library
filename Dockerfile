FROM python:3.12
WORKDIR /usr/local/app
RUN apt-get update && apt-get install -y \
    pkg-config \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
# Install the application dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy in the source code
COPY . ./src
EXPOSE 5000

# Setup an app user so the container doesn't run as the root user
RUN useradd app
USER app

CMD ["python", "src/app.py"]
# CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]