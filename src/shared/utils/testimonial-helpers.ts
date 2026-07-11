// ─── Testimonial Helpers ───────────────────────────────────────────────────────
// Utilidades para manejo de testimonios y avatares

// Google avatar background colors for placeholders
export const avatarColors = [
  "bg-[#4285F4] text-white", // Blue
  "bg-[#EA4335] text-white", // Red
  "bg-[#FBBC05] text-white", // Yellow
  "bg-[#34A853] text-white", // Green
];

export const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
};

export const getAvatarColor = (index: number) => {
  return avatarColors[index % avatarColors.length];
};

export const hasCustomImage = (image?: string | null) => {
  return image && !image.includes("portada-fina-estampa");
};
