FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV NEXT_PUBLIC_API_URL="https://chauffagistes-pool.fr:3000"
ENV NEXT_PUBLIC_HISTORY_API_URL="http://192.168.1.201:8091"
ENV NEXT_PUBLIC_BASE_URL="https://stats.chauffagistes-pool.fr"
RUN npx prisma generate

ARG SESSION_PASSWORD="1234"
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app ./
EXPOSE 3000
CMD ["npm", "start"]