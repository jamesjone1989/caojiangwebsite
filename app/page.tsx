"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  BookHeart,
  BookOpen,
  ChevronRight,
  MessageCircle,
  MousePointerClick,
  Radio,
  TentTree,
} from "lucide-react";

type ItemId = "books" | "village" | "wechat" | "xiaohongshu" | "echo";

type StoryItem = {
  id: ItemId;
  eyebrow: string;
  title: string;
  shortTitle: string;
  description: string;
  note: string;
  icon: LucideIcon;
  href?: string;
};

const storyItems: StoryItem[] = [
  {
    id: "books",
    eyebrow: "01 / 出版作品",
    title: "把经验写成可以带走的方法",
    shortTitle: "两本书",
    description:
      "《高效学习：曹将的公开课》与《PPT炼成记》，分别记录我对学习方法与表达呈现的长期思考。",
    note: "高效学习 × 清晰表达",
    icon: BookOpen,
  },
  {
    id: "village",
    eyebrow: "02 / 知识星球",
    title: "AI 新手，也可以慢慢进村",
    shortTitle: "AI新手村",
    description:
      "一个为 AI 新手准备的知识星球，从工具入门、真实任务到经验交流，一起把 AI 用进日常工作。",
    note: "从第一次尝试，到完成一件事",
    icon: TentTree,
  },
  {
    id: "wechat",
    eyebrow: "03 / 微信公众号",
    title: "在「曹将」里，持续写下思考",
    shortTitle: "公众号",
    description:
      "公众号「曹将」，记录学习、表达、职场与 AI 实践。长文章，是我整理经验和回答问题的主要方式。",
    note: "公众号搜索：曹将",
    icon: MessageCircle,
  },
  {
    id: "xiaohongshu",
    eyebrow: "04 / 小红书",
    title: "把方法拆成更轻巧的一页",
    shortTitle: "小红书",
    description:
      "小红书账号「曹将」，用更短、更直观的形式分享工具、方法、阅读与工作中的具体发现。",
    note: "小红书搜索：曹将",
    icon: BookHeart,
  },
  {
    id: "echo",
    eyebrow: "05 / 独立作品",
    title: "听见自己，也听见时间留下的回声",
    shortTitle: "回声日记",
    description:
      "回声日记，是一件围绕声音记录与自我回望展开的作品。让那些来不及写下来的日常，也能被好好保存。",
    note: "huishengriji.cn",
    icon: Radio,
    href: "https://huishengriji.cn",
  },
];

const nodeClassNames: Record<ItemId, string> = {
  books: "story-node node-books",
  village: "story-node node-village",
  wechat: "story-node node-wechat",
  xiaohongshu: "story-node node-xiaohongshu",
  echo: "story-node node-echo",
};

export default function Home() {
  const [activeId, setActiveId] = useState<ItemId>("books");
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const activeItem =
    storyItems.find((item) => item.id === activeId) ?? storyItems[0];
  const activeIndex = storyItems.findIndex((item) => item.id === activeId);

  const stageStyle = {
    "--pointer-x": `${pointer.x}deg`,
    "--pointer-y": `${pointer.y}deg`,
  } as CSSProperties;

  function handlePointerMove(event: React.PointerEvent<HTMLElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 5;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * -4;
    setPointer({ x, y });
  }

  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="回到首页">
          <span className="brand-dot" aria-hidden="true" />
          <span>曹将</span>
          <small>CAO JIANG</small>
        </a>
        <nav aria-label="页面导航">
          <a href="#map">作品地图</a>
          <a href="#about">关于我</a>
        </nav>
        <span className="edition">自我介绍 · 2026</span>
      </header>

      <section className="hero" id="top">
        <div className="intro-copy" id="about">
          <div className="section-mark">
            <span>00</span>
            <i />
            <span>你好</span>
          </div>

          <p className="kicker">你好，我是曹将。</p>
          <h1>
            欢迎来到
            <br />
            我的<span>作品地图</span>
          </h1>
          <p className="lead">
            这里收录了我的两本书、一个知识星球、两个内容账号，以及一件仍在生长的作品。
          </p>

          <div className="interaction-tip">
            <MousePointerClick size={20} strokeWidth={2.4} aria-hidden="true" />
            <span>点击西瓜老师身边的物件，认识我做过的五件事</span>
          </div>

          <div className="intro-footer">
            <span>写作</span>
            <i />
            <span>学习</span>
            <i />
            <span>AI</span>
            <i />
            <span>产品</span>
          </div>
        </div>

        <section
          className="story-stage"
          id="map"
          data-active={activeId}
          style={stageStyle}
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setPointer({ x: 0, y: 0 })}
          aria-label="曹将作品地图"
        >
          <div className="paper-grid" aria-hidden="true" />
          <div className="orbit orbit-one" aria-hidden="true" />
          <div className="orbit orbit-two" aria-hidden="true" />
          <span className="hand-note note-one" aria-hidden="true">
            点这里看看
          </span>
          <span className="hand-note note-two" aria-hidden="true">
            还在继续更新
          </span>

          <div className="character-wrap" aria-hidden="true">
            <div className="character-halo" />
            <Image
              className="character"
              src="/xigua-teacher.png"
              alt=""
              width={1302}
              height={1302}
              priority
              draggable={false}
            />
            <span className="character-label">西瓜老师</span>
          </div>

          {storyItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = item.id === activeId;
            return (
              <button
                className={`${nodeClassNames[item.id]} ${
                  isActive ? "is-active" : ""
                }`}
                key={item.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveId(item.id)}
              >
                <span className="node-number">0{index + 1}</span>
                <span className="node-icon">
                  <Icon size={22} strokeWidth={2.3} aria-hidden="true" />
                </span>
                <span>{item.shortTitle}</span>
              </button>
            );
          })}

          <div className="detail-panel" aria-live="polite">
            <div className="detail-progress" aria-hidden="true">
              <span style={{ width: `${((activeIndex + 1) / 5) * 100}%` }} />
            </div>
            <p className="detail-eyebrow">{activeItem.eyebrow}</p>
            <h2>{activeItem.title}</h2>
            <p className="detail-description">{activeItem.description}</p>

            {activeItem.id === "books" ? (
              <div className="book-stack" aria-label="曹将出版的两本书">
                <div className="book book-red">
                  <small>曹将 著</small>
                  <strong>高效学习</strong>
                  <span>曹将的公开课</span>
                </div>
                <div className="book book-green">
                  <small>曹将 著</small>
                  <strong>PPT炼成记</strong>
                  <span>表达与呈现</span>
                </div>
              </div>
            ) : null}

            <div className="detail-action">
              <span>{activeItem.note}</span>
              {activeItem.href ? (
                <a
                  href={activeItem.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`访问${activeItem.shortTitle}`}
                >
                  访问作品
                  <ArrowUpRight size={18} aria-hidden="true" />
                </a>
              ) : (
                <span className="search-hint">
                  记住这个名字
                  <ChevronRight size={17} aria-hidden="true" />
                </span>
              )}
            </div>
          </div>
        </section>
      </section>

      <section className="mobile-map" aria-label="移动端作品导航">
        <p>选择一站，继续逛逛</p>
        <div className="mobile-node-row">
          {storyItems.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={item.id === activeId ? "is-active" : ""}
              onClick={() => setActiveId(item.id)}
            >
              <span>0{index + 1}</span>
              {item.shortTitle}
            </button>
          ))}
        </div>
      </section>

      <footer>
        <p>
          一个关于曹将的自我介绍网页
          <span aria-hidden="true">·</span>
          由西瓜老师带路
        </p>
        <a href="#top">回到开头</a>
      </footer>
    </main>
  );
}
