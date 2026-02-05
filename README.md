setup instructions:

1. follow this page: https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/sqlite

2. `npm install express cors`
3. `npm install -D @types/express @types/cors`
4. in tsconfig.json, ensure `"ignoreDeprecations": "5.0"` value matches `npx tsc --version`
5. add `"dev": "tsx watch src/index.ts",` to `package.json`

`npx prisma migrate dev --name [name]`

`npx prisma format` - for auto formatting of schema.prisma file
`npx prisma migrate reset` - to clear/reset migration.sql