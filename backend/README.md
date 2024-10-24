# To build and start Docker containers (defined in docker-compose.yml file):
```bash
docker-compose up --build
```

# To find postgres-container IP:
```bash
docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' <name_of_container_running_postgres>
```

With our `docker-compose.yml` container's name should be `postgres`.

# To connect to PostgreSQL database running inside Docker container:
```bash
psql -h <container_ip> -U <db_username> -d <db_name>
```

