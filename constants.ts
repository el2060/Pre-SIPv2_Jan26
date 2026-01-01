
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
    context: 'The children are running around noisily after outdoor play. Your goal is to use Positive Guidance to get them to: 1) Quiet down, 2) Drink water, and 3) Sit in a circle.',
    contextZh: '户外活动后，孩子们吵吵闹闹地跑来跑去。你的目标是运用正向引导让他们：1) 安静下来，2) 喝水，3) 围坐成一圈。',
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
    context: 'Two children are pulling on the same teddy bear and one is crying. Facilitate conflict resolution by acknowledging feelings and guiding them to solve the problem.',
    contextZh: '两个孩子正在争抢同一个泰迪熊，其中一个在哭。请通过认可感受并引导他们解决问题来促进冲突化解。',
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
    title: 'Daily Update Inquiry',
    titleZh: '每日情况咨询',
    difficulty: 'Beginner',
    description: 'Respond to an anxious parent asking about their child\'s day.',
    context: 'A parent messages you via the centre app, anxious about whether their son participated today. Respond with a specific, positive observation using the "Sandwich Method".',
    contextZh: '一位家长通过中心App发信息给你，担心儿子今天是否参与了活动。请使用“三明治法”，用具体、积极的观察结果来回复。',
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
    context: 'A K1 parent is worried their child refuses to speak Mandarin. Acknowledge their feelings and suggest authentic home learning strategies (e.g. songs, cartoons).',
    contextZh: '一位 K1 家长担心孩子抗拒说华语。请安抚他们的情绪，并建议真实的家庭学习策略（如歌曲、动画片）。',
    aiContext: 'Evaluate tone: Empathetic. Content: Suggest authentic learning strategies (iTeach) like songs or cartoons, not drilling.',
    tags: ['Family Partnership', 'Bilingual Support'],
    mode: 'text',
    initialMessage: 'Hello Teacher 👋, I noticed recently my girl refuses to speak Mandarin at home. Every time I try, she just replies in English. Is she like that in class also? A bit worried she cannot catch up leh... 😟',
    initialMessageZh: '老师您好 👋，我最近发现我女儿在家里不肯说华语。每次我尝试，她都只用英语回答。她在班上也是这样吗？有点担心她跟不上... 😟'
  },
  {
    id: 'p3',
    roleId: 'parents',
    title: 'Home Activity Clarification',
    titleZh: '家庭活动答疑',
    difficulty: 'Beginner',
    description: 'Clarify details for a confused parent regarding a home task.',
    context: 'A parent is confused about the "Lantern Festival" craft notice you sent. They are asking about materials and deadlines. Clarify patiently and encourage participation.',
    contextZh: '一位家长对你发的“元宵节”手工通知感到困惑，询问材料和截止日期。请耐心地澄清细节并鼓励参与。',
    aiContext: 'Check for clarity, safety warnings, and warm tone. Must link to culture/values.',
    tags: ['Family Engagement', 'Clear Communication'],
    mode: 'text',
    initialMessage: 'Teacher, sorry to disturb. I saw the notice about the Lantern Festival craft but I\'m quite confused. 😵‍💫 Do we need to buy the materials ourselves? And is it compulsory? We are quite busy this week...',
    initialMessageZh: '老师，不好意思打扰了。我看到关于元宵节做灯笼的通知，但我有点搞不清楚。😵‍💫 材料我们需要自己买吗？是强制参加的吗？我们这周有点忙...'
  },
  {
    id: 'p4',
    roleId: 'parents',
    title: 'Difficult Talk: Referral',
    titleZh: '难点谈话：转介',
    difficulty: 'Challenging',
    description: 'Sensitively discuss possible speech delay via chat.',
    context: 'You need to discuss a possible speech delay with a nervous parent. Share objective observations and suggest professional assessment (ECDA/KKH pathways) without diagnosing.',
    contextZh: '你需要与一位紧张的家长讨论可能的语言迟缓问题。分享客观观察结果，建议专业评估（ECDA/KKH 途径），但不要进行诊断。',
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
    context: 'A child, Ali, gave up immediately when his block tower fell. You are discussing with a senior teacher how to build his "Perseverance" (VSLD). Choose the best approach.',
    contextZh: '一个叫 Ali 的孩子在积木塔倒塌后立刻放弃了。你正在与一位资深老师讨论如何培养他的“毅力”（VSLD）。请选择最佳方法。',
    aiContext: 'User should identify "Perseverance" (Learning Disposition). User should suggest scaffolding or modeling, not just "helping him build it".',
    tags: ['VSLD', 'Professional Inquiry'],
    mode: 'text',
    initialMessage: 'Hey, did you see Ali just now? *sighs* He just walked away the moment his tower fell. 🧱🏚️ I feel like he gives up very easily. As a teacher, what do you think is the best way to encourage him? (Select the best NEL-aligned approach)',
    initialMessageZh: '嘿，你刚才看到 Ali 了吗？*叹气* 他的塔一倒，他直接就走开了。🧱🏚️ 我觉得他很容易放弃。作为老师，你觉得鼓励他最好的方法是什么？（选择最符合 NEL 的方法）'
  },
];
