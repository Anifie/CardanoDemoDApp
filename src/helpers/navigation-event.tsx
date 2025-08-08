"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function NavigationEvents({
  callback,
}: {
  callback: (url: string, data: any) => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = `${pathname}?${searchParams}`;
    console.log(url);
    callback(url, { pathname, searchParams });
  }, [pathname, searchParams]);

  return null;
}
