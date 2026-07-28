"use client";

/* eslint-disable @next/next/no-img-element */

import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  MessageCircle,
  Radio,
  Sparkles,
  Users,
} from "lucide-react";
import { useEffect, useRef } from "react";

const links = {
  efficientLearning:
    "https://3.cn/-2X6z7RF?jkl=@L46a40PajHTk@ ZH1997",
  pptBook:
    "https://www.douban.com/doubanapp/dispatch/book/25852784?dt_dapp=1",
  aiVillage: "https://t.zsxq.com/2IJ1F",
  echoJournal: "https://huishengriji.cn",
  xiaobot:
    "https://xiaobot.net/p/jghbd?refer=c3f68f06-3090-44fa-bf08-434f581889b3",
};

const featuredArticles = [
  {
    title: "如何打造个人知识体系",
    year: "2023",
    length: "长文",
    topic: "知识管理",
    size: "hero",
    href: "https://mp.weixin.qq.com/s/C4ZCszJtzt-7cRJbtl9K8g",
  },
  {
    title: "演示设计清单",
    year: "2022",
    length: "5300 字",
    topic: "表达",
    size: "lg",
    href: "https://mp.weixin.qq.com/s/hssZ5M1gRr4x2cxN6oGeTA",
  },
  {
    title: "如何快速熟悉一个新领域",
    year: "2022",
    length: "5600 字",
    topic: "学习",
    size: "xl",
    href: "https://mp.weixin.qq.com/s/_UFI6CHqDE5KwDtpPuBK_Q",
  },
  {
    title: "时间管理的10个误区",
    year: "2024",
    length: "5800 字",
    topic: "效率",
    size: "lg",
    href: "https://mp.weixin.qq.com/s/qohULQcM6Pgi36MGlsHvtg",
  },
  {
    title: "AI时代，我们还可以做什么？",
    year: "2024",
    length: "3700 字",
    topic: "AI",
    size: "xl",
    href: "https://mp.weixin.qq.com/s/E8qVr2fmeLHNXyoG0yEQPg",
  },
  {
    title: "哪些职场能力可以穿越周期",
    year: "2023",
    length: "5400 字",
    topic: "能力",
    size: "lg",
    href: "https://mp.weixin.qq.com/s/NjvhF3euxkymgTSdt7G9Jg",
  },
] as const;

function ExternalLink({
  href,
  children,
  className = "text-link",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a className={className} href={href} target="_blank" rel="noreferrer">
      <span>{children}</span>
      <ArrowUpRight aria-hidden="true" size={18} strokeWidth={2.2} />
    </a>
  );
}

export default function Home() {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const revealNodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 },
    );

    revealNodes.forEach((node) => observer.observe(node));

    const updateProgress = () => {
      if (!progressRef.current) return;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      progressRef.current.style.transform = `scaleX(${progress})`;
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateProgress);
    };
  }, []);

  return (
    <main className="site-shell">
      <div
        className="scroll-progress"
        ref={progressRef}
        aria-hidden="true"
      />

      <header className="topbar">
        <a className="brand" href="#home" aria-label="回到首页">
          <span className="brand-mark" aria-hidden="true">
            曹
          </span>
          <span className="brand-name">曹将</span>
        </a>
        <nav className="topnav" aria-label="页面导航">
          <a href="#books">书</a>
          <a href="#village">AI 新手村</a>
          <a href="#channels">公众号</a>
          <a href="#works">作品</a>
        </nav>
      </header>

      <section className="hero-section" id="home">
        <div className="hero-grid">
          <div className="hero-copy" data-reveal>
            <p className="eyebrow">HELLO, I&apos;M CAO JIANG</p>
            <h1>
              你好
              <br />
              我是
              <br />
              <span>曹将</span>
            </h1>
            <p className="hero-lede">
              写了14年文章，出过两本书，研究AI，擅长表达，下面是我的一些作品。
            </p>
            <a className="scroll-cue" href="#highlights">
              <ArrowDown aria-hidden="true" size={18} />
              <span>认识我做过的事</span>
            </a>
          </div>

          <div className="hero-visual" data-reveal>
            <div className="hero-disc disc-red" aria-hidden="true" />
            <div className="hero-disc disc-green" aria-hidden="true" />
            <div className="hero-grid-lines" aria-hidden="true" />
            <img
              className="hero-person"
              src="/editorial/xigua-teacher-halfbody-cutout.png"
              alt="戴着西瓜帽、穿白色外套的西瓜老师"
              width={702}
              height={1200}
              fetchPriority="high"
            />
          </div>
        </div>
      </section>

      <section className="highlights-section" id="highlights">
        <div className="section-heading light-heading" data-reveal>
          <p className="eyebrow">先看重点</p>
          <h2>这些，是我持续在做的事。</h2>
        </div>

        <div className="highlight-rail" data-reveal>
          <article className="highlight-card highlight-books">
            <span className="highlight-number">02</span>
            <BookOpen aria-hidden="true" size={28} />
            <h3>两本书</h3>
            <p>学习方法与表达呈现。</p>
          </article>
          <article className="highlight-card highlight-ai">
            <span className="highlight-number">AI</span>
            <Users aria-hidden="true" size={28} />
            <h3>AI 新手村</h3>
            <p>从第一次尝试，到真正完成一件事。</p>
          </article>
          <article className="highlight-card highlight-write">
            <span className="highlight-number">∞</span>
            <MessageCircle aria-hidden="true" size={28} />
            <h3>持续写作</h3>
            <p>公众号和小红书，都叫「曹将」。</p>
          </article>
          <article className="highlight-card highlight-product">
            <span className="highlight-number">01</span>
            <Radio aria-hidden="true" size={28} />
            <h3>独立作品</h3>
            <p>把日子说给自己听。</p>
          </article>
        </div>
      </section>

      <section className="statement-section">
        <div className="statement-inner" data-reveal>
          <p className="eyebrow">我关心的事</p>
          <h2>
            让学习，
            <br />
            <span>真正发生。</span>
          </h2>
          <p>
            从读一本书、做一页 PPT，到尝试一种新工具，
            我更关心的不是知道了多少，而是能不能把它变成行动、作品和自己的经验。
          </p>
        </div>
      </section>

      <section className="chapter books-section" id="books">
        <div className="chapter-heading" data-reveal>
          <p className="eyebrow">01 / 出版作品</p>
          <h2>
            把经验，
            <br />
            写成可以带走的方法。
          </h2>
        </div>

        <div className="book-stage" data-reveal>
          <article className="book-item book-item-green">
            <div className="book-cover-wrap">
              <img
                className="book-cover"
                src="/editorial/book-efficient-learning.jpg"
                alt="《高效学习：曹将的公开课》书封"
                width={330}
                height={495}
                loading="lazy"
              />
            </div>
            <div className="book-copy">
              <p>清华大学出版社 · 2022</p>
              <h3>《高效学习：曹将的公开课》</h3>
              <span>
                从绘制学习地图，到阅读、听课、偷师、实践与知识管理，一套面向职场人的系统学习策略。
              </span>
              <ExternalLink href={links.efficientLearning}>
                查看这本书
              </ExternalLink>
            </div>
          </article>

          <article className="book-item book-item-yellow">
            <div className="book-cover-wrap">
              <img
                className="book-cover"
                src="/editorial/book-ppt.jpg"
                alt="《PPT炼成记》书封"
                width={370}
                height={500}
                loading="lazy"
              />
            </div>
            <div className="book-copy">
              <p>中国青年出版社 · 2014</p>
              <h3>《PPT炼成记》</h3>
              <span>
                从文字、图片、颜色和图表，到动画、版式与模板，完整拆解一份 PPT 如何被炼成。
              </span>
              <ExternalLink href={links.pptBook}>查看这本书</ExternalLink>
            </div>
          </article>
        </div>
      </section>

      <section className="chapter village-section" id="village">
        <div className="village-intro">
          <div className="village-copy" data-reveal>
            <p className="eyebrow">02 / 知识星球</p>
            <h2>
              零基础，
              <br />
              <span>也能快速上手 AI。</span>
            </h2>
            <p>
              从一门系统课程开始，跟着真实案例练习，再把独家资料带回自己的工作与生活。
              不需要技术背景，也不必一次学会所有工具。
            </p>
            <ExternalLink href={links.aiVillage} className="primary-link">
              加入 AI 新手村
            </ExternalLink>
          </div>

          <div className="village-proof" data-reveal>
            <div className="village-stats" aria-label="AI 新手村内容规模">
              <div>
                <strong>100+</strong>
                <span>新手系统课程</span>
              </div>
              <div>
                <strong>100+</strong>
                <span>可复制案例</span>
              </div>
              <div>
                <strong>20+</strong>
                <span>独家资料</span>
              </div>
            </div>

            <a
              className="village-qr-card"
              href={links.aiVillage}
              target="_blank"
              rel="noreferrer"
              aria-label="微信扫码或点击加入 AI 新手村"
            >
              <div className="village-qr-copy">
                <p>AI 新手村</p>
                <h3>扫码加入，<br />从第一次实践开始。</h3>
                <span>
                  微信扫一扫
                  <ArrowUpRight aria-hidden="true" size={18} strokeWidth={2.2} />
                </span>
              </div>
              <div className="village-qr-image">
                <img
                  src="/ai-village-qr.png"
                  alt="AI 新手村加入二维码"
                  width={978}
                  height={976}
                  loading="lazy"
                />
              </div>
            </a>
          </div>
        </div>

        <div
          className="village-scenes"
          data-reveal
          aria-label="AI 新手村应用场景"
        >
          <span>办公提效</span>
          <span>知识管理</span>
          <span>创意产出</span>
          <span>生活提质</span>
          <span>个人成长</span>
        </div>

        <div className="village-gallery" data-reveal>
          <figure className="village-gallery-item village-gallery-cover">
            <img
              src="/editorial/ai-village-casebook-cover.png"
              alt="AI 实践案例集封面"
              width={2880}
              height={4160}
              loading="lazy"
            />
            <figcaption>AI 实践案例集</figcaption>
          </figure>
          <figure className="village-gallery-item village-gallery-course">
            <img
              src="/editorial/ai-village-course-map.png"
              alt="AI 新手课内容一览图"
              width={1054}
              height={1492}
              loading="lazy"
            />
            <figcaption>AI 新手课 · 一览图</figcaption>
          </figure>
          <figure className="village-gallery-item village-gallery-cases">
            <img
              src="/editorial/ai-village-cases-map.png"
              alt="AI 真实案例内容一览图"
              width={1054}
              height={1492}
              loading="lazy"
            />
            <figcaption>AI 真实案例 · 一览图</figcaption>
          </figure>
        </div>

        <div className="village-case-showcase" data-reveal>
          <div className="village-case-heading">
            <p className="eyebrow">案例与独家资料</p>
            <h3>
              从具体内容，
              <br />
              看见 AI 怎么用。
            </h3>
            <p>课程之外，还可以带走专题手册、提示词库和持续更新的真实案例。</p>
          </div>

          <div className="village-case-rail" aria-label="AI 新手村案例与独家资料">
            <figure>
              <img
                src="/editorial/ai-village-resource-hr-ai.jpg"
                alt="《HR AI启发》知识卡片手册"
                width={1400}
                height={1980}
                loading="lazy"
              />
              <figcaption>《HR AI启发》知识卡片手册</figcaption>
            </figure>
            <figure>
              <img
                src="/editorial/ai-village-resource-codex.jpg"
                alt="《Codex橙皮书》知识卡片手册"
                width={1400}
                height={1980}
                loading="lazy"
              />
              <figcaption>《Codex橙皮书》知识卡片手册</figcaption>
            </figure>
            <figure>
              <img
                src="/editorial/ai-village-resource-chatgpt-prompts.jpg"
                alt="ChatGPT图片提示词库"
                width={1400}
                height={1980}
                loading="lazy"
              />
              <figcaption>ChatGPT 图片提示词库</figcaption>
            </figure>
            <figure>
              <img
                src="/editorial/ai-village-cases-20260706.jpg"
                alt="AI新手村优秀案例 2026年7月6日至7月12日"
                width={1400}
                height={1980}
                loading="lazy"
              />
              <figcaption>AI 新手村优秀案例 · 07.06—07.12</figcaption>
            </figure>
            <figure>
              <img
                src="/editorial/ai-village-cases-20260713.jpg"
                alt="AI新手村优秀案例 2026年7月13日至7月19日"
                width={1400}
                height={1980}
                loading="lazy"
              />
              <figcaption>AI 新手村优秀案例 · 07.13—07.19</figcaption>
            </figure>
            <figure>
              <img
                src="/editorial/ai-village-cases-20260720.jpg"
                alt="AI新手村优秀案例 2026年7月20日至7月26日"
                width={1400}
                height={1981}
                loading="lazy"
              />
              <figcaption>AI 新手村优秀案例 · 07.20—07.26</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="chapter channels-section" id="channels">
        <div className="chapter-heading channels-heading" data-reveal>
          <p className="eyebrow">03 / 微信公众号「曹将」</p>
          <h2>
            从 2014，
            <br />
            一直写到今天。
          </h2>
        </div>

        <div className="article-feature-grid">
          <article className="wechat-intro" data-reveal>
            <div className="channel-title">
              <MessageCircle aria-hidden="true" size={27} />
              <div>
                <p>微信公众号</p>
                <h3>曹将</h3>
              </div>
            </div>
            <p className="wechat-count">
              <strong>1947</strong>
              <span>篇文章</span>
            </p>
            <p className="channel-description">
              写学习、表达、职场、工具，也写一路走来的选择与变化。长文章，是我整理经验和回答问题的主要方式。
            </p>
            <div className="wechat-qr">
              <img
                src="/wechat-caojiang-qr.png"
                alt="微信公众号曹将二维码"
                width={906}
                height={890}
                loading="lazy"
              />
              <strong>微信扫一扫，关注公众号「曹将」</strong>
            </div>
          </article>

          <div className="article-cloud-wrap" data-reveal>
            <div className="article-cloud-heading">
              <p className="eyebrow">代表长文</p>
            </div>
            <div className="article-cloud" aria-label="曹将公众号代表长文">
              {featuredArticles.map((article) => (
                <a
                  className={`article-cloud-link article-size-${article.size}`}
                  href={article.href}
                  target="_blank"
                  rel="noreferrer"
                  key={article.href}
                  aria-label={`${article.title}，${article.year} 年，${article.length}，打开微信原文`}
                >
                  <span>{article.title}</span>
                  <small>
                    {article.year} · {article.topic} · {article.length}
                  </small>
                  <ArrowUpRight aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="xiaohongshu-section">
        <article className="xiaohongshu-panel xiaohongshu-panel-wide" data-reveal>
          <div className="xiaohongshu-copy">
            <div className="channel-title">
              <Sparkles aria-hidden="true" size={27} />
              <div>
                <p>小红书</p>
                <h3>曹将</h3>
              </div>
            </div>
            <p className="channel-description">
              把职场方法、知识管理、阅读与实用工具，拆成更轻巧、更直观的一页。
              <br />
              小红书搜索「曹将」，就能找到我。
            </p>
            <div className="xiaohongshu-stats" aria-label="小红书账号数据">
              <span>
                <strong>6222</strong>
                粉丝
              </span>
              <span>
                <strong>4.2万</strong>
                获赞与收藏
              </span>
              <span>
                <strong>105</strong>
                关注
              </span>
            </div>
          </div>
          <figure className="xiaohongshu-art">
            <img
              src="/editorial/xiaohongshu-handdrawn-v2.png"
              alt="西瓜老师与计划本、知识卡片、书和演示板组成的手绘插画"
              width={1536}
              height={1024}
              loading="lazy"
            />
            <figcaption>
              <span>知识卡片</span>
              <span>职场方法</span>
              <span>阅读与工具</span>
            </figcaption>
          </figure>
        </article>
      </section>

      <section className="chapter echo-section" id="works">
        <div className="echo-visual" data-reveal>
          <div className="browser-frame">
            <div className="browser-bar" aria-hidden="true">
              <i />
              <i />
              <i />
              <span>huishengriji.cn</span>
            </div>
            <img
              src="/editorial/echo-journal-screen-v3.png"
              alt="回声日记网页界面"
              width={3006}
              height={1610}
              loading="lazy"
            />
          </div>
        </div>
        <div className="echo-copy" data-reveal>
          <p className="eyebrow">04 / 独立作品</p>
          <h2>
            听见
            <br />
            自己，
            <br />
            也听见
            <br />
            时间的回声。
          </h2>
          <p>
            回声日记围绕对话记录与自我回望展开。
            不必先把一切想清楚，从此刻的一件小事开始，把今天慢慢写成一页。
          </p>
          <ExternalLink href={links.echoJournal} className="primary-link light-link">
            打开回声日记
          </ExternalLink>
        </div>
      </section>

      <section className="chapter xiaobot-section">
        <div className="xiaobot-copy" data-reveal>
          <p className="eyebrow">05 / 小报童专栏</p>
          <h2>
            把结构化表达，
            <br />
            练进真实职场。
          </h2>
          <p>
            《如何提升结构化表达能力》覆盖竞聘演讲、年终总结、研究报告、会议纪要等
            30+ 个常见场景，用 40+ 篇内容拆解案例，并提供可复用的写作模板。
          </p>
          <div className="xiaobot-stats" aria-label="专栏内容概览">
            <span>
              <strong>30+</strong>
              职场场景
            </span>
            <span>
              <strong>40+</strong>
              篇内容
            </span>
            <span>
              <strong>可复用</strong>
              写作模板
            </span>
          </div>
          <ExternalLink href={links.xiaobot} className="primary-link">
            查看小报童专栏
          </ExternalLink>
        </div>

        <div className="xiaobot-phone" data-reveal>
          <div className="phone-speaker" aria-hidden="true" />
          <img
            src="/editorial/xiaobot-column.png"
            alt="《如何提升结构化表达能力》小报童专栏目录"
            width={780}
            height={5648}
            loading="lazy"
          />
        </div>
      </section>

      <section className="closing-section">
        <div className="closing-portrait" aria-hidden="true">
          <img
            src="/editorial/xigua-teacher-halfbody-cutout.png"
            alt=""
            width={702}
            height={1200}
            loading="lazy"
          />
        </div>
        <div className="closing-copy" data-reveal>
          <h2>
            岁月本长，
            <br />
            忙着自促。
          </h2>
          <p>
            欢迎你从下面任何一个入口加入。
            <br />
            一起前行，共同成长。
          </p>
          <div className="closing-links">
            <ExternalLink href={links.aiVillage}>AI 新手村</ExternalLink>
            <ExternalLink href={links.echoJournal}>回声日记</ExternalLink>
            <ExternalLink href={links.xiaobot}>结构化表达专栏</ExternalLink>
          </div>
        </div>
      </section>

      <footer className="footer">
        <span>曹将</span>
        <span>学习 · 表达 · 职场 · AI 实践</span>
      </footer>
    </main>
  );
}
