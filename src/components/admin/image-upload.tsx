"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { normalizeImageUrl } from '@/lib/utils';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface ImageUploadProps {
  label?: string;
  value?: string | string[];
  onChange: (val: string | string[]) => void;
  multiple?: boolean;
  folder?: string; // optional R2 folder prefix
}

export function ImageUpload({ label = 'Imagem', value, onChange, multiple = false, folder }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const images: string[] = Array.isArray(value) ? value : (value ? [value] : []);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadToFirebase(file, folder);
        if (url) uploaded.push(url);
      }
      const next = multiple ? [...images, ...uploaded] : (uploaded[0] || images[0] || '');
      onChange(multiple ? next : next);
    } catch (e) {
      console.error(e);
    } finally {
      setIsUploading(false);
    }
  };

  const onPaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData?.items;
    if (!items || items.length === 0) return;
    const files: File[] = [];
    for (const it of items as any) {
      if (it.kind === 'file') {
        const f = it.getAsFile();
        if (f) files.push(f);
      }
    }
    if (files.length > 0) {
      const dt = new DataTransfer();
      for (const f of files) {
        dt.items.add(f);
      }
      await handleFiles(dt.files);
    }
  };

  const removeImage = (idx: number) => {
    if (multiple) {
      const next = images.filter((_, i) => i !== idx);
      onChange(next);
    } else {
      onChange('');
    }
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div
        className="rounded-md border p-3 text-sm bg-muted/30"
        onPaste={onPaste}
      >
        <div className="flex items-center gap-2">
          <Input type="file" accept="image/*" multiple={multiple} onChange={(e) => handleFiles(e.target.files)} />
          <Button type="button" variant="outline" disabled={isUploading}>
            {isUploading ? 'A carregar...' : 'Carregar'}
          </Button>
          <span className="text-muted-foreground">Cole uma imagem aqui (Ctrl+V) ou selecione um ficheiro.</span>
        </div>
      </div>
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((img, idx) => {
            const src = normalizeImageUrl(img);
            return (
              <div key={idx} className="relative h-28 w-full overflow-hidden rounded-md border">
                <Image src={src} alt={`Imagem ${idx + 1}`} fill className="object-cover" />
                <div className="absolute right-2 top-2 flex gap-2">
                  <Button type="button" size="sm" variant="destructive" onClick={() => removeImage(idx)}>
                    Remover
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

async function uploadToFirebase(file: File, folder?: string): Promise<string | null> {
  const base = folder ? folder.replace(/\/+$/,'') : 'uploads';
  const key = `${base}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const imageRef = ref(storage, key);
  await uploadBytes(imageRef, file, { contentType: file.type || 'application/octet-stream' });
  const url = await getDownloadURL(imageRef);
  return url;
}
