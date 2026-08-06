(function () {
  "use strict";

  window.STORY_CHAPTER = {
    id: "workplace-map",
    title: "小明的职场成长地图",
    subtitle: "二十个挑战，从新人走向独立协作",
    levels: [
      {
        id: "task-confirmation",
        number: "01",
        day: "DAY 1 · 09:20",
        title: "接到一句模糊任务",
        dimension: "理解与确认",
        toolName: "反述沟通法",
        eventImage: "assets/images/scene-event-01-task.webp",
        mentorImage: "assets/images/scene-mentor-01-restate.webp",
        location: { id: "desk", name: "小明工位", short: "模糊任务", x: 18, y: 67, sceneClass: "desk" },
        eventDialogue: [
          { speaker: "领导", text: "小明，下周把新员工培训方案跟进一下。" },
          { speaker: "小明", text: "好的领导……等一下，「跟进」到底是要做到哪一步？" },
          { speaker: "旁白", text: "第一天上班，小明的第一个挑战来得比咖啡还快。" },
        ],
        mentorDialogue: [
          { speaker: "西瓜老师", text: "先别急着证明你会做。你现在知道交付物是什么吗？" },
          { speaker: "小明", text: "好像不知道。时间只知道是下周，标准也没问。" },
          { speaker: "西瓜老师", text: "那就对了。「收到」只能证明你听见了；复述理解和第一步，才能换来真正的信息。" },
        ],
        question: "如果回到刚才，小明应该怎么回复？",
        options: [
          { id: "only-received", isCorrect: false, title: "先答应再说", body: "好的领导，收到，我尽快跟进。" },
          { id: "restate-and-plan", isCorrect: true, title: "复述任务并提出第一步", body: "我理解是要形成一版供下周讨论的新员工培训方案。我先整理旧资料和需求，明天中午前拿目录请您看方向，可以吗？" },
        ],
        feedback: {
          correct: "你说清了理解、交付物和第一步，也给领导留了及时纠偏的机会。",
          wrong: "态度很积极，但「跟进」和「尽快」依然是空的。你们对交付物和时间可能理解完全不同。",
        },
        principle: "复述任务，说出第一步，再请对方纠偏。",
        template: "我理解这次需要……\n我准备先……\n在……前再跟您确认，您看可以吗？",
      },
      {
        id: "first-unfamiliar-task",
        number: "02",
        day: "DAY 3 · 10:10",
        title: "第一次负责陌生工作",
        dimension: "理解与确认",
        toolName: "救生员法",
        eventImage: "assets/images/scene-event-02-activity.webp",
        mentorImage: "assets/images/scene-mentor-02-lifeguard.webp",
        location: { id: "activity", name: "活动准备区", short: "陌生工作", x: 38, y: 25, sceneClass: "activity" },
        eventDialogue: [
          { speaker: "领导", text: "这次新人分享会由你牵头，周五前先出个方案。" },
          { speaker: "小明", text: "我连公司有哪些会议室都还没认全，怎么独立办活动？" },
          { speaker: "旁白", text: "桌上的活动物料堆得很高，小明的心里也开始堆问号。" },
        ],
        mentorDialogue: [
          { speaker: "西瓜老师", text: "职场不是闭卷考试。陌生任务的第一步，不是藏住不会。" },
          { speaker: "小明", text: "那我要直接说自己做不了吗？" },
          { speaker: "西瓜老师", text: "不是拒绝任务，是快速找到能拉你一把的「救生员」，请教后带着计划回来确认。" },
        ],
        question: "面对从没做过的任务，哪种起步方式更稳妥？",
        options: [
          { id: "study-alone", isCorrect: false, title: "不暴露不会，自己研究", body: "先答应下来，下班后在网上查攻略，等完整方案做好再找领导。" },
          { id: "find-lifeguard", isCorrect: true, title: "找到救生员，留下确认接口", body: "说明自己没办过，请领导指点以往负责人或参考案例。请教后拉一版行动计划，再向领导确认。" },
        ],
        feedback: {
          correct: "你没有把「没做过」变成拒绝，而是为自己找到资源，同时留下再次对齐的接口。",
          wrong: "独自研究看起来努力，但可能从一开始就用错了标准，最后用完整方案换来一次全盘返工。",
        },
        principle: "陌生任务先问「谁能帮我」，请教后再带着计划回来确认。",
        template: "这类工作我还没有做过。\n以往是哪位同事负责，我可以先去请教吗？\n我整理出初步计划后再请您把关。",
      },
      {
        id: "leader-invitation",
        number: "03",
        day: "DAY 4 · 11:30",
        title: "给领导发会议邀请",
        dimension: "清晰表达",
        toolName: "目的先行＋信息分层",
        eventImage: "assets/images/scene-event-03-invite.webp",
        mentorImage: "assets/images/scene-mentor-03-structure.webp",
        location: { id: "invite", name: "会议预约区", short: "会议邀请", x: 50, y: 48, sceneClass: "invite" },
        eventDialogue: [
          { speaker: "同事", text: "时间、地点、议题和材料都定了，你邀请一下领导吧。" },
          { speaker: "小明", text: "信息这么多，全写进一段话里会不会显得很认真？" },
          { speaker: "旁白", text: "小明在发送键上停了三秒，决定先去问问西瓜老师。" },
        ],
        mentorDialogue: [
          { speaker: "西瓜老师", text: "发消息不是把你知道的都写上去，而是帮对方更快抓住重点。" },
          { speaker: "小明", text: "所以先说我需要他做什么？" },
          { speaker: "西瓜老师", text: "没错。标题先说来意，再把内容、时间、地点和需要的行动分层。" },
        ],
        question: "哪种会议邀请更容易获得明确回复？",
        options: [
          { id: "long-paragraph", isCorrect: false, title: "一段话全部说完", body: "把会议背景、议题、时间、地点和请求连成一个长段落，最后请领导考虑。" },
          { id: "structured-message", isCorrect: true, title: "标题先行，分点表达", body: "用「邀请参加·年度人才发展规划研讨会」说明来意，分点写内容、时间、地点和材料，最后请领导确认是否参会。" },
        ],
        feedback: {
          correct: "标题先说明来意，关键信息分层排列，领导扫一眼就能理解并做判断。",
          wrong: "内容没有错，但关键信息藏在长段落里，接收者需要自己寻找时间、地点和行动要求。",
        },
        principle: "先说目的，再把关键信息分层；让对方一眼知道需要做什么。",
        template: "【主题＋需要对方做的事】\n背景：……\n时间／地点：……\n需要您：……",
      },
      {
        id: "ask-colleague",
        number: "04",
        day: "DAY 4 · 15:40",
        title: "向资深同事请教",
        dimension: "清晰表达",
        toolName: "高质量请教",
        eventImage: "assets/images/scene-event-04-system.webp",
        mentorImage: "assets/images/scene-mentor-04-question.webp",
        location: { id: "system", name: "采购系统工位", short: "向同事请教", x: 62, y: 68, sceneClass: "system" },
        eventDialogue: [
          { speaker: "系统", text: "提交失败：审批链缺失。" },
          { speaker: "小明", text: "我已经重新选了部门，还是不行。要不就问「这个怎么弄」？" },
          { speaker: "旁白", text: "聊天框里只有一句模糊的问话。小明想起了西瓜老师的办公室。" },
        ],
        mentorDialogue: [
          { speaker: "西瓜老师", text: "会请教不是少问问题，而是让别人能快速判断你的问题。" },
          { speaker: "小明", text: "那我要先把所有经过都讲一遍吗？" },
          { speaker: "西瓜老师", text: "只需要四样：背景、具体卡点、你已经试过什么，以及一个明确问题。" },
        ],
        question: "怎样开口，同事才能更快帮到小明？",
        options: [
          { id: "vague-question", isCorrect: false, title: "把问题直接丢过去", body: "老师，采购系统这个怎么弄呀？我这里一直不行，能帮我看看吗？" },
          { id: "specific-question", isCorrect: true, title: "交代背景和具体卡点", body: "我在提交办公用品申请，已填预算科目并上传询价单，但提示「审批链缺失」。重选部门后仍然不行。这种情况是否需要先找管理员配置审批人？" },
        ],
        feedback: {
          correct: "背景、现象、已做尝试和具体疑问都很清楚，对方不用来回追问就能给出建议。",
          wrong: "对方还不知道你要完成什么、哪里报错、试过什么，只能先花时间追问。",
        },
        principle: "高质量请教＝背景＋卡点＋已尝试方法＋一个具体问题。",
        template: "我正在……，遇到……\n已经尝试……\n想确认是否应该……？",
      },
      {
        id: "meeting-followup",
        number: "05",
        day: "DAY 5 · 16:50",
        title: "第一次参加部门会议",
        dimension: "清晰表达",
        toolName: "会议闭环",
        eventImage: "assets/images/scene-event-05-meeting.webp",
        mentorImage: "assets/images/scene-mentor-05-closure.webp",
        location: { id: "meeting", name: "部门会议室", short: "会议闭环", x: 82, y: 27, sceneClass: "meeting" },
        eventDialogue: [
          { speaker: "会议主持人", text: "好，今天就到这里，大家按刚才说的开始推进。" },
          { speaker: "小明", text: "大家都点头了，应该都记得自己要做什么吧？" },
          { speaker: "旁白", text: "人陆续离开会议室，白板上还留着一堆箭头，却没有人名和日期。" },
        ],
        mentorDialogue: [
          { speaker: "西瓜老师", text: "会议结束，不等于事情开始推进。" },
          { speaker: "小明", text: "可是会上已经说得很清楚了。" },
          { speaker: "西瓜老师", text: "每个人的记忆都会变形。真正的闭环，是把口头共识变成可检查的负责人和时间表。" },
        ],
        question: "散会后，小明最应该先做什么？",
        options: [
          { id: "rely-on-memory", isCorrect: false, title: "大家都记得，不必重复", body: "会上已经说得很清楚，先各自推进；有人忘记时再在群里提醒。" },
          { id: "send-action-summary", isCorrect: true, title: "马上发行动纪要", body: "会后 30 分钟内发简短纪要：先列会议结论，再写清任务、负责人、截止时间和协同部门；待确认事项单独标注。" },
        ],
        feedback: {
          correct: "你把口头共识变成了可检查的负责人和时间表，也减少了「我以为」。",
          wrong: "会后每个人的记忆都会变形。没有文字确认的共识，很难真正推进。",
        },
        principle: "会议闭环的最小单位：结论、行动项、负责人、截止时间、待确认事项。",
        template: "会议结论：……\n行动项：……｜负责人：……｜截止：……\n待确认：……",
      },
    ],
  };

  const extraMeta = [
    {
      id: "risk-update", day: "MONTH 1 · DAY 12", location: "数据分析区", short: "项目风险", sceneClass: "data",
      partner: "协作同事", partnerLine: "销售数据还在确认，今天不一定能给你。",
      thought: "报告明天下午就要交。现在汇报风险，会不会显得我能力不够？",
      mentorQuestion: "我还没真正延期，现在说会不会太早？", imageKey: "06-risk",
    },
    {
      id: "criticism-cooling", day: "MONTH 1 · DAY 15", location: "领导工位", short: "回应批评", sceneClass: "leader",
      partner: "领导", partnerLine: "供应商名单呢？昨天不是说好发给我吗？",
      thought: "糟了，我完全忘了。要不要先解释这两天临时任务太多？",
      mentorQuestion: "如果不解释原因，领导会不会觉得我不认真？", imageKey: "07-criticism",
    },
    {
      id: "growth-feedback", day: "MONTH 1 · DAY 20", location: "月度沟通室", short: "负面反馈", sceneClass: "feedback",
      partner: "领导", partnerLine: "你做得很认真，但方案缺少业务重点，还需要多想一层。",
      thought: "是不是我根本不适合做方案？",
      mentorQuestion: "听到这种评价，我怎么才能不把它变成「我不行」？", imageKey: "08-feedback",
    },
    {
      id: "leader-decision", day: "MONTH 1 · DAY 23", location: "预算评审区", short: "请领导决策", sceneClass: "budget",
      partner: "领导", partnerLine: "预算只能保一项。你整理清楚后，给我一个建议。",
      thought: "是升级场地，还是增加嘉宾？我应该把问题直接交给领导吗？",
      mentorQuestion: "怎样说，才能让领导更容易做决策？", imageKey: "09-decision",
    },
    {
      id: "colleague-reminder", day: "MONTH 1 · DAY 27", location: "设计协作区", short: "催同事交付", sceneClass: "design",
      partner: "设计同事", partnerLine: "海报还没弄完，再给我一点时间吧。",
      thought: "已经晚了一天，后面的文案和制作都在等。我该怎么催？",
      mentorQuestion: "不用领导施压，还能怎样让对方愿意马上行动？", imageKey: "10-reminder",
    },
    {
      id: "meeting-called-on", day: "MONTH 3 · GROUP MEETING", location: "集团会议室", short: "突然被点名", sceneClass: "group-meeting",
      partner: "总负责人", partnerLine: "今天来的同事都说两句吧。小明，你先来。",
      thought: "毫无准备！说「学到了很多」至少不会出错吧？",
      mentorQuestion: "没有成熟观点时，即兴发言还能说什么？", imageKey: "11-called-on",
    },
    {
      id: "meeting-idea", day: "MONTH 3 · COURSE REVIEW", location: "课程讨论区", short: "会议提想法", sceneClass: "course",
      partner: "课程负责人", partnerLine: "新员工课程先按原方案推进，大家还有补充吗？",
      thought: "我手里有调研数据，想增加实战演练，但怎么接话才不突兀？",
      mentorQuestion: "怎样既表达不同想法，又不把讨论变成立场对抗？", imageKey: "12-idea",
    },
    {
      id: "proposal-preview", day: "MONTH 4 · PROPOSAL", location: "方案评审区", short: "方案预演", sceneClass: "proposal",
      partner: "领导", partnerLine: "细节做了很多，但方向还是不对。",
      thought: "我已经连续返工两次。下一次是不是应该做得更完整再汇报？",
      mentorQuestion: "怎样才能更早发现方向偏了？", imageKey: "13-preview",
    },
    {
      id: "result-report", day: "MONTH 5 · MONTHLY REVIEW", location: "月度汇报厅", short: "汇报成果", sceneClass: "report",
      partner: "领导", partnerLine: "入职流程优化由你来汇报，重点说清楚成果。",
      thought: "我做了访谈、清单、邮件和日程，全部讲完就能体现工作量吗？",
      mentorQuestion: "怎样让别人看到价值，而不只是看到我很忙？", imageKey: "14-result",
    },
    {
      id: "external-resource", day: "MONTH 6 · PARTNERSHIP", location: "外部合作洽谈区", short: "争取外部资源", sceneClass: "partner",
      partner: "行业专家", partnerLine: "最近行程比较满，新的分享邀约暂时不接。",
      thought: "这场分享对新人很重要，我还能拿什么理由打动对方？",
      mentorQuestion: "对方为什么要帮我？我能先给他什么价值？", imageKey: "15-resource",
    },
    {
      id: "restart-delivery", day: "MONTH 8 · VIDEO REVIEW", location: "视频剪辑区", short: "交付不达标", sceneClass: "video",
      partner: "制作同事", partnerLine: "年会视频剪好了，两分半，效果很完整。",
      thought: "可开场只留了一分钟。直接让他马上重剪吗？",
      mentorQuestion: "对方已经做了很多，我该怎样重启这次协作？", imageKey: "16-restart",
    },
    {
      id: "public-accountability", day: "MONTH 9 · PROJECT KICKOFF", location: "项目协作区", short: "防止甩锅", sceneClass: "project",
      partner: "合作同事", partnerLine: "这次我还是配合你，需要什么你再告诉我。",
      thought: "上次出问题时他说自己只是配合。这次我要不要先留证据？",
      mentorQuestion: "怎样保护自己，又不把合作变成互相提防？", imageKey: "17-accountability",
    },
    {
      id: "feedback-field", day: "MONTH 10 · ANNIVERSARY", location: "周年庆评审室", short: "多方意见", sceneClass: "review",
      partner: "领导", partnerLine: "这版先按我的意见改，另外两位领导那里你再沟通。",
      thought: "三位领导的意见彼此冲突，我到底该听谁的？",
      mentorQuestion: "我不能替领导排序，怎样把意见重新收拢？", imageKey: "18-field",
    },
    {
      id: "skip-level-report", day: "MONTH 11 · EXECUTIVE REVIEW", location: "大领导会议室", short: "越级汇报", sceneClass: "executive",
      partner: "大领导", partnerLine: "小明，明天你单独来汇报一下项目进度。",
      thought: "这是难得的展示机会，但直属领导还不知道这件事。",
      mentorQuestion: "怎样抓住机会，又不损伤直属领导的信任？", imageKey: "19-skip-level",
    },
    {
      id: "rotation-change", day: "YEAR 1 · ROLE CHANGE", location: "轮岗沟通室", short: "突然轮岗", sceneClass: "rotation",
      partner: "领导", partnerLine: "下个月你去业务部门轮岗，提前准备一下。",
      thought: "手里的项目刚有起色。这个安排是培养，还是被边缘化？",
      mentorQuestion: "面对突然变化，我应该先问清什么、争取什么？", imageKey: "20-rotation",
    },
  ];

  const sourceLevels = (window.GAME_STAGES || []).slice(1).flatMap((stage) =>
    stage.levels.map((item) => ({ stage, item }))
  );
  const plainText = (value) => String(value || "")
    .replace(/<br\s*\/?\s*>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replaceAll("&nbsp;", " ");

  window.STORY_CHAPTER.levels.forEach((item) => { item.stageId = "first-week"; });
  extraMeta.forEach((meta, index) => {
    const source = sourceLevels.find(({ item }) => item.id === meta.id);
    if (!source) return;
    const globalNumber = String(index + 6).padStart(2, "0");
    const { stage, item } = source;
    window.STORY_CHAPTER.levels.push({
      id: item.id,
      number: globalNumber,
      day: meta.day,
      title: item.title,
      dimension: item.dimension,
      toolName: item.toolName,
      stageId: stage.id,
      eventImage: `assets/images/scene-event-${meta.imageKey}.webp`,
      mentorImage: `assets/images/scene-mentor-${meta.imageKey}.webp`,
      location: { id: meta.sceneClass, name: meta.location, short: meta.short, sceneClass: meta.sceneClass },
      eventDialogue: [
        { speaker: meta.partner, text: meta.partnerLine },
        { speaker: "小明", text: meta.thought },
        { speaker: "旁白", text: item.scene },
      ],
      mentorDialogue: [
        { speaker: "西瓜老师", text: item.mentorIntro },
        { speaker: "小明", text: meta.mentorQuestion },
        { speaker: "西瓜老师", text: item.principle },
      ],
      question: `面对「${item.title}」，小明下一步怎么做更专业？`,
      options: item.options.map((option) => ({ ...option, body: plainText(option.body) })),
      feedback: item.feedback,
      principle: item.principle,
      template: item.template,
      sensitiveNote: item.sensitiveNote || "",
    });
  });

  window.STORY_CHAPTER.stages = [
    { id: "first-week", number: "01", timeLabel: "入职第一周", title: "先让别人放心" },
    { id: "first-month", number: "02", timeLabel: "入职第一个月", title: "能够独立推进" },
    { id: "first-half-year", number: "03", timeLabel: "入职前半年", title: "开始产生影响力" },
    { id: "first-year", number: "04", timeLabel: "入职第一年", title: "处理复杂局面" },
  ];
})();
