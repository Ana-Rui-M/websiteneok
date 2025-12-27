"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { normalizeImageUrl } from '@/lib/utils';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import imageCompression from 'browser-image-compression';

interface ImageUploadProps {
  label?: string;
  value?: string | string[];
  onChange: (val: string | string[]) => void;
  multiple?: boolean;
  folder?: string; // optional R2 folder prefix
}

export function ImageUpload({ label = 'Imagem', value, onChange, multiple = false, folder }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const images: string[] = Array.isArray(value) ? value : (value ? [value] : []);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setProgress(0);
    try {
      const uploadedRaw: (string | null)[] = await Promise.all(
        Array.from(files).map(async (file) => {
          const compressed = await compressFile(file);
          const url = await uploadToFirebase(compressed, folder, (p) => setProgress(p));
          return url;
        })
      );
      const uploaded: string[] = uploadedRaw.filter((u): u is string => !!u && typeof u === 'string' && u.length > 0);
      if (multiple) {
        const nextArr = [...images, ...uploaded];
        onChange(nextArr);
      } else {
        const nextStr = uploaded[0] || images[0] || '';
        onChange(nextStr);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUploading(false);
      setProgress(0);
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
  const readClipboard = async () => {
    try {
      const navClip: any = (navigator as any).clipboard;
      if (navClip && typeof navClip.read === 'function') {
        const items = await navClip.read();
        const files: File[] = [];
        for (const item of items) {
          for (const type of item.types) {
            if (type.startsWith('image/')) {
              const blob = await item.getType(type);
              const file = new File([blob], `clipboard_${Date.now()}.png`, { type });
              files.push(file);
            }
          }
        }
        if (files.length > 0) {
          const dt = new DataTransfer();
          for (const f of files) dt.items.add(f);
          await handleFiles(dt.files);
          return;
        }
      }
    } catch {}
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
      <div className="rounded-md border p-3 text-sm bg-muted/30" onPaste={onPaste}>
        <div className="flex flex-wrap items-center gap-2">
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple={multiple}
            capture="environment"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <Button type="button" variant="outline" disabled={isUploading} onClick={() => fileInputRef.current?.click()}>
            {isUploading ? (progress > 0 ? `A carregar... ${progress}%` : 'A carregar...') : 'Selecionar'}
          </Button>
          <Button type="button" variant="outline" onClick={readClipboard}>
            Colar da Área de Transferência
          </Button>
          <div
            contentEditable
            suppressContentEditableWarning
            className="min-w-[180px] flex-1 rounded-md border bg-background px-2 py-1 text-muted-foreground"
            onPaste={onPaste}
          >
            Toque e cole aqui (iOS)
          </div>
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

async function uploadToFirebase(file: File, folder?: string, onProgress?: (p: number) => void): Promise<string | null> {
  const base = folder ? folder.replace(/\/+$/,'') : 'uploads';
  const key = `${base}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const imageRef = ref(storage, key);
  return await new Promise<string | null>((resolve) => {
    const task = uploadBytesResumable(imageRef, file, { contentType: file.type || 'application/octet-stream' });
    task.on('state_changed', (snap) => {
      const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
      if (onProgress) onProgress(pct);
    }, () => resolve(null), async () => {
      const url = await getDownloadURL(imageRef);
      resolve(url);
    });
  });
}

async function compressFile(file: File): Promise<File> {
  try {
    if (!file.type.startsWith('image/')) return file;
    const isSmall = file.size < 300 * 1024;
    if (isSmall) return file;
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    const isIOS = /iPad|iPhone|iPod/.test(ua);
    const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua);
    const options = {
      maxSizeMB: 0.6,
      maxWidthOrHeight: 1600,
      useWebWorker: !(isIOS && isSafari),
      initialQuality: 0.8,
    };
    const compressedBlob = await imageCompression(file, options);
    const compressedFile = new File([compressedBlob], file.name, { type: compressedBlob.type || file.type });
    return compressedFile;
  } catch {
    return file;
  }
}
