setup steps:
1. `npm init -y`
2. `npm install express cors dotenv`
3. `npm install -D typescript ts-node-dev @types/node @types/express`
4. `npx tsc --init`
5. amend `tsconfig.json`

1. `npm install prisma @prisma/client`
2. `npx prisma init`
3. `npx prisma migrate dev --name [name]`

`npx prisma format` - for auto formatting of schema.prisma file