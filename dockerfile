FROM node:20
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npx prisma generate
ENV NEXT_TELEMETRY_DISABLED=1
ENV RESEND_API_KEY=dummy-key-for-build
RUN npm run build
EXPOSE 3000
CMD [ "npm","start"]
