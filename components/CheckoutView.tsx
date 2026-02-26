"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { CreditCard, Wallet } from "lucide-react";
import { formatPrice } from "@/utils/helpers";
import { PaymentStatus, Address } from "@/types";

const SHIPPING_METHODS = [
  { id: "standard", name: "پیک استاندارد وب‌قاب", price: 0 },
  { id: "express", name: "ارسال اکسپرس (امروز)", price: 85000 },
];

export default function CheckoutView() {
  const router = useRouter();
  const { cart, user, createOrder, addNotification } = useApp();

  const [selectedAddressId, setSelectedAddressId] =
    user?.addresses.find((a) => a.isDefault)?.id ||
    user?.addresses[0]?.id ||
    "";

  const [selectedShipping, setSelectedShipping] = useState(SHIPPING_METHODS[0]);

  const [paymentType, setPaymentType] = useState("ONLINE");

  const total =
    cart.reduce((acc, item) => acc + item.price * item.quantity, 0) +
    selectedShipping.price;

  const handlePayment = async () => {
    if (!selectedAddressId) {
      addNotification("آدرس را انتخاب کنید.", "error");
      return;
    }

    const addr = user?.addresses.find(
      (a) => a.id === selectedAddressId,
    ) as Address;

    const method =
      paymentType === "WALLET" ? "پرداخت از کیف پول" : "درگاه آنلاین بانکی";

    const orderId = await createOrder(
      addr,
      total,
      selectedShipping.name,
      method,
      PaymentStatus.UNPAID,
    );

    if (!orderId) {
      if (paymentType === "WALLET") {
        addNotification("موجودی کیف پول کافی نیست.", "error");
      }
      return;
    }

    // 🔥 جایگزین onSuccess
    router.push(`/order-success/${orderId}`);
  };

  return (
    <div className="pb-20">
      <h2 className="text-2xl font-black mb-10">نهایی‌سازی سفارش</h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-8 rounded-[40px] shadow-xl">
            <h3 className="text-lg font-black mb-8">روش پرداخت</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setPaymentType("ONLINE")}
                className={`p-6 rounded-[28px] border ${
                  paymentType === "ONLINE"
                    ? "border-brand bg-brand/5"
                    : "border-muted/10"
                }`}>
                <CreditCard className="mb-4 text-brand" />
                درگاه مستقیم بانکی
              </button>

              <button
                onClick={() => setPaymentType("WALLET")}
                className={`p-6 rounded-[28px] border ${
                  paymentType === "WALLET"
                    ? "border-brand bg-brand/5"
                    : "border-muted/10"
                }`}>
                <Wallet className="mb-4 text-brand" />
                پرداخت از کیف پول
                <p className="text-xs mt-2">
                  موجودی: {formatPrice(user?.walletBalance || 0)} تومان
                </p>
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-black p-10 rounded-[48px] text-white">
            <div className="flex justify-between mb-6">
              <span>مبلغ نهایی</span>
              <span className="text-2xl text-brand">
                {formatPrice(total)} تومان
              </span>
            </div>

            <button
              onClick={handlePayment}
              className="w-full bg-brand text-black py-5 rounded-[28px] font-black">
              {paymentType === "WALLET"
                ? "تایید و برداشت از موجودی"
                : "انتقال به درگاه بانکی"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
