import { useState, useEffect, useMemo } from "react";
import { collection, query, onSnapshot, orderBy, limit, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Link } from "@tanstack/react-router";
import {
  ClipboardList,
  Receipt,
  Mail,
  TrendingUp,
  ArrowRight,
  Inbox,
  CheckCircle2,
  MoreVertical,
  ChevronRight,
  TrendingDown,
  Minus,
} from "lucide-react";
import type { ActivityLogEntry } from "@/lib/activityLog";
import { CountUp } from "@/components/shared/CountUp";
import { formatDistanceToNow, format } from "date-fns";
import { toMillis } from "@/lib/runtime";
import type { LucideIcon } from "lucide-react";
import type { AssessmentDocument } from "@/types/admin";
import type { CMSDocument } from "@/lib/cms";
import { InstallBanner } from "@/components/admin/AppSettings";

const MODE_LABELS: Record<string, string> = {
  in_clinic_kakinada: "In-clinic · Kakinada",
  online: "Online",
};

/**
 * "2h", "4d" — a compact age for narrow screens.
 *
 * The full "about 2 hours ago" is ~110px and sits in a shrink-0 column, which
 * squeezed the name beside it down to "Trac…" at 360px. A patient's name is
 * the one thing that row exists to show.
 */
function compactAgo(ms: number): string {
  const s = Math.max(0, Math.floor((Date.now() - ms) / 1000));
  if (s < 60) return "now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  const w = Math.floor(d / 7);
  if (w < 5) return `${w}w`;
  return `${Math.floor(d / 30)}mo`;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<AssessmentDocument[]>([]);
  const [payments, setPayments] = useState<CMSDocument[]>([]);
  const [enquiries, setEnquiries] = useState<CMSDocument[]>([]);
  const [activity, setActivity] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Time-aware greeting
  const greeting = useMemo(() => {
    // Basic IST conversion approx for greeting (or just use local time assuming user is in IST)
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  const adminName = user?.displayName ? user.displayName.split(" ")[0] : "";
  const title = adminName ? `${greeting}, ${adminName}.` : `${greeting}.`;

  const todayDate = format(new Date(), "EEEE, d MMMM yyyy");

  useEffect(() => {
    // Fetch recent assessments
    const unsubAssessments = onSnapshot(
      query(collection(db, "assessments"), orderBy("submittedAt", "desc")),
      (snap) => {
        setAssessments(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as AssessmentDocument));
      },
    );

    // Fetch enquiries
    const unsubEnquiries = onSnapshot(
      query(collection(db, "enquiries"), orderBy("createdAt", "desc")),
      (snap) => {
        setEnquiries(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as CMSDocument));
      },
    );

    // Fetch activity log
    const unsubActivity = onSnapshot(
      query(collection(db, "activityLog"), orderBy("createdAt", "desc"), limit(15)),
      (snap) => {
        setActivity(
          snap.docs.map((d) => ({ id: d.id, ...d.data() }) as unknown as ActivityLogEntry),
        );
        setLoading(false);
      },
    );

    return () => {
      unsubAssessments();
      unsubEnquiries();
      unsubActivity();
    };
  }, []);

  // Compute stats
  const newAssessmentsCount = assessments.filter((a) => a.status === "new").length;
  const pendingPaymentsCount = assessments.filter((a) => a.verificationStatus === "pending").length;
  const unreadEnquiriesCount = enquiries.filter((e) => !e["readAt"]).length;

  const currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();
  const thisMonthAssessments = assessments.filter((a) => {
    // Assuming submittedAt is ISO string or timestamp
    const time = toMillis(a.submittedAt);
    return time >= currentMonthStart;
  }).length;

  const needsAttentionCount = newAssessmentsCount + unreadEnquiriesCount;

  /*
   * Real trends.
   *
   * These four figures were hardcoded strings ("+2 this week", "+5 this week",
   * "+12% vs last month"). They never changed and bore no relation to the
   * data, which on a clinical dashboard is worse than showing nothing -- the
   * practice would have made scheduling decisions from invented numbers.
   */
  const DAY = 86_400_000;
  const now = Date.now();
  const weekAgo = now - 7 * DAY;
  const twoWeeksAgo = now - 14 * DAY;

  const inRange = (t: number, from: number, to: number) => t >= from && t < to;

  const countAssessments = (from: number, to: number) =>
    assessments.filter((a) => inRange(toMillis(a.submittedAt), from, to)).length;
  const countEnquiries = (from: number, to: number) =>
    enquiries.filter((e) => inRange(toMillis(e["createdAt"] as never), from, to)).length;

  /**
   * The card VALUE is a backlog (how many are still new / unverified /
   * unread); the trend below it is an INFLOW (how many arrived this week).
   * Those are different measures, so the label says which one it is --
   * "0 unread · +3 vs last week" read as a contradiction.
   */
  const weekTrend = (thisWeek: number, lastWeek: number) => {
    if (thisWeek === 0 && lastWeek === 0) return { label: "None this week", positive: null };
    if (thisWeek === 0) return { label: "None this week", positive: false };
    return {
      label: `${thisWeek} arrived this week`,
      positive: thisWeek >= lastWeek,
    };
  };

  const assessmentsTrend = weekTrend(
    countAssessments(weekAgo, now),
    countAssessments(twoWeeksAgo, weekAgo),
  );
  const enquiriesTrend = weekTrend(
    countEnquiries(weekAgo, now),
    countEnquiries(twoWeeksAgo, weekAgo),
  );
  const pendingTrend = weekTrend(
    assessments.filter(
      (a) => a.verificationStatus === "pending" && toMillis(a.submittedAt) >= weekAgo,
    ).length,
    assessments.filter(
      (a) =>
        inRange(toMillis(a.submittedAt), twoWeeksAgo, weekAgo) &&
        a.verificationStatus === "pending",
    ).length,
  );

  // Month over month, stated as a count difference rather than a percentage:
  // a percentage off a base of one or two submissions is noise.
  const lastMonthStart = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).getTime();
  const lastMonthCount = countAssessments(lastMonthStart, currentMonthStart);
  const monthDiff = thisMonthAssessments - lastMonthCount;
  const monthTrend =
    lastMonthCount === 0 && thisMonthAssessments === 0
      ? { label: "None yet this month", positive: null }
      : lastMonthCount === 0
        ? { label: "First month with submissions", positive: true }
        : monthDiff === 0
          ? { label: "Same as last month", positive: null }
          : {
              label: `${monthDiff > 0 ? "+" : "−"}${Math.abs(monthDiff)} vs last month`,
              positive: monthDiff > 0,
            };
  const monthLabel = monthTrend.label;

  // Need to extract the 5 oldest pending payments for the right panel
  const pendingPayments = assessments
    .filter((a) => a.verificationStatus === "pending")
    .sort((a, b) => {
      const tA = toMillis(a.submittedAt);
      const tB = toMillis(b.submittedAt);
      return tA - tB; // oldest first
    })
    .slice(0, 5);

  // Stats for 'This month at a glance'
  const paymentsVerifiedThisMonth = assessments.filter(
    (a) => a.verificationStatus === "verified" && toMillis(a.submittedAt) >= currentMonthStart,
  ).length;
  const modeKak = assessments.filter(
    (a) =>
      a.details?.preferredMode === "in_clinic_kakinada" &&
      toMillis(a.submittedAt) >= currentMonthStart,
  ).length;
  const modeOnl = assessments.filter(
    (a) => a.details?.preferredMode === "online" && toMillis(a.submittedAt) >= currentMonthStart,
  ).length;

  // Most common condition
  const conditions = assessments
    .map((a) => a.details?.programInterest)
    .filter((c): c is string => Boolean(c));
  const conditionCounts = conditions.reduce(
    (acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  const mostCommonCondition =
    Object.entries(conditionCounts).sort((a, b) => Number(b[1]) - Number(a[1]))[0]?.[0] || "—";

  return (
    <div className="p-6 md:p-8 max-w-[1440px] mx-auto">
      {/* Greeting Header */}
      <div className="mb-8">
        <h1 className="font-fraunces font-medium text-[clamp(1.5rem,2.6vw,1.875rem)] text-text m-0 leading-tight">
          {title}
        </h1>
        <p className="text-[14px] text-text-muted mt-1.5">
          {todayDate} ·{" "}
          {/* --accent as 14px text is 3.11:1 on --bg. --accent-contrast is the
              token meant for accent-coloured text (5.81:1), which the two
              spans further down this file already use. */}
          {needsAttentionCount > 0 ? (
            <span className="text-accent-contrast font-medium">
              {newAssessmentsCount} assessments and {unreadEnquiriesCount} enquiries need your
              attention.
            </span>
          ) : (
            <span>Everything's up to date.</span>
          )}
        </p>
      </div>

      <InstallBanner />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[18px] mb-[28px]">
        <StatCard
          icon={ClipboardList}
          label="New assessments"
          value={newAssessmentsCount}
          attention={newAssessmentsCount > 0}
          trend={assessmentsTrend.label}
          trendPositive={assessmentsTrend.positive}
          href="/admin/assessments?filter=new"
        />
        <StatCard
          icon={Receipt}
          label="Payments to verify"
          value={pendingPaymentsCount}
          attention={pendingPaymentsCount > 0}
          trend={pendingTrend.label}
          trendPositive={pendingTrend.positive}
          href="/admin/payments"
        />
        <StatCard
          icon={Mail}
          label="Unread enquiries"
          value={unreadEnquiriesCount}
          attention={unreadEnquiriesCount > 0}
          trend={enquiriesTrend.label}
          trendPositive={enquiriesTrend.positive}
          href="/admin/enquiries?filter=unread"
        />
        <StatCard
          icon={TrendingUp}
          label="Assessments this month"
          value={thisMonthAssessments}
          attention={false}
          trend={monthLabel}
          trendPositive={monthTrend.positive}
          href="/admin/assessments?filter=month"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6 items-start">
        {/* Left - Recent Assessments */}
        <div className="bg-surface border border-border rounded-[20px] overflow-hidden">
          <div className="p-[20px_22px] border-b border-border flex justify-between items-center">
            <h2 className="text-[15.5px] font-semibold text-text m-0">Recent assessments</h2>
            <Link
              to="/admin/assessments"
              className="text-[13.5px] font-semibold text-primary hover:text-accent-contrast flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight size={15} />
            </Link>
          </div>

          {assessments.length === 0 && !loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-text-muted">
              <Inbox size={28} className="mb-3 opacity-50" />
              <span className="text-[14px]">No assessments yet</span>
            </div>
          ) : (
            <div className="flex flex-col">
              {assessments.slice(0, 8).map((assessment, i) => {
                const isNew = assessment.status === "new";
                const name = assessment.details?.fullName?.trim() || "Unknown";
                const initial = name[0]?.toUpperCase() ?? "?";

                let timeStr = "";
                let timeShort = "";
                if (assessment.submittedAt) {
                  const d = toMillis(assessment.submittedAt);
                  timeStr = formatDistanceToNow(d, { addSuffix: true });
                  timeShort = compactAgo(d);
                }

                return (
                  <Link
                    key={assessment.id}
                    to={`/admin/assessments/${assessment.id}`}
                    className="h-[64px] px-4 sm:px-[22px] border-b border-border last:border-b-0 flex items-center hover:bg-surface-alt transition-colors group cursor-pointer"
                  >
                    <div className="w-[36px] h-[36px] rounded-full bg-primary-soft text-primary flex items-center justify-center font-bold text-[13px] mr-[14px] shrink-0">
                      {initial.toUpperCase()}
                    </div>
                    <div className="flex flex-col justify-center flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        {isNew && <div className="w-[7px] h-[7px] rounded-full bg-accent" />}
                        <span className="text-[14px] font-semibold text-text truncate">
                          {name.trim()}
                        </span>
                      </div>
                      <span className="text-[12.5px] text-text-muted truncate">
                        {assessment.details?.city || "Unknown city"} ·{" "}
                        {MODE_LABELS[assessment.details?.preferredMode ?? "online"]}
                      </span>
                    </div>
                    <div className="flex flex-col items-end shrink-0 ml-2 sm:ml-4">
                      {assessment.verificationStatus === "verified" && (
                        <span className="text-[12px] uppercase tracking-wider font-bold text-[var(--success)] bg-[var(--success)]/10 px-2 py-0.5 rounded-full mb-1">
                          Paid
                        </span>
                      )}
                      {assessment.verificationStatus === "pending" && (
                        <span className="text-[12px] uppercase tracking-wider font-bold text-accent-contrast bg-accent/10 px-2 py-0.5 rounded-full mb-1">
                          Pending
                        </span>
                      )}
                      <span className="text-[12.5px] text-text-muted">
                        <span className="sm:hidden">{timeShort}</span>
                        <span className="hidden sm:inline">{timeStr}</span>
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Right - Stacked Panels */}
        <div className="flex flex-col gap-4">
          {/* Panel A - Needs verification */}
          <div className="bg-surface border border-border rounded-[20px] p-[20px_22px]">
            <h2 className="text-[15.5px] font-semibold text-text m-0 mb-4 flex items-center gap-2">
              Needs verification
              {pendingPaymentsCount > 0 && (
                <span className="bg-accent-strong text-on-accent text-[12px] px-2 py-0.5 rounded-full">
                  {pendingPaymentsCount}
                </span>
              )}
            </h2>

            {pendingPayments.length === 0 ? (
              <div className="flex items-center gap-2 text-[13.5px] text-text-muted py-2">
                <CheckCircle2 size={16} className="text-[var(--success)]" /> All payments verified
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {pendingPayments.map((payment) => {
                  const name = payment.details?.fullName?.trim() || "Unknown";
                  let timeStr = "";
                  if (payment.submittedAt) {
                    const d = toMillis(payment.submittedAt);
                    timeStr = formatDistanceToNow(d, { addSuffix: true });
                  }

                  return (
                    <div key={payment.id} className="flex items-center gap-3">
                      <div className="w-[44px] h-[44px] rounded-[8px] bg-surface-alt overflow-hidden border border-border shrink-0">
                        {payment.payment?.screenshotUrl ? (
                          <img
                            src={payment.payment.screenshotUrl}
                            alt="Screenshot"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Receipt size={20} className="text-text-muted m-3" />
                        )}
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-[13.5px] font-semibold text-text truncate">
                          {name.trim()}
                        </span>
                        <span className="text-[12px] text-text-muted truncate">{timeStr}</span>
                      </div>
                      <Link
                        to={`/admin/assessments/${payment.id}`}
                        className="w-[32px] h-[32px] rounded-full flex items-center justify-center text-text-muted hover:bg-surface-alt hover:text-primary transition-colors shrink-0"
                      >
                        <ChevronRight size={16} />
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Panel B - This month at a glance */}
          <div className="bg-surface border border-border rounded-[20px] p-[22px]">
            <h2 className="text-[15.5px] font-semibold text-text m-0 mb-5">
              This month at a glance
            </h2>

            <div className="flex flex-col gap-[20px]">
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-text-muted">Total assessments</span>
                <span className="text-[14.5px] font-semibold text-text">
                  {thisMonthAssessments}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[13px] text-text-muted">Payments verified</span>
                <span className="text-[14.5px] font-semibold text-text">
                  {paymentsVerifiedThisMonth}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[13px] text-text-muted">Consultations</span>
                <div className="flex gap-1.5">
                  <span
                    className="text-[12px] font-semibold bg-surface-alt px-1.5 py-0.5 rounded text-text-muted"
                    title="Kakinada"
                  >
                    K:{modeKak}
                  </span>
                  <span
                    className="text-[12px] font-semibold bg-surface-alt px-1.5 py-0.5 rounded text-text-muted"
                    title="Online"
                  >
                    O:{modeOnl}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[13px] text-text-muted">Top condition</span>
                <span className="text-[14.5px] font-semibold text-text max-w-[150px] truncate text-right">
                  {mostCommonCondition}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="mt-[24px] bg-surface border border-border rounded-[20px] p-[22px]">
        <h2 className="text-[15.5px] font-semibold text-text m-0 mb-6">Recent activity</h2>

        {activity.length === 0 && !loading ? (
          <div className="text-center text-[13.5px] text-text-muted py-8">No activity yet</div>
        ) : (
          <div className="relative">
            <div className="absolute top-2 bottom-2 left-[14px] w-[2px] bg-border z-0" />
            <div className="flex flex-col gap-[18px] relative z-10">
              {activity.map((entry, idx) => {
                const isAssess = entry.type === "assessment";
                const isPay = entry.type === "payment";
                const dotColor = isAssess
                  ? "var(--primary)"
                  : isPay
                    ? "var(--accent)"
                    : "var(--text-muted)";

                let timeStr = "";
                if (entry.createdAt) {
                  const d = toMillis(entry.createdAt);
                  timeStr = formatDistanceToNow(d, { addSuffix: true });
                }

                return (
                  <div
                    key={`${entry.referenceId ?? entry.type}-${idx}`}
                    className="pl-[34px] relative"
                  >
                    <div
                      className="absolute left-[10px] top-[4px] w-[10px] h-[10px] rounded-full shadow-[0_0_0_4px_var(--surface)]"
                      style={{ background: dotColor }}
                    />
                    <div className="text-[13.5px] text-text leading-tight mb-1">
                      {entry.description}
                    </div>
                    <div className="text-[12px] text-text-muted">{timeStr}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  attention,
  trend,
  trendPositive,
  href,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  attention: boolean;
  trend: string;
  trendPositive: boolean | null;
  href: string;
}) {
  return (
    <Link
      to={href}
      className="block relative bg-surface border border-border rounded-[20px] p-[24px_22px] overflow-hidden cursor-pointer group transition-all duration-300 hover:-translate-y-[3px] hover:border-primary/30 hover:shadow-[0_12px_30px_rgba(var(--primary-rgb), 0.08)]"
    >
      <div className="flex items-center gap-4 mb-4">
        <div
          className={`w-[44px] h-[44px] rounded-[13px] flex items-center justify-center transition-colors duration-300 ${attention ? "bg-accent-strong text-on-accent" : "bg-primary-soft text-primary"}`}
        >
          <Icon size={20} />
        </div>
      </div>

      <div className="font-fraunces font-medium text-[clamp(1.75rem,3vw,2.25rem)] text-text leading-none mb-1">
        <CountUp value={value} duration={1.5} separator="," />
      </div>
      <div className="text-[13px] text-text-muted">{label}</div>

      <div className="mt-[14px] pt-[14px] border-t border-border flex items-center gap-1.5 text-[12.5px]">
        {trendPositive === true && <TrendingUp size={14} className="text-[var(--success)]" />}
        {trendPositive === false && <TrendingDown size={14} className="text-[var(--danger)]" />}
        {trendPositive === null && <Minus size={14} className="text-text-muted" />}
        <span
          className={
            trendPositive === true
              ? "text-[var(--success)]"
              : trendPositive === false
                ? "text-[var(--danger)]"
                : "text-text-muted"
          }
        >
          {trend}
        </span>
      </div>
    </Link>
  );
}
