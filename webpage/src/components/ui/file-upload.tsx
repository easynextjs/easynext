"use client";

import { cn } from "@/lib/utils";
import { ChangeEvent, useRef } from "react";

interface FileUploadProps extends React.HTMLAttributes<HTMLDivElement> {
  onFileChange: (file: File) => void;
  accept?: string;
}

export function FileUpload({
  className,
  onFileChange,
  accept = "image/*",
  children,
  ...props
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileChange(file);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "cursor-pointer rounded-md border-2 border-dashed border-gray-300 p-4 hover:border-gray-400",
        className
      )}
      {...props}
    >
      <input
        type="file"
        ref={inputRef}
        onChange={handleChange}
        accept={accept}
        className="hidden"
      />
      {children}
    </div>
  );
}
