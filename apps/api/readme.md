cat << 'EOF' > README.md

# Backend API Setup

## 🚀 Installation

```bash
npm init -y

npm install bcrypt cookie-session cors dotenv express mongoose passport passport-google-oauth20 passport-local uuid zod

npm install -D @types/bcrypt @types/cookie-session @types/cors @types/dotenv @types/express @types/mongoose @types/node @types/passport @types/passport-google-oauth20 @types/passport-local ts-node-dev typescript

npx tsc --init


open tsconfig.json
   1. open comment on
       "rootDir": "./src",
       "outDir": "./dist",
   2. add this to register typescript
      "include": ["src/**/*.ts","@types"]
```
