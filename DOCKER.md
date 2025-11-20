# Docker Setup

Ten projekt zawiera konfigurację Docker i docker-compose dla łatwego uruchomienia całego stacku.

## Wymagania

- Docker Desktop (Windows/Mac) lub Docker Engine (Linux)
- docker-compose (zwykle instalowane z Docker Desktop)

## Szybki start

### 1. Uruchomienie całego stacku (Backend + PostgreSQL + Redis)

```bash
# Zbuduj i uruchom wszystkie kontenery
docker-compose up -d

# Zobacz logi
docker-compose logs -f

# Zatrzymaj kontenery
docker-compose down

# Zatrzymaj i usuń dane (volumes)
docker-compose down -v
```

### 2. Uruchomienie tylko bazy danych i Redis

Jeśli chcesz uruchomić backend lokalnie (npm run dev), ale bazę i Redis w Docker:

```bash
# Uruchom tylko PostgreSQL i Redis
docker-compose up -d postgres redis

# Backend uruchom lokalnie
npm run dev
```

## Dostępne serwisy

Po uruchomieniu `docker-compose up -d`:

- **Backend API**: http://localhost:8000
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## Zmienne środowiskowe

Skopiuj `.env.docker.example` do `.env` i dostosuj wartości:

```bash
cp .env.docker.example .env
```

## Przydatne komendy

```bash
# Przebuduj obrazy
docker-compose build

# Uruchom konkretny serwis
docker-compose up postgres

# Sprawdź status kontenerów
docker-compose ps

# Zobacz logi konkretnego serwisu
docker-compose logs -f backend

# Wejdź do kontenera
docker-compose exec backend sh
docker-compose exec postgres psql -U postgres -d portfolio_db

# Restart konkretnego serwisu
docker-compose restart backend
```

## Produkcja

Dla produkcji upewnij się że:

1. Zmieniłeś `SESSION_SECRET` na losowy string
2. Użyłeś silnych haseł dla bazy danych
3. Skonfigurowałeś odpowiednie limity zasobów
4. Używasz zewnętrznych volumes dla persistence

## Troubleshooting

### Port już zajęty

Jeśli masz lokalnie uruchomiony PostgreSQL/Redis, zmień porty w `docker-compose.yml` lub zatrzymaj lokalne serwisy.

### Problem z budowaniem

```bash
docker-compose build --no-cache
```

### Resetowanie bazy danych

```bash
docker-compose down -v
docker-compose up -d
```
