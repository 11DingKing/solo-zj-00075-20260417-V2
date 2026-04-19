FROM node:14-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production

FROM node:14-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV PORT 8080

RUN addgroup -g 1001 -S nodejs
RUN adduser -S express -u 1001

COPY --from=deps /app/node_modules ./node_modules
COPY . .

USER express

EXPOSE 8080

CMD ["npm", "start"]
