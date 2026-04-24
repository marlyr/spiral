import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChartColumn,
  ChevronLeft,
  ChevronRight,
  Github,
  Search,
  Users,
} from "lucide-react";

import { KanbanDemo } from "@/components/kanban-demo";
import { curriculumTracks } from "@/lib/track-details";
import { cn } from "@/lib/utils";

type SessionPill = {
  color: string;
  name: string;
};

const deckCards = [
  {
    id: 3,
    track: "Basic Skills",
    level: "Level 3",
    title: "Scratch spin",
    category: "Spin",
    categoryClassName: "bg-[#e2d8f0] text-[#6550a0] border-[#c4b2e0]",
    status: "Not Started",
    statusClassName:
      "bg-[var(--secondary)] text-[var(--text2)] border-[#d8d2c8]",
    note: "Add your own notes, cues, reminders...",
    muted: true,
  },
  {
    id: 2,
    track: "Basic Skills",
    level: "Level 3",
    title: "Salchow jump",
    category: "Jump",
    categoryClassName: "bg-[var(--warm-bg)] text-[#a0612e] border-[#e8cbb5]",
    status: "Working On",
    statusClassName: "bg-[var(--accent)] text-[#5a63a8] border-[#c5c9e8]",
    note: "Left back inside edge — remember to check hip position on the landing.",
  },
  {
    id: 1,
    track: "Basic Skills",
    level: "Level 4",
    title: "Forward crossovers",
    category: "Footwork",
    categoryClassName: "bg-[var(--sage-bg)] text-[#4d7a57] border-[#b8d8be]",
    status: "Working On",
    statusClassName: "bg-[var(--accent)] text-[#5a63a8] border-[#c5c9e8]",
    note: "Keep weight on inside edge. Coach says look up more — arms out for balance.",
    caret: true,
  },
];

const diarySessions: Record<number, SessionPill[]> = {
  3: [{ color: "#7c85c8", name: "Freestyle" }],
  7: [{ color: "#6b8f74", name: "Group" }],
  9: [
    { color: "#7c85c8", name: "Freestyle" },
    { color: "#5a63a8", name: "Private" },
  ],
  12: [{ color: "#6b8f74", name: "Public" }],
  14: [{ color: "#7c85c8", name: "Freestyle" }],
  16: [{ color: "#5a63a8", name: "Private" }],
  19: [{ color: "#7c85c8", name: "Freestyle" }],
  21: [
    { color: "#6b8f74", name: "Group" },
    { color: "#7c85c8", name: "Freestyle" },
  ],
  23: [
    { color: "#7c85c8", name: "Freestyle" },
    { color: "#6b8f74", name: "Group" },
  ],
};

const featureCards = [
  {
    title: "Skill Search",
    description:
      "Search the full curriculum by name or filter by category — jumps, spins, footwork, and more.",
    icon: Search,
  },
  {
    title: "Progress Charts",
    description:
      "Visualize how often you skate, skills unlocked over time, and your trajectory across weeks and months.",
    icon: ChartColumn,
  },
  {
    title: "Coach Mode",
    description:
      "Share your progress board with your coach, assign drills, and get feedback tied directly to your skills.",
    icon: Users,
  },
];

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function buildCalendarDays() {
  const days = [];
  const startDay = 3;
  const daysInMonth = 30;

  for (let day = 27; day < 27 + startDay; day += 1) {
    days.push({
      key: `prev-${day}`,
      label: day,
      otherMonth: true,
      sessions: [] as SessionPill[],
      isToday: false,
      isSelected: false,
    });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push({
      key: `current-${day}`,
      label: day,
      otherMonth: false,
      sessions: diarySessions[day] ?? [],
      isToday: day === 23,
      isSelected: day === 23,
    });
  }

  const trailing = (7 - (days.length % 7)) % 7;

  for (let day = 1; day <= trailing; day += 1) {
    days.push({
      key: `next-${day}`,
      label: day,
      otherMonth: true,
      sessions: [] as SessionPill[],
      isToday: false,
      isSelected: false,
    });
  }

  return days;
}

const calendarDays = buildCalendarDays();

export default function LandingPage() {
  const pageRef = useRef<HTMLDivElement | null>(null);
  const trackGridRef = useRef<HTMLDivElement | null>(null);
  const deckRef = useRef<HTMLDivElement | null>(null);
  const [tracksVisible, setTracksVisible] = useState(false);
  const [deckVisible, setDeckVisible] = useState(false);

  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;

    const revealItems = Array.from(
      root.querySelectorAll<HTMLElement>("[data-landing-reveal]"),
    );

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("landing-reveal-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    revealItems.forEach((item) => revealObserver.observe(item));

    const trackGrid = trackGridRef.current;
    let trackObserver: IntersectionObserver | null = null;

    if (trackGrid) {
      trackObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTracksVisible(true);
              trackObserver?.disconnect();
            }
          });
        },
        { threshold: 0.85 },
      );

      trackObserver.observe(trackGrid);
    }

    const deck = deckRef.current;
    let deckObserver: IntersectionObserver | null = null;

    if (deck) {
      deckObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              window.setTimeout(() => setDeckVisible(true), 300);
              deckObserver?.disconnect();
            }
          });
        },
        { threshold: 0.85 },
      );

      deckObserver.observe(deck);
    }

    return () => {
      revealObserver.disconnect();
      trackObserver?.disconnect();
      deckObserver?.disconnect();
    };
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen text-[var(--foreground)]">
      <nav className="mx-auto flex w-full max-w-[1080px] items-center justify-between px-8 pt-6 max-sm:px-5">
        <Link
          to="/"
          className="text-[1.25rem] font-bold tracking-[-0.03em] text-[var(--foreground)]"
        >
          spiral
        </Link>
        <div className="flex items-center gap-[10px]">
          <Link
            to="/login"
            className="rounded-full border border-[var(--border)] bg-[var(--card)] px-[18px] py-[7px] text-[0.85rem] font-medium transition-colors hover:bg-[var(--secondary)]"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="rounded-full bg-[var(--primary)] px-[18px] py-[7px] text-[0.85rem] font-semibold text-[var(--primary-foreground)] transition-opacity hover:opacity-90"
          >
            Sign up
          </Link>
        </div>
      </nav>

      <section className="mx-auto grid w-full max-w-[1080px] grid-cols-[1fr_1.05fr] items-center gap-14 px-8 pt-16 max-lg:grid-cols-1 max-sm:px-5">
        <div data-landing-hero className="max-w-[390px]">
          <p className="mb-[14px] text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--peri-dim)]">
            Learn to Skate USA · Progress tracker
          </p>
          <h1 className="mb-5 text-[clamp(2.4rem,4vw,3.1rem)] leading-[1.06] font-extrabold tracking-[-0.03em]">
            Your skating progress,
            <br />
            <span className="text-[var(--primary)]">visualized.</span>
          </h1>
          <p className="mb-8 max-w-[380px] text-[1.05rem] leading-[1.65] text-[var(--text2)]">
            Spiral is a progress tracker built for figure skaters. Organize your
            skills, log every session, and watch yourself improve, one edge at a
            time.
          </p>
          <Link
            to="/register"
            className="landing-hero-cta group inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-7 py-3 text-[0.95rem] font-semibold leading-[1.2] text-[var(--primary-foreground)] transition-opacity hover:opacity-90"
            aria-label="Start tracking free"
          >
            <span className="landing-hero-cta-inner" aria-hidden="true">
              <span className="landing-hero-cta-text">Start tracking free</span>
              <span className="landing-hero-cta-text">Start tracking free</span>
            </span>
            <ArrowRight className="size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="landing-hero-demo drop-shadow-[0_8px_32px_rgba(107,98,88,0.10)]">
          <KanbanDemo />
        </div>
      </section>

      <div className="mx-auto mt-16 w-full max-w-[1080px] px-8 max-sm:px-5">
        <hr className="border-t border-[var(--border)]" />
      </div>

      <section
        id="section-tracks"
        className="mx-auto w-full max-w-[1080px] px-8 pt-16 max-sm:px-5"
      >
        <div className="grid grid-cols-2 items-center gap-14 max-lg:grid-cols-1">
          <div
            data-landing-reveal
            className="landing-reveal landing-reveal-from-left max-w-[390px]"
          >
            <p className="mb-[14px] text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--peri-dim)]">
              Learn to Skate USA
            </p>
            <h2 className="mb-4 text-[2rem] leading-[1.15] font-bold tracking-[-0.025em]">
              Built around the
              <br />
              official curriculum.
            </h2>
            <p className="text-[1rem] leading-[1.65] text-[var(--text2)]">
              Spiral maps directly to the Learn to Skate USA program. Every
              skill in your track is already loaded in, organized by level, and
              ready to work through.
            </p>
          </div>

          <div
            ref={trackGridRef}
            className="grid auto-rows-fr grid-cols-2 gap-[10px] max-sm:grid-cols-1"
          >
            {curriculumTracks.map((track, index) => {
              const Icon = track.icon;
              return (
                <div
                  key={track.title}
                  data-landing-reveal
                  className={cn("landing-reveal landing-reveal-scale h-full")}
                  style={{ transitionDelay: `${index * 90}ms` }}
                >
                  <div
                    className={cn(
                      "flex h-full flex-col rounded-[14px] border border-[var(--border)] bg-[var(--card)] px-5 py-[18px]",
                      tracksVisible
                        ? "landing-track-card-bounced"
                        : "landing-track-card-pending",
                    )}
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    <div
                      className={cn(
                        "mb-[10px] grid size-8 place-items-center rounded-[8px]",
                        track.iconClassName,
                      )}
                    >
                      <Icon className="size-4" strokeWidth={2} />
                    </div>
                    <div className="mb-1 text-[0.95rem] font-semibold">
                      {track.title}
                    </div>
                    <div className="text-[0.82rem] leading-[1.55] text-[var(--text2)]">
                      {track.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="mx-auto mt-16 w-full max-w-[1080px] px-8 max-sm:px-5">
        <hr className="border-t border-[var(--border)]" />
      </div>

      <section
        id="section-skills"
        className="mx-auto grid w-full max-w-[1080px] grid-cols-2 items-center gap-16 px-8 pt-[72px] max-lg:grid-cols-1 max-sm:px-5"
      >
        <div
          data-landing-reveal
          className="landing-reveal landing-reveal-from-left"
        >
          <p className="mb-[10px] text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--peri-dim)]">
            Skill notes
          </p>
          <h2 className="text-[2rem] leading-[1.15] font-bold tracking-[-0.025em]">
            Your cues,
            <br />
            your way.
          </h2>
          <p className="mt-4 mb-6 max-w-[360px] text-[1rem] leading-[1.65] text-[var(--text2)]">
            Click any skill card to open its detail view. Add personal notes,
            coaching cues, or reminders, saved automatically as you type.
          </p>
          <div className="flex flex-col gap-[11px] text-[0.88rem] text-[var(--text2)]">
            <div className="flex items-center gap-[10px]">
              <span className="size-2 rounded-full bg-[var(--primary)]" />
              See the skill&apos;s level, track, and category at a glance
            </div>
            <div className="flex items-center gap-[10px]">
              <span className="size-2 rounded-full bg-[var(--primary)]" />
              Write freeform notes, coaching cues, timestamps, and goals
            </div>
            <div className="flex items-center gap-[10px]">
              <span className="size-2 rounded-full bg-[var(--primary)]" />
              Autosaved, so your notes are always there when you return
            </div>
          </div>
        </div>

        <div
          data-landing-reveal
          className="landing-reveal landing-reveal-from-right flex justify-center"
        >
          <div
            ref={deckRef}
            className={cn(
              "landing-card-deck relative h-[280px] w-[300px]",
              deckVisible && "landing-card-deck-fanned",
            )}
          >
            {deckCards.map((card) => (
              <div
                key={card.id}
                className={cn(
                  "landing-card-deck-card absolute w-[260px] rounded-[16px] border border-[var(--border)] bg-[var(--card)] p-5 shadow-[0_8px_28px_rgba(26,23,20,0.11)]",
                  `landing-card-deck-card-${card.id}`,
                )}
              >
                <div className="mb-[6px] flex items-center gap-[6px] text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--peri-dim)]">
                  <span>{card.track}</span>
                  <span className="text-[var(--border-mid)]">·</span>
                  <span>{card.level}</span>
                </div>
                <div className="mb-[10px] text-[17px] leading-[1.25] font-semibold">
                  {card.title}
                </div>
                <div className="flex gap-[6px]">
                  <span
                    className={cn(
                      "rounded-full border px-2 py-[2px] text-[11px] font-medium",
                      card.categoryClassName,
                    )}
                  >
                    {card.category}
                  </span>
                  <span
                    className={cn(
                      "rounded-full border px-2 py-[2px] text-[11px] font-medium",
                      card.statusClassName,
                    )}
                  >
                    {card.status}
                  </span>
                </div>
                <div className="mt-[14px]">
                  <div className="mb-[7px] text-[9.5px] font-semibold uppercase tracking-[0.1em] text-[var(--text3)]">
                    My Notes
                  </div>
                  <div
                    className={cn(
                      "h-[72px] rounded-[8px] border border-[var(--border)] bg-[var(--secondary)] px-[11px] py-[9px] text-[12px] leading-[1.5]",
                      card.muted
                        ? "text-[var(--text3)]"
                        : "text-[var(--text2)]",
                    )}
                  >
                    {card.note}
                    {card.caret && (
                      <span className="landing-note-caret ml-1 inline-block h-3 w-0.5 align-text-bottom bg-[var(--primary)]" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto mt-[72px] w-full max-w-[1080px] px-8 max-sm:px-5">
        <hr className="border-t border-[var(--border)]" />
      </div>

      <div
        id="section-diary"
        className="mx-auto mt-[72px] w-full max-w-[1080px] px-8 max-sm:px-5"
      >
        <div data-landing-reveal className="landing-reveal">
          <p className="mb-[10px] text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--peri-dim)]">
            Skating diary
          </p>
          <h2 className="text-[2rem] leading-[1.15] font-bold tracking-[-0.025em]">
            Log every session.
            <br />
            See every pattern.
          </h2>
          <p className="mt-[14px] max-w-[460px] text-[0.95rem] leading-[1.65] text-[var(--text2)]">
            Track your ice time, add notes, tag session types, and build a
            personal record that fuels your progress charts.
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1080px] px-8 pt-8 max-sm:px-5">
        <div
          data-landing-reveal
          className="landing-reveal landing-reveal-scale overflow-hidden rounded-[16px] border border-[var(--border)] bg-[var(--card)] shadow-[0_4px_24px_rgba(107,98,88,0.07)]"
        >
          <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-[16px] max-sm:flex-col max-sm:items-start max-sm:gap-3">
            <div className="flex items-baseline gap-2 text-[18px] font-semibold tracking-[-0.01em]">
              April
              <span className="text-[13px] font-normal text-[var(--text3)]">
                2026
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="h-[30px] rounded-[7px] border border-[var(--border)] bg-[var(--card)] px-[11px] text-[11.5px] text-[var(--text2)] transition-colors hover:bg-[var(--muted)]"
              >
                Today
              </button>
              <button
                type="button"
                className="grid size-[30px] place-items-center rounded-[7px] border border-[var(--border)] bg-[var(--card)] text-[var(--text2)] transition-colors hover:bg-[var(--muted)]"
              >
                <ChevronLeft className="size-3.5" />
              </button>
              <button
                type="button"
                className="grid size-[30px] place-items-center rounded-[7px] border border-[var(--border)] bg-[var(--card)] text-[var(--text2)] transition-colors hover:bg-[var(--muted)]"
              >
                <ChevronRight className="size-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_340px] max-lg:grid-cols-1">
            <div className="border-r border-[var(--border)] px-2 pb-3 max-lg:border-r-0 max-lg:border-b">
              <div className="grid grid-cols-7 pt-[10px]">
                {weekdayLabels.map((label) => (
                  <div
                    key={label}
                    className="px-0 py-2 text-center text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[var(--text3)]"
                  >
                    {label}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day) => (
                  <div
                    key={day.key}
                    className={cn(
                      "min-h-[88px] rounded-[9px] border px-[8px] py-[7px] transition-colors",
                      day.otherMonth
                        ? "opacity-35 border-transparent"
                        : "border-transparent hover:bg-[var(--muted)]",
                      day.sessions.length > 0 &&
                        !day.otherMonth &&
                        "border-[var(--border)] bg-[#fbf9f5]",
                      day.isSelected && "border-[#c5c9e8] bg-[var(--accent)]",
                    )}
                  >
                    <div className="mb-[3px] flex min-h-5 items-center justify-between">
                      <div
                        className={cn(
                          "grid size-5 place-items-center rounded-full text-[12px] font-medium",
                          day.isToday
                            ? "bg-[var(--primary)] text-white"
                            : "text-[var(--foreground)]",
                        )}
                      >
                        {day.label}
                      </div>
                    </div>
                    <div className="flex flex-col gap-[3px]">
                      {day.sessions.slice(0, 2).map((session) => (
                        <div
                          key={`${day.key}-${session.name}`}
                          className="flex max-w-full items-center gap-1 overflow-hidden rounded-[4px] border border-[var(--border)] bg-[var(--card)] px-[5px] py-[2px] text-[9.5px] font-medium text-[var(--foreground)]"
                        >
                          <span
                            className="size-[5px] rounded-full"
                            style={{ backgroundColor: session.color }}
                          />
                          <span className="truncate">{session.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="border-b border-[var(--border)] px-5 py-[16px]">
                <div className="mb-[3px] text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[var(--peri-dim)]">
                  Thursday
                </div>
                <div className="text-[18px] font-semibold tracking-[-0.01em]">
                  April 23{" "}
                  <span className="text-[13px] font-normal text-[var(--text3)]">
                    · 2 sessions
                  </span>
                </div>
              </div>
              <div>
                <div className="grid cursor-pointer grid-cols-[7px_1fr_auto] items-center gap-3 border-b border-[var(--border)] bg-[var(--accent)] px-5 py-[13px]">
                  <div className="h-[34px] w-[3px] rounded-[2px] bg-[var(--primary)]" />
                  <div className="min-w-0">
                    <div className="truncate text-[13.5px] font-medium">
                      Morning freestyle
                    </div>
                    <div className="mt-[3px] flex flex-wrap items-center gap-[6px]">
                      <span className="rounded-full border border-[#a8c8e8] bg-[#d4e6f6] px-[6px] py-[1.5px] text-[10px] font-medium text-[#3a6aa8]">
                        Freestyle
                      </span>
                      <span className="text-[10.5px] text-[var(--text3)]">
                        6:00 AM
                      </span>
                    </div>
                  </div>
                  <div className="text-[11px] text-[var(--text3)]">75 min</div>
                </div>

                <div className="grid cursor-pointer grid-cols-[7px_1fr_auto] items-center gap-3 border-b border-[var(--border)] px-5 py-[13px] transition-colors hover:bg-[var(--muted)]">
                  <div className="h-[34px] w-[3px] rounded-[2px] bg-[var(--sage)]" />
                  <div className="min-w-0">
                    <div className="truncate text-[13.5px] font-medium">
                      Group lesson — Crossovers
                    </div>
                    <div className="mt-[3px] flex flex-wrap items-center gap-[6px]">
                      <span className="rounded-full border border-[#b8d8be] bg-[var(--sage-bg)] px-[6px] py-[1.5px] text-[10px] font-medium text-[#4d7a57]">
                        Group
                      </span>
                      <span className="text-[10.5px] text-[var(--text3)]">
                        4:30 PM
                      </span>
                    </div>
                  </div>
                  <div className="text-[11px] text-[var(--text3)]">45 min</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section
        id="section-features"
        className="mx-auto w-full max-w-[1080px] px-8 pt-[72px] max-sm:px-5"
      >
        <p className="mb-[10px] text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--peri-dim)]">
          What&apos;s coming
        </p>
        <h2 className="mb-8 text-[2rem] font-bold tracking-[-0.025em]">
          More features on the way
        </h2>
        <div className="grid grid-cols-3 gap-[14px] max-lg:grid-cols-1">
          {featureCards.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                data-landing-reveal
                className="landing-reveal landing-reveal-scale rounded-[14px] border border-[var(--border)] bg-[var(--secondary)] p-5"
                style={{ transitionDelay: `${index * 90}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="grid size-[38px] place-items-center rounded-[10px] bg-[var(--accent)] text-[var(--primary)]">
                    <Icon className="size-[18px]" strokeWidth={2} />
                  </div>
                  <span className="rounded-full border border-[var(--border)] bg-[var(--page-bg-color)] px-2 py-[3px] text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-[var(--text3)]">
                    Coming soon
                  </span>
                </div>
                <div className="mt-3">
                  <div className="mb-1 text-[0.95rem] font-semibold">
                    {feature.title}
                  </div>
                  <div className="text-[0.82rem] leading-[1.6] text-[var(--text2)]">
                    {feature.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section
        id="section-cta"
        className="mx-auto mt-[72px] w-full max-w-[1080px] px-8 max-sm:px-5"
      >
        <div
          data-landing-reveal
          className="landing-reveal relative flex items-center justify-between gap-8 overflow-hidden rounded-[20px] bg-[var(--primary)] px-14 py-[52px] max-md:flex-col max-md:items-start max-md:px-7 max-md:py-10"
        >
          <div className="landing-cta-dither pointer-events-none absolute right-0 bottom-0 h-full w-[48%] max-md:w-[72%]" />
          <div className="relative z-10">
            <h2 className="mb-2 text-[1.75rem] leading-[1.2] font-bold tracking-[-0.02em] text-white">
              Ready to track your
              <br />
              skating journey?
            </h2>
            <p className="text-[0.9rem] text-white/70">
              Free to use. Takes less than a minute to set up.
            </p>
          </div>
          <Link
            to="/register"
            className="relative z-10 inline-flex shrink-0 items-center rounded-full bg-white px-7 py-[13px] text-[0.95rem] font-semibold text-[var(--primary)] transition-[opacity,transform] hover:-translate-y-px hover:opacity-95"
          >
            Create your account
          </Link>
        </div>
      </section>

      <footer className="mx-auto mt-[60px] flex w-full max-w-[1080px] items-center justify-between border-t border-[var(--border)] px-8 py-[28px] pb-10 text-[0.8rem] text-[var(--text3)] max-sm:flex-col max-sm:items-start max-sm:gap-3 max-sm:px-5">
        <span>spiral · built for skaters, by a skater</span>
        <a
          href="https://github.com/marlyr/spiral"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 transition-colors hover:text-[var(--foreground)]"
        >
          <Github className="size-4" />
          GitHub
        </a>
      </footer>
    </div>
  );
}
