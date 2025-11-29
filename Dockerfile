FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts

COPY . .

ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start"]
