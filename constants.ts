
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
    aiContext: 'Evaluate if the user uses Positive Guidance (iTeach). Bad: "Stop running!". Good: "Let\'s use our walking feet." Focus on Self-Management (SEC).',
    tags: ['Routine Management', 'Positive Guidance'],
    mode: 'text',
    initialMessage: '*Running around noisily and laughing* Catch me if you can!! We don\'t want to sit down!'
  },
  {
    id: 'c2',
    roleId: 'children',
    title: 'Conflict at Play Corner',
    titleZh: '游戏角冲突',
    difficulty: 'Intermediate',
    description: 'Resolve a dispute over a toy using NEL principles',
    context: 'Two children are pulling on the same teddy bear. One is crying.',
    aiContext: 'Evaluate user on Relationship Management (SEC). User should facilitate conflict resolution, not just solve it for them.',
    tags: ['Social Emotional', 'Conflict Resolution'],
    mode: 'text'
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
    aiContext: 'Check for "Sandwich Method". Check if they link observation to NEL domains (e.g., Discovery of the World).',
    tags: ['Home-School Partnership', 'Child Observation'],
    mode: 'text'
  },
  {
    id: 'p2',
    roleId: 'parents',
    title: 'Parent Inquiry: Bilingual Concern',
    titleZh: '家长咨询：双语进展关切',
    difficulty: 'Intermediate',
    description: 'A K1 parent messages concerned their child resists Mandarin.',
    context: 'A K1 parent messages you concerned their child resists Mandarin. Reply to acknowledge feelings, share observations, and suggest home strategies.',
    aiContext: 'Evaluate tone: Empathetic. Content: Suggest authentic learning strategies (iTeach) like songs or cartoons, not drilling.',
    tags: ['Family Partnership', 'Bilingual Support'],
    mode: 'text'
  },
  {
    id: 'p3',
    roleId: 'parents',
    title: 'Home Task Instructions (Writing)',
    titleZh: '家庭任务说明（书面）',
    difficulty: 'Beginner',
    description: 'Draft clear bilingual written instructions for a festive craft.',
    context: 'Draft clear bilingual written instructions for a festive craft (CNY/Deepavali) including safety and links to centre learning goals.',
    aiContext: 'Check for clarity, safety warnings, and warm tone. Must link to culture/values.',
    tags: ['Written Communication', 'Family Engagement'],
    mode: 'text'
  },
  {
    id: 'p4',
    roleId: 'parents',
    title: 'Difficult Talk: Referral',
    titleZh: '难点谈话：转介',
    difficulty: 'Challenging',
    description: 'Sensitively discuss possible speech delay via chat.',
    context: 'Sensitively discuss possible speech delay, reference ECDA/KKH pathways, and co-create a support plan in Mandarin/English.',
    aiContext: 'CRITICAL: User must NOT diagnose. User should share observations (objective) and suggest professional assessment. Tone: Supportive.',
    tags: ['Professional Ethics', 'Sensitive Communication'],
    mode: 'text'
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
    aiContext: 'User should identify "Perseverance" (Learning Disposition). User should suggest scaffolding or modeling, not just "helping him build it".',
    tags: ['VSLD', 'Professional Inquiry'],
    mode: 'text',
    initialMessage: 'I noticed Ali just walked away when his tower fell. He seems to lack perseverance. As a teacher, what is the best immediate response to encourage him? (Select the best NEL-aligned approach)'
  },
];
