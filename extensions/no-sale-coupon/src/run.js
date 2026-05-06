/**
 * Shopify Function — Bloqueia cupões quando há produtos em promoção no carrinho.
 * A app Sales & Discounts baixa o price e guarda o original em compareAtPrice.
 * Esta Function deteta isso via compareAtAmountPerQuantity > amountPerQuantity
 * e rejeita os cupões introduzidos pelo cliente.
 *
 * IMPORTANTE: discounts[] está SEMPRE vazio — esta Function nunca aplica
 * descontos, apenas bloqueia cupões. Era aqui que estava o bug dos 10%.
 */

export function run(input) {
  const hasOnSaleItem = input.cart.lines.some(lineIsOnSale);

  // Sem produtos em promoção → deixa os cupões passar normalmente
  if (!hasOnSaleItem) {
    return noDiscountResult();
  }

  const enteredCodes = input.cart.discountCodes.map((dc) => dc.code);

  // Há produtos em promoção mas nenhum cupão introduzido → nada a fazer
  if (enteredCodes.length === 0) {
    return noDiscountResult();
  }

  // Há produtos em promoção E cupões → rejeita todos os cupões
  return {
    discounts: [], // ← SEMPRE vazio. Nunca coloques descontos aqui.
    discountApplicationStrategy: "FIRST",
    discountCodes: {
      reject: enteredCodes.map((code) => ({
        code,
        reason:
          "Os cupões de desconto não são aplicáveis a produtos já em promoção. " +
          "Remove os produtos em promoção do carrinho para usar o cupão, " +
          "ou conclui a compra com o desconto já aplicado nos produtos.",
      })),
    },
  };
}

/**
 * Resultado neutro: sem descontos aplicados, sem cupões rejeitados.
 */
function noDiscountResult() {
  return {
    discounts: [],
    discountApplicationStrategy: "FIRST",
  };
}

/**
 * Devolve true se o produto estiver em promoção.
 * Sales & Discounts baixa price e guarda o original em compareAtPrice,
 * por isso compareAtAmountPerQuantity > amountPerQuantity significa "em promoção".
 */
function lineIsOnSale(line) {
  const compareAt = line.cost?.compareAtAmountPerQuantity?.amount;
  const current = line.cost?.amountPerQuantity?.amount;
  if (!compareAt || !current) return false;
  return parseFloat(compareAt) > parseFloat(current);
}
