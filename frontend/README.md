# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).

## Backend API URL Configuration

This frontend reads API URL from environment variables.

1. Copy `.env.example` to `.env`.
2. Set `VITE_API_BASE_URL` to your backend API base URL.

Example for Vercel backend:

```bash
VITE_API_BASE_URL=https://software-business-assignment-vibe-c.vercel.app/api
```

For local development with a local backend, you can keep `VITE_API_BASE_URL=/api` and use the Vite proxy target with:

```bash
VITE_DEV_API_PROXY_TARGET=http://localhost:3000
```
