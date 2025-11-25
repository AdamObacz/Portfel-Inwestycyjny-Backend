# Portfolio Investment Backend - API Documentation

Backend dla aplikacji portfela inwestycyjnego z obsługą kryptowalut.

## 🚀 Zaimplementowane funkcjonalności

### ✅ Punkt 1: Zarządzanie Portfolio

- Dodawanie assetów do portfela użytkownika
- Pobieranie całego portfela z aktualnymi cenami
- Aktualizacja pozycji w portfelu
- Usuwanie assetów z portfela
- Wyszukiwanie kryptowalut z zewnętrznego API (CoinGecko)

### ✅ Punkt 2: Raporty dzienne/miesięczne

- Raport dzienny (porównanie dziś vs wczoraj)
- Raport miesięczny (agregacja dla bieżącego miesiąca)
- Raport wydajności dla niestandardowego zakresu dat
- Automatyczne tworzenie snapshots codziennie o 00:01
- Historia snapshots portfela

---

## 📋 Endpointy API

### **Autentykacja** (`/api/auth`)

Istniejące endpointy:

- `POST /api/auth/register` - Rejestracja użytkownika
- `POST /api/auth/login` - Logowanie
- `GET /api/auth/me` - Pobranie danych zalogowanego użytkownika
- `POST /api/auth/logout` - Wylogowanie

---

### **Portfolio** (`/api/portfolio`)

Wszystkie endpointy wymagają autentykacji (session).

#### `GET /api/portfolio`

Pobiera cały portfel użytkownika z aktualnymi cenami i wyliczeniami.

**Response:**

```json
{
  "positions": [
    {
      "id": "uuid",
      "asset": {
        "id": "uuid",
        "symbol": "BTC",
        "name": "Bitcoin",
        "imageUrl": "https://..."
      },
      "quantity": 0.5,
      "averagePurchasePrice": 45000,
      "currentPrice": 50000,
      "currentValue": 25000,
      "costBasis": 22500,
      "profitLoss": 2500,
      "profitLossPercentage": 11.11,
      "updatedAt": "2025-11-24T10:00:00.000Z"
    }
  ],
  "totalValue": 25000,
  "totalCost": 22500,
  "totalProfitLoss": 2500,
  "totalProfitLossPercentage": 11.11
}
```

#### `POST /api/portfolio`

Dodaje asset do portfela (lub aktualizuje istniejącą pozycję).

**Body:**

```json
{
  "assetId": "uuid",
  "quantity": 0.5,
  "purchasePrice": 45000
}
```

**Response:**

```json
{
  "message": "Asset added to portfolio successfully",
  "position": { ... }
}
```

#### `PUT /api/portfolio/:id`

Aktualizuje pozycję w portfelu.

**Body:**

```json
{
  "quantity": 0.75,
  "purchasePrice": 46000
}
```

#### `DELETE /api/portfolio/:id`

Usuwa pozycję z portfela.

**Response:**

```json
{
  "message": "Position removed successfully"
}
```

#### `GET /api/portfolio/assets/search?q=bitcoin`

Wyszukuje kryptowaluty w zewnętrznym API.

**Query params:**

- `q` - zapytanie wyszukiwania (np. "bitcoin", "eth")

**Response:**

```json
{
  "results": [
    {
      "symbol": "BTC",
      "name": "Bitcoin",
      "type": "cryptocurrency",
      "apiId": "bitcoin",
      "imageUrl": "https://..."
    }
  ]
}
```

---

### **Raporty** (`/api/reports`)

Wszystkie endpointy wymagają autentykacji (session).

#### `GET /api/reports/daily`

Pobiera raport dzienny (dziś vs wczoraj).

**Response:**

```json
{
  "date": "2025-11-24T00:00:00.000Z",
  "currentValue": 25000,
  "previousValue": 24000,
  "dailyChange": 1000,
  "dailyChangePercentage": 4.17,
  "positions": [ ... ]
}
```

#### `GET /api/reports/monthly`

Pobiera raport miesięczny dla bieżącego miesiąca.

**Response:**

```json
{
  "month": 11,
  "year": 2025,
  "startValue": 20000,
  "endValue": 25000,
  "monthlyChange": 5000,
  "monthlyChangePercentage": 25,
  "snapshots": [
    {
      "date": "2025-11-01T00:00:00.000Z",
      "value": 20000,
      "breakdown": [ ... ]
    }
  ]
}
```

#### `GET /api/reports/performance?from=2025-01-01&to=2025-11-24`

Pobiera raport wydajności dla niestandardowego zakresu dat.

**Query params:**

- `from` - data rozpoczęcia (YYYY-MM-DD), domyślnie: 30 dni temu
- `to` - data zakończenia (YYYY-MM-DD), domyślnie: dzisiaj

**Response:**

```json
{
  "period": {
    "from": "2025-01-01T00:00:00.000Z",
    "to": "2025-11-24T23:59:59.999Z"
  },
  "startValue": 15000,
  "endValue": 25000,
  "totalChange": 10000,
  "totalChangePercentage": 66.67,
  "snapshots": [ ... ],
  "dailyChanges": [ ... ]
}
```

#### `GET /api/reports/snapshots?limit=30`

Pobiera historyczne snapshoty portfela.

**Query params:**

- `limit` - liczba snapshots do pobrania (domyślnie: 30)

**Response:**

```json
{
  "snapshots": [
    {
      "date": "2025-11-24T00:00:00.000Z",
      "value": 25000,
      "breakdown": [ ... ]
    }
  ]
}
```

#### `POST /api/reports/snapshot`

Ręcznie tworzy snapshot portfela (przydatne do testowania).

**Response:**

```json
{
  "message": "Snapshot created successfully",
  "snapshot": { ... }
}
```

---

## 🗄️ Struktura bazy danych

### Nowe Entity:

1. **Asset** - Przechowuje informacje o kryptowalutach

   - id, symbol, name, type, apiId, imageUrl

2. **Portfolio** - Pozycje w portfelu użytkownika

   - id, userId, assetId, quantity, averagePurchasePrice

3. **PortfolioSnapshot** - Dzienne snapshoty wartości portfela
   - id, userId, snapshotDate, totalValue, breakdown (JSONB)

---

## ⚙️ Konfiguracja

### Zmienne środowiskowe (.env)

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=portfolio_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Session
SESSION_SECRET=your-secret-key

# Application
NODE_ENV=development
MAIN_PORT=8000
MAIN_ALLOWED_ORIGINS=http://localhost:5173

# Crypto API (CoinGecko)
CRYPTO_API_URL=https://api.coingecko.com/api/v3
CRYPTO_API_KEY=
```

---

## 🔄 Cron Jobs

### Daily Snapshot

- **Schedule:** Codziennie o 00:01
- **Funkcja:** Automatycznie tworzy snapshot portfela dla wszystkich użytkowników
- **Lokalizacja:** `src/config/cron.ts`

---

## 🧪 Testowanie API

### 1. Zarejestruj się i zaloguj

```bash
# Register
POST http://localhost:8000/api/auth/register
{
  "email": "test@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}

# Login
POST http://localhost:8000/api/auth/login
{
  "email": "test@example.com",
  "password": "password123"
}
```

### 2. Wyszukaj kryptowalutę

```bash
GET http://localhost:8000/api/portfolio/assets/search?q=bitcoin
```

### 3. Dodaj do portfela

Najpierw musisz znaleźć assetId z wyszukiwania lub utworzyć asset w bazie.

```bash
POST http://localhost:8000/api/portfolio
{
  "assetId": "uuid-from-database",
  "quantity": 0.5,
  "purchasePrice": 45000
}
```

### 4. Pobierz portfel

```bash
GET http://localhost:8000/api/portfolio
```

### 5. Utwórz snapshot (manualnie)

```bash
POST http://localhost:8000/api/reports/snapshot
```

### 6. Pobierz raport dzienny

```bash
GET http://localhost:8000/api/reports/daily
```

---

## 🔜 Następne kroki (Punkty 3 i 4)

### Punkt 3: Watchlista i Profile publiczne

- UserProfile entity
- Following entity
- Endpointy do obserwowania użytkowników
- Widok publicznych portfeli

### Punkt 4: Powiadomienia Email

- PriceAlert entity
- Notification entity
- Serwis do wysyłki emaili (nodemailer)
- Cron job do sprawdzania alertów cenowych

---

## 📦 Uruchomienie

```bash
# Install dependencies
npm install

# Build
npm run build

# Development
npm run dev

# Production
npm start
```

---

## 🛠️ Stack technologiczny

- **Framework:** HyperExpress
- **ORM:** TypeORM
- **Database:** PostgreSQL
- **Cache/Session:** Redis
- **Validation:** Zod
- **Cron:** node-cron
- **External API:** CoinGecko
- **TypeScript:** 5.9.3
