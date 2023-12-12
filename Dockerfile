FROM node:20-alpine AS builder

COPY migrate-and-start.sh .
RUN chmod +x migrate-and-start.sh

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY prisma ./prisma/
COPY . .

RUN rm -rf node_modules

# Install app dependencies
RUN npm ci
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/migrate-and-start.sh .

# RUN npx prisma migrate dev

EXPOSE 3000

CMD ["./migrate-and-start.sh"]

# CMD [ "npm", "run", "start:migrate:prod" ]
