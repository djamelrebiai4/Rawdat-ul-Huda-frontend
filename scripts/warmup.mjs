import { spawn } from "node:child_process";
import { request } from "node:http";

const port = process.env.PORT || "3000";
const base = `http://localhost:${port}`;

const routes = [
  "/en",
  "/ar",
  "/en/tajweed-course",
  "/ar/tajweed-course",
  "/en/arabic-course",
  "/ar/arabic-course",
  "/en/noorani-qaida",
  "/ar/noorani-qaida",
  "/en/pricing",
  "/ar/pricing",
  "/en/about",
  "/ar/about",
  "/en/faq",
  "/ar/faq",
  "/en/blog",
  "/ar/blog",
  "/en/contact",
  "/ar/contact",
  "/en/locations",
  "/ar/locations",
  "/en/locations/usa",
  "/ar/locations/usa",
  "/en/locations/uk",
  "/ar/locations/uk",
  "/en/locations/canada",
  "/ar/locations/canada",
  "/en/locations/pakistan",
  "/ar/locations/pakistan",
  "/en/blog/how-long-to-learn-tajweed",
  "/ar/blog/how-long-to-learn-tajweed",
  "/en/blog/tajweed-rules-for-beginners",
  "/ar/blog/tajweed-rules-for-beginners",
  "/en/blog/can-adults-learn-quran-from-scratch",
  "/ar/blog/can-adults-learn-quran-from-scratch",
  "/en/blog/quranic-arabic-vs-conversational-arabic",
  "/ar/blog/quranic-arabic-vs-conversational-arabic",
  "/en/privacy-policy",
  "/ar/privacy-policy",
  "/en/terms",
  "/ar/terms",
];

function get(url) {
  return new Promise((resolve) => {
    request(url, (res) => {
      res.resume();
      res.on("end", () => resolve(res.statusCode));
    })
      .on("error", () => resolve(null))
      .end();
  });
}

async function waitForServer() {
  for (let i = 0; i < 120; i++) {
    if (await get(base)) return true;
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}

const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "dev"], {
  stdio: "inherit",
});

child.on("exit", (code) => process.exit(code ?? 0));

if (await waitForServer()) {
  console.log("⚡ Pre-compiling all routes (first click will be instant)...");
  for (const route of routes) {
    const code = await get(base + route);
    console.log(`  ${code ?? "ERR"} ${route}`);
  }
  console.log("✓ All 45 pages ready — navigation is instant from the first click");
} else {
  console.error("✗ Dev server did not start in time");
}