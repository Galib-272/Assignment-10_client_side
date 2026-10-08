"use client";
import { use, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DynamicPaymentRedirect({ params }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const bookingId = unwrappedParams.bookingId;

  useEffect(() => {
    if (bookingId) {
      router.replace(`/dashboard/payment?bookingId=${bookingId}`);
    } else {
      router.replace("/dashboard/payment");
    }
  }, [bookingId, router]);

  return (
    <div style={{ display: "flex", justifyContent: "center", paddingTop: "80px" }}>
      <div className="spinner" />
    </div>
  );
}
