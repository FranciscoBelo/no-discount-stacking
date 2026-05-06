# 🛡️ Shopify Function — Bloquear Cupões em Produtos com Desconto

## O que faz esta Function?

Quando um cliente tenta aplicar um cupão (ex: WELCOME10) num carrinho que já
contém produtos com desconto aplicado pela app **Sales & Discounts**, esta
Function rejeita o cupão e mostra uma mensagem clara ao cliente.

**Porquê é necessário?**  
A app Sales & Discounts baixa diretamente o preço do produto no Shopify (campo
`price`) e guarda o preço original em `compare_at_price`. O Shopify não
reconhece isto como um "desconto nativo", por isso não bloqueia automaticamente
a acumulação com cupões.

---

## 📋 Pré-requisitos

- [ ] Node.js 22 ou superior → https://nodejs.org
- [ ] Shopify CLI → `npm install -g @shopify/cli`
- [ ] Conta de Partner no Shopify → https://partners.shopify.com
- [ ] Uma app criada no Partner Dashboard (ver Passo 1)

---

## 🚀 Passos de Instalação e Deploy

### Passo 1 — Criar a App no Partner Dashboard

1. Vai a https://partners.shopify.com
2. Clica em **Apps** → **Create app** → **Create app manually**
3. Dá o nome: `no-sale-coupon-stacking`
4. Copia o **Client ID** que aparece no dashboard

### Passo 2 — Configurar o shopify.app.toml

Abre o ficheiro `shopify.app.toml` na raiz do projeto e substitui:

```
client_id = "YOUR_CLIENT_ID_HERE"
```

pelo Client ID que copiaste no Passo 1.

### Passo 3 — Instalar dependências e fazer deploy

```bash
git clone https://github.com/FranciscoBelo/no-discount-stacking.git
cd no-discount-stacking
npm install
cd extensions/no-sale-coupon && npm install && cd ../..
shopify auth login
shopify app deploy
```

### Passo 4 — Ativar a Function na loja (OBRIGATÓRIO)

Depois do deploy, corre esta mutation no GraphiQL:

```graphql
mutation {
  discountAutomaticAppCreate(
    automaticAppDiscount: {
      title: "Bloquear cupões em produtos com desconto"
      functionHandle: "no-sale-coupon"
      discountClasses: [ORDER]
      startsAt: "2024-01-01T00:00:00"
    }
  ) {
    automaticAppDiscount {
      discountId
    }
    userErrors {
      field
      message
    }
  }
}
```

---

## 📁 Estrutura do Projeto

```
no-discount-stacking/
├── shopify.app.toml                    ← Configuração da app (mete o teu client_id aqui)
├── package.json                        ← Dependências raiz
└── extensions/
    └── no-sale-coupon/
        ├── shopify.extension.toml      ← Configuração da Function
        ├── package.json                ← Dependências da extensão
        ├── locales/
        │   └── en.default.json         ← Nome e descrição no admin Shopify
        └── src/
            ├── run.graphql             ← Query de input
            └── run.js                  ← Lógica principal ← FICHEIRO PRINCIPAL
```
