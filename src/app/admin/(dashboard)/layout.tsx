import React from "react";
import AdminLayout from "../../../../components/admin/layout/AdminLayout";

export default function AdminRouteLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
