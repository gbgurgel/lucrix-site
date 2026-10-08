import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Box,
  Check,
  ChevronDown,
  CircleDollarSign,
  Compass,
  Gauge,
  Lightbulb,
  MonitorPlay,
  PackageCheck,
  RotateCcw,
  Sparkles,
  TrendingUp,
  WalletCards,
  X,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Starfield from "@/components/Starfield";
import {
  Answers,
  changeOfferKind,
  INITIAL_ANSWERS,
  isQuestionValid,
  OFFER_OPTIONS,
  OfferKind,
  QuestionDefinition,
  getQuestionCount,
  getQuestions,
} from "@/lib/questionnaire";
import {
  calculateProfitability,
  calculateScenarios,
  inputsFromAnswers,
  ProfitabilityResult,
  SimulationInputs,
} from "@/lib/profitability";

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 2,
});
const compactBrl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  notation: "compact",
  maximumFractionDigits: 1,
});
const integer = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
const percent = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });

const smooth = { type: "spring" as const, stiffness: 390, damping: 34, mass: 0.7 };

function scrollToPageTop() {
  window.scrollTo({
    top: 0,
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
  });
}

function Wordmark({ small = false }: { small?: boolean }) {
  return (
    <a className={`wordmark${small ? " wordmark--small" : ""}`} href="#inicio" aria-label="Lucrix, início">
      <span className="brand-mark" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span>Lucrix<span className="wordmark-dot">.</span></span>
    </a>
  );
}

function BrandButton({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled = false,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "quiet" | "outline";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  return (
    <motion.button
      type={type}
      className={`button button--${variant} ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { y: -2, scale: 1.015 }}
      whileTap={disabled ? undefined : { y: 0, scale: 0.985 }}
      transition={smooth}
    >
      {children}
    </motion.button>
  );
}

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduceMotion ? 0 : 18, filter: reduceMotion ? "none" : "blur(5px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: reduceMotion ? 0.12 : 0.58, delay: reduceMotion ? 0 : delay, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function HeroPreview() {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className="hero-visual"
      initial={{ opacity: 0, scale: 0.92, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.12, ease: [0.2, 0.7, 0.2, 1] }}
      aria-label="Prévia de um resultado do simulador"
    >
      <div className="orbit orbit--one" />
      <div className="orbit orbit--two" />
      <div className="visual-glow" />
      <div className="floating-chip chip-top"><span className="chip-icon chip-icon--violet"><TrendingUp size={15} /></span><span><small>Margem estimada</small><b>32,4%</b></span><span className="chip-trend">+4,2%</span></div>
      <div className="preview-window glass-panel">
        <div className="preview-window-head"><span className="window-dots"><i /><i /><i /></span><span>LEITURA DA OFERTA</span><span className="live-pulse"><i /> AO VIVO</span></div>
        <div className="preview-amount"><span>Resultado mensal estimado</span><strong>R$ 8.460<span>,00</span></strong></div>
        <div className="mini-chart" aria-hidden="true">
          {[36, 48, 40, 60, 52, 73, 62, 87, 72, 96, 83, 100].map((height, index) => (
            <motion.span key={index} initial={{ height: 0 }} animate={{ height: `${height}%` }} transition={{ duration: 0.7, delay: 0.3 + index * 0.045, ease: "easeOut" }} />
          ))}
        </div>
        <div className="preview-window-foot"><span><i className="legend-dot legend-dot--violet" /> Receita líquida</span><span>últimos 12 meses <ChevronDown size={12} /></span></div>
      </div>
      <motion.div className="floating-chip chip-bottom" animate={reduceMotion ? undefined : { y: [0, -6, 0] }} transition={reduceMotion ? { duration: 0.01 } : { duration: 5.5, repeat: Infinity, ease: "easeInOut" }}><span className="chip-icon chip-icon--green"><Check size={14} /></span><span><small>Ponto de equilíbrio</small><b>84 vendas / mês</b></span></motion.div>
      <div className="visual-caption"><span className="caption-star">✦</span> cada premissa à vista, cada decisão mais clara</div>
    </motion.div>
  );
}

function Landing({ onStart }: { onStart: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const start = () => {
    setMenuOpen(false);
    onStart();
  };
  const coverage = [
    { icon: Box, name: "Produto físico", tint: "violet", text: "Custo, embalagem, frete, comissões, pagamentos, impostos, CAC, devoluções e custos fixos." },
    { icon: MonitorPlay, name: "Produto digital", tint: "blue", text: "Taxas, reembolsos ou garantia, CAC e outros custos aplicáveis — sem frete nem embalagem." },
    { icon: Sparkles, name: "Serviço", tint: "pink", text: "Custo de entrega por serviço. Sem presumir horas, agenda ou capacidade de atendimento." },
  ];
  const steps = [
    { n: "01", icon: Compass, title: "Você responde", text: "Preço, custos, taxas, impostos, aquisição de clientes e volume esperado." },
    { n: "02", icon: Gauge, title: "A gente calcula", text: "Margem de contribuição, ponto de equilíbrio e resultado mensal estimado." },
    { n: "03", icon: TrendingUp, title: "Você testa cenários", text: "Compare hipóteses pessimistas, base e otimistas no simulador ao vivo." },
    { n: "04", icon: Lightbulb, title: "Decida com clareza", text: "Veja as premissas e limitações. Sem promessas ou números escondidos." },
  ];

  return (
    <div className="site-content">
      <header className="site-header">
        <div className="header-inner">
          <Wordmark />
          <button className="mobile-menu-button" aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X size={20} /> : <span className="menu-lines"><i /><i /></span>}
          </button>
          <nav className={menuOpen ? "nav nav--open" : "nav"} aria-label="Navegação principal">
            <a href="#inicio" onClick={() => setMenuOpen(false)}>Início</a>
            <a href="#como-funciona" onClick={() => setMenuOpen(false)}>Como funciona</a>
            <a href="#cobertura" onClick={() => setMenuOpen(false)}>O que analisamos</a>
            <BrandButton onClick={start} variant="outline" className="nav-cta">Analisar oferta <ArrowUpRight size={15} /></BrandButton>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero-section" id="inicio">
          <div className="hero-grid">
            <div className="hero-copy">
              <motion.div className="eyebrow" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55 }}><span className="eyebrow-spark">✦</span> UMA ESTIMATIVA, FEITA COM SEUS NÚMEROS</motion.div>
              <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.06 }}>Sua oferta fecha a conta <span>antes</span> de virar investimento?</motion.h1>
              <motion.p className="hero-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.62, delay: 0.14 }}>Informe preço, custos e volume esperado. Descubra sua margem de contribuição, ponto de equilíbrio e cenários — com cada premissa à vista.</motion.p>
              <motion.div className="hero-actions" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.2 }}>
                <BrandButton onClick={start}>Estimar minha oferta <ArrowRight size={17} /></BrandButton>
                <a className="text-link" href="#como-funciona">Entenda em 1 minuto <ArrowDown size={14} /></a>
              </motion.div>
              <motion.div className="hero-proof" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45, duration: 0.65 }}>
                <span className="proof-icon"><BadgeCheck size={15} /></span>
                <span>Até 15 perguntas <i /> Sem planilha gigante <i /> Sem promessas</span>
              </motion.div>
            </div>
            <HeroPreview />
          </div>
          <div className="hero-bottomline"><span>ESTIMATIVA BASEADA NOS SEUS NÚMEROS</span><span className="bottomline-track"><i /></span><span>01 — 03</span></div>
        </section>

        <section className="signal-strip" aria-label="O que você recebe">
          <div className="signal-item"><span className="signal-icon"><CircleDollarSign size={18} /></span><div><b>Margem de contribuição</b><small>por venda, com cada custo considerado</small></div></div>
          <span className="signal-divider" />
          <div className="signal-item"><span className="signal-icon"><Gauge size={18} /></span><div><b>Ponto de equilíbrio</b><small>quantas vendas para cobrir os fixos</small></div></div>
          <span className="signal-divider" />
          <div className="signal-item"><span className="signal-icon"><TrendingUp size={18} /></span><div><b>3 cenários visíveis</b><small>pessimista, base e otimista</small></div></div>
        </section>

        <section className="coverage-section section-wrap" id="cobertura">
          <Reveal className="section-heading"><span className="section-kicker">FEITO PARA A SUA OFERTA</span><h2>O que entra na conta<span className="heading-dot">.</span></h2><p>As perguntas mudam conforme o que você vende. A cobertura e as premissas ficam claras desde o início.</p></Reveal>
          <div className="coverage-grid">
            {coverage.map(({ icon: Icon, name, tint, text }, index) => (
              <Reveal key={name} delay={index * 0.09} className={`coverage-card coverage-card--${tint}`}>
                <div className="coverage-card-top"><span className="coverage-icon"><Icon size={19} /></span><span className="coverage-index">0{index + 1}</span></div>
                <h3>{name}</h3><p>{text}</p><span className="card-arrow" aria-hidden="true"><ArrowUpRight size={15} /></span>
              </Reveal>
            ))}
          </div>
          <Reveal className="scope-note"><span className="scope-note-icon"><Lightbulb size={16} /></span><p><b>Uma estimativa simples e honesta.</b> Não modelamos assinaturas, capacidade de atendimento, vários produtos juntos, estoque, capital de giro, sazonalidade, recompra ou regime tributário.</p></Reveal>
        </section>

        <section className="how-section" id="como-funciona">
          <div className="section-wrap how-inner">
            <Reveal className="how-intro"><span className="section-kicker">CLAREZA EM CADA ETAPA</span><h2>Dos seus números<br />a uma decisão melhor<span className="heading-dot">.</span></h2><p>Sem planilha gigante. Só as perguntas que ajudam você a entender o que precisa acontecer para a conta fechar.</p><BrandButton onClick={start} variant="outline">Começar análise <ArrowRight size={16} /></BrandButton></Reveal>
            <div className="steps-list">
              {steps.map(({ n, icon: Icon, title, text }, index) => (
                <Reveal key={n} delay={index * 0.06} className="step-row">
                  <span className="step-number">{n}</span><span className="step-icon"><Icon size={18} /></span><div className="step-copy"><h3>{title}</h3><p>{text}</p></div><span className="step-check"><Check size={14} /></span>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="truth-section section-wrap">
          <Reveal className="truth-card">
            <div className="truth-orb truth-orb--one" /><div className="truth-orb truth-orb--two" />
            <div className="truth-icon"><Lightbulb size={20} /></div>
            <div className="truth-copy"><span className="section-kicker">PREMISSAS VISÍVEIS. EXPECTATIVAS REAIS.</span><h2>Estimativa não é previsão.</h2><p>O Lucrix usa os números que você informa para ajudar a explorar cenários. O resultado não inclui capital de giro nem sazonalidade e não substitui a orientação de um contador.</p></div>
            <BrandButton onClick={start} variant="quiet">Ver meus números <ArrowRight size={16} /></BrandButton>
          </Reveal>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-inner"><Wordmark small /><span>Lucrix · protótipo de validação · estimativas, não aconselhamento financeiro.</span><a href="#inicio">Voltar ao início <ArrowUpRight size={13} /></a></div>
      </footer>
    </div>
  );
}

function OfferTypeSelection({ value, onChange }: { value: OfferKind | ""; onChange: (value: OfferKind) => void }) {
  const icons = { physical: PackageCheck, digital: MonitorPlay, service: Sparkles };
  return (
    <div className="offer-options" role="group" aria-label="Tipo da oferta">
      {OFFER_OPTIONS.map((option, index) => {
        const Icon = icons[option.value];
        const selected = value === option.value;
        return (
          <motion.button
            type="button"
            aria-pressed={selected}
            className={`offer-option${selected ? " offer-option--selected" : ""}`}
            key={option.value}
            onClick={() => onChange(option.value)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.055 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.985 }}
          >
            <span className="offer-option-icon"><Icon size={19} /></span>
            <span className="offer-option-copy"><b>{option.label}</b><small>{option.detail}</small></span>
            <span className="radio-indicator">{selected && <i />}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

function QuestionField({
  question,
  value,
  onChange,
  onSubmit,
  offerKind,
}: {
  question: QuestionDefinition;
  value: string | number;
  onChange: (value: string | number) => void;
  onSubmit: () => void;
  offerKind: OfferKind | "";
}) {
  if (question.kind === "choice") return <OfferTypeSelection value={offerKind} onChange={(next) => onChange(next)} />;

  const isCurrency = question.kind === "currency";
  const isPercent = question.kind === "percent";
  const inputMode = isCurrency || isPercent || question.kind === "quantity" ? "decimal" : "text";
  const placeholder = question.placeholder ?? "";
  const maybeDescription = question.required ? null : <small className="field-optional">Opcional · deixe em branco se não se aplica</small>;

  return (
    <div className="question-field-wrap">
      <label className={`question-input-shell${isCurrency ? " question-input-shell--currency" : ""}`} htmlFor={`answer-${question.id}`}>
        {isCurrency && <span className="input-affix input-affix--prefix">R$</span>}
        <input
          id={`answer-${question.id}`}
          type={question.kind === "text" ? "text" : "number"}
          inputMode={inputMode}
          aria-label={question.title}
          min={question.min}
          max={question.max}
          step={isPercent || question.kind === "quantity" ? "1" : "0.01"}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(question.kind === "text" ? event.target.value : event.target.value === "" ? "" : Number(event.target.value))}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onSubmit();
            }
          }}
          autoComplete="off"
          autoFocus
          aria-describedby={`hint-${question.id}`}
        />
        {isPercent && <span className="input-affix input-affix--suffix">%</span>}
        {question.kind === "quantity" && <span className="input-affix input-affix--suffix">vendas / mês</span>}
      </label>
      <div className="field-bottomline" id={`hint-${question.id}`}>
        <span>{maybeDescription ?? (isPercent ? "Informe um percentual entre 0 e 100." : isCurrency ? "Valores em reais (BRL)." : "")}</span>
        <span className="field-hint-icon"><Check size={12} /></span>
      </div>
    </div>
  );
}

function Wizard({
  answers,
  questionIndex,
  onChange,
  onNext,
  onBack,
}: {
  answers: Answers;
  questionIndex: number;
  onChange: (key: keyof Answers, value: string | number) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const questions = getQuestions(answers.kind);
  const total = getQuestionCount(answers.kind || "physical");
  const question = questions[questionIndex];
  const valid = question ? isQuestionValid(question, answers) : false;
  const currentValue = answers[question.id] ?? "";
  const progress = ((questionIndex + 1) / total) * 100;
  const reduceMotion = useReducedMotion();
  if (!question) return null;

  return (
    <main className="wizard-page">
      <motion.div className="wizard-shell" initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0.16 : 0.55, ease: [0.2, 0.7, 0.2, 1] }}>
        <div className="wizard-topline"><Wordmark small /><button className="exit-link" type="button" onClick={onBack}>Sair da análise <X size={14} /></button></div>
        <div className="progress-area" role="group" aria-label="Progresso da análise">
          <div className="progress-meta"><span>Pergunta {questionIndex + 1} de {total}</span><span>{Math.round(progress)}%</span></div>
          <div className="progress-track" role="progressbar" aria-label="Progresso do questionário" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)} aria-valuetext={`Pergunta ${questionIndex + 1} de ${total}`}><motion.div className="progress-fill" initial={false} animate={{ width: `${progress}%` }} transition={{ duration: reduceMotion ? 0.08 : 0.6, ease: [0.22, 0.61, 0.36, 1] }}><i /></motion.div></div>
        </div>
        <div className="question-panel">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              className="question-content"
              key={question.id}
              initial={{ opacity: 0, x: reduceMotion ? 0 : 22, filter: reduceMotion ? "none" : "blur(5px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: reduceMotion ? 0 : -18, filter: reduceMotion ? "none" : "blur(4px)" }}
              transition={{ duration: reduceMotion ? 0.1 : 0.34, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <div className="question-index"><span className="tiny-star">✦</span> SUA ESTIMATIVA, PASSO A PASSO</div>
              <h1 aria-live="polite" aria-atomic="true">{question.title}</h1>
              <p className="question-description">{question.description}</p>
              <QuestionField
                question={question}
                value={currentValue}
                onChange={(value) => onChange(question.id, value)}
                onSubmit={onNext}
                offerKind={answers.kind}
              />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="wizard-actions">
          <BrandButton variant="outline" onClick={onBack}><ArrowLeft size={15} /> Voltar</BrandButton>
          <span className="private-note"><span><Check size={11} /></span> suas respostas permanecem nesta sessão</span>
          <BrandButton onClick={onNext} disabled={!valid}>Continuar <ArrowRight size={15} /></BrandButton>
        </div>
        <div className="wizard-footnote"><span>LUCRIX · ESTIMATIVA, NÃO PREVISÃO</span><span><i /> SEM PROMESSAS, SÓ PREMISSAS CLARAS</span></div>
      </motion.div>
      <div className="wizard-vignette" aria-hidden="true" />
    </main>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
  accent,
  delay = 0,
}: {
  icon: typeof CircleDollarSign;
  label: string;
  value: string;
  detail: string;
  accent: string;
  delay?: number;
}) {
  return (
    <motion.article className={`metric-card metric-card--${accent}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42, delay }}>
      <div className="metric-top"><span className="metric-icon"><Icon size={17} /></span><span className="metric-label">{label}</span></div>
      <strong className="metric-value">{value}</strong>
      <span className="metric-detail">{detail}</span>
    </motion.article>
  );
}

function RangeControl({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
  id,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (value: number) => string;
  onChange: (value: number) => void;
  id: string;
}) {
  return (
    <label className="range-control" htmlFor={id}>
      <span className="range-label"><span>{label}</span><b>{format(value)}</b></span>
      <input id={id} type="range" min={min} max={Math.max(max, min + step)} step={step} value={Math.min(value, Math.max(max, min + step))} onChange={(event) => onChange(Number(event.target.value))} />
      <span className="range-ends"><span>{format(min)}</span><span>{format(max)}</span></span>
    </label>
  );
}

function ResultScreen({
  answers,
  onEdit,
  onRestart,
}: {
  answers: Answers;
  onEdit: () => void;
  onRestart: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const resultTitleRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    resultTitleRef.current?.focus({ preventScroll: true });
  }, []);
  const original = useMemo(() => inputsFromAnswers(answers), [answers]);
  const [simulation, setSimulation] = useState<SimulationInputs | null>(null);
  useEffect(() => setSimulation(original), [original]);
  const activeInputs = simulation ?? original;
  const result = useMemo(() => calculateProfitability(activeInputs), [activeInputs]);
  const scenarios = useMemo(() => calculateScenarios(original), [original]);
  const maxScenario = Math.max(1, ...scenarios.map((scenario) => Math.max(0, scenario.result.monthlyResult)));
  const offerTypeLabel = OFFER_OPTIONS.find((option) => option.value === answers.kind)?.label ?? "Oferta";
  const update = (key: keyof SimulationInputs, value: number) => setSimulation((current) => ({ ...(current ?? original), [key]: value }));
  const controls = [
    { key: "price" as const, label: "Preço por venda", value: activeInputs.price, max: Math.max(original.price * 1.5, 50), step: 1, format: brl.format },
    { key: "monthlyVolume" as const, label: "Vendas por mês", value: activeInputs.monthlyVolume, max: Math.max(original.monthlyVolume * 2, 100), step: 1, format: (value: number) => `${integer.format(value)} vendas` },
    { key: "cac" as const, label: "CAC por venda", value: activeInputs.cac, max: Math.max(original.cac * 2, original.price * 0.5, 50), step: 1, format: brl.format },
    { key: "unitCost" as const, label: answers.kind === "physical" ? "Custo do produto / unidade" : answers.kind === "service" ? "Custo de entrega / serviço" : "Custo direto por venda", value: activeInputs.unitCost, max: Math.max(original.unitCost * 2, original.price * 0.85, 50), step: 1, format: brl.format },
    { key: "fixedCosts" as const, label: "Custos fixos mensais", value: activeInputs.fixedCosts, max: Math.max(original.fixedCosts * 2, original.price * Math.max(original.monthlyVolume, 1), 1000), step: 10, format: compactBrl.format },
  ];
  const premiseItems = [
    { label: "Preço", value: brl.format(original.price) },
    { label: "Vendas / mês", value: integer.format(original.monthlyVolume) },
    {
      label: answers.kind === "physical" ? "Custo do produto" : answers.kind === "service" ? "Custo por serviço" : "Custo direto",
      value: brl.format(original.unitCost),
    },
  ];
  if (answers.kind === "physical") {
    premiseItems.push(
      { label: "Embalagem", value: brl.format(original.packagingCost) },
      { label: "Frete", value: brl.format(original.freightCost) },
    );
  }
  premiseItems.push(
    { label: "Comissão", value: `${percent.format(original.commissionRate)}%` },
    { label: "Taxa de pagamento", value: `${percent.format(original.paymentRate)}%` },
    { label: "Tarifa fixa", value: brl.format(original.paymentFixed) },
    { label: "Impostos", value: `${percent.format(original.taxRate)}%` },
    { label: "CAC", value: brl.format(original.cac) },
  );
  if (answers.kind === "physical" || answers.kind === "digital") {
    premiseItems.push({ label: answers.kind === "physical" ? "Devoluções" : "Reembolsos", value: `${percent.format(original.returnRate)}%` });
  }
  premiseItems.push(
    { label: "Custos fixos / mês", value: brl.format(original.fixedCosts) },
    { label: "Investimento inicial", value: brl.format(original.initialInvestment) },
  );

  return (
    <main className="results-page">
      <motion.div className="results-shell" initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <header className="results-header"><Wordmark small /><div className="results-header-right"><span className="analysis-badge"><span /> análise pronta</span><button className="exit-link" onClick={onRestart}>Nova análise <RotateCcw size={14} /></button></div></header>

        <section className="results-title-row">
          <div><span className="section-kicker">SUA LEITURA INICIAL · {offerTypeLabel.toUpperCase()}</span><h1 ref={resultTitleRef} tabIndex={-1}>Os números da sua oferta<span className="heading-dot">.</span></h1><p>{answers.name ? <><b>{answers.name}</b> · </> : null}estimativa baseada nas premissas que você informou.</p></div>
          <BrandButton variant="outline" onClick={onEdit}><ArrowLeft size={15} /> Editar respostas</BrandButton>
        </section>

        <section className="metrics-grid" aria-label="Métricas principais">
          <MetricCard icon={CircleDollarSign} label="Margem por venda" value={brl.format(result.contributionPerSale)} detail={`${percent.format(result.contributionRate)}% de contribuição`} accent="violet" delay={0.05} />
          <MetricCard icon={Gauge} label="Ponto de equilíbrio" value={result.breakEvenUnits === null ? "Não atingido" : `${integer.format(result.breakEvenUnits)} vendas`} detail={result.breakEvenRevenue === null ? "A margem por venda não cobre os custos" : `ou ${brl.format(result.breakEvenRevenue)} em receita`} accent="blue" delay={0.12} />
          <MetricCard icon={TrendingUp} label="Resultado mensal" value={brl.format(result.monthlyResult)} detail="depois dos custos variáveis e fixos" accent={result.monthlyResult >= 0 ? "green" : "amber"} delay={0.19} />
          <MetricCard icon={WalletCards} label="Retorno simples" value={result.estimatedReturnMonths === null ? "—" : `${percent.format(result.estimatedReturnMonths)} meses`} detail={result.estimatedReturnMonths === null ? "Informe investimento e resultado mensal positivo" : "investimento inicial ÷ resultado mensal"} accent="pink" delay={0.26} />
        </section>

        <section className="results-grid">
          <article className="panel scenario-panel">
            <div className="panel-heading"><div><span className="section-kicker">TRÊS POSSIBILIDADES</span><h2>Cenários lado a lado</h2></div><span className="scenario-caption"><span /> hipóteses visíveis</span></div>
            <div className="scenario-list">
              {scenarios.map((scenario, index) => {
                const width = Math.max(3, (Math.max(0, scenario.result.monthlyResult) / maxScenario) * 100);
                return (
                  <motion.div className={`scenario-row scenario-row--${scenario.id}`} key={scenario.id} initial={{ opacity: 0, x: reduceMotion ? 0 : -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.18 + index * 0.08, duration: 0.32 }}>
                    <div className="scenario-row-head"><span className="scenario-name"><i />{scenario.name}</span><b>{brl.format(scenario.result.monthlyResult)}</b></div>
                    <div className="scenario-bar"><motion.i initial={{ width: 0 }} animate={{ width: `${width}%` }} transition={{ duration: reduceMotion ? 0.1 : 0.65, delay: 0.28 + index * 0.09, ease: [0.22, 0.61, 0.36, 1] }} /></div>
                    <span className="scenario-assumption">{scenario.assumption}</span>
                  </motion.div>
                );
              })}
            </div>
            <div className="scenario-footnote"><Lightbulb size={14} /> São variações para comparação, não previsões de mercado.</div>
          </article>

          <article className="panel simulator-panel">
            <div className="panel-heading"><div><span className="section-kicker">MEXA NAS PREMISSAS</span><h2>Simulador ao vivo</h2></div><span className="simulator-live"><i /> recalculando</span></div>
            <div className="simulator-result" aria-live="polite"><span>Resultado mensal estimado</span><motion.strong key={Math.round(result.monthlyResult * 100) / 100} initial={{ opacity: 0.45, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>{brl.format(result.monthlyResult)}</motion.strong></div>
            <div className="range-list">
              {controls.map((control) => (
                <RangeControl key={control.key} id={`sim-${control.key}`} label={control.label} value={control.value} min={0} max={control.max} step={control.step} format={control.format} onChange={(value) => update(control.key, value)} />
              ))}
            </div>
            <button className="reset-simulator" onClick={() => setSimulation(original)}><RotateCcw size={13} /> Restaurar premissas originais</button>
          </article>
        </section>

        <section className="results-grid results-grid--bottom">
          <article className="panel formula-panel">
            <div className="panel-heading"><div><span className="section-kicker">CONTA ABERTA</span><h2>Como chegamos aqui</h2></div><span className="formula-symbol">ƒx</span></div>
            <div className="formula-steps">
              <div><span>01</span><p><b>Margem de contribuição</b><small>{answers.kind === "physical" ? "Preço − custo do produto, embalagem, frete, taxas, CAC e devoluções estimadas." : answers.kind === "digital" ? "Preço − custos diretos, taxas, CAC e reembolsos estimados." : "Preço − custo de entrega, taxas, CAC e outros custos variáveis aplicáveis."}</small></p></div>
              <div><span>02</span><p><b>Ponto de equilíbrio</b><small>Custos fixos ÷ margem por venda; arredondado para cima.</small></p></div>
              <div><span>03</span><p><b>Resultado mensal</b><small>Margem por venda × vendas esperadas − custos fixos mensais.</small></p></div>
            </div>
          </article>
          <article className="panel assumptions-panel">
            <div className="panel-heading"><div><span className="section-kicker">O QUE FOI INFORMADO</span><h2>Premissas da análise</h2></div><span className="assumptions-icon"><Check size={15} /></span></div>
            <div className="assumption-chips">
              {premiseItems.map(({ label, value }) => <span key={label}><i /> {label} · {value}</span>)}
            </div>
            <p className="assumption-note">Os campos em branco foram tratados como zero. Ajustes no simulador não alteram suas respostas originais.</p>
          </article>
        </section>

        <section className="result-warning"><span><Lightbulb size={16} /></span><p><b>Importante:</b> esta é uma estimativa construída a partir dos dados e das hipóteses que você forneceu. Não modela assinaturas recorrentes, capacidade de atendimento, múltiplos produtos, estoque, capital de giro, sazonalidade, recompra ou regime tributário. O investimento inicial entra apenas no retorno simples. Não substitui a orientação de um contador.</p></section>
        <footer className="results-footer"><Wordmark small /><span>LUCRIX · ESTIMATIVAS, NÃO ACONSELHAMENTO FINANCEIRO</span><button onClick={onRestart}>Começar de novo <RotateCcw size={13} /></button></footer>
      </motion.div>
    </main>
  );
}

export default function Home() {
  const [phase, setPhase] = useState<"landing" | "wizard" | "results">("landing");
  const [answers, setAnswers] = useState<Answers>(INITIAL_ANSWERS);
  const [questionIndex, setQuestionIndex] = useState(0);
  const questions = getQuestions(answers.kind);

  const updateAnswer = (key: keyof Answers, value: string | number) => {
    if (key === "kind" && typeof value === "string") {
      setAnswers((current) => changeOfferKind(current, value as OfferKind));
      return;
    }
    setAnswers((current) => ({ ...current, [key]: value }));
  };
  const begin = () => {
    setQuestionIndex(0);
    setPhase("wizard");
    scrollToPageTop();
  };
  const next = () => {
    const current = questions[questionIndex];
    if (!current || !isQuestionValid(current, answers)) return;
    if (questionIndex + 1 >= questions.length) {
      setPhase("results");
      scrollToPageTop();
      return;
    }
    setQuestionIndex((index) => index + 1);
  };
  const back = () => {
    if (questionIndex > 0) setQuestionIndex((index) => index - 1);
    else setPhase("landing");
  };
  const edit = () => {
    setQuestionIndex(Math.max(0, questions.length - 1));
    setPhase("wizard");
    scrollToPageTop();
  };
  const restart = () => {
    setAnswers(INITIAL_ANSWERS);
    setQuestionIndex(0);
    setPhase("landing");
    scrollToPageTop();
  };

  return (
    <div className={`app-shell app-shell--${phase}`}>
      <Starfield />
      <div className="ambient-glow ambient-glow--a" aria-hidden="true" />
      <div className="ambient-glow ambient-glow--b" aria-hidden="true" />
      <AnimatePresence mode="wait" initial={false}>
        {phase === "landing" ? (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.27 }}>
            <Landing onStart={begin} />
          </motion.div>
        ) : phase === "wizard" ? (
          <motion.div key="wizard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <Wizard answers={answers} questionIndex={questionIndex} onChange={updateAnswer} onNext={next} onBack={back} />
          </motion.div>
        ) : (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.26 }}>
            <ResultScreen answers={answers} onEdit={edit} onRestart={restart} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
