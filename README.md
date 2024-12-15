# SE2-SERVICE-SimTech
    UAS SE2 SimTech

CARA MENJALANKAN PROGRAM

# IMPORT DATABASE
1. IMPORT simtech.sql ke XAMPP MYSQL
2. Nyalahkan XAMPP Apache dan MySQL

# MENYALAKAN RABBITMQ
1. Nyalahkan RabbitMQ Service
2. Jalankan Command ini di BIN folder RabbitMQ
    ```
    rabbitmq-plugins enable rabbitmq_prometheus
    ```
3. Jalankan prometheus.exe di folder  C:..\prometheus-3.0.1.windows-amd64\prometheus-3.0.1.windows-amd64
    ```
    Pastikan file prometheus.yml seperti ini
    --------------------------------------
    global:
    scrape_interval: 15s  # Set the scrape interval to every 15 seconds. Default is every 1 minute.
    evaluation_interval: 15s  # Evaluate rules every 15 seconds. The default is every 1 minute.
    # scrape_timeout is set to the global default (10s).

    # Alertmanager configuration
    alerting:
    alertmanagers:
        - static_configs:
            - targets:
            # - alertmanager:9093

    # Load rules once and periodically evaluate them according to the global 'evaluation_interval'.
    rule_files:
    # - "first_rules.yml"
    # - "second_rules.yml"

    # A scrape configuration containing exactly one endpoint to scrape:
    # Here it's Prometheus itself.
    scrape_configs:
    - job_name: "prometheus"
        static_configs:
        - targets: ["localhost:9090"]  # This scrapes Prometheus itself.

    # Add RabbitMQ scrape config
    - job_name: "rabbitmq"
        static_configs:
        - targets: ["localhost:15692"]  # This is the default port for RabbitMQ metrics exposed by the Prometheus plugin.
    ```
4. Di GRAFANA, buka localhost:3000 Tambahkan Metric RabbitMQ di DASHBOARD
    ```
    # Message Rates
    rabbitmq_queue_messages_published_total      # Total messages published
    rabbitmq_queue_messages_delivered_total      # Total messages delivered
    rabbitmq_queue_messages_acked_total         # Total messages acknowledged
    rabbitmq_queue_messages_unacked_total       # Total unacknowledged messages

    # Queue State
    rabbitmq_queue_messages_ready               # Messages ready for delivery
    rabbitmq_queue_messages                     # Total messages in queue
    rabbitmq_queue_consumers                    # Number of consumers
    ```

# OAuth
1. Ganti Client ID dan Client Secret di file ENV dengan Client ID dan Client Secret dari Google Developer Console

# CONFIGURASI ENV
1. UBAH PORT DI ENV
2. UBAH IP DI ENV
3. UBAH URL NGROK (Optional jika ingin menggunakan OAUTH)
5. UBAH USERNAME DAN PASSWORD DB

# RUN WEBSITE
1. Run Command ini di folder SE2-SERVICE-SimTech
    ```
    docker-compose down --remove-orphans
    docker-compose up --build
    ```
2. Akses Website di https://IP:PORT (https://192.168.0.5:8443)






