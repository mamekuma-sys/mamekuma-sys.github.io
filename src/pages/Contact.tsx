import { useState } from "react";
import Layout from "@/components/Layout";
import WindowCard from "@/components/WindowCard";
import { Github, Mail, Send } from "lucide-react";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "이름을 입력해주세요").max(100, "이름은 100자 이내로 입력해주세요"),
  email: z.string().trim().email("올바른 이메일 주소를 입력해주세요").max(255, "이메일은 255자 이내로 입력해주세요"),
  message: z.string().trim().min(1, "메시지를 입력해주세요").max(2000, "메시지는 2000자 이내로 입력해주세요"),
});

type ContactForm = z.infer<typeof contactSchema>;

const Contact = () => {
  const [form, setForm] = useState<ContactForm>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: keyof ContactForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactForm, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ContactForm;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitted(true);
    // No backend yet — just show success state
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-xl md:text-2xl font-bold font-mono mb-1">
          <span className="text-primary">$</span> ./contact --help
        </h1>
        <p className="text-xs font-mono text-muted-foreground mb-6">// 연락 가능한 채널</p>

        <WindowCard title="connections.conf" className="mb-5">
          <div className="p-5 font-mono">
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              <span className="text-primary">→</span> AI, 보안, 스타트업, 또는 협업에 대한 이야기를 나누고 싶다면 연락해주세요.
            </p>
            <div className="space-y-2">
              <a
                href="https://github.com/junny048"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <Github size={13} className="text-primary" />
                <span>github.com/junny048</span>
              </a>
              <a
                href="mailto:kjun04080@gmail.com"
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail size={13} className="text-primary" />
                <span>kjun04080@gmail.com</span>
              </a>
            </div>
          </div>
        </WindowCard>

        <WindowCard title="send_message.sh">
          <div className="p-5 font-mono">
            <h2 className="text-xs font-bold mb-4 flex items-center gap-2">
              <Send size={12} className="text-primary" /> <span className="text-primary">$</span> ./send_message
            </h2>

            {submitted ? (
              <div className="text-center py-8">
                <p className="text-sm text-primary font-mono mb-2">✓ 메시지가 준비되었습니다</p>
                <p className="text-xs text-muted-foreground">백엔드 연동 후 실제 전송이 활성화됩니다.</p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: "", email: "", message: "" });
                  }}
                  className="mt-4 text-xs text-primary hover:underline font-mono"
                >
                  $ reset
                </button>
              </div>
            ) : (
              <form className="space-y-3" onSubmit={handleSubmit} noValidate>
                <div>
                  <label className="text-[10px] text-muted-foreground block mb-1">NAME=</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    maxLength={100}
                    className="w-full bg-muted border border-border rounded-sm px-3 py-1.5 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="your_name"
                  />
                  {errors.name && <p className="text-[10px] text-destructive mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground block mb-1">EMAIL=</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    maxLength={255}
                    className="w-full bg-muted border border-border rounded-sm px-3 py-1.5 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="you@example.com"
                  />
                  {errors.email && <p className="text-[10px] text-destructive mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground block mb-1">MESSAGE=</label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    maxLength={2000}
                    className="w-full bg-muted border border-border rounded-sm px-3 py-1.5 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                    placeholder="echo 'your message here'"
                  />
                  {errors.message && <p className="text-[10px] text-destructive mt-1">{errors.message}</p>}
                  <p className="text-[10px] text-muted-foreground mt-1 text-right">{form.message.length}/2000</p>
                </div>
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground px-4 py-1.5 rounded-sm text-xs font-mono font-bold hover:opacity-90 transition-opacity"
                >
                  $ send --now
                </button>
              </form>
            )}
          </div>
        </WindowCard>
      </div>
    </Layout>
  );
};

export default Contact;
