
import { FeedbackData, Message, Scenario, Language } from '../types';

const ARTIFICIAL_DELAY_MS = 1500;

export const callGeminiText = async (
  input: string,
  history: Message[],
  scenario: Scenario,
  language: Language = 'en'
): Promise<{ text: string; options?: string[] }> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, ARTIFICIAL_DELAY_MS));

  const lowerInput = input.toLowerCase();

  // --- Teacher MCQ Scenario Logic (VSLD) ---
  if (scenario.id === 't1') {
    if (history.length === 1) { 
       if (language === 'zh') {
           return {
               text: "这个观点很有道理。不过，参考 NEL 框架中关于“毅力”的定义，我们可能更需要关注*过程*，以搭建支架帮助他反思。你觉得哪句话更能达到这个目的？",
               options: [
                   "A: '别难过，我们来搭个小一点的。'",
                   "B: '我看到它在倒塌前摇晃了一下。我们可以怎么调整底座呢？'",
                   "C: '好孩子不放弃。再试一次。'"
               ]
           };
       }
       return {
         text: "That's a valid perspective. However, looking at the NEL framework for 'Perseverance', we might want to focus more on the *process* to scaffold his reflection. Which of these remarks would better achieve that?",
         options: [
           "A: 'Don't be sad, let's build a smaller one.'",
           "B: 'I saw it wobble before it fell. What can we change at the base?'",
           "C: 'Good boys don't give up. Try again.'"
         ]
       };
    }
    if (input.includes("base") || input.includes("wobble") || input.startsWith("B")) {
       return { text: language === 'zh' 
           ? "选择很棒！这符合 NEL 框架，因为它关注的是问题解决（过程导向的表扬），而不是仅仅针对个人的表扬。你会如何在档案中记录这一观察？" 
           : "Excellent choice! This aligns with NEL as it focuses on problem-solving (Process-oriented praise) rather than just person-oriented praise. How would you document this observation in his portfolio?" 
       };
    }
    if (input.startsWith("A") || input.startsWith("C")) {
        return { text: language === 'zh'
            ? "这种方法是鼓励性的，但可能无法帮助他理解*为什么*会倒塌。在 NEL 中，我们希望孩子成为知识的建构者。试着考虑选项 B - 你明白为什么吗？"
            : "That approach is encouraging, but it might not help him understand *why* it fell. In NEL, we want children to be constructors of knowledge. Try considering option B - do you see why?"
        };
    }
  }

  // --- Children Logic (Rowdy / Circle Time) ---
  if (scenario.id === 'c1') {
    if (lowerInput.includes("walk") || lowerInput.includes("gentle") || input.includes("走") || input.includes("慢")) {
       return { text: language === 'zh' 
           ? "(孩子们气喘吁吁地慢下来) 好的老师……我们在走了。我可以坐在 Sarah 旁边吗？" 
           : "(Children slow down panting) Okay teacher... we are walking. Can I sit next to Sarah?" 
       };
    }
    if (lowerInput.includes("stop") || lowerInput.includes("quiet") || lowerInput.includes("shh") || input.includes("停") || input.includes("安静")) {
        return { text: language === 'zh'
            ? "(孩子们不理会，继续咯咯笑) 你抓不到我！！"
            : "(Children ignore and keep giggling) You can't catch me!!" 
        };
    }
    return { text: language === 'zh'
        ? "(大声咯咯笑) 我们不累！我们要跑！"
        : "(Loud giggling) We are not tired! We want to run!" 
    };
  }

  // --- Parent Logic (Bilingual Concern) ---
  if (scenario.id === 'p2') {
     if (lowerInput.includes("understand") || lowerInput.includes("worry") || lowerInput.includes("feel") || input.includes("理解") || input.includes("担心")) {
         return { text: language === 'zh'
             ? "我只是担心他上小学后会跟不上。他在家只说英语。如果他讨厌华文课怎么办？"
             : "I'm just worried he will fall behind in Primary 1. He only speaks English at home. What if he hates Chinese class?" 
         };
     }
     return { text: language === 'zh'
         ? "但他就是不肯说。我放中文动画片时他就哭。"
         : "But he refuses to speak it. He cries when I put on Chinese cartoons." 
     };
  }

  // --- Parent Logic (Referral) ---
  if (scenario.id === 'p4') {
      if (lowerInput.includes("autism") || lowerInput.includes("delay") || input.includes("自闭") || input.includes("迟缓")) {
          return { text: language === 'zh'
              ? "(防卫性地) 你是说我儿子有问题吗？他只是像他爸爸一样开窍晚。"
              : "(Defensive) Are you saying something is wrong with my son? He is just a late bloomer like his father." 
          };
      }
      if (lowerInput.includes("observe") || lowerInput.includes("support") || lowerInput.includes("help him") || input.includes("观察") || input.includes("支持")) {
          return { text: language === 'zh'
              ? "(叹气) 我确实注意到他用手指而不是说话。我们该怎么办？我不知道该去哪里求助。"
              : "(Sighs) I have noticed he points instead of talking. What should we do? I don't know where to go." 
          };
      }
  }

  // Default Generic Responses
  if (scenario.roleId === 'children') {
    return { text: language === 'zh' ? `(孩子看起来很好奇) 老师，为什么?` : `(Child looks curious) Teacher, why?` };
  } else if (scenario.roleId === 'parents') {
    return { text: language === 'zh' ? `(家长点头) 明白了。谢谢老师的建议。` : `(Parent nods) Understood. Thank you for the advice, Teacher.` };
  } else {
    return { text: language === 'zh' ? `这与我们学校的价值观非常契合。我们继续吧。` : `That aligns well with our school's values. Let's proceed with that.` };
  }
};

export const callGeminiVoice = async (
  history: Message[],
  scenario: Scenario,
  language: Language = 'en'
): Promise<string> => {
  await new Promise((resolve) => setTimeout(resolve, ARTIFICIAL_DELAY_MS + 500));

  if (scenario.id === 'c1') {
    return language === 'zh' 
        ? `(混乱和笑声) 抓我呀！！不要喝水！！` 
        : `(Chaos and laughter) catch me!! No water!!`;
  }
  if (scenario.id === 'p2') {
    return language === 'zh'
        ? `(担忧的语气) 老师，我真的不知道该怎么办。我说华语时他就捂住耳朵。`
        : `(Worried tone) Teacher, I really don't know what to do. He just covers his ears when I speak Mandarin.`;
  }
  
  return language === 'zh'
      ? `(语音回复占位符...)`
      : `(Audio Response Placeholder based on context...)`;
};

export const generateFeedback = async (
  history: Message[],
  scenario: Scenario
): Promise<FeedbackData> => {
  await new Promise((resolve) => setTimeout(resolve, 2500));

  return {
    languageProficiency: {
      score: 85,
      comment: "Good use of professional terms in Chinese. You used '毅力' (Perseverance) correctly in context."
    },
    nelAlignment: {
      score: 4,
      comment: "You effectively applied the 'scaffolding' strategy. Remember to allow the child more time to respond."
    },
    strengths: [
      "Clear instructions given to the children (Step-by-step).",
      "Maintained professional yet warm tone with the parent.",
      "Demonstrated understanding of VSLD concepts."
    ],
    suggestions: [
      "In the rowdy scenario, try using a specific auditory signal (like a clap) before speaking.",
      "For the parent feedback, try to start with a positive observation before the area of concern (Sandwich method).",
    ]
  };
};
