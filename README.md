erp-aero-test
=============

# Running

```bash
cp .env.example .env
docker compose up -d
```

http://localhost:4000/

## Running without docker

```bash
# Run redis and mysql
cp .env.example .env
# Edit .env
yarn dev
```

http://localhost:3000/
