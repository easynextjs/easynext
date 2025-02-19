"use client";

import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    location.replace("https://sumins.notion.site/easynext");
  }, []);

  return <div></div>;
}
