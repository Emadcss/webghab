
export const toPersianDigits = (num: number | string): string => {
  if (num === undefined || num === null) return '';
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/\d/g, (x) => persianDigits[parseInt(x)]);
};

export const toPersianDigitsGlobal = (text: string): string => {
  if (!text) return '';
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return text.replace(/\d/g, (x) => persianDigits[parseInt(x)]);
};

export const formatPrice = (price: number): string => {
  const formatted = new Intl.NumberFormat('fa-IR').format(Math.round(price));
  return toPersianDigits(formatted);
};

export const cleanPrice = (formattedPrice: string): number => {
  if (typeof formattedPrice !== 'string') return Number(formattedPrice) || 0;
  return Number(formattedPrice.replace(/[^0-9]/g, ''));
};

/**
 * Formats a number or string for input fields with thousands separators
 */
export const formatInputNumber = (val: string | number): string => {
  if (val === undefined || val === null) return '';
  const numStr = val.toString().replace(/[^0-9]/g, '');
  if (!numStr) return '';
  return Number(numStr).toLocaleString();
};

/**
 * Controller: Calculates final totals for a cart
 */
export const calculateCartTotals = (items: any[], isPartner: boolean) => {
  return items.reduce((acc, item) => {
    const variant = getVariantInfo(item, item.selectedVariantId, isPartner);
    if (!variant) return acc;
    const lineTotal = variant.finalPrice * item.quantity;
    const lineDiscount = (variant.originalPrice - variant.finalPrice) * item.quantity;
    return {
      subtotal: acc.subtotal + (variant.originalPrice * item.quantity),
      discount: acc.discount + lineDiscount,
      total: acc.total + lineTotal
    };
  }, { subtotal: 0, discount: 0, total: 0 });
};

/**
 * Sanitize input to prevent basic XSS
 */
export const sanitizeInput = (val: string): string => {
  return val.replace(/[<>]/g, '').trim();
};

export const getVariantInfo = (product: any, variantId: string | undefined, isPartner: boolean) => {
  if (!variantId || variantId.startsWith('base-') || !product.variants || product.variants.length === 0) {
    const base = isPartner ? product.wholesalePrice : product.price;
    const disc = product.discountPercentage || 0;
    return {
      name: product.name,
      variantName: 'نسخه پایه',
      originalPrice: base,
      discountPercentage: disc,
      finalPrice: base * (1 - disc / 100)
    };
  }

  const variant = product.variants.find((v: any) => v.id === variantId);
  if (!variant) return null;

  const base = isPartner ? variant.wholesalePrice : variant.price;
  const disc = variant.discountPercentage || 0;

  return {
    name: product.name,
    variantName: `${variant.colorName} | ${variant.warrantyName}`,
    originalPrice: base,
    discountPercentage: disc,
    finalPrice: base * (1 - disc / 100)
  };
};

export const getProductBestPrice = (product: any, isPartner: boolean) => {
  if (!product.variants || product.variants.length === 0) {
    const base = isPartner ? product.wholesalePrice : product.price;
    const discount = product.discountPercentage || 0;
    return {
      originalPrice: base,
      discountPercentage: discount,
      finalPrice: base * (1 - discount / 100),
      variantId: `base-${product.id}`
    };
  }

  const variants = product.variants.map((v: any) => {
    const base = isPartner ? v.wholesalePrice : v.price;
    const discount = v.discountPercentage || 0;
    return {
      originalPrice: base,
      discountPercentage: discount,
      finalPrice: base * (1 - discount / 100),
      variantId: v.id
    };
  });

  return variants.reduce((min: any, curr: any) => curr.finalPrice < min.finalPrice ? curr : min, variants[0]);
};
