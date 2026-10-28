# Club-Auto Web

Base web da plataforma de benefícios e descontos para motoristas de aplicativo.
Este repositório será o **app-web**. O aplicativo Flutter/Dart (**app-mobile**) e
o backend Supabase/PostgreSQL/Edge Functions (**app-backend**) ficam em
repositórios independentes.

## Tecnologias

- Next.js 16 com App Router, React 19 e TypeScript 5 em modo estrito.
- CSS padrão; ESLint 9 com regras Next.js, Core Web Vitals e TypeScript.
- npm e `package-lock.json` para instalações reproduzíveis.

A base segue a [instalação oficial do Next.js](https://nextjs.org/docs/app/getting-started/installation)
e a [configuração oficial do ESLint](https://nextjs.org/docs/app/api-reference/config/eslint).

O ESLint está fixado em 9.39.5 para respeitar os peer dependencies dos plugins
React, import e acessibilidade usados pelo Next.js. O npm sinaliza o fim de
suporte dessa versão; atualizar para ESLint 10 quando esses plugins declararem
compatibilidade, sem recorrer a `--force` ou `--legacy-peer-deps`.

## Requisitos e execução

Use Node.js **24 LTS** (indicado em `.nvmrc`) e npm **10 ou superior**.
O mínimo configurado é Node.js 22.13.0. Não há variáveis de ambiente obrigatórias.

```sh
npm ci
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). A página inicial apenas
confirma a nova base; ela não representa a interface final.

```sh
npm run lint       # ESLint; avisos também falham
npm run typecheck  # Gera tipos de rotas e executa TypeScript sem emitir arquivos
npm run build     # Build de produção
npm start         # Servidor de produção, após o build
```

`next-env.d.ts`, `.next/` e arquivos de cache são gerados localmente e ignorados
pelo Git. O lint e a verificação de tipos são comandos separados do build.

## Estrutura

```text
src/
  app/
    layout.tsx       # Layout raiz, idioma e metadados
    page.tsx         # Página inicial mínima
    globals.css      # Estilos globais da nova aplicação
public/             # Futuros arquivos estáticos servidos pelo Next.js
legacy/
  index.html        # Protótipo original completo, sem alterações de conteúdo
AGENTS.md           # Orientação padrão gerada pelo Next.js para agentes
eslint.config.mjs
tsconfig.json
package.json
package-lock.json
```

Crie `src/components/` para componentes compartilhados e `src/features/` para
funcionalidades conforme a migração exigir. `src/hooks/`, `src/lib/` e
`src/types/` devem surgir apenas quando houver código concreto para eles.
O alias `@/*` aponta para `src/*`.

## Referência original e migração gradual

O repositório original continha apenas `.gitattributes` e `index.html`.
Todo o HTML, CSS e JavaScript do protótipo foi preservado em `legacy/index.html`.
Não havia arquivos locais separados de imagens, estilos ou scripts. As URLs
originais do SheetJS via CDN e das imagens de placeholder foram mantidas.

Abra `legacy/index.html` no navegador para consultar o protótipo. Ele fica fora
de `public/` e não é publicado pelo Next.js. Dependências externas exigem rede;
o protótipo mantém as limitações existentes, incluindo ações incompletas,
usuários simulados e dados de teste em `localStorage`.

Migre uma tela ou seção de cada vez, usando o legado como referência visual:

1. Identifique elementos reutilizáveis e converta-os em componentes tipados.
2. Use CSS Modules para estilos locais; evite copiar os seletores globais do
   legado para toda a aplicação.
3. Mantenha Server Components por padrão. Use `"use client"` somente nas partes
   que precisarem de interação ou APIs do navegador.
4. Copie os assets necessários para `public/` sem apagar a referência original.
5. Verifique acessibilidade, responsividade e estados vazios/carregando/erro de
   cada tela migrada e execute lint, tipos e build antes de entregar.

O código de simulação do legado não define contratos de autenticação, cupons
ou persistência de produção. Não o transporte automaticamente para a nova base.

## Integrações futuras

O Supabase será integrado quando os contratos do **app-backend** estiverem
definidos. Migrations, políticas de acesso e Edge Functions pertencem àquele
repositório. A futura camada de integração web pode ficar em `src/lib/`, sem
duplicar regras do backend. Configure apenas as variáveis necessárias nessa
etapa e mantenha credenciais privilegiadas no servidor, fora do Git.

Autenticação, assinaturas, pagamentos e regras de negócio ainda não foram
implementados. O suporte a PWA será uma etapa posterior; esta base não registra
service workers nem implementa cache offline ou notificações push.
