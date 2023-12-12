FROM mcr.microsoft.com/playwright:v1.39.0-jammy

COPY . /aqa-playwright
WORKDIR /aqa-playwright

RUN npm ci

CMD ["npm", "test"]
