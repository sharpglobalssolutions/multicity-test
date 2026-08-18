import { LayoutDashboard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export default function AdminDashboardPage() {
  return (
    <Card>
      <CardContent>
        <EmptyState
          icon={LayoutDashboard}
          title="Admin foundation ready"
          description="The layout, navigation, and reusable component library are set up. Business modules (Pages, Airports, Airlines, Offers, Blog, SEO, Users) will be built into the sidebar items marked “Soon” in a future pass."
        />
      </CardContent>
    </Card>
  );
}
