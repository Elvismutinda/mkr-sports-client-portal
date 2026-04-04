import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

const NotFoundPage: React.FC = () => (
  <div className="flex min-h-screen items-center justify-center bg-background px-4">
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
        <FileQuestion className="h-12 w-12 text-muted-foreground" />
      </div>

      <h1 className="text-7xl font-bold tracking-tight text-foreground">
        404
      </h1>

      <p className="max-w-md text-base text-muted-foreground">
        Sorry, the page you visited does not exist.
      </p>

      <Link href="/">
        <Button size="lg">Back Home</Button>
      </Link>
    </div>
  </div>
);

export default NotFoundPage;