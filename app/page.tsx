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
          <a href="#channels">关注我</a>
          <a href="#works">作品</a>
        </nav>
      </header>

      <section className="hero-section" id="home">
        <div className="hero-grid">
          <div className="hero-copy" data-reveal>
            <p className="eyebrow">HELLO, I&apos;M CAO JIANG</p>
            <h1>
              你好，
              <br />
              我是<span>曹将</span>。
            </h1>
            <p className="hero-lede">
              我写作、做产品，
              <br />
              也一直在研究怎样把复杂的事情讲清楚。
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
              src="/editorial/xigua-fullbody-v2.png"
              alt="戴着西瓜帽、穿白色外套的西瓜老师"
              width={1024}
              height={1536}
              fetchPriority="high"
            />
            <span className="hero-caption">西瓜老师</span>
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
        <div className="village-copy" data-reveal>
          <p className="eyebrow">02 / 知识星球</p>
          <h2>
            AI 新手，
            <br />
            也可以慢慢进村。
          </h2>
          <p>
            AI 新手村为刚开始使用 AI 的人准备。这里不追逐抽象概念，
            从工具入门、真实任务到经验交流，一起把 AI 用进日常工作。
          </p>
          <ExternalLink href={links.aiVillage} className="primary-link">
            加入 AI 新手村
          </ExternalLink>
        </div>
        <div className="village-visual" data-reveal>
          <img
            src="/editorial/ai-village-editorial.png"
            alt="西瓜老师在桌前介绍 AI 学习方法的三维场景"
            width={1672}
            height={941}
            loading="lazy"
          />
        </div>
      </section>

      <section className="chapter channels-section" id="channels">
        <div className="chapter-heading channels-heading" data-reveal>
          <p className="eyebrow">03 / 持续写作</p>
          <h2>
            长文章，认真写。
            <br />
            小发现，轻轻记。
          </h2>
        </div>

        <div className="channels-grid">
          <article className="wechat-panel" data-reveal>
            <div className="channel-title">
              <MessageCircle aria-hidden="true" size={27} />
              <div>
                <p>微信公众号</p>
                <h3>曹将</h3>
              </div>
            </div>
            <p className="channel-description">
              记录学习、表达、职场与 AI 实践。长文章，是我整理经验和回答问题的主要方式。
            </p>
            <div className="qr-stage">
              <img
                src="/wechat-caojiang-qr.png"
                alt="微信公众号曹将二维码"
                width={906}
                height={890}
                loading="lazy"
              />
            </div>
            <strong className="scan-label">微信扫一扫，关注公众号「曹将」</strong>
          </article>

          <article className="xiaohongshu-panel" data-reveal>
            <div className="channel-title">
              <Sparkles aria-hidden="true" size={27} />
              <div>
                <p>小红书</p>
                <h3>曹将</h3>
              </div>
            </div>
            <div className="redbook-display" aria-hidden="true">
              <span>学习</span>
              <span>工具</span>
              <span>阅读</span>
              <span>工作</span>
              <b>曹将</b>
            </div>
            <p className="channel-description">
              把方法拆成更轻巧、更直观的一页。小红书搜索「曹将」，就能找到我。
            </p>
          </article>
        </div>
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
              src="/editorial/echo-journal-screen-v2.png"
              alt="回声日记网页界面"
              width={1440}
              height={980}
              loading="lazy"
            />
          </div>
        </div>
        <div className="echo-copy" data-reveal>
          <p className="eyebrow">04 / 独立作品</p>
          <h2>
            听见自己，
            <br />
            也听见时间的回声。
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
        <div className="closing-mark" aria-hidden="true">
          曹
        </div>
        <div className="closing-copy" data-reveal>
          <p className="eyebrow">很高兴认识你</p>
          <h2>
            继续学习，
            <br />
            继续表达。
          </h2>
          <p>这里是曹将。也欢迎你从任何一个入口，继续认识我。</p>
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
