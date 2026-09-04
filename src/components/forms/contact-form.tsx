"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

type FormState = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const t = useTranslations("contact.form");
  const [state, setState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const validate = () => {
    const next: Record<string, string> = {};
    if (!values.name.trim()) next.name = t("nameError");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = t("emailError");
    if (!values.phone.trim()) next.phone = t("phoneError");
    if (!values.message.trim()) next.message = t("messageError");
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setState("submitting");

    const text = [
      `New contact from ${site.name} website`,
      `Name: ${values.name}`,
      `Email: ${values.email}`,
      `Phone: ${values.phone}`,
      `Message: ${values.message}`,
    ].join("\n");

    const encoded = encodeURIComponent(text);
    const wa = `https://wa.me/${site.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encoded}`;
    setTimeout(() => setState("success"), 600);
    window.open(wa, "_blank", "noopener,noreferrer");
  };

  if (state === "success") {
    return (
      <div
        role="status"
        className="rounded-2xl border border-success/30 bg-success-light p-8 text-center"
      >
        <p className="font-display text-xl font-semibold text-success-foreground">
          {t("success")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <Input
        label={t("name")}
        name="name"
        placeholder={t("namePlaceholder")}
        value={values.name}
        onChange={(e) => setValues({ ...values, name: e.target.value })}
        error={errors.name}
        autoComplete="name"
      />
      <Input
        label={t("email")}
        name="email"
        type="email"
        placeholder={t("emailPlaceholder")}
        value={values.email}
        onChange={(e) => setValues({ ...values, email: e.target.value })}
        error={errors.email}
        autoComplete="email"
      />
      <Input
        label={t("phone")}
        name="phone"
        type="tel"
        placeholder={t("phonePlaceholder")}
        value={values.phone}
        onChange={(e) => setValues({ ...values, phone: e.target.value })}
        error={errors.phone}
        autoComplete="tel"
        dir="ltr"
      />
      <Textarea
        label={t("message")}
        name="message"
        placeholder={t("messagePlaceholder")}
        value={values.message}
        onChange={(e) => setValues({ ...values, message: e.target.value })}
        error={errors.message}
      />
      {state === "error" && (
        <p role="alert" className="text-sm text-destructive">
          {t("error")}
        </p>
      )}
      <Button type="submit" size="lg" disabled={state === "submitting"} className="mt-1">
        <Send className="h-4 w-4" aria-hidden="true" />
        {t("submit")}
      </Button>
    </form>
  );
}