# Pre-SIP Practice Lab 🎓

A GenAI-powered roleplay simulator designed to help Early Childhood Education students practice professional communication skills before their Student Internship Programme (SIP).

---

## 🌟 Key Features

### 1. **Roleplay Simulations**
Users can engage in realistic text-based conversations with three key stakeholder personas:
- **Children**: Practice positive guidance, routine management, and conflict resolution.
- **Parents**: Handle inquiries, provide feedback using the Sandwich Method, and manage difficult conversations (e.g., referrals).
- **Teachers (Colleagues)**: Discuss professional inquiries and pedagogical strategies (VSLDs).

### 2. **AI Mentor & Live Coaching 💡**
An intelligent "Coach" widget sits within the chat interface.
- **Deep Analysis**: Analyzes the **entire conversation history** to understand context.
- **Structured Feedback**: Provides immediate, actionable tips anchored in the **NEL Framework** (Nurturing Early Learners).
  - **Observation**: Highlights what the student recently did (or missed).
  - **NEL Link**: Connects the behavior to specific competencies (e.g., Social & Emotional Development).
  - **Coach Tip**: Suggests concrete next steps.

### 3. **Bilingual Support (English/Chinese)**
- Full UI and Scenario support for both languages.
- Toggles seamlessly within the chat to practice communicating with Mandarin-speaking parents or grandparents.

### 4. **Post-Session Feedback**
After ending a session, the AI acts as a Senior Lecturer to generate a report card:
- **Language Proficiency Score**: Evaluates professional tone and clarity.
- **NEL Alignment Score**: measures adherence to Singapore's EC standards.
- **Strengths & Growth Areas**: Bulleted qualitative feedback.

---

## 📋 Design Scenarios

The app includes carefully curated scenarios ranging from Beginner to Challenging:

### **Role: Children 👶**
| Scenario | Difficulty | Focus Area |
| :--- | :--- | :--- |
| **Transition to Circle Time** | Beginner | Routine Management, Positive Guidance |
| **Conflict at Play Corner** | Intermediate | Social Emotional (Conflict Resolution) |

### **Role: Parents 👪**
| Scenario | Difficulty | Focus Area |
| :--- | :--- | :--- |
| **Daily Update Inquiry** | Beginner | Home-School Partnership, Sandwich Method |
| **Bilingual Concern** | Intermediate | Family Partnership, Authentic Learning |
| **Home Activity Clarification** | Beginner | Clear Communication |
| **Difficult Talk: Referral** | Challenging | Professional Ethics, Sensitive Communication |

### **Role: Teachers 👩‍🏫**
| Scenario | Difficulty | Focus Area |
| :--- | :--- | :--- |
| **Nurturing VSLDs** | Intermediate | Professional Inquiry, Learning Dispositions |

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Tailwind CSS, Lucide Icons.
- **AI Engine**: Google Gemini API (`gemini-3-flash-preview`).
  - Used for character simulation.
  - Used for pedagogical analysis (Coaching & Feedback).
- **Architecture**: Client-side single-page application (SPA).

---

## 🚀 How to Use

1.  **Select a Role**: Choose who you want to practice with (Child, Parent, or Colleague).
2.  **Choose a Scenario**: Pick a specific situation (e.g., "Conflict at Play Corner").
3.  **Interact**: Chat naturally.
    *   *Stuck?* Click the **Lightbulb** 💡 icon for a Mentor Tip.
    *   *Want to switch language?* Toggle the EN/CN button.
4.  **Review**: Click "End Session" to get your performance scorecard.
