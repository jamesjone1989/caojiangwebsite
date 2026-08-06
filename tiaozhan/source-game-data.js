(function () {
  "use strict";

  const stage = (config) => config;
  const level = (config) => config;

  window.GAME_STAGES = [
    stage({
      id: "first-week",
      number: "01",
      timeLabel: "入职第一周",
      title: "先让别人放心",
      shortTitle: "建立靠谱感",
      intro: "新人的第一项专业能力，不是什么都会，而是让别人知道你听懂了、在行动、会闭环。",
      resultTitles: ["入职探索者", "稳稳起步", "靠谱新同事"],
      resultNotes: [
        "先不求什么都做对，从确认任务和留下文字记录开始。",
        "你已经在建立靠谱感，再把请教和会议闭环练成习惯。",
        "你知道如何让别人放心地把事情交给你。",
      ],
      levels: [
        level({
          id: "task-confirmation",
          number: "01",
          title: "接到一句模糊任务",
          dimension: "理解与确认",
          ability: "understanding",
          toolName: "反述沟通法",
          sourceRef: "《干得漂亮》第1关·接任务",
          scene: "领导路过你的工位时说：“下周把新员工培训方案跟进一下。”说完就走了。",
          mentorIntro: "“收到”只能证明你听见了。先把自己的理解和第一步说出来，才能换来信息增量。",
          options: [
            { id: "only-received", isCorrect: false, title: "先答应再说", body: "好的领导，收到，我尽快跟进。" },
            { id: "restate-and-plan", isCorrect: true, title: "复述任务并提出第一步", body: "好的领导。我理解是要形成一版供下周讨论的新员工培训方案。我先整理去年资料和今年需求，明天中午前拉一个目录请您看方向，您看可以吗？" },
          ],
          feedback: {
            correct: "你复述了目标，又用第一步行动给了领导纠偏的机会。模糊任务因此开始变清晰。",
            wrong: "态度很积极，但“跟进”和“尽快”依然是空的。你们对交付物和时间可能理解完全不同。",
          },
          principle: "复述任务，说出第一步，再请对方纠偏。",
          template: "我理解这次需要……\n我准备先……\n在……前再跟您确认，您看可以吗？",
        }),
        level({
          id: "first-unfamiliar-task",
          number: "02",
          title: "第一次负责陌生工作",
          dimension: "理解与确认",
          ability: "understanding",
          toolName: "救生员法",
          sourceRef: "《干得漂亮》第1关·接任务",
          scene: "入职第三天，领导让你牵头组织一场新人分享会，但你从没办过活动。",
          mentorIntro: "职场不是闭卷考试。陌生任务的第一步，是找到能拉你一把的人。",
          options: [
            { id: "study-alone", isCorrect: false, title: "不暴露不会，自己研究", body: "先答应下来，下班后在网上查攻略，等完整方案做好再找领导。" },
            { id: "find-lifeguard", isCorrect: true, title: "找到救生员，留下确认接口", body: "跟领导说明自己没办过，请他指点以往负责人或参考案例。请教后先拉一版行动计划，再向领导确认。" },
          ],
          feedback: {
            correct: "你没有把“没做过”变成拒绝，而是为自己找到资源，同时留下了再次对齐的接口。",
            wrong: "独自研究看起来努力，但可能从一开始就用错了标准，最后用完整方案换来一次全盘返工。",
          },
          principle: "陌生任务先问“谁能帮我”，请教后再带着计划回来确认。",
          template: "这类工作我还没有做过。\n以往是哪位同事负责，我可以先去请教吗？\n我整理出初步计划后再请您把关。",
        }),
        level({
          id: "leader-invitation",
          number: "03",
          title: "给领导发会议邀请",
          dimension: "清晰表达",
          ability: "clarity",
          toolName: "目的先行＋信息分层",
          sourceRef: "《干得漂亮》第3关·线上沟通",
          scene: "人才发展规划研讨会已经定好时间，你需要邀请领导参会。信息很多，怎样发才更容易得到回复？",
          mentorIntro: "发消息不是把知道的都写上去，而是帮对方更快抓住重点。",
          options: [
            { id: "long-paragraph", isCorrect: false, title: "一段话全部说完", body: "尊敬的领导，咱们部门下周要组织开展年度人才发展规划研讨会，主要是梳理下今年的培训成效和招聘成果，还得讨论下明年的骨干员工培养方案和校园招聘计划，想邀请您来参会给我们指导指导，会议定在下周三下午两点，地点就在公司三楼的第一会议室，另外会议材料我们已经准备得差不多了，到时候会提前发给您，您看您那边有没有时间，要是时间有冲突的话我们也可以调整，麻烦您抽空考虑一下，特此请示。" },
            { id: "structured-message", isCorrect: true, title: "标题先行、分点表达", body: "<strong>【邀请领导参加·年度人才发展规划研讨会】</strong><br><br>尊敬的领导，咱们部门下周将组织开展年度人才发展规划研讨会。<br><br>1. <strong>会议内容</strong>：梳理今年培训成效与招聘成果，讨论明年骨干员工培养方案及校园招聘计划。<br>2. <strong>会议时间</strong>：下周三下午两点<br>3. <strong>会议地点</strong>：公司三楼第一会议室<br>4. <strong>会议材料</strong>：已准备得差不多，会提前发给您。<br><br>特邀请您参会并给予指导，若您时间有冲突，我们可做调整。麻烦您抽空考虑一下，特此请示。" },
          ],
          feedback: {
            correct: "标题先说明来意，内容、时间、地点和材料分层排列，领导扫一眼就能理解并做判断。",
            wrong: "内容没有错，但关键信息藏在长段落里，接收者需要自己寻找时间、地点和行动要求。",
          },
          principle: "先说目的，再把关键信息分层；让对方一眼知道需要做什么。",
          template: "【主题＋需要对方做的事】\n背景：……\n时间／地点：……\n需要您：……",
        }),
        level({
          id: "ask-colleague",
          number: "04",
          title: "向资深同事请教",
          dimension: "清晰表达",
          ability: "clarity",
          toolName: "高质量请教",
          sourceRef: "职场请教场景改写",
          scene: "你第一次使用公司采购系统，提交时不断报错，准备向资深同事求助。",
          mentorIntro: "会请教不是少问问题，而是让别人能快速判断你的问题。",
          options: [
            { id: "vague-question", isCorrect: false, title: "把问题直接丢过去", body: "老师，采购系统这个怎么弄呀？我这里一直不行，能帮我看看吗？" },
            { id: "specific-question", isCorrect: true, title: "交代背景和具体卡点", body: "老师，打扰一下。我在采购系统提交办公用品申请，已填预算科目并上传询价单，但提示“审批链缺失”。我对照手册重新选过部门，仍然不行。请问这种情况需要先找部门管理员配置审批人吗？" },
          ],
          feedback: {
            correct: "背景、现象、已做尝试和具体疑问都很清楚，对方不用来回追问就能给出建议。",
            wrong: "对方还不知道你要完成什么、哪里报错、试过什么，只能先花时间追问。",
          },
          principle: "高质量请教＝背景＋卡点＋已尝试方法＋一个具体问题。",
          template: "我正在……，遇到……\n已经尝试……\n想确认是否应该……？",
        }),
        level({
          id: "meeting-followup",
          number: "05",
          title: "第一次参加部门会议",
          dimension: "清晰表达",
          ability: "clarity",
          toolName: "会议闭环",
          sourceRef: "职场会议场景改写",
          scene: "部门会议讨论了很多事项，大家当场都点头同意。散会后，你接下来怎么做？",
          mentorIntro: "会议结束，不等于事情开始推进。真正的闭环发生在结论被写下来之后。",
          options: [
            { id: "rely-on-memory", isCorrect: false, title: "大家都记得，不必重复", body: "会上已经说得很清楚了，先各自推进；有人忘记时再在群里提醒。" },
            { id: "send-action-summary", isCorrect: true, title: "马上发行动纪要", body: "会后30分钟内发出简短纪要：先列会议结论，再写清任务、负责人、截止时间和协同部门；待确认事项单独标注。" },
          ],
          feedback: {
            correct: "你把口头共识变成了可检查的负责人和时间表，也减少了“我以为”。",
            wrong: "会后每个人的记忆都会变形。没有文字确认的共识，很难真正推进。",
          },
          principle: "会议闭环的最小单位：结论、行动项、负责人、截止时间、待确认事项。",
          template: "会议结论：……\n行动项：……｜负责人：……｜截止：……\n待确认：……",
        }),
      ],
    }),
    stage({
      id: "first-month",
      number: "02",
      timeLabel: "入职第一个月",
      title: "能够独立推进",
      shortTitle: "学会独立推进",
      intro: "当你开始独立承担工作，风险、批评、反馈和催办都会出现。专业不是没问题，而是遇到问题还能向前推。",
      resultTitles: ["协作练习生", "稳健执行者", "独立推进新星"],
      resultNotes: ["先练习提前说、带方案说，不要等结果失控才解释。", "你已经能承接多数日常推进任务，再练习把反馈变成行动。", "你会在不确定里管理预期，也能帮别人快速做决策。"],
      levels: [
        level({
          id: "risk-update", number: "01", title: "项目可能延期", dimension: "主动推进", ability: "momentum", toolName: "信息增量法", sourceRef: "《干得漂亮》第6关·汇报工作",
          scene: "招聘数据报告明天下午要交，但一个关键部门迟迟没有回传数据。你判断按时完成已经有风险。",
          mentorIntro: "暴露风险不是示弱。真正让人不安的，是截止时间到了才发现事情完不成。",
          options: [
            { id: "wait-until-deadline", isCorrect: false, title: "再等等，最后再说", body: "先继续催数据。如果明天下午还没拿到，再跟领导解释是对方部门没有及时提供。" },
            { id: "early-risk-signal", isCorrect: true, title: "提前同步并带上方案", body: "直属领导，报告目前已完成约80%，还缺销售部门的关键数据。我已催办两次，预计今天17:00前仍有拿不到的风险。建议先按现有数据完成主体，缺失部分做醒目标注，确保明天能先提交讨论稿。" },
          ],
          feedback: { correct: "你说清了进度、阻碍、风险时间点和备选方案，领导可以及时判断。", wrong: "等待会压缩处理风险的时间。说明责任归属，不能替代提前预警。" },
          principle: "风险汇报带四样东西：当前进度、具体阻碍、影响判断、解决方案。", sensitiveNote: "涉及跨部门依赖、延期或交付承诺时，要第一时间向直属领导同步进度、风险和备选方案。", template: "目前完成……\n因为……存在……风险\n我建议……\n需要您决定／支持……",
        }),
        level({
          id: "criticism-cooling", number: "02", title: "犯错后被领导批评", dimension: "情绪与反馈", ability: "feedback", toolName: "冷却法", sourceRef: "《干得漂亮》第2关·回应批评",
          scene: "你忘了按约定发供应商名单。领导来问进度时发现还没开始，明显生气了。", mentorIntro: "批评当下，先处理责任和行动，不要急着证明自己情有可原。",
          options: [
            { id: "explain-first", isCorrect: false, title: "先解释为什么忘了", body: "我不是故意的，这两天手头临时任务太多，一直没顾上。" },
            { id: "own-and-repair", isCorrect: true, title: "承担责任并确认补救", body: "对不起，是我没管理好进度，让您着急了。我现在立即整理，半小时后先拿框架跟您碰一下，今天下班前完成全部名单。" },
          ],
          feedback: { correct: "你用内归因承担了责任，又给出补救动作和时间，沟通开始从情绪回到解决问题。", wrong: "所有解释都像在说“我错得有道理”。对方此刻更关心你怎么补救。" },
          principle: "回应批评的三个动作：承担责任、确认行动、确认时间。", template: "这件事的确是我在……环节没做好。\n我马上……\n在……时间给您反馈结果。",
        }),
        level({
          id: "growth-feedback", number: "03", title: "第一次收到负面反馈", dimension: "情绪与反馈", ability: "feedback", toolName: "成长心态", sourceRef: "结合《干得漂亮》序言的可控行动观与成长型思维",
          scene: "入职月度沟通中，领导说：“你做得很认真，但方案缺少业务重点，还需要多想一层。”", mentorIntro: "反馈评价的是当前做法和结果，不是你的能力上限。",
          options: [
            { id: "take-as-verdict", isCorrect: false, title: "把反馈当成能力判决", body: "觉得自己果然不适合做方案，简单说声“我会注意”，以后尽量少接类似任务。" },
            { id: "turn-into-data", isCorrect: true, title: "把反馈转成学习信息", body: "请领导举一个具体例子，确认“缺少业务重点”体现在哪里；归纳两项改进动作，并约定两周后拿新版本再请他看一次。" },
          ],
          feedback: { correct: "你把抽象评价变成了例子、标准、行动和复盘时间。这就是重新拿回可控部分。", wrong: "一次结果不好不等于“我不行”。把反馈内化成标签，会让你错过真正可改进的信息。" },
          principle: "反馈不是能力判决；问清事实、提炼行动、约定复盘。", template: "我理解您认为目前的……还需要提升。\n能否请您举一个具体例子？\n接下来我准备……\n在……后再请您看一次。",
        }),
        level({
          id: "leader-decision", number: "04", title: "请领导做决策", dimension: "清晰表达", ability: "clarity", toolName: "选择法", sourceRef: "《干得漂亮》第3关·线上沟通",
          scene: "新人活动预算只够覆盖“升级场地”或“增加嘉宾”其中一项，你需要请领导定方案。", mentorIntro: "领导不回消息，有时不是没看到，而是你把整道题又交还给了他。",
          options: [
            { id: "ask-openly", isCorrect: false, title: "说完背景，请领导想办法", body: "领导，现在预算不够，场地和嘉宾只能保一个，您看怎么办比较好？" },
            { id: "offer-options", isCorrect: true, title: "提供选项、差异和建议", body: "领导，预算只够支持一项：A升级场地，参与体验更好，但内容不变；B增加一位业务嘉宾，场地保持原方案。本次目标是帮新人理解业务，我建议选B。您确认后，我今天就锁定嘉宾。" },
          ],
          feedback: { correct: "你已经完成了分析，领导只需要在清晰选项中做决策，并知道决策后会发生什么。", wrong: "你提出了问题，却没有先做判断。领导需要重新从头思考，回复成本很高。" },
          principle: "讲问题，给两个可选方案和差异，明确你的建议并导向行动。", template: "需要您决定的是……\nA方案：……，优势／代价……\nB方案：……，优势／代价……\n我建议……，确认后我会……",
        }),
        level({
          id: "colleague-reminder", number: "05", title: "催同事交付材料", dimension: "主动推进", ability: "momentum", toolName: "包装法", sourceRef: "《干得漂亮》第7关·催办",
          scene: "设计同事的海报草图已经晚了一天，后续文案和制作都在等他。你需要推动进度。", mentorIntro: "你着急，不代表对方就会着急。一次好催办，会让对方看到共同目标和最小行动。",
          options: [
            { id: "pressure-with-leader", isCorrect: false, title: "用领导施压", body: "这个稿子到底什么时候能给？领导一直在催，大家都等着你呢。" },
            { id: "goal-benefit-action", isCorrect: true, title: "说目标、好处和最小行动", body: "想跟你确认一下海报到哪个阶段了。周三前定下构图，文案和制作就都能开工，咱们也不用最后一起加班。你今天能否先给我一张黑白构图？细节可以之后再补。" },
          ],
          feedback: { correct: "你说明了为什么关心、推进后对对方有什么好处，又把动作缩小到可立即开始。", wrong: "“领导在催”只会传递压力，没有帮对方解决任何行动障碍。" },
          principle: "催办＝明确目标＋亮明好处＋提出一个足够小的行动。", template: "我关心这件事，是因为……\n只要完成……，我们就能……\n你现在能否先……？",
        }),
      ],
    }),
    stage({
      id: "first-half-year", number: "03", timeLabel: "入职前半年", title: "开始产生影响力", shortTitle: "开始贡献影响力", intro: "当你已经能完成工作，下一步是让别人看见你的思考、专业和可合作价值。",
      resultTitles: ["表达修炼者", "专业贡献者", "影响力成长者"], resultNotes: ["影响力不是抢话，先练习每次带一条有证据的信息增量。", "你已经能在会议和汇报中贡献价值，再练习让合作者也得到好处。", "你会让自己的工作、思考和合作价值被准确看见。"],
      levels: [
        level({ id: "meeting-called-on", number: "01", title: "会议上突然被点名", dimension: "情绪与反馈", ability: "feedback", toolName: "感受法", sourceRef: "《干得漂亮》第5关·会议发言", scene: "你跟领导参加集团会议，总负责人突然说：“今天来的同事都说两句吧。”", mentorIntro: "即兴发言不需要假装自己有高深观点。从具体感受出发，再回到行动。", options: [
          { id: "generic-honor", isCorrect: false, title: "用安全的客套话结束", body: "今天很荣幸参加会议，听了各位领导的分享，学到了很多，谢谢大家。" },
          { id: "feeling-to-action", isCorrect: true, title: "说具体感受和后续行动", body: "今天让我最受启发的，是王总提到“不要只看活动到场率”。我平时负责培训运营，回去后想把课后30天的行为变化也纳入复盘，先做一个小样本尝试。" },
        ], feedback: { correct: "具体细节证明你在认真听，后续行动则让感受落到了工作上。", wrong: "这番话很安全，但没有任何属于你的信息，听众也很难记住你。" }, principle: "即兴发言：说一个真实具体的感受，再说你回去准备怎么做。", template: "今天让我最受启发的是……\n它让我想到自己负责的……\n回去后我准备……" }),
        level({ id: "meeting-idea", number: "02", title: "在会议上提出想法", dimension: "影响与汇报", ability: "influence", toolName: "锚定法", sourceRef: "《干得漂亮》第5关·会议发言", scene: "大家在讨论新员工培训课程，你手里有一份学员调研数据，想提出增加实战演练。", mentorIntro: "好观点不应该被“我不知道怎么插话”埋没。找一个已有观点作为锚点。", options: [
          { id: "drop-opinion", isCorrect: false, title: "直接抛出“我觉得”", body: "我觉得现在的课程太虚了，应该增加更多实战演练。" },
          { id: "anchor-data-open", isCorrect: true, title: "锚定观点，给数据并保持开放", body: "我很认同刚才李老师说的“课程要帮新人快速上手”。我们的调研中，68%的新人最想增加真实案例演练。基于这个数据，是否可以先选一节课加一个20分钟演练？这是我目前的想法，也想听听大家的意见。" },
        ], feedback: { correct: "你承接了已有讨论，用数据支撑一个具体建议，最后还留了讨论接口。", wrong: "方向可能对，但突然评价现有课程“太虚”，容易让讨论转向立场对抗。" }, principle: "锚定前人观点，一次只提一件有证据的事，最后留下讨论接口。", template: "我很认同刚才的……\n根据……数据，我建议是否可以……\n这是目前的想法，也想听听大家的意见。" }),
        level({ id: "proposal-preview", number: "03", title: "方案总被领导推翻", dimension: "主动推进", ability: "momentum", toolName: "预演法", sourceRef: "《干得漂亮》第6关·汇报工作", scene: "你连续两次加班完成活动方案，汇报时却都被说“方向不对”。新一轮任务又来了。", mentorIntro: "被否定的是当前版本，不是你的能力。高成长性的做法，是缩短行动、反馈和调整之间的距离。", options: [
          { id: "perfect-then-show", isCorrect: false, title: "做得更完美再汇报", body: "上次肯定是准备还不够。这次先把完整方案、预算和时间表全部做好，再一次性拿给领导。" },
          { id: "sample-and-check", isCorrect: true, title: "先打样，边请教边优化", body: "先用一页纸对齐活动目标和优先级；再带着粗框架请领导看方向；核心思路确认后，最后补齐预算和执行细节。" },
        ], feedback: { correct: "你用小样本提前换取了反馈，方向错了也只需要调整框架，不会整份返工。", wrong: "投入更多时间不会自动修正方向。等到完成品才换反馈，代价会更大。" }, principle: "不要懋大招；先打样，带着样本请教，再分阶段完善。", template: "我先拉了一个很粗的……\n目前有……几点把握不好\n想先请您帮我看看方向，再继续往下做。" }),
        level({ id: "result-report", number: "04", title: "汇报自己做出的成果", dimension: "影响与汇报", ability: "influence", toolName: "对比法", sourceRef: "《干得漂亮》第6关·汇报工作", scene: "你优化了新人入职流程，要在月度会上汇报成果。怎样让领导知道这个成果意味着什么？", mentorIntro: "罗列动作只能证明你很忙。成果要放在一个清晰参照中，变化才能被看见。", options: [
          { id: "list-effort", isCorrect: false, title: "按流程罗列做过的事", body: "我们先访谈了各部门，又改了入职清单，重做了邮件，最后还调整了培训日程。" },
          { id: "compare-change", isCorrect: true, title: "用参照说清变化", body: "优化前，新人完成入职手续平均需3.2天；这个月降到1.6天，其中最大的改变是将部门材料改为入职前预审。下一步准备在两个部门继续验证，再决定是否全面推广。" },
        ], feedback: { correct: "参照、核心变化和下一步都很清楚。听众不只知道你做了什么，还知道价值有多大。", wrong: "你说了很多动作，却没有回答“结果变好了多少”。忙碌不等于价值已被看见。" }, principle: "找参考，说变化和关键经验，最后对齐下一步。", template: "相比……，现在……\n主要是因为我们做了……\n下一步准备……" }),
        level({ id: "external-resource", number: "05", title: "向外部伙伴争取资源", dimension: "影响与汇报", ability: "influence", toolName: "供应商法", sourceRef: "《干得漂亮》第4关·争取资源", scene: "你想邀请一位行业专家为新人做分享，但对方与你不熟，平时也很忙。", mentorIntro: "争取资源不是只说自己多需要。先问一句：我能为对方带去什么？", options: [
          { id: "ask-favor", isCorrect: false, title: "强调这次帮忙很重要", body: "老师，我们特别希望您能抽空来分享一小时，这对我们的新人培训真的非常重要。" },
          { id: "offer-value", isCorrect: true, title: "先对内确认，再说清合作价值", body: "先与直属领导确认可提供的资源和承诺边界，再联系对方：老师，看到您最近在做年轻用户研究。我们这批新人来自十二个业务城市，可以在分享前按您的问题完成一份小调研，结果全部回传给您。如果这对您有帮助，想请您在方便时为大家分享一次。" },
        ], feedback: { correct: "你先守住了内部承诺边界，再结合对方正在做的事提供真实价值，合作开始变成双向。", wrong: "事情对你很重要，不代表对方就有行动理由。只强调自己的需要，对方看不到合作价值。" }, principle: "先对内确认承诺边界，再利他、再利己。", sensitiveNote: "涉及对外资源、数据、费用或交付承诺时，先及时与直属领导确认权限和口径，再向外部伙伴表达。", template: "我已与直属领导确认……\n我了解到您正在……\n我们可以为您提供……\n如果这对您有帮助，想请您……" }),
      ],
    }),
    stage({
      id: "first-year", number: "04", timeLabel: "入职第一年", title: "处理复杂局面", shortTitle: "应对复杂协作", intro: "当你进入更复杂的协作网络，需要管理标准、责任、多方意见、层级信任和角色变化。",
      resultTitles: ["进阶挑战者", "成熟职场人", "复杂协作高手"], resultNotes: ["复杂局面里不要只靠态度，从明确标准、记录共识和同步信息开始。", "你已经能看见协作中的边界和信任，再练习在角色变化中主动要资源。", "你能用规则、证据和信息同步稳住复杂协作。"],
      levels: [
        level({ id: "restart-delivery", number: "01", title: "同事交付结果不符合标准", dimension: "主动推进", ability: "momentum", toolName: "重启法", sourceRef: "《干得漂亮》第7关·催办", scene: "同事按时交了年会视频，但时长两分半，而年会开场只留了一分钟。", mentorIntro: "对方已经做了，却没做对，通常意味着你们从一开始就没有真正对齐。", options: [
          { id: "demand-redo", isCorrect: false, title: "指出问题，要求马上返工", body: "这个时长完全不行，我明明说过只要一分钟。赶紧重新剪，今天必须给我。" },
          { id: "restart-alignment", isCorrect: true, title: "揽责任、说标准、对计划", body: "抱歉，肯定是我一开始没把使用场景说清。视频用在年会开场，只有一分钟，长了会压缩后续流程。咱们一起看看保留哪三个镜头，再定一下今天的修改计划。" },
        ], feedback: { correct: "你先释放了对方的防御，再用使用场景解释标准，最后把沟通落到新计划。", wrong: "对方会感到自己做了很多却突然被推翻，容易将精力用在辩解而不是返工。" }, principle: "结果不达标时回到任务起点：揽责任、说标准、对计划。", template: "抱歉，出现这个问题可能是我开始没说清。\n这件事的目标是……，所以标准是……\n咱们一起定一下接下来的计划。" }),
        level({ id: "public-accountability", number: "02", title: "合作同事有甩锅风险", dimension: "边界与应变", ability: "boundaries", toolName: "公示法", sourceRef: "《干得漂亮》第8关·主动防守", scene: "你又要与一位曾在出问题时说“我只是配合”的同事合作。项目分工刚刚定下。", mentorIntro: "主动防守不是先怀疑他人，而是让项目的规则、变动和责任可被看见。", options: [
          { id: "collect-after-problem", isCorrect: false, title: "先合作，出事再收集证据", body: "这次先正常配合。如果对方再甩锅，就把聊天记录整理好去找领导申诉。" },
          { id: "publish-agreements", isCorrect: true, title: "先同步领导，再公示分工和变动", body: "先向直属领导同步合作风险和拟定的分工，再将双方确认的标准、截止时间发到项目群，邀请对方确认；后续出现客户新需求或进度变动，也同时在群里和直属领导处及时同步。" },
        ], feedback: { correct: "同步和公示让直属领导与合作各方都拥有同一版记录。这不只保护你，也减少项目中的信息差。", wrong: "等问题发生后再申诉，你仍然在用情绪和零散记录解释过去。更好的方式是把规则做在前面。" }, principle: "先同步直属领导，再公示分工、标准、时间、风险和变动。", sensitiveNote: "涉及责任争议、客户变化或跨部门风险时，不要只留在双方私聊里；及时向直属领导同步，并保留公开确认记录。", template: "先向直属领导同步：目前合作中存在……风险。\n项目群同步：刚才确认的分工是……\n标准／截止时间：……\n若有变动，我们在群里同步后再调整。" }),
        level({ id: "feedback-field", number: "03", title: "多位领导反复修改方案", dimension: "主动推进", ability: "momentum", toolName: "场域法", sourceRef: "《干得漂亮》第9关·平衡", scene: "你负责周年庆方案。三位领导分别私下提出修改意见，而且有些意见相互冲突。", mentorIntro: "不要被动接住每一条飞来的意见。主动建立一个所有人同时讨论同一件事的场域。", options: [
          { id: "follow-latest", isCorrect: false, title: "谁最后说就先按谁的改", body: "先按职级最高的领导意见修改，其他人再提意见就继续调整，直到大家都不再说。" },
          { id: "create-field", isCorrect: true, title: "先对齐直属领导，再集中收拢意见", body: "先向直属领导同步意见冲突，请他确认决策机制和参会范围；再约一场30分钟方案评审集中讨论。会后汇总纪要，请大家确认新思路，之后按同一版结论修改。" },
        ], feedback: { correct: "你先让直属领导掌握冲突，再把零散意见放到同一个场域中，并用纪要将大家从提意见带到执行方案。", wrong: "逐个私下修改会让你陷入无限迭代，也没有人知道当前到底以哪个意见为准。" }, principle: "先与直属领导确认决策机制，再在公开场域收拢共识。", sensitiveNote: "遇到多位领导意见冲突，不要自行判断谁的意见优先；及时向直属领导同步，由他确认决策人、参会范围和执行口径。", template: "先向直属领导同步：目前收到……和……两类冲突意见。\n想请您确认决策机制和参会范围。\n会后我会汇总纪要，确认后按统一思路执行。" }),
        level({ id: "skip-level-report", number: "04", title: "大领导要求越级汇报", dimension: "边界与应变", ability: "boundaries", toolName: "越级汇报三步法", sourceRef: "结合《干得漂亮》第9关的统一战线思路改写", scene: "公司大领导在项目群里点名，让你第二天单独汇报项目进度。这是难得的展示机会，但你的直属领导此前并不知道这次安排。", mentorIntro: "越级汇报可以越过层级传递信息，但不能越过直属领导建立信任。", options: [
          { id: "showcase-directly", isCorrect: false, title: "抓住机会直接表现", body: "马上准备自己负责的内容，先不告诉直属领导，避免他要求修改后影响自己独立展示。" },
          { id: "align-report-sync", isCorrect: true, title: "事前对齐、汇报不越权、事后同步", body: "事前向直属领导同步汇报要求，确认口径、重点和权限边界；汇报时说清自己的工作，也说明团队和直属领导的支持，不做超权承诺；事后立即同步反馈和行动。" },
        ], feedback: { correct: "你既抓住了展示机会，又保护了团队口径、权限边界和直属领导的信任。", wrong: "一次展示可能很成功，但信息不对称会让直属领导无法管理项目，也可能让你无意中做出超权承诺。" }, principle: "越级汇报三步：事前报备对齐，汇报时不越权，事后同步反馈与行动。", sensitiveNote: "越级汇报前后同步直属领导是必做动作：事前报备、事中守边界、事后立即回传反馈和下一步行动。", template: "事前：大领导希望我汇报……，想先跟您对齐口径和边界。\n汇报时：这项工作在……支持下，目前……\n事后：刚才汇报的反馈是……，下一步……" }),
        level({ id: "rotation-change", number: "05", title: "突然收到轮岗安排", dimension: "边界与应变", ability: "boundaries", toolName: "主动迎战法", sourceRef: "《干得漂亮》第10关·轮岗", scene: "领导突然通知你：下个月调到一个陌生的业务部门轮岗。你手里的项目刚有起色，心里很不安。", mentorIntro: "轮岗是被边缘还是被培养，不应该靠猜。先为自己争取准备时间和必要资源。", options: [
          { id: "resist-or-submit", isCorrect: false, title: "当场抵触，或什么也不问就接受", body: "如果还有勇气就当场说自己不想去；如果觉得无法改变，就说“好的”，到新部门再慢慢适应。" },
          { id: "prepare-and-resource", isCorrect: true, title: "及时沟通，争取准备和支持", body: "先与直属领导及时沟通自己的理解和顾虑，请求用一天了解新岗位并整理问题；第二天回来请教轮岗目标、期望和交接边界，同时请他介绍新部门关键人，并约定轮岗后的汇报接口。" },
        ], feedback: { correct: "你没有被动接受一个模糊变化，而是及时与直属领导沟通，主动搞清目标，并为新角色要到了启动资源。", wrong: "抵触和躺平看似是两种选择，实际上都把对变化的控制权交了出去。" }, principle: "面对角色变化，先与直属领导沟通，再搞清目标并为新岗位要资源。", sensitiveNote: "轮岗、职责调整、汇报线变化等重要人事安排，不要靠猜测消化；及时与直属领导确认原因、目标、交接和后续汇报关系。", template: "我想先跟您同步一下我的理解和顾虑。\n能否给我……时间了解情况？\n我想再向您请教轮岗目标、期望、交接边界和可以争取的支持。" }),
      ],
    }),
  ];
})();
