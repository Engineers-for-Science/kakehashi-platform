import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils";


export default function LoadingCard({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <>
      <Card
        className={cn("hover:bg-gray-50 cursor-pointer shadow p-6 space-y-2", className)}
        {...props}
      >
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />

      </Card>
    </>
  )
}