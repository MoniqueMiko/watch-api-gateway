# Watch API Gateway App

Este projeto é um **API Gateway** construído com [NestJS](https://nestjs.com/), que faz comunicação com microserviços via **Kafka**. Ele utiliza **JWT para autenticação**, e é totalmente escrito em TypeScript.

## 📦 Tecnologias Principais

- [NestJS v11](https://docs.nestjs.com/)
- [KafkaJS](https://kafka.js.org/)
- [JWT](https://jwt.io/)
- [Passport](https://www.passportjs.org/)
- [RxJS](https://rxjs.dev/)
- [Jest](https://jestjs.io/) + Supertest para testes
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) para formatação e linting

---

## 🚀 Scripts Disponíveis

| Comando               | Descrição                                        |
|----------------------|--------------------------------------------------|
| `npm run start`      | Inicia a aplicação                              |
| `npm run start:dev`  | Inicia com `watch` (modo desenvolvimento)       |
| `npm run start:debug`| Inicia em modo debug                            |
| `npm run start:prod` | Inicia em produção (compilado)                  |
| `npm run build`      | Compila o projeto (dist/)                       |
| `npm run format`     | Formata os arquivos com Prettier                |
| `npm run lint`       | Aplica ESLint nos arquivos `.ts`                |
| `npm run test`       | Executa os testes unitários                     |
| `npm run test:watch` | Executa testes unitários em modo observação     |
| `npm run test:cov`   | Executa testes com relatório de cobertura       |
| `npm run test:e2e`   | Executa testes end-to-end                        |

---

## 🔐 Autenticação

Este projeto utiliza JWT com o `PassportStrategy` para autenticação. A estratégia espera o token no cabeçalho `Authorization` no formato:

```

Authorization: Bearer <token>

````

A chave secreta `JWT_SECRET` deve estar definida no `.env`.

---

## 🔄 Kafka

A comunicação com microserviços é feita via Kafka, usando a biblioteca `kafkajs`. Certifique-se de que o broker Kafka esteja rodando em `localhost:9092`.

---

## 🧪 Testes

- Testes unitários estão localizados em `*.spec.ts`.
- Para rodar com cobertura:
```bash
npm run test:cov
````

---

## 📁 Estrutura de Pastas (simplificada)

```
src/
├── controller/
│   ├── auth/
│   └── review/
├── service/
├── strategy/
├── config/
├── app.module.ts
├── main.ts
```

---

## ⚙️ Requisitos

* Node.js 18+
* Kafka rodando localmente
* Variáveis de ambiente no `.env`, incluindo:

```
JWT_SECRET=suachavesecreta
```

---

## 🛠️ Build

Para compilar o projeto:

```bash
npm run build
```

O código será gerado na pasta `dist/`.

---

## 🧹 Lint e Prettier

Para manter o código limpo e padronizado:

```bash
npm run lint
npm run format
```

---

## 🧑‍💻 Autor
- Monique Lourenço -> monique_lourenzia@hotmail.com
---

## 📄 Licença

Este projeto é **UNLICENSED**. Uso restrito conforme especificado.

`````