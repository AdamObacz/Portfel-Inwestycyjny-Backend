
FROM node:22-alpine

RUN apk add --no-cache libc6-compat
RUN apk add --no-cache git
WORKDIR /app

COPY package.json ./

RUN npm i


WORKDIR /app
COPY . .

RUN npm run build

EXPOSE 8000

CMD ["npm", "run","start"]
