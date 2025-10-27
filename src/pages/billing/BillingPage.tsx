import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
  message,
} from "antd";
import dayjs from "dayjs";

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


const { Text, Title } = Typography;

export default function BillingPage() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const { accessToken } = useAuth();

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

  const currentPlan = useMemo(() => plans[0] ?? null, [plans]);

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
  } = useQuery<BillingPlan | null>({
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

  // MUTATIONS
  const invMut = useMutation({
    mutationFn: (planId: number) => makeInvoice(planId, accessToken ?? undefined),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["analytics"] });
      message.success("Счёт выписан");
    },
    onError: () => message.error("Не удалось выписать счёт"),
  });

  const autoMut = useMutation({
    mutationFn: (enabled: boolean) => setAutopay(enabled, accessToken ?? undefined),
    onSuccess: () => {
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
      <div className="flex-none relative flex items-center justify-center pt-4 pb-9">
        <Button type="text" className="absolute left-1" onClick={() => nav(-1)}>
          Назад
        </Button>
        <Title level={4} style={{ margin: 0 }}>
          Текущий тариф
        </Title>
      </div>

      {/* Body */}
      <div className="flex-1 min-h-0 overflow-hidden px-4 pb-4 sm:px-5 sm:pb-5 space-y-12">
        {/* Current plan */}
        <section>
          <Text style={{ color: "#85889E" }} className="block mb-2 text-[17px] leading-[22px]">
            Текущий тариф
          </Text>

          <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden flex flex-col max-h-[calc(55dvh-15px)] sm:max-h-0 h-full">
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
                </Space>
              ) : (
                <Text type="secondary">Нет активного тарифа</Text>
              )}
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button onClick={() => setPickerOpen(true)} className="h-11 rounded-xl" disabled={!plans.length}>
              Сменить тариф
            </Button>
            <Button
              type="primary"
              className="h-11 rounded-xl"
              disabled={!currentPlan || invMut.isPending}
              loading={invMut.isPending}
              onClick={() => currentPlan && invMut.mutate(currentPlan.id)}
            >
              Возобновить тариф
            </Button>
          </div>
        </section>

        {/* Autopay */}
        <section>
          <Text style={{ color: "#85889E" }} className="block mb-2 text-[17px] leading-[22px]">
            Оплата
          </Text>

          <div className="rounded-2xl border border-gray-100 bg-white p-4 flex items-center justify-between">
            <Text style={{ fontSize: 17, color: "#262633" }}>Автоплатёж</Text>
            <Switch
              checked={autopay}
              loading={loadingAutopay || autoMut.isPending}
              onChange={(v) => autoMut.mutate(v)}
            />
          </div>
        </section>

        {/* History & analytics */}
        <section className="flex-none">
          <Text style={{ color: "#85889E" }} className="block mb-2 text-[17px] leading-[22px]">
            История
          </Text>

          {/* Card: flex column; top = filters, bottom = scrollable list */}
          <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden flex flex-col h-[55dvh] sm:h-[45dvh]">
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
                className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 pb-6"
                style={{
                  WebkitOverflowScrolling: "touch",
                  // helps programmatic scrolling stop above the rounded edge
                  scrollPaddingBottom: 24,
                  // keeps clear of iOS home indicator
                  paddingBottom: "env(safe-area-inset-bottom, 24px)",
                }}
              >
                <List<AnalyticsEntry>
                  dataSource={history}
                  renderItem={(tx) => {
                    const isPayment = tx.type === "payment";
                    const payment = isPayment ? (tx as AnalyticsPayment) : undefined;
                    const invoice = !isPayment ? (tx as AnalyticsInvoice) : undefined;

                    const amount = tx.amount;                            // in both variants
                    const currency = tx.currency ?? "UZS";
                    const balance = payment?.balance;

                    const isCancel = payment?.paymentType === "cancel";
                    const title = isPayment ? (isCancel ? "отмена пополнения" : "пополнение") : "списание";

                    const sign = isPayment ? (isCancel ? "−" : "+") : "−";
                    const amountColor = isPayment ? (isCancel ? "#d92d20" : "#2c7a7b") : "#85889E";

                    const dt = fmtDateTime(tx.createdAt);

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
                                    ? (payment?.status === "succeeded" ? "Успешно" : "Неуспешно")
                                    : (invoice?.status === "paid" ? "Оплачен" : "Ожидает")}
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
                <div aria-hidden className="h-2" />
              </div>
            )}
          </div>
        </section>
      </div >

      {/* Plan picker modal */}
      < Modal
        open={pickerOpen}
        onCancel={() => setPickerOpen(false)
        }
        footer={null}
        title="Тарифы"
        width={420}
        centered
      >
        {
          loadingPlans ? (
            <Skeleton active />
          ) : (
            <List
              dataSource={plans}
              renderItem={(p: BillingPlan) => (
                <List.Item
                  actions={[
                    <Button
                      key="invoice"
                      type="primary"
                      loading={invMut.isPending}
                      onClick={() => {
                        invMut.mutate(p.id);
                        setPickerOpen(false);
                      }}
                    >
                      Возобновить тариф
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <Space style={{ justifyContent: "space-between", width: "100%" }}>
                        <Text strong>{p.name}</Text>
                        <Text type="secondary">
                          {p.pricePerMonth ? `${p.pricePerMonth} ${p.currency ?? "UZS"} / мес` : "Бесплатно"}
                        </Text>
                      </Space>
                    }
                    description={
                      <div>
                        {p.description && <Text type="secondary">{p.description}</Text>}
                        <div
                          style={{
                            marginTop: 8,
                            paddingTop: 8,
                            borderTop: "1px solid #f0f0f0",
                            display: "grid",
                            gridTemplateColumns: "1fr auto",
                            rowGap: 6,
                          }}
                        >
                          <Text type="secondary">Сотрудников в организации</Text>
                          <Text strong>{p.maxEmployeesInOrganizations ?? "—"}</Text>

                          <Text type="secondary">Количество организаций</Text>
                          <Text strong>{p.maxOrganizations ?? "—"}</Text>
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />

          )}
      </Modal >
    </Card >
  );
}


