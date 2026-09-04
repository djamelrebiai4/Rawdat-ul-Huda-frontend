"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CalendarCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

type FormState = "idle" | "submitting" | "success" | "error";

export function TrialForm() {
  const t = useTranslations("contact.trial");
  const te = useTranslations("contact.form");
  const [state, setState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    program: "",
    level: "",
    timezone: "",
  });

  const validate = () => {
    const next: Record<string, string> = {};
    if (!values.name.trim()) next.name = te("nameError");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = te("emailError");
    if (!values.phone.trim()) next.phone = te("phoneError");
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setState("submitting");

    const text = [
      `New trial request from ${site.name} website`,
      `Name: ${values.name}`,
      `Email: ${values.email}`,
      `Phone: ${values.phone}`,
      `Program: ${values.program}`,
      `Level: ${values.level}`,
      `Timezone: ${values.timezone}`,
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
        value={values.name}
        onChange={(e) => setValues({ ...values, name: e.target.value })}
        error={errors.name}
        autoComplete="name"
      />
      <Input
        label={t("email")}
        name="email"
        type="email"
        value={values.email}
        onChange={(e) => setValues({ ...values, email: e.target.value })}
        error={errors.email}
        autoComplete="email"
      />
      <Input
        label={t("phone")}
        name="phone"
        type="tel"
        value={values.phone}
        onChange={(e) => setValues({ ...values, phone: e.target.value })}
        error={errors.phone}
        autoComplete="tel"
        dir="ltr"
      />
      <Select
        label={t("program")}
        name="program"
        value={values.program}
        onChange={(e) => setValues({ ...values, program: e.target.value })}
        placeholder={t("program")}
        options={[
          { value: "hifdh", label: t("programOptions.hifdh") },
          { value: "arabic", label: t("programOptions.arabic") },
          { value: "tajweed", label: t("programOptions.tajweed") },
          { value: "unsure", label: t("programOptions.unsure") },
        ]}
      />
      <Select
        label={t("level")}
        name="level"
        value={values.level}
        onChange={(e) => setValues({ ...values, level: e.target.value })}
        placeholder={t("level")}
        options={[
          { value: "beginner", label: t("levelOptions.beginner") },
          { value: "some", label: t("levelOptions.some") },
          { value: "intermediate", label: t("levelOptions.intermediate") },
          { value: "advanced", label: t("levelOptions.advanced") },
        ]}
      />
      <Input
        label={t("timezone")}
        name="timezone"
        placeholder="GMT+2"
        value={values.timezone}
        onChange={(e) => setValues({ ...values, timezone: e.target.value })}
        dir="ltr"
      />
      {state === "error" && (
        <p role="alert" className="text-sm text-destructive">
          {t("error")}
        </p>
      )}
      <Button type="submit" size="lg" disabled={state === "submitting"} className="mt-1">
        <CalendarCheck className="h-4 w-4" aria-hidden="true" />
        {t("submit")}
      </Button>
    </form>
  );
}