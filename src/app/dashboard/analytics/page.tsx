"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, DollarSign, Package, Star } from "lucide-react";

interface Analytics {
  totalViews: number;
  totalRevenue: number;
  pendingOrders: number;
  listingsCount: number;
  avgRating: number;
  conversionRate: number;
  viewsByListing: { name: string; views: number }[];
  revenueByDay: { date: string; revenue: number }[];
}

export default function SellerAnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);

  useEffect(() => {
    fetch("/api/seller/analytics")
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) {
    return <p className="text-muted-foreground">Бор мешавад...</p>;
  }

  const stats = [
    { label: "Намоишҳо", value: data.totalViews, icon: Eye },
    { label: "Даромад", value: `${data.totalRevenue.toLocaleString()} с.`, icon: DollarSign },
    { label: "Фармоишҳои интизор", value: data.pendingOrders, icon: Package },
    { label: "Рейтинг", value: data.avgRating || "—", icon: Star },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold">Аналитикаи фурӯшанда</h2>
        <p className="text-sm text-muted-foreground">
          Конверсия: {data.conversionRate}% · {data.listingsCount} эълон
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Даромад (7 рӯз)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data.revenueByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="hsl(168 76% 32%)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Намоишҳо барои маҳсулот</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.viewsByListing} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" fontSize={12} />
                <YAxis dataKey="name" type="category" width={80} fontSize={11} />
                <Tooltip />
                <Bar dataKey="views" fill="hsl(168 76% 32%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
