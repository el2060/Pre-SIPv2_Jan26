
import { Role, Scenario } from './types';

export const ROLES: Role[] = [
  {
    id: 'children',
    title: 'Children',
    titleZh: '与幼儿沟通',
    description: 'Practice positive guidance and routine management',
    descriptionZh: '练习正向引导和常规管理',
    iconName: 'Baby',
  },
  {
    id: 'parents',
    title: 'Parents',
    titleZh: '与家长沟通',
    description: 'Practice home-school partnership and feedback',
    descriptionZh: '练习家校合作与反馈',
    iconName: 'Users',
  },
  {
    id: 'colleagues',
    title: 'Teachers',
    titleZh: '与同事沟通',
    description: 'Discuss NEL framework and professional inquiry',
    descriptionZh: '讨论 NEL 框架和专业探究',
    iconName: 'Briefcase',
  },
];

export const SCENARIOS: Scenario[] = [
  // --- Role: Children ---
  {
    id: 'c1',
    roleId: 'children',
    title: 'Transition to Circle Time',
    titleZh: '过渡到圆圈时间',
    difficulty: 'Beginner',
    description: 'Manage rowdy children: Quiet down → Water → Sit',
    context: 'The children are running around noisily after outdoor play. You need to get them to 1) Quiet down, 2) Drink water, and 3) Sit in a circle.',
    contextZh: '户外活动后，孩子们吵吵闹闹地跑来跑去。你需要让他们：1) 安静下来，2) 喝水，3) 围坐成一圈。',
    aiContext: 'Evaluate if the user uses Positive Guidance (iTeach). Bad: "Stop running!". Good: "Let\'s use our walking feet." Focus on Self-Management (SEC).',
    tags: ['Routine Management', 'Positive Guidance'],
    mode: 'text',
    initialMessage: '*runs around loudly* Catch me if you can!! 🏃‍♂️💨 We don\'t want to sit down lah! It\'s so boring!',
    initialMessageZh: '*大声跑来跑去* 来抓我呀！！🏃‍♂️💨 我们才不要坐下来呢！太无聊了！'
  },
  {
    id: 'c2',
    roleId: 'children',
    title: 'Conflict at Play Corner',
    titleZh: '游戏角冲突',
    difficulty: 'Intermediate',
    description: 'Resolve a dispute over a toy using NEL principles',
    context: 'Two children are pulling on the same teddy bear. One is crying.',
    contextZh: '两个孩子正在争抢同一个泰迪熊。其中一个在哭。',
    aiContext: 'Evaluate user on Relationship Management (SEC). User should facilitate conflict resolution, not just solve it for them.',
    tags: ['Social Emotional', 'Conflict Resolution'],
    mode: 'text',
    initialMessage: '*pulling the teddy bear hard* No!! It\'s mine! I take first one! 😡😭 *starts crying*',
    initialMessageZh: '*用力拉扯泰迪熊* 不！！是我的！我先拿到的！😡😭 *开始大哭*'
  },

  // --- Role: Parents ---
  {
    id: 'p1',
    roleId: 'parents',
    title: 'Daily Learning Story (Writing)',
    titleZh: '每日学习记录（书面）',
    difficulty: 'Beginner',
    description: 'Write a short bilingual update in the centre app about today\'s learning.',
    context: 'Write a short bilingual update in the centre app about today\'s learning, referencing observations and linking to NEL areas.',
    contextZh: '在中心应用程序中写一段简短的双语更新，介绍今天的学习情况，引用观察结果并联系到 NEL 领域。',
    aiContext: 'Check for "Sandwich Method". Check if they link observation to NEL domains (e.g., Discovery of the World).',
    tags: ['Home-School Partnership', 'Child Observation'],
    mode: 'text',
    initialMessage: 'Hi Teacher, just checking in... how was my boy today? Did he join in the activities? 🤔 Hope he didn\'t cause any trouble!',
    initialMessageZh: '老师好，想问一下... 我儿子今天怎么样？他有参与活动吗？🤔 希望他没有惹麻烦！'
  },
  {
    id: 'p2',
    roleId: 'parents',
    title: 'Parent Inquiry: Bilingual Concern',
    titleZh: '家长咨询：双语进展关切',
    difficulty: 'Intermediate',
    description: 'A K1 parent messages concerned their child resists Mandarin.',
    context: 'A K1 parent messages you concerned their child resists Mandarin. Reply to acknowledge feelings, share observations, and suggest home strategies.',
    contextZh: '一位 K1 家长发信息给你，担心孩子抗拒说华语。回复以安抚情绪，分享观察，并建议家庭策略。',
    aiContext: 'Evaluate tone: Empathetic. Content: Suggest authentic learning strategies (iTeach) like songs or cartoons, not drilling.',
    tags: ['Family Partnership', 'Bilingual Support'],
    mode: 'text',
    initialMessage: 'Hello Teacher 👋, I noticed recently my girl refuses to speak Mandarin at home. Every time I try, she just replies in English. Is she like that in class also? A bit worried she cannot catch up leh... 😟',
    initialMessageZh: '老师您好 👋，我最近发现我女儿在家里不肯说华语。每次我尝试，她都只用英语回答。她在班上也是这样吗？有点担心她跟不上... 😟'
  },
  {
    id: 'p3',
    roleId: 'parents',
    title: 'Home Task Instructions (Writing)',
    titleZh: '家庭任务说明（书面）',
    difficulty: 'Beginner',
    description: 'Draft clear bilingual written instructions for a festive craft.',
    context: 'Draft clear bilingual written instructions for a festive craft (CNY/Deepavali) including safety and links to centre learning goals.',
    contextZh: '起草一份清晰的双语书面说明，用于节日手工制作活动（春节/屠妖节），包括安全提示和与中心学习目标的联系。',
    aiContext: 'Check for clarity, safety warnings, and warm tone. Must link to culture/values.',
    tags: ['Written Communication', 'Family Engagement'],
    mode: 'text',
    initialMessage: '(This is a writing task. Please draft the message you would send to parents regarding the upcoming Lantern Festival lantern-making task.)',
    initialMessageZh: '（这是一个写作任务。请起草您将发送给家长的关于即将到来的元宵节灯笼制作任务的信息。）'
  },
  {
    id: 'p4',
    roleId: 'parents',
    title: 'Difficult Talk: Referral',
    titleZh: '难点谈话：转介',
    difficulty: 'Challenging',
    description: 'Sensitively discuss possible speech delay via chat.',
    context: 'Sensitively discuss possible speech delay, reference ECDA/KKH pathways, and co-create a support plan in Mandarin/English.',
    contextZh: '通过聊天敏感地讨论可能的语言迟缓问题，引用 ECDA/KKH 途径，并用华语/英语共同制定支持计划。',
    aiContext: 'CRITICAL: User must NOT diagnose. User should share observations (objective) and suggest professional assessment. Tone: Supportive.',
    tags: ['Professional Ethics', 'Sensitive Communication'],
    mode: 'text',
    initialMessage: 'Hi Teacher, thanks for arranging this chat. *looks a bit nervous* Is everything okay with my son? We were quite surprised when you called for a meeting. He is doing okay in class right? 😰',
    initialMessageZh: '老师好，谢谢您的安排。*看起来有点紧张* 我儿子一切都好吗？您叫我们来谈话时，我们挺惊讶的。他在班上还好吗？😰'
  },

  // --- Role: Teachers ---
  {
    id: 't1',
    roleId: 'colleagues',
    title: 'Nurturing VSLDs (Inquiry)',
    titleZh: '培养 VSLD',
    difficulty: 'Intermediate',
    description: 'Discuss how to nurture "Perseverance" in a child.',
    context: 'A child, Ali, gave up immediately when his block tower fell. You are discussing with a senior teacher how to build his "Perseverance" (VSLD).',
    contextZh: '一个叫 Ali 的孩子在积木塔倒塌后立刻放弃了。你正在与一位资深老师讨论如何培养他的“毅力”（VSLD）。',
    aiContext: 'User should identify "Perseverance" (Learning Disposition). User should suggest scaffolding or modeling, not just "helping him build it".',
    tags: ['VSLD', 'Professional Inquiry'],
    mode: 'text',
    initialMessage: 'Hey, did you see Ali just now? *sighs* He just walked away the moment his tower fell. 🧱🏚️ I feel like he gives up very easily. As a teacher, what do you think is the best way to encourage him? (Select the best NEL-aligned approach)',
    initialMessageZh: '嘿，你刚才看到 Ali 了吗？*叹气* 他的塔一倒，他直接就走开了。🧱🏚️ 我觉得他很容易放弃。作为老师，你觉得鼓励他最好的方法是什么？（选择最符合 NEL 的方法）'
  },
];
