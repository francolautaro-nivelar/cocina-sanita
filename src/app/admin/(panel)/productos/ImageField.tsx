"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";

export default function ImageField({ currentImageUrl }: { currentImageUrl?: string | null }) {
  const [preview, setPreview] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setPreview(null);
      return;
    }
    setPreview(URL.createObjectURL(file));
  }

  const shownImage = preview ?? currentImageUrl ?? null;

  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-brand-green-dark">
        Foto {currentImageUrl && "(subí una nueva para reemplazar la actual)"}
      </span>
      <div className="flex items-center gap-4">
        <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-brand-sage/15">
          {shownImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={shownImage} alt="Vista previa" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="text-brand-sage" size={28} strokeWidth={1.5} />
          )}
        </div>
        <input
          name="image"
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="input flex-1"
        />
      </div>
    </label>
  );
}
