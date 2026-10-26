// Store billeder fra telefonen skaleres ned i browseren før upload.
export async function formindsk(fil: File, maks = 2400) {
  try {
    const bmp = await createImageBitmap(fil);
    const skala = Math.min(1, maks / Math.max(bmp.width, bmp.height));
    if (skala === 1 && fil.size < 1_500_000) return fil;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * skala);
    canvas.height = Math.round(bmp.height * skala);
    canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((ok) => canvas.toBlob(ok, "image/jpeg", 0.86));
    if (!blob) return fil;
    return new File([blob], fil.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return fil;
  }
}
