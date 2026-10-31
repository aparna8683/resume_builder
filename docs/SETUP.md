# Resume Builder setup and deployment

## Requirements

- Node.js 22 or newer
- npm
- MongoDB (local or hosted, such as MongoDB Atlas)

## Local development

### 1. Configure the API

```bash
cd server
npm ci
cp .env.example .env
```

Set these values in `server/.env`:

- `MONGO_URI`: your MongoDB connection string
- `JWT_SECRET`: a unique random secret with at least 32 characters
- `CLIENT_URL=http://localhost:5173`

AI enhancement and ImageKit image hosting are optional. Configure `GEMINI_API_KEY` (or `OPENAI_API_KEY`) and, if using a different compatible provider, `OPENAI_BASE_URL`. Configure `IMAGEKIT_PRIVATE_KEY` to enable hosted profile images.

Start the API:

```bash
npm run dev
```

The API listens on port 5000 by default. Its health endpoint is `http://localhost:5000/health`.

### 2. Configure the frontend

In another terminal:

```bash
cd client
npm ci
cp .env.example .env
npm run dev
```

The Vite development proxy sends `/api` requests to `http://localhost:5000`. Override this with `VITE_API_PROXY_TARGET` if your local API uses another address.

## Production deployment

1. Deploy the `server` directory as a Node.js service and provide `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL` as platform environment variables.
2. Set `NODE_ENV=production` and configure `CLIENT_URL` with the exact frontend origin (comma-separated if multiple origins are used).
3. Deploy the `client` directory as a static Vite site using `npm ci` and `npm run build`.
4. If frontend and API use the same origin, configure the hosting platform or reverse proxy to forward `/api` to the API service and leave `VITE_BASE_URL` empty.
5. If frontend and API use different origins, set `VITE_BASE_URL` to the API origin before building the frontend and include the frontend origin in `CLIENT_URL`.

Never commit `.env` files or expose `JWT_SECRET`, AI provider keys, or the ImageKit private key to the browser.

## Validation

From `client`:

```bash
npm ci
npm run lint
npm run build
```

From `server`:

```bash
npm ci
npm test
```

The GitHub Actions workflows run these checks and JavaScript syntax validation on repair-branch pushes and pull requests to `main`.
