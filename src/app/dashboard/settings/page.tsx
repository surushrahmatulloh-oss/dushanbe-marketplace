import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await auth();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Танзимот</h2>

      <Card>
        <CardHeader>
          <CardTitle>Профил</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Ном</p>
            <p className="font-medium">{session!.user!.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{session!.user!.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Нақш</p>
            <p className="font-medium">{session!.user!.role}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
