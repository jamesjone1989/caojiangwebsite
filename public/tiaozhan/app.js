(function () {
  "use strict";

  const chapter = window.STORY_CHAPTER;
  const root = document.getElementById("story-root");
  const liveRegion = document.getElementById("live-region");
  const STORAGE_KEY = "xigua-workplace-story-v1";
  const SCREENS = new Set(["intro", "event", "travel", "mentor", "choice", "resolution", "map", "result"]);

  const iconPaths = {
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    map: '<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z"/><path d="M9 3v15M15 6v15"/>',
    door: '<path d="M13 4h3a2 2 0 0 1 2 2v14"/><path d="M2 20h3M13 20h9M10 12v.01"/><path d="M13 20V2.8a1 1 0 0 0-1.2-1L5.8 3A1 1 0 0 0 5 4v16"/>',
    message: '<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/>',
    briefcase: '<rect width="20" height="14" x="2" y="7" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M12 12v.01M2 13a18 18 0 0 0 20 0"/>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    check: '<path d="m20 6-11 11-5-5"/>',
    rotate: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>',
  };

  function icon(name, label) {
    return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${label ? `role="img" aria-label="${escapeHtml(label)}"` : 'aria-hidden="true"'}>${iconPaths[name] || iconPaths.arrow}</svg>`;
  }

  function defaultState() {
    return { screen: "intro", currentLevel: 0, completed: [], unlocked: 1, answers: {} };
  }

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!parsed || !SCREENS.has(parsed.screen)) return defaultState();
      const completed = Array.isArray(parsed.completed)
        ? parsed.completed.filter((id) => chapter.levels.some((level) => level.id === id))
        : [];
      const answers = {};
      chapter.levels.forEach((level) => {
        const answerId = parsed.answers && parsed.answers[level.id];
        if (level.options.some((option) => option.id === answerId)) answers[level.id] = answerId;
      });
      const migratedUnlocked = Math.min(chapter.levels.length, completed.length + 1);
      const restoredScreen = parsed.screen === "result" && completed.length < chapter.levels.length ? "map" : parsed.screen;
      return {
        screen: restoredScreen,
        currentLevel: Math.max(0, Math.min(chapter.levels.length - 1, Number(parsed.currentLevel) || 0)),
        completed,
        unlocked: Math.max(1, migratedUnlocked, Math.min(chapter.levels.length, Number(parsed.unlocked) || 1)),
        answers,
      };
    } catch (_error) {
      return defaultState();
    }
  }

  let state = loadState();

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function currentLevel() {
    return chapter.levels[state.currentLevel];
  }

  function getScore() {
    return chapter.levels.reduce((total, level) => {
      const answer = level.options.find((option) => option.id === state.answers[level.id]);
      return total + (answer && answer.isCorrect ? 5 : 0);
    }, 0);
  }

  function announce(message) {
    liveRegion.textContent = "";
    window.setTimeout(() => { liveRegion.textContent = message; }, 30);
  }

  function screenHeader(kicker, title, showMap) {
    return `<header class="topbar">
      <a class="wordmark" href="#" data-action="home" aria-label="${showMap ? "返回挑战地图" : "回到故事开头"}"><span>西瓜</span><b>职场新人挑战地图</b></a>
      <div class="topbar-title"><span>${escapeHtml(kicker)}</span><strong>${escapeHtml(title)}</strong></div>
      ${showMap ? `<button class="icon-button" type="button" data-action="home">${icon("map")}<span>挑战地图</span></button>` : '<span class="topbar-blank" aria-hidden="true"></span>'}
    </header>`;
  }

  function dialogueList(dialogues) {
    return `<div class="dialogue-list">${dialogues.map((line, index) => `
      <div class="dialogue-line ${line.speaker === "旁白" ? "narrator" : ""}" style="--delay:${index * 140}ms">
        <span>${escapeHtml(line.speaker)}</span><p>${escapeHtml(line.text)}</p>
      </div>`).join("")}</div>`;
  }

  function sentenceParts(text) {
    const parts = String(text || "").match(/[^。！？；]+[。！？；]?/g) || [];
    return parts.map((part) => part.trim()).filter(Boolean);
  }

  function mentorBreakdown(level) {
    return `<section class="mentor-breakdown" aria-label="西瓜老师给新人的详细拆解">
      <span>给新人的三步拆解</span>
      <ol>
        <li><b>先看问题</b><p>${escapeHtml(level.feedback.wrong)}</p></li>
        <li><b>再做动作</b><p>${escapeHtml(level.principle)}</p></li>
        <li><b>可以这样说</b><p class="mentor-script">${escapeHtml(level.template)}</p></li>
      </ol>
    </section>`;
  }

  function comicPanel(level, type) {
    const baseDialogues = type === "mentor" ? level.mentorDialogue : level.eventDialogue;
    const dialogues = type === "mentor"
      ? [...baseDialogues, { speaker: "西瓜老师", text: `先记住这个判断顺序：${level.principle}` }]
      : baseDialogues;
    const imagePath = type === "mentor" ? level.mentorImage : level.eventImage;
    const label = type === "mentor" ? `西瓜老师与小明面对面分析「${level.toolName}」` : `${level.location.name}里的办公室事件`;
    const speakerClass = (speaker) => {
      if (speaker === "小明") return "speaker-xiaoming";
      if (speaker === "西瓜老师") return "speaker-mentor";
      if (speaker === "旁白") return "speaker-narrator";
      if (speaker === "系统") return "speaker-system";
      return "speaker-partner";
    };
    return `<figure class="comic-panel comic-${type}" aria-label="${escapeHtml(label)}">
      <img class="comic-panel-image" src="${escapeHtml(imagePath)}" alt="${escapeHtml(label)}" />
      <figcaption class="comic-frame-label"><span>${escapeHtml(level.day)}</span><strong>${type === "mentor" ? "西瓜老师办公室" : escapeHtml(level.location.name)}</strong></figcaption>
      <div class="scene-dialogue-list" aria-label="对话内容">
        ${dialogues.map((line, index) => `<p class="scene-dialogue ${speakerClass(line.speaker)}" style="--delay:${index * 150}ms">
          <strong>${escapeHtml(line.speaker)}：</strong><span>${escapeHtml(line.text)}</span>
        </p>`).join("")}
      </div>
    </figure>`;
  }

  function locationDecor(level) {
    const scene = level.location.sceneClass;
    if (scene === "meeting") {
      return '<div class="whiteboard meeting-board"><i></i><i></i><b>ACTION?</b></div><div class="meeting-table"></div><div class="chair chair-a"></div><div class="chair chair-b"></div><div class="chair chair-c"></div>';
    }
    if (scene === "activity") {
      return '<div class="pinboard"><b>NEW HIRE DAY</b><i></i><i></i></div><div class="supply-box box-one">物料</div><div class="supply-box box-two">名牌</div><div class="standing-board">流程<br>？？？</div>';
    }
    if (scene === "invite") {
      return '<div class="calendar"><b>WED</b><strong>14:00</strong><span>人才发展研讨会</span></div><div class="scene-desk"><div class="laptop"><span>写一封邀请…</span></div></div><div class="office-plant"></div>';
    }
    if (scene === "system") {
      return '<div class="system-screen"><span>采购系统</span><b>审批链缺失</b><i>!</i></div><div class="scene-desk system-desk"></div><div class="manual-stack"><span>操作手册</span><span>常见问题</span></div>';
    }
    return '<div class="window-grid"><i></i><i></i><i></i></div><div class="scene-desk"><div class="monitor"><span>新员工培训方案</span></div><div class="coffee-cup"></div></div><div class="leader-note">下周跟进一下</div>';
  }

  function eventScene(level) {
    const hasBoss = level.eventDialogue.some((line) => line.speaker === "领导");
    const isWorkstation = level.location.id === "desk";
    return `<div class="illustrated-scene event-illustration location-${escapeHtml(level.location.sceneClass)} ${isWorkstation ? "ai-workstation" : ""} ${hasBoss ? "has-boss" : ""}">
      ${isWorkstation ? '<img class="scene-background" src="assets/images/xiaoming-workstation.webp" alt="" aria-hidden="true" />' : locationDecor(level)}
      <div class="scene-label"><span>${escapeHtml(level.day)}</span><strong>${escapeHtml(level.location.name)}</strong></div>
      ${hasBoss ? '<img class="character event-boss" src="assets/images/boss.webp" alt="老板正在向小明交代任务" />' : ""}
      <img class="character xiaoming event-character ${hasBoss ? "face-left" : ""}" src="assets/images/xiaoming.webp" alt="小明站在${escapeHtml(level.location.name)}${hasBoss ? "，正面向老板" : ""}" />
      <div class="thought-mark" aria-hidden="true"><i></i><i></i><b>?</b></div>
    </div>`;
  }

  function mentorOffice(level, compact) {
    return `<div class="illustrated-scene mentor-office ${compact ? "compact-office" : ""}">
      <img class="scene-background" src="assets/images/xigua-office.webp" alt="" aria-hidden="true" />
      <div class="door-sign">西瓜老师办公室</div>
      <img class="character teacher" src="assets/images/xigua-teacher.webp" alt="西瓜老师在左侧，正面向小明" />
      <img class="character xiaoming office-xiaoming" src="assets/images/xiaoming.webp" alt="小明在右侧，正面向西瓜老师" />
      <div class="office-topic"><span>CHALLENGE ${escapeHtml(level.number)}</span><strong>${escapeHtml(level.toolName)}</strong></div>
    </div>`;
  }

  function renderIntro() {
    root.innerHTML = `<section class="intro-screen" aria-labelledby="screen-title">
      <div class="intro-copy">
        <div class="issue-tag"><span>NEW HIRE STORY</span><b>入职第一天</b></div>
        <p class="intro-eyebrow">一部可以「玩」的职场成长绘本</p>
        <h1 id="screen-title"><span>小明的</span><br>职场成长地图</h1>
        <p class="intro-lead">从第一天接任务，到第一年处理复杂协作。<br>二十次挑战，二十个能带回现场的方法。</p>
        <div class="intro-stats" aria-label="学习内容"><span><b>20</b>办公室挑战</span><span><b>04</b>成长阶段</span></div>
        <button class="primary-button" type="button" data-action="start-story"><span>开始职场成长之旅</span>${icon("arrow")}</button>
        ${state.completed.length ? '<button class="text-button" type="button" data-action="home">继续上次的职场挑战</button>' : ""}
      </div>
      <div class="intro-art" aria-label="小明第一天来到办公室">
        <div class="office-building"><span>WELCOME<br>ON BOARD</span><i></i><i></i><i></i></div>
        <div class="red-arrow" aria-hidden="true"></div>
        <img src="assets/images/xiaoming.webp" alt="头上长着绿色小芽的新人小明" />
        <blockquote>「我会努力的。可是……第一步应该做什么？」</blockquote>
        <span class="day-stamp">MON<br>09:00</span>
      </div>
    </section>`;
  }

  function renderEvent() {
    const level = currentLevel();
    root.innerHTML = `<section class="story-screen" aria-labelledby="screen-title">
      ${screenHeader(level.day, `挑战 ${level.number} / 20`, true)}
      <div class="story-split comic-story-layout">
        ${comicPanel(level, "event")}
        <article class="story-panel">
          <div class="chapter-index"><span>OFFICE EVENT</span><b>${escapeHtml(level.number)}</b></div>
          <p class="dimension-label">${escapeHtml(level.dimension)}训练</p>
          <h1 id="screen-title">${escapeHtml(level.title)}</h1>
          <p class="comic-page-note">看完这一格，再决定小明的下一步。</p>
          <button class="primary-button" type="button" data-action="go-mentor"><span>去找西瓜老师</span>${icon("door")}</button>
        </article>
      </div>
    </section>`;
  }

  function renderTravel() {
    const level = currentLevel();
    root.innerHTML = `<section class="travel-screen" aria-labelledby="screen-title">
      ${screenHeader("办公室路线", `挑战 ${level.number} / 20`, true)}
      <div class="corridor">
        <div class="corridor-lines" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
        <span class="from-sign">${escapeHtml(level.location.name)}</span>
        <div class="walking-xiaoming"><img src="assets/images/xiaoming.webp" alt="小明正走向西瓜老师办公室" /></div>
        <div class="mentor-door"><span>ROOM 101</span><strong>西瓜老师</strong><i></i></div>
        <div class="footsteps" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
      </div>
      <div class="travel-caption"><p>遇到问题，不是只能一个人猜。</p><h1 id="screen-title">走，去走廊尽头。</h1><button class="primary-button" type="button" data-action="enter-office"><span>敲门</span>${icon("door")}</button></div>
    </section>`;
  }

  function renderMentor() {
    const level = currentLevel();
    root.innerHTML = `<section class="story-screen" aria-labelledby="screen-title">
      ${screenHeader("西瓜老师办公室", `挑战 ${level.number} / 20`, true)}
      <div class="story-split mentor-split comic-story-layout">
        ${comicPanel(level, "mentor")}
        <article class="story-panel mentor-panel">
          <div class="chapter-index"><span>MENTOR TALK</span><b>${escapeHtml(level.number)}</b></div>
          <p class="dimension-label">把问题变成下一步</p>
          <h1 id="screen-title">西瓜老师怎么看？</h1>
          <p class="comic-page-note">不用一次记住所有道理，先按下面三步判断。</p>
          ${mentorBreakdown(level)}
          <button class="primary-button" type="button" data-action="open-choice"><span>我想好怎么做了</span>${icon("message")}</button>
        </article>
      </div>
    </section>`;
  }

  function renderChoice() {
    const level = currentLevel();
    root.innerHTML = `<section class="choice-screen" aria-labelledby="screen-title">
      ${screenHeader(level.toolName, `挑战 ${level.number} / 20`, true)}
      <div class="choice-layout">
        <aside>${mentorOffice(level, true)}<blockquote>「不用猜标准答案。选那个更能降低协作成本的做法。」</blockquote></aside>
        <article>
          <span class="choice-kicker">YOUR TURN · 轮到你了</span>
          <h1 id="screen-title">${escapeHtml(level.question)}</h1>
          <div class="option-list" role="group" aria-label="请选择处理方式">
            ${level.options.map((option, index) => `<button class="option-button" type="button" data-action="select-option" data-option-id="${escapeHtml(option.id)}"><span class="option-letter">${String.fromCharCode(65 + index)}</span><span class="option-copy"><strong>${escapeHtml(option.title)}</strong><span class="option-detail-label">具体做法</span><ul>${sentenceParts(option.body).map((part) => `<li>${escapeHtml(part)}</li>`).join("")}</ul></span>${icon("arrow")}</button>`).join("")}
          </div>
          <p class="choice-note">每个选择都会获得西瓜老师的具体点评。</p>
        </article>
      </div>
    </section>`;
  }

  function renderResolution() {
    const level = currentLevel();
    const selected = level.options.find((option) => option.id === state.answers[level.id]);
    if (!selected) {
      state.screen = "choice";
      render();
      return;
    }
    const isCorrect = selected.isCorrect;
    const isLast = state.currentLevel === chapter.levels.length - 1;
    root.innerHTML = `<section class="resolution-screen ${isCorrect ? "is-correct" : "is-wrong"}" aria-labelledby="screen-title">
      ${screenHeader("西瓜老师的复盘", `职场力 ${getScore()} / 100`, true)}
      <div class="resolution-hero">
        <div class="verdict-stamp"><span>${isCorrect ? "GOOD CALL" : "TRY AGAIN"}</span><strong>${isCorrect ? "+5" : "+0"}</strong><small>职场力</small></div>
        <div><p>${isCorrect ? "判断清晰" : "再想一步"}</p><h1 id="screen-title">${escapeHtml(level.toolName)}</h1><blockquote>${escapeHtml(isCorrect ? level.feedback.correct : level.feedback.wrong)}</blockquote></div>
        <img src="assets/images/xigua-teacher.webp" alt="西瓜老师正在复盘这次选择" />
      </div>
      <div class="knowledge-layout">
        <section class="principle-card"><span>01 · 通关口诀</span><h2>${escapeHtml(level.principle)}</h2><div class="marker-line"></div></section>
        <section class="template-card"><span>02 · 直接套用</span><h2>下次可以这样说</h2><pre>${escapeHtml(level.template)}</pre></section>
      </div>
      ${level.sensitiveNote ? `<aside class="sensitive-note"><span>边界提醒</span><p>${escapeHtml(level.sensitiveNote)}</p></aside>` : ""}
      ${state.currentLevel === 0 ? '<p class="mentor-closing">「以后遇到类似问题，随时过来找我。」<span>—— 西瓜老师</span></p>' : ""}
      <footer class="resolution-footer"><div><span>已完成 ${state.completed.length} / 20 个挑战</span><div class="mini-progress"><i style="width:${state.completed.length * 5}%"></i></div></div><button class="primary-button" type="button" data-action="finish-level"><span>${isLast ? "查看职场成长手册" : "回到挑战地图"}</span>${icon(isLast ? "book" : "map")}</button></footer>
    </section>`;
  }

  function renderMap() {
    const score = getScore();
    const stageRows = chapter.stages.map((stage) => {
      const stageLevels = chapter.levels
        .map((level, index) => ({ level, index }))
        .filter(({ level }) => level.stageId === stage.id);
      const completedCount = stageLevels.filter(({ level }) => state.completed.includes(level.id)).length;
      return `<section class="journey-stage" aria-labelledby="stage-${escapeHtml(stage.id)}">
        <header><span>${escapeHtml(stage.number)}</span><div><small>${escapeHtml(stage.timeLabel)}</small><h2 id="stage-${escapeHtml(stage.id)}">${escapeHtml(stage.title)}</h2></div><b>${completedCount} / ${stageLevels.length}</b></header>
        <div class="stage-track">
          ${stageLevels.map(({ level, index }) => {
            const unlocked = index < state.unlocked;
            const completed = state.completed.includes(level.id);
            return `<button class="map-node ${completed ? "completed" : unlocked ? "unlocked" : "locked"}" type="button" data-action="select-level" data-level-index="${index}" ${unlocked ? "" : "disabled"} aria-label="${escapeHtml(level.number)} ${escapeHtml(level.location.name)}：${escapeHtml(level.title)}${completed ? "，已完成" : unlocked ? "，可挑战" : "，未解锁"}">
              <span class="node-number">${completed ? icon("check") : unlocked ? level.number : icon("lock")}</span><span class="node-copy"><b>${escapeHtml(level.location.name)}</b><small>${escapeHtml(level.location.short)}</small></span><i class="status-stamp">${completed ? "DONE" : unlocked ? "OPEN" : "LOCKED"}</i>
            </button>`;
          }).join("")}
        </div>
      </section>`;
    }).join("");
    root.innerHTML = `<section class="map-screen" aria-labelledby="screen-title">
      ${screenHeader("职场成长地图", `已完成 ${state.completed.length} / 20`, false)}
      <div class="map-intro"><div><span>OFFICE CHALLENGE MAP · 20 LEVELS</span><h1 id="screen-title">小明的挑战地图</h1><p>四个阶段，二十个真实职场问题。<br>沿着时间线逐一完成，下一站才会打开。</p></div><div class="map-score"><span>CAREER YEAR 01</span><strong>${score}</strong><small>/ 100 职场力</small></div></div>
      <div class="office-map journey-map">${stageRows}<img class="map-xiaoming" src="assets/images/xiaoming.webp" alt="小明正在职场成长地图上继续前进" /></div>
      <footer class="map-footer"><p>${state.completed.length === chapter.levels.length ? "二十个挑战全部完成，可以查看职场成长手册了。" : "黄色节点表示下一个可以挑战的地点。"}</p><div>${state.completed.length === chapter.levels.length ? `<button class="secondary-button" type="button" data-action="show-result">${icon("book")}<span>查看成长手册</span></button>` : ""}<button class="text-button" type="button" data-action="restart">${icon("rotate")}<span>重新开始</span></button></div></footer>
    </section>`;
  }

  function renderResult() {
    root.innerHTML = `<section class="result-screen" aria-labelledby="screen-title">
      ${screenHeader("职场第一年·已通关", `职场力 ${getScore()} / 100`, true)}
      <div class="result-hero"><div><span>20 CHALLENGES · COMPLETED</span><p>小明的职场成长手册</p><h1 id="screen-title">从新人<br><b>到靠谱伙伴。</b></h1><blockquote>专业不是一开始什么都会，而是在每一次任务、反馈和复杂协作中，都能把问题变成下一步。</blockquote></div><div class="result-portrait"><img src="assets/images/xiaoming.webp" alt="完成二十个挑战的小明"/><span>${getScore()}<small>/100</small></span><b>独立协作</b></div></div>
      <section class="handbook" aria-labelledby="handbook-title"><div class="handbook-heading"><span>YOUR WORKPLACE TOOLKIT</span><h2 id="handbook-title">二十个方法，带回工作现场</h2></div><ol>${chapter.levels.map((level) => `<li><span>${level.number}</span><div><p>${escapeHtml(level.location.short)}</p><h3>${escapeHtml(level.toolName)}</h3><strong>${escapeHtml(level.principle)}</strong><details><summary>查看可直接套用的话术</summary><pre>${escapeHtml(level.template)}</pre></details></div></li>`).join("")}</ol></section>
      <div class="result-mentor"><img src="assets/images/xigua-teacher.webp" alt="西瓜老师"/><blockquote>「你不需要一入职就什么都会。<br>你需要知道，下一步可以怎么做。」</blockquote></div>
      <footer class="result-footer"><button class="secondary-button" type="button" data-action="home">${icon("map")}<span>回顾挑战地图</span></button><button class="primary-button" type="button" data-action="restart"><span>重新体验成长地图</span>${icon("rotate")}</button></footer>
    </section>`;
  }

  function render() {
    if (state.screen === "event") renderEvent();
    else if (state.screen === "travel") renderTravel();
    else if (state.screen === "mentor") renderMentor();
    else if (state.screen === "choice") renderChoice();
    else if (state.screen === "resolution") renderResolution();
    else if (state.screen === "map") renderMap();
    else if (state.screen === "result") renderResult();
    else renderIntro();
    const heading = document.getElementById("screen-title");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }
  }

  function goTo(screen, announcement) {
    state.screen = screen;
    saveState();
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (announcement) announce(announcement);
  }

  function selectOption(optionId) {
    const level = currentLevel();
    const option = level.options.find((item) => item.id === optionId);
    if (!option) return;
    state.answers[level.id] = option.id;
    if (!state.completed.includes(level.id)) state.completed.push(level.id);
    state.unlocked = Math.max(state.unlocked, Math.min(chapter.levels.length, state.currentLevel + 2));
    goTo("resolution", option.isCorrect ? "判断清晰，获得五点职场力。" : "这个选择还可以再想一步，已显示西瓜老师的点评。");
  }

  root.addEventListener("click", (event) => {
    const target = event.target.closest("[data-action]");
    if (!target) return;
    event.preventDefault();
    const action = target.dataset.action;
    if (action === "start-story") {
      state.currentLevel = 0;
      goTo("event", "小明的第一天开始了。");
    } else if (action === "go-mentor") goTo("travel", "小明准备去找西瓜老师。");
    else if (action === "enter-office") goTo("mentor", "已进入西瓜老师办公室。");
    else if (action === "open-choice") goTo("choice", "请选择你认为更稳妥的做法。");
    else if (action === "select-option") selectOption(target.dataset.optionId);
    else if (action === "finish-level") goTo(state.currentLevel === chapter.levels.length - 1 ? "result" : "map", "已完成当前挑战。");
    else if (action === "select-level") {
      const index = Number(target.dataset.levelIndex);
      if (Number.isInteger(index) && index >= 0 && index < state.unlocked) {
        state.currentLevel = index;
        goTo("event", `进入第 ${index + 1} 个挑战。`);
      }
    } else if (action === "show-result") goTo("result", "已打开职场成长手册。");
    else if (action === "home") goTo(state.completed.length ? "map" : "intro", "已返回挑战地图。");
    else if (action === "restart") {
      if (window.confirm("确定重新开始吗？已完成的挑战和得分将被清除。")) {
        state = defaultState();
        saveState();
        render();
        announce("已重新开始小明的职场成长地图。");
      }
    }
  });

  render();
})();
