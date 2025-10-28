import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import backIcon from "@/assets/icons/icon-navbar.svg";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  Button,
  Switch,
  Segmented,
  DatePicker,
  Modal,
  List,
  Typography,
  Space,
  Divider,
  Skeleton,
  Drawer,
  message,
} from "antd";
import dayjs from "dayjs";

import type { CurrentPlan } from "@/requests/billing";

import { useAuth } from "@/hooks/useAuth";
import {
  getBillingPlans as getPlans,
  getBillingAnalytics as getAnalytics,
  getAutopay,
  setAutopay,
  makeInvoice,
  getCurrentUserBillingPlan,
} from "@/requests/billing";
import type {
  AnalyticsTransactionType as TxnType,
  AnalyticsEntry,
  AnalyticsPayment,
  AnalyticsInvoice,
  BillingPlan,
} from "@/types/billing";

import "dayjs/locale/ru";
dayjs.locale("ru");


const { Text, Title } = Typography;

{/* Plan picker modal */ }
const PLAN_COLORS = [

  // Steel silver
  { accent: "#A8A9AD", light: "rgba(168,169,173,0.12)", light2: "rgba(168,169,173,0.05)" },

  // Sapphire (deep vivid blue)
  { accent: "#0F52BA", light: "rgba(15, 82, 186, 0.12)", light2: "rgba(15, 82, 186, 0.05)" },

  // Gold
  { accent: "#DAA520", light: "rgba(218, 165, 32, 0.14)", light2: "rgba(218, 165, 32, 0.06)" },

  // Royal Purple
  { accent: "#7851A9", light: "rgba(120, 81, 169, 0.12)", light2: "rgba(120, 81, 169, 0.05)" },

  // Teal
  { accent: "#14B8A6", light: "rgba(20, 184, 166, 0.12)", light2: "rgba(20, 184, 166, 0.05)" },

  // Charcoal (dark gray)
  { accent: "#36454F", light: "rgba(54, 69, 79, 0.12)", light2: "rgba(54, 69, 79, 0.05)" },

  // Platinum (soft silver)
  { accent: "#E5E4E2", light: "rgba(229, 228, 226, 0.18)", light2: "rgba(229, 228, 226, 0.08)" },

  // Blue
  { accent: "#2563EB", light: "rgba(37, 99, 235, 0.12)", light2: "rgba(37, 99, 235, 0.05)" },

  // Warm Orange
  { accent: "#FF8C00", light: "rgba(255, 140, 0, 0.12)", light2: "rgba(255, 140, 0, 0.05)" },

  // Deep Violet
  { accent: "#5B2C6F", light: "rgba(91, 44, 111, 0.12)", light2: "rgba(91, 44, 111, 0.05)" },
];

export default function BillingPage() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const { accessToken } = useAuth();
  const [monitorOpen, setMonitorOpen] = useState(false);

  const refreshCurrent = async () => {
    await Promise.all([
      qc.invalidateQueries({ queryKey: ["current-plan"], exact: false }),
    ]);
  };


  const refreshAnalytics = async () => {
    await qc.invalidateQueries({ queryKey: ["analytics"], exact: false });
  };



  //   const refreshBilling = async () => {
  //   await Promise.all([
  //     qc.invalidateQueries({ queryKey: ["current-plan"], exact: false }),
  //     qc.invalidateQueries({ queryKey: ["plans"], exact: false }),
  //     qc.invalidateQueries({ queryKey: ["analytics"], exact: false }),
  //     qc.invalidateQueries({ queryKey: ["autopay"], exact: false }),
  //   ]);
  //   // optional: force immediate network fetch for visible queries
  //   await Promise.all([
  //     qc.refetchQueries({ queryKey: ["current-plan"], type: "active" }),
  //     qc.refetchQueries({ queryKey: ["plans"], type: "active" }),
  //     qc.refetchQueries({ queryKey: ["analytics"], type: "active" }),
  //     qc.refetchQueries({ queryKey: ["autopay"], type: "active" }),
  //   ]);
  // };


  // show only time in preview rows
  const fmtTime = (iso: string) => dayjs(iso).format("HH:mm");

  // date header like "21 октября 2025 г."
  const fmtDateHeader = (iso: string) => dayjs(iso).format("D MMMM YYYY г.");




  // state
  const [pickerOpen, setPickerOpen] = useState(false);
  const [range, setRange] = useState<[string | undefined, string | undefined]>([
    undefined,
    undefined,
  ]);
  const [type, setType] = useState<TxnType | undefined>(undefined);
  const rangeKey = `${range[0] ?? ""}|${range[1] ?? ""}`;

  // PLANS
  const { data: plans = [], isLoading: loadingPlans } = useQuery<BillingPlan[]>({
    queryKey: ["plans", !!accessToken],
    queryFn: () => getPlans({ status: "active", token: accessToken ?? undefined }),
    enabled: !!accessToken,
    staleTime: 60_000,
    retry: false,
  });


  // AUTOPAY
  const { data: autopay = false, isLoading: loadingAutopay } = useQuery<boolean>({
    queryKey: ["autopay", !!accessToken],
    queryFn: () => getAutopay(accessToken ?? undefined),
    enabled: !!accessToken,
    retry: false,
  });

  // CURRENT PLAN
  const {
    data: plan,
    isLoading: loadingPlan,
  } = useQuery<CurrentPlan | null>({
    queryKey: ["current-plan", !!accessToken],
    queryFn: () => getCurrentUserBillingPlan(accessToken ?? undefined),
    enabled: !!accessToken,
    staleTime: 60_000,
    retry: false,
  });


  // ANALYTICS
  const { data: history = [], isLoading: loadingHistory } = useQuery<AnalyticsEntry[]>({
    queryKey: ["analytics", !!accessToken, type ?? "all", rangeKey],
    queryFn: () =>
      getAnalytics({
        transactionType: type,
        from: range[0],
        to: range[1],
        token: accessToken ?? undefined,
      }),
    enabled: !!accessToken,
    placeholderData: (prev) => prev,
    retry: false,
  });

  // group history by calendar day (keeps descending order)
  const groupedHistory = useMemo(() => {
    if (!history?.length) return [];
    const m = new Map<string, AnalyticsEntry[]>();
    for (const tx of history) {
      const key = dayjs(tx.createdAt).format("YYYY-MM-DD");
      if (!m.has(key)) m.set(key, []);
      m.get(key)!.push(tx);
    }
    return Array.from(m.entries()).sort((a, b) => (a[0] > b[0] ? -1 : 1));
  }, [history]);

  // MUTATIONS
  const invMut = useMutation({
    mutationFn: (planId: number) => makeInvoice(planId, accessToken ?? undefined),
    onSuccess: async () => {
      message.success("Счёт выписан");
    },
    onError: () => message.error("Не удалось выписать счёт"),
  });

  const autoMut = useMutation({
    mutationFn: (enabled: boolean) => setAutopay(enabled, accessToken ?? undefined),
    onSuccess: async () => {
      qc.invalidateQueries({ queryKey: ["autopay"] });
      message.success("Настройки автоплатежа обновлены");
    },
    onError: () => message.error("Не удалось изменить автоплатёж"),
  });


  // helpers
  const fmtDateTime = (iso: string) =>
    new Date(iso).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const nfmt = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 });
  const money = (v: number, ccy = "UZS") => `${nfmt.format(v)} ${ccy}`;

  return (
    <Card className="home-card w-full max-w-[520px] h-[100dvh] rounded-3xl shadow-2xl border-none overflow-hidden flex flex-col">
      {/* Header */}
      <div className="relative flex items-center justify-center pt-2 pb-2">
        <Button
          type="text"
          className="!absolute left-1"
          onClick={() => nav(-1)}
        >
          <img src={backIcon} alt="" className="w-25 h-25" />
        </Button>
        <Title level={4} className="m-0">
          Тариф
        </Title>
      </div>


      {/* Body */}
      <div className="flex-1 min-h-0 overflow-hidden px-4 pb-4 sm:px-5 sm:pb-5 space-y-4.5">
        {/* Current plan */}
        <section>
          <Text style={{ color: "#85889E" }} className="block mb-2 text-[17px] leading-[22px]">
            Текущий тариф
          </Text>

          <div className="rounded-2xl border border-gray-100 bg-white flex flex-col max-h-[55dvh] sm:max-h-[45dvh] min-h-0">
            <div className="p-2">
              {loadingPlan ? (
                <Skeleton active />
              ) : plan ? (
                <Space className="w-full" direction="vertical" size={2}>
                  <Space
                    align="baseline"
                    className="w-full"
                    style={{ justifyContent: "space-between" }}
                  >
                    <Text strong style={{ fontSize: 17 }}>
                      {plan.name}
                    </Text>
                    <Text style={{ color: "#85889E", fontSize: 17 }}>
                      {plan.pricePerMonth
                        ? `${plan.pricePerMonth} ${plan.currency ?? "UZS"} / мес`
                        : "Бесплатно"}
                    </Text>
                  </Space>

                  {plan.description && (
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      {plan.description}
                    </Text>
                  )}

                  {/* Autopay */}
                  <section>
                    <div className="rounded-2xl border border-gray-100 bg-white p-2 flex items-center justify-between">
                      <Text style={{ fontSize: 15, color: "#262633" }}>Автоплатёж</Text>
                      <Switch
                        checked={autopay}
                        loading={loadingAutopay || autoMut.isPending}
                        onChange={(v) => autoMut.mutate(v)}
                      />
                    </div>
                  </section>
                </Space>
              ) : (
                <Text type="secondary">Нет активного тарифа</Text>
              )}

            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button
              onClick={async () => {
                await qc.invalidateQueries({ queryKey: ["plans"] }); // 👈 one trigger only
                setPickerOpen(true);
              }}
              className="h-11 rounded-xl"
              disabled={!plans.length}
            >
              Все тарифы
            </Button>


            <Button
              type="primary"
              className="h-11 rounded-xl"
              disabled={!plan || loadingPlan || invMut.isPending}  
              loading={invMut.isPending}
              onClick={async () => {
                if (!plan) return;
                await invMut.mutateAsync(plan.id);   
                await refreshCurrent();
              }}
            >
              Возобновить тариф
            </Button>


          </div>
        </section>

        {/* Подписка: баланс и даты периода */}
        <section>
          <Text style={{ color: "#85889E" }} className="block mb-2 text-[17px] leading-[22px]">
            Подписка
          </Text>

          <div className="rounded-2xl border border-gray-100 bg-white p-2">
            <div className="grid grid-cols-[1fr_auto] gap-y-2">
              <Text type="secondary">Баланс</Text>
              <Text strong>{money(plan?.balance ?? 0, plan?.currency ?? "UZS")}</Text>

              <Text type="secondary">Дата начала подписки</Text>
              <Text strong>{plan?.startDate ? fmtDateTime(plan.startDate) : "возобновите тариф"}</Text>

              <Text type="secondary">Дата окончания подписки</Text>
              <Text strong>{plan?.endDate ? fmtDateTime(plan.endDate) : "возобновите тариф"}</Text>
            </div>
          </div>
        </section>


        {/* History & analytics */}
        <section className="flex-none">
          <Text style={{ color: "#85889E" }} className="block mb-2 text-[17px] leading-[22px]">
            История
          </Text>

          {/* Wrapper with max height; button stays visible */}
          <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden flex flex-col max-h-[42dvh]">
            {/* Filters (not scrollable) */}
            <div className="p-3 flex flex-col gap-2">
              <Segmented
                block
                options={[
                  { label: "Все", value: "all" },
                  { label: "Списания", value: "invoice" },
                  { label: "Поступления", value: "payment" },
                ]}
                value={type ?? "all"}
                onChange={(v) => setType(v === "all" ? undefined : (v as TxnType))}
              />
              <div className="flex gap-2">
                <DatePicker
                  className="flex-1"
                  placeholder="с"
                  value={range[0] ? dayjs(range[0]) : undefined}
                  onChange={(d) => setRange([d ? d.format("YYYY-MM-DD") : undefined, range[1]])}
                />
                <DatePicker
                  className="flex-1"
                  placeholder="по"
                  value={range[1] ? dayjs(range[1]) : undefined}
                  onChange={(d) => setRange([range[0], d ? d.format("YYYY-MM-DD") : undefined])}
                />
              </div>
            </div>

            {/* Scrollable list area */}
            {loadingHistory ? (
              <div className="p-4"><Skeleton active /></div>
            ) : history.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">Нет записей</div>
            ) : (


              <div
                className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 pb-4"
                style={{
                  WebkitOverflowScrolling: "touch",
                  scrollPaddingBottom: 24,
                  paddingBottom: "env(safe-area-inset-bottom, 16px)",
                }}
              >

                <List<AnalyticsEntry>
                  dataSource={history}
                  renderItem={(tx) => {
                    const isPayment = tx.type === "payment";
                    const payment = isPayment ? (tx as AnalyticsPayment) : undefined;
                    const invoice = !isPayment ? (tx as AnalyticsInvoice) : undefined;

                    const amount = tx.amount;
                    const currency = tx.currency ?? "UZS";
                    const balance = payment?.balance;

                    const isCancel = payment?.paymentType === "cancel";
                    const title = isPayment ? (isCancel ? "отмена пополнения" : "пополнение") : "списание";

                    const sign = isPayment ? (isCancel ? "−" : "+") : "−";
                    const amountColor = isPayment ? (isCancel ? "#d92d20" : "#2c7a7b") : "#85889E";
                    const dt = fmtTime(tx.createdAt); // 👈 show only HH:mm here

                    return (
                      <>
                        <List.Item
                          actions={[
                            <Text key="amt" strong style={{ color: amountColor }}>
                              {`${sign}${money(amount, currency)}`}
                            </Text>,
                          ]}
                        >
                          <List.Item.Meta
                            title={<Text style={{ color: "#262633" }}>{title}</Text>}
                            description={
                              <div style={{ fontSize: 13 }}>
                                <Text type="secondary">
                                  {dt}
                                  {isPayment && payment?.method ? ` • ${payment.method.toUpperCase()}` : ""}
                                  {" • "}
                                  {isPayment
                                    ? (payment?.status === "succeeded" ? "Успешно" : "  Успешно отменено")
                                    : (invoice?.status === "paid" ? "Оплачен" : "Оплачен")}
                                </Text>

                                {typeof balance === "number" && (
                                  <div style={{ marginTop: 4, color: "#6b7280" }}>
                                    Баланс на момент операции: <strong>{money(balance, currency)}</strong>
                                  </div>
                                )}
                              </div>
                            }
                          />
                        </List.Item>
                        <Divider style={{ margin: 0 }} />
                      </>
                    );
                  }}
                />
              </div>
            )}

            {/* Sticky footer with button */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur p-3 border-t border-transparent">
              <Button
                type="primary"
                block
                onClick={async () => {
                  await refreshAnalytics();
                  setMonitorOpen(true);
                }}
              >
                Полная история
              </Button>
            </div>


          </div>
        </section>
      </div >

      <Drawer
        placement="right"
        open={monitorOpen}
        onClose={() => setMonitorOpen(false)}
        width="100%"
        bodyStyle={{ padding: 0, background: "#f7f7fb" }}
        headerStyle={{ display: "none" }}
      >
        {/* Header with left back icon and centered title */}
        <div className="sticky top-0 z-40 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-transparent">
          <div className="relative flex items-center justify-center pt-4 pb-4 bg-white border-b border-transparent">
            <img
              src={backIcon}
              alt="Назад"
              className="absolute left-3 w-25 h-25 cursor-pointer border-transparent"
              onClick={() => setMonitorOpen(false)}
            />
            <Title level={4} className="m-0">История</Title>
          </div>

          <div className="p-3 flex flex-col gap-2 border-transparen">
            <Segmented
              block
              options={[
                { label: "Все", value: "all" },
                { label: "Списания", value: "invoice" },
                { label: "Поступления", value: "payment" },
              ]}
              value={type ?? "all"}
              onChange={(v) => setType(v === "all" ? undefined : (v as TxnType))}
            />
            <div className="flex gap-2">
              <DatePicker
                className="flex-1"
                placeholder="с"
                value={range[0] ? dayjs(range[0]) : undefined}
                onChange={(d) => setRange([d ? d.format("YYYY-MM-DD") : undefined, range[1]])}
              />
              <DatePicker
                className="flex-1"
                placeholder="по"
                value={range[1] ? dayjs(range[1]) : undefined}
                onChange={(d) => setRange([range[0], d ? d.format("YYYY-MM-DD") : undefined])}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="h-[calc(100dvh-64px)] overflow-y-auto px-3 pb-6">
          {groupedHistory.length === 0 ? (
            <div className="p-6 text-center text-gray-500 text-sm">Нет записей</div>
          ) : (

            groupedHistory.map(([ymd, items]) => (
              <div key={ymd} className="mb-3">
                {/* Date header */}
                <div className="sticky top-0 z-10">
                  <div className="bg-[#eef1f6] text-[#4b5563] text-base font-medium rounded-xl px-3 py-2">
                    {fmtDateHeader(items[0].createdAt)}
                  </div>
                </div>

                <List<AnalyticsEntry>
                  dataSource={items}
                  renderItem={(tx) => {
                    const isPayment = tx.type === "payment";
                    const payment = isPayment ? (tx as AnalyticsPayment) : undefined;
                    const invoice = !isPayment ? (tx as AnalyticsInvoice) : undefined;

                    const amount = tx.amount;
                    const currency = tx.currency ?? "UZS";
                    const balance = payment?.balance;

                    const isCancel = payment?.paymentType === "cancel";
                    const title = isPayment ? (isCancel ? "Перевод" : "Поступление") : "Списание";
                    const sign = isPayment ? (isCancel ? "−" : "+") : "−";
                    const amountColor = isPayment ? (isCancel ? "#d92d20" : "#2c7a7b") : "#85889E";
                    const t = fmtTime(tx.createdAt);

                    return (
                      <>
                        <List.Item
                          actions={[
                            <Text key="amt" strong style={{ color: amountColor, fontSize: 16 }}>
                              {`${sign}${nfmt.format(amount)} ${currency}`}
                            </Text>,
                          ]}
                        >
                          <List.Item.Meta
                            title={
                              <div className="flex items-center gap-2">
                                <Text style={{ color: "#262633", fontSize: 16 }}>{title}</Text>
                                {isPayment && (
                                  <span className="text-xs px-2 py-[2px] rounded-md bg-[#d1fae5] text-[#047857]">
                                    перевод
                                  </span>
                                )}
                              </div>
                            }
                            description={
                              <div style={{ fontSize: 14 }}>
                                <Text type="secondary">
                                  {t}{" • "}
                                  {isPayment
                                    ? (payment?.status === "succeeded" ? "Успешно" : "Успешно отменено")
                                    : (invoice?.status === "paid" ? "Оплачен" : "Оплачен")}
                                </Text>

                                {typeof balance === "number" && (
                                  <div style={{ marginTop: 4, color: "#6b7280" }}>
                                    Баланс: <strong>{nfmt.format(balance)} {currency}</strong>
                                  </div>
                                )}
                              </div>
                            }
                          />
                        </List.Item>
                        <Divider style={{ margin: 0 }} />
                      </>
                    );
                  }}
                />
              </div>
            ))
          )}
        </div>
      </Drawer>


      {/* Plan picker modal */}
      <Modal
        open={pickerOpen}
        onCancel={() => setPickerOpen(false)}
        footer={null}
        title="Тарифы"
        width={420}
        centered
        bodyStyle={{ padding: 16, maxHeight: "70dvh", overflow: "auto" }} // nice scroll if many plans
      >
        {loadingPlans ? (
          <Skeleton active />
        ) : (
          <List
            grid={{
              gutter: 16,          // adds margin between cards
              xs: 1, sm: 1, md: 1, // single column layout, responsive
            }}
            dataSource={plans}
            renderItem={(p: BillingPlan, idx: number) => {
              const isCurrent = plan?.id === p.id;
              // use a unique palette for every plan (stable across renders)
              const palette = PLAN_COLORS[idx % PLAN_COLORS.length];
              const accent = palette.accent;
              const gold = "#DAA520";
              return (
                <List.Item>
                  <div
                    className="relative flex flex-col rounded-2xl shadow-md p-5 pb-3 gap-3 transition-all duration-300"
                    style={{
                      border: `1px solid ${isCurrent ? "#16a34a" : gold}`,
                      minHeight: 270,
                      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                      background: `linear-gradient(135deg, ${palette.light}, ${palette.light2})`,
                      backdropFilter: "blur(3px)",
                    }}
                  >
                    {/* Ribbon only for current */}
                    {isCurrent && (
                      <div
                        style={{
                          position: "absolute",
                          top: -10,
                          left: 16,
                          background: "#16a34a",
                          color: "#fff",
                          borderRadius: 8,
                          padding: "2px 10px",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        Текущий
                      </div>
                    )}

                    {/* Header (your gold styling kept) */}
                    <div className="flex items-baseline justify-between mb-2">
                      <Text
                        strong
                        style={{
                          fontSize: 17,
                          background: "linear-gradient(90deg, #FFD700, #FFA500)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          fontWeight: 800,
                        }}
                      >
                        {p.name}
                      </Text>
                      <Text
                        strong
                        style={{
                          fontSize: 17,
                          color: "#DAA520",
                          fontWeight: 700,
                        }}
                      >
                        {p.pricePerMonth
                          ? `${p.pricePerMonth} ${p.currency ?? "UZS"} / мес`
                          : "Бесплатно"}
                      </Text>
                    </div>

                    {/* Description (unchanged) */}
                    <div style={{ flexGrow: 1 }}>
                      {p.description && (
                        <Text type="secondary" style={{ display: "block", marginBottom: 10 }}>
                          {p.description}
                        </Text>
                      )}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr auto",
                          rowGap: 8,
                          borderTop: "1px solid #f0f0f0",
                          paddingTop: 8,
                        }}
                      >
                        <Text type="secondary">Сотрудников в организации</Text>
                        <Text strong>{p.maxEmployeesInOrganizations ?? "—"}</Text>

                        <Text type="secondary">Количество организаций</Text>
                        <Text strong>{p.maxOrganizations ?? "—"}</Text>
                      </div>
                    </div>

                    {/* CTA — color matches the card's accent for non-current */}
                    <Button
                      type={isCurrent ? "default" : "primary"}
                      size="large"
                      block
                      style={
                        isCurrent
                          ? { marginTop: 10, background: "#fff", borderColor: "#16a34a", color: "#16a34a" }
                          : { marginTop: 10, background: accent, borderColor: accent }
                      }
                      loading={invMut.isPending}
                      onClick={async () => {
                        await invMut.mutateAsync(p.id);
                        await refreshCurrent();
                        setPickerOpen(false);
                      }
                      }
                    >
                      {isCurrent ? "Продлить тариф" : "Выбрать тариф"}
                    </Button>

                  </div>
                </List.Item>
              );
            }}
          />
        )}
      </Modal>
    </Card >
  );
}
