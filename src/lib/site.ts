export const site = {
  name: "Rawdat ul-Huda Quran Academy",
  url: "https://moddakir.com",
  whatsappNumber: "+923069296224",
  whatsappDisplay: "+92 306 9296224",
  email: "hello@moddakir.com",
  facebook: "https://www.facebook.com/Moddakirapp",
  twitter: "https://x.com/ModdakirApp",
} as const;

export function whatsappLink(message: string) {
  const text = encodeURIComponent(message);
  return `https://wa.me/${site.whatsappNumber.replace(/[^0-9]/g, "")}?text=${text}`;
}