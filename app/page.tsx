"use client";

import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  ArrowUpRight,
  BookHeart,
  BookOpen,
  MessageCircle,
  Radio,
  Rotate3D,
  TentTree,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import XiguaTeacher3D, { type FocusId } from "./XiguaTeacher3D";

type ItemId = Exclude<FocusId, "overview">;

type StoryItem = {
  id: ItemId;
  index: string;
  eyebrow: string;
  shortTitle: string;
  title: string;
  description: string;
  note: string;
  icon: LucideIcon;
  href?: string;
  actionLabel?: string;
};

const storyItems: StoryItem[] = [
  {
    id: "books",
    index: "01",
    eyebrow: "出版作品",
    shortTitle: "两本书",
    title: "把经验，写成可以带走的方法",
    description:
      "《高效学习：曹将的公开课》与《PPT炼成记》，分别记录我对学习方法与表达呈现的长期思考。",
    note: "高效学习 × 清晰表达",
    icon: BookOpen,
  },
  {
    id: "village",
    index: "02",
    eyebrow: "知识星球",
    shortTitle: "AI新手村",
    title: "AI 新手，也可以慢慢进村",
    description:
      "一个为 AI 新手准备的知识星球。从工具入门、真实任务到经验交流，一起把 AI 用进日常工作。",
    note: "从第一次尝试，到完成一件事",
    icon: TentTree,
    href: "https://t.zsxq.com/2IJ1F",
    actionLabel: "加入 AI 新手村",
  },
  {
    id: "wechat",
    index: "03",
    eyebrow: "微信公众号",
    shortTitle: "公众号",
    title: "在「曹将」里，持续写下思考",
    description:
      "公众号「曹将」，记录学习、表达、职场与 AI 实践。长文章，是我整理经验和回答问题的主要方式。",
    note: "微信搜索：曹将",
    icon: MessageCircle,
  },
  {
    id: "xiaohongshu",
    index: "04",
    eyebrow: "小红书",
    shortTitle: "小红书",
    title: "把方法，拆成更轻巧的一页",
    description:
      "小红书账号「曹将」，用更短、更直观的形式分享工具、方法、阅读与工作中的具体发现。",
    note: "小红书搜索：曹将",
    icon: BookHeart,
  },
  {
    id: "echo",
    index: "05",
    eyebrow: "独立作品",
    shortTitle: "回声日记",
    title: "听见自己，也听见时间的回声",
    description:
      "回声日记，是一件围绕声音记录与自我回望展开的作品。让那些来不及写下来的日常，也能被好好保存。",
    note: "huishengriji.cn",
    icon: Radio,
    href: "https://huishengriji.cn",
  },
];

export default function Home() {
  const [activeId, setActiveId] = useState<FocusId>("overview");
  const activeItem =
    activeId === "overview"
      ? null
      : storyItems.find((item) => item.id === activeId) ?? null;

  return (
    <main className="site-shell">
      <header className="topbar">
        <button
          type="button"
          className="brand"
          aria-label="回到总览"
          onClick={() => setActiveId("overview")}
        >
          <span className="brand-mark" aria-hidden="true">
            曹
          </span>
          <span>
            曹将
            <small>CAO JIANG</small>
          </span>
        </button>

        <div className="topbar-note">
          <span className="live-dot" aria-hidden="true" />
          一份可以轻轻转动的自我介绍
        </div>

        <button
          type="button"
          className="overview-button"
          onClick={() => setActiveId("overview")}
          aria-pressed={activeId === "overview"}
        >
          <Rotate3D size={17} aria-hidden="true" />
          总览
        </button>
      </header>

      <section className="three-stage" aria-label="曹将作品地图">
        <div className="sr-only">
          <h2>曹将的作品与内容</h2>
          <ul>
            <li>出版作品：《高效学习：曹将的公开课》《PPT炼成记》</li>
            <li>知识星球：AI新手村</li>
            <li>微信公众号：曹将</li>
            <li>小红书账号：曹将</li>
            <li>独立作品：回声日记，huishengriji.cn</li>
          </ul>
        </div>
        <div className="stage-glow glow-red" aria-hidden="true" />
        <div className="stage-glow glow-green" aria-hidden="true" />
        <div className="stage-grid" aria-hidden="true" />

        <div className={`hero-copy ${activeItem ? "is-dimmed" : ""}`}>
          <p className="eyebrow">HELLO, I&apos;M CAO JIANG</p>
          <h1>
            你好，
            <br />
            我是<span>曹将</span>。
          </h1>
          <p>
            我写作、做产品，也在认真研究怎样把复杂的事情讲清楚。
            <br />
            这位戴着西瓜帽的朋友，叫「西瓜老师」。
          </p>
        </div>

        <div
          className="canvas-shell"
          aria-label="使用原图呈现、可用鼠标或手指拖拽倾斜的西瓜老师形象"
        >
          <XiguaTeacher3D focus={activeId} />
        </div>

        <div className="character-sign" aria-hidden="true">
          <span>3D</span>
          西瓜老师
        </div>

        <nav className="story-nav" aria-label="曹将作品地图">
          {storyItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === activeId;
            return (
              <button
                type="button"
                key={item.id}
                className={`story-trigger trigger-${item.id} ${isActive ? "is-active" : ""}`}
                aria-pressed={isActive}
                onClick={() => setActiveId(item.id)}
              >
                <span className="trigger-index">{item.index}</span>
                <span className="trigger-icon">
                  <Icon size={18} strokeWidth={2.2} aria-hidden="true" />
                </span>
                <span>{item.shortTitle}</span>
              </button>
            );
          })}
        </nav>

        <p className="motion-hint">
          <Rotate3D size={18} aria-hidden="true" />
          按住拖动，轻轻转动 · 双击复位 · 点击标签走近看看
        </p>

        <section
          className={`story-detail ${activeItem ? "is-visible" : ""}`}
          aria-live="polite"
          aria-hidden={!activeItem}
        >
          {activeItem ? (
            <>
              <button
                type="button"
                className="detail-back"
                onClick={() => setActiveId("overview")}
              >
                <ArrowLeft size={17} aria-hidden="true" />
                返回总览
              </button>
              <p className="detail-eyebrow">
                {activeItem.index} / {activeItem.eyebrow}
              </p>
              <h2>{activeItem.title}</h2>
              <p className="detail-description">{activeItem.description}</p>

              {activeItem.id === "wechat" ? (
                <div className="wechat-follow-card">
                  <Image
                    className="wechat-qr"
                    src="/wechat-caojiang-qr.png"
                    alt="微信公众号曹将二维码"
                    width={760}
                    height={980}
                    sizes="(max-width: 560px) 190px, 138px"
                    unoptimized
                  />
                  <div className="wechat-scan-copy">
                    <span>微信扫一扫</span>
                    <strong>关注公众号「曹将」</strong>
                    <small>学习 · 表达 · 职场 · AI 实践</small>
                  </div>
                </div>
              ) : null}

              {activeItem.id === "books" ? (
                <div className="book-titles" aria-label="曹将出版的两本书">
                  <span>
                    <a
                      href="https://3.cn/-2X6z7RF?jkl=@L46a40PajHTk@ ZH1997"
                      target="_blank"
                      rel="noreferrer"
                    >
                      《高效学习：曹将的公开课》
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                  </span>
                  <span>
                    <a
                      href="https://www.douban.com/doubanapp/dispatch/book/25852784?dt_dapp=1"
                      target="_blank"
                      rel="noreferrer"
                    >
                      《PPT炼成记》
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                  </span>
                </div>
              ) : null}

              <div className="detail-footer">
                <span>{activeItem.note}</span>
                {activeItem.href ? (
                  <a href={activeItem.href} target="_blank" rel="noreferrer">
                    {activeItem.actionLabel ?? "访问作品"}
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </a>
                ) : (
                  <span className="remember">记住这个名字</span>
                )}
              </div>
            </>
          ) : null}
        </section>

        <div className="stage-counter" aria-hidden="true">
          <strong>{activeItem?.index ?? "00"}</strong>
          <span>/ 05</span>
        </div>

        <footer className="font-credit">本站使用 OPPO Sans 4.0 字体</footer>
      </section>
    </main>
  );
}
