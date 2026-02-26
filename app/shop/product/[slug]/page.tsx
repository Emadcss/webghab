import ProductDetails from "@/components/product/ProductDetails";

export default function ProductPage({ params }) {
  // محصول رو از API یا context بگیر
  return <ProductDetails slug={params.slug} />;
}
