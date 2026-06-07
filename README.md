# BuddyScript

A social media platform built as a Laravel 13 JSON API with a React 19 SPA frontend. Users can register, create posts with images, comment and reply, like posts and comments, and control post privacy.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | PHP 8.3+, Laravel 13 |
| Authentication | JWT (`php-open-source-saver/jwt-auth`) |
| Frontend | React 19, TypeScript, Vite 8 |
| Database | MySQL |
| Testing | Pest 4 |
| Code Quality | Laravel Pint, PHPStan / Larastan, Rector |

---

## Architecture

```
app/
├── Actions/        # Single-responsibility business logic (CreatePostAction, ToggleLikeAction, …)
├── DTOs/           # Readonly data transfer objects used at request boundaries
├── Http/
│   ├── Controllers/
│   ├── Requests/   # Form request validation
│   └── Resources/  # Eloquent API resources (JSON transformation)
├── Models/
├── Policies/
├── Repositories/   # Interface-bound query classes (PostRepository, CommentRepository, …)
└── Services/       # ImageUploadService, JwtService

resources/js/
├── components/     # PostCard, PostComposer, CommentSection, CommentItem, …
├── context/        # AuthContext (JWT token, user state)
├── hooks/          # usePageTitle, useRelativeTime
├── pages/          # Login, Register, Feed
├── services/       # Axios API client with Bearer token interceptor
└── types.ts
```

All API routes are versioned under `/api/v1`. The frontend is a single-page app served from a catch-all `/{any?}` route — React Router handles client-side navigation.

---

## Prerequisites

- PHP 8.3+
- Composer
- Node.js 20+ and npm
- MySQL

---

## Installation

### 1. Clone the repository

```bash
git clone <repo-url>
cd appifylab
```

### 2. Install PHP dependencies

```bash
composer install
```

### 3. Set up environment file

```bash
cp .env.example .env
php artisan key:generate
```

### 4. Configure the database

Edit `.env` and set your MySQL credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=buddyscript
DB_USERNAME=root
DB_PASSWORD=your_password
```

### 5. Generate the JWT secret

```bash
php artisan jwt:secret
```

This writes `JWT_SECRET` into your `.env` automatically.

### 6. Run migrations

```bash
php artisan migrate
```

### 7. Create the storage symlink

```bash
php artisan storage:link
```

Post images are stored under `storage/app/public/posts` and served via this symlink.

### 8. Install Node dependencies and build assets

```bash
npm install
npm run build
```

### 9. (Optional) Seed demo data

```bash
php artisan db:seed
```

This creates **21 users** (20 random + 1 known dev account), each with 3–10 posts, nested comments, replies, and likes spread across all content.

---

## Demo Credentials

After seeding, you can log in immediately with:

| Field | Value |
|---|---|
| Email | `dev@example.com` |
| Password | `password` |

All randomly generated users also share the same password: `password`.

---

## Quick Setup (one command)

The `composer setup` script automates steps 2–8 for a clean environment:

```bash
composer setup
```

> You still need to set your database credentials in `.env` and run `php artisan jwt:secret` manually, as those require environment-specific values.

---

## Running the Application

Start all services concurrently (API server, queue worker, log watcher, Vite dev server):

```bash
composer run dev
```

Or start services individually:

```bash
php artisan serve          # API + SPA shell at http://localhost:8000
npm run dev                # Vite HMR dev server
php artisan queue:listen   # Queue worker (image upload jobs)
```

---

## Environment Variables Reference

Key variables beyond the defaults:

| Variable | Description | Default |
|---|---|---|
| `DB_DATABASE` | MySQL database name | `appi` |
| `JWT_SECRET` | JWT signing key — generate with `php artisan jwt:secret` | _(empty)_ |
| `JWT_TTL` | Access token lifetime in minutes | `60` |
| `JWT_REFRESH_TTL` | Refresh token lifetime in minutes | `20160` (14 days) |
| `JWT_BLACKLIST_ENABLED` | Revoke tokens on logout | `true` |
| `QUEUE_CONNECTION` | Queue driver — `database` is the default | `database` |
| `FILESYSTEM_DISK` | Storage disk for uploaded images | `local` |

---

## API Endpoints

Base URL: `http://localhost:8000/api/v1`

Rate limits: auth endpoints — 10 req/min per IP; all other endpoints — 60 req/min per user.

### Auth

| Method | Endpoint | Auth required | Description |
|---|---|---|---|
| POST | `/auth/register` | No | Register a new user |
| POST | `/auth/login` | No | Login, returns JWT |
| POST | `/auth/logout` | Yes | Invalidate token |
| POST | `/auth/refresh` | Yes | Refresh JWT |
| GET | `/auth/me` | Yes | Authenticated user details |

### Posts

| Method | Endpoint | Auth required | Description |
|---|---|---|---|
| GET | `/posts` | Yes | Paginated feed (15 per page) |
| POST | `/posts` | Yes | Create post (body + up to 5 images) |
| DELETE | `/posts/{post}` | Yes | Delete own post |

### Comments & Replies

| Method | Endpoint | Auth required | Description |
|---|---|---|---|
| GET | `/posts/{post}/comments` | Yes | List comments with nested replies |
| POST | `/posts/{post}/comments` | Yes | Add a comment |
| POST | `/comments/{comment}/replies` | Yes | Add a reply |
| DELETE | `/comments/{comment}` | Yes | Delete own comment |

### Likes

| Method | Endpoint | Auth required | Description |
|---|---|---|---|
| POST | `/posts/{post}/likes` | Yes | Toggle like on a post |
| POST | `/comments/{comment}/likes` | Yes | Toggle like on a comment |
| GET | `/posts/{post}/likes` | Yes | List users who liked a post |
| GET | `/comments/{comment}/likes` | Yes | List users who liked a comment |

---

## Testing

```bash
composer test
```

Or via artisan directly:

```bash
php artisan test --compact
php artisan test --compact --filter=PostTest   # run a single test file
```

Tests use `RefreshDatabase` and hit a real database — no mocked repositories. Coverage is generated automatically with `composer test`.

---

## Code Quality

```bash
composer lint      # Laravel Pint — auto-fix code style
composer analyse   # PHPStan / Larastan static analysis
composer refactor  # Rector — automated refactoring
```

Run Pint before committing any PHP changes:

```bash
vendor/bin/pint --dirty
```

---

## Frontend Notes

- Auth token is stored in `localStorage` and attached to every request via an Axios interceptor.
- The Feed page implements infinite scroll — 15 posts per page, next page loads when the user scrolls within 200 px of the bottom.
- Like updates are optimistic — the UI updates immediately without waiting for the API response.
- Dark mode is toggled via the `DarkModeToggle` component and persisted in `localStorage`.
- If frontend changes aren't reflected in the browser, rebuild assets:

```bash
npm run build
# or keep the dev server running:
npm run dev
```

---

## What's Not Yet Implemented

The following features are visible in the UI but not connected to an API:

- Friend suggestions (right sidebar)
- Notifications
- Chat
- Search
- "Save Post", video/event/article post types

Real-time features (live like counts, new comment streaming) would require adding **Laravel Reverb** or Pusher with Laravel Echo. The existing event broadcasting infrastructure is ready to be wired up.
