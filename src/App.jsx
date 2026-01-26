import React, { useState, useEffect } from 'react';
import { BookOpen, Brain, Target, Clock, Calendar, ChevronRight, Check, X, Volume2, RotateCcw, Trophy, Flame, Star, Zap, MessageCircle, Headphones, FileText, Home, Settings, TrendingUp, Play, Pause, Award, Edit3, Mic } from 'lucide-react';

// Daily Missions - Real-world tasks using your Japan advantage
const dailyMissions = [
  { id: 1, task: "コンビニで「温めますか」に「大丈夫です」以外で答える", english: "At konbini, answer '温めますか' with something other than '大丈夫です'", example: "いいえ、結構です / お願いします", xp: 50 },
  { id: 2, task: "駅員さんに何か質問する", english: "Ask a station staff member a question", example: "〜行きは何番線ですか？", xp: 50 },
  { id: 3, task: "レストランで「おすすめは何ですか」と聞く", english: "Ask 'What do you recommend?' at a restaurant", example: "すみません、おすすめは何ですか？", xp: 50 },
  { id: 4, task: "同僚に週末の予定を聞く", english: "Ask a colleague about their weekend plans", example: "週末は何か予定がありますか？", xp: 50 },
  { id: 5, task: "お店で「〜はありますか」と聞く", english: "Ask 'Do you have ~?' at a store", example: "すみません、Mサイズはありますか？", xp: 50 },
  { id: 6, task: "天気について誰かと話す", english: "Talk about the weather with someone", example: "今日は暑いですね / 寒くなりましたね", xp: 30 },
  { id: 7, task: "電話で予約をする", english: "Make a reservation by phone", example: "予約をお願いしたいんですが...", xp: 100 },
  { id: 8, task: "道を聞かれたら日本語で説明する", english: "If asked for directions, explain in Japanese", example: "まっすぐ行って、右に曲がってください", xp: 75 },
  { id: 9, task: "スーパーで店員さんに商品の場所を聞く", english: "Ask store staff where a product is", example: "すみません、醤油はどこですか？", xp: 40 },
  { id: 10, task: "「お先に失礼します」を使って帰る", english: "Use 'お先に失礼します' when leaving", example: "お先に失礼します。お疲れ様でした。", xp: 30 },
  { id: 11, task: "日本語でコーヒーを注文する（カスタマイズ付き）", english: "Order coffee in Japanese with customization", example: "アイスラテのMサイズ、ミルク少なめでお願いします", xp: 50 },
  { id: 12, task: "誰かの日本語を褒める or 感謝する", english: "Compliment or thank someone in Japanese", example: "説明がとても分かりやすかったです", xp: 40 },
];

// Shadowing phrases with phonetic timing
const shadowingPhrases = [
  { japanese: "すみません、ちょっといいですか。", meaning: "Excuse me, do you have a moment?", speed: "slow" },
  { japanese: "それはちょっと難しいかもしれません。", meaning: "That might be a bit difficult.", speed: "normal" },
  { japanese: "もう一度言っていただけますか。", meaning: "Could you say that again?", speed: "slow" },
  { japanese: "来週の会議は何時からですか。", meaning: "What time is next week's meeting?", speed: "normal" },
  { japanese: "ちょっと考えさせてください。", meaning: "Let me think about it.", speed: "slow" },
  { japanese: "お忙しいところすみません。", meaning: "Sorry to bother you when you're busy.", speed: "normal" },
  { japanese: "そうですね、確かにそうかもしれません。", meaning: "I see, that might be true.", speed: "normal" },
  { japanese: "もしよければ、手伝いましょうか。", meaning: "If you'd like, shall I help?", speed: "slow" },
];

// Output journal prompts
const journalPrompts = [
  { prompt: "今日の天気について一文書いてください", hint: "Use: 今日は〜です" },
  { prompt: "昨日したことを一つ書いてください", hint: "Use: 昨日、〜ました" },
  { prompt: "週末の予定を書いてください", hint: "Use: 〜つもりです / 〜予定です" },
  { prompt: "好きな食べ物とその理由を書いてください", hint: "Use: 〜が好きです。なぜなら〜から" },
  { prompt: "最近見た映画やドラマについて書いてください", hint: "Use: 〜を見ました。〜と思いました" },
  { prompt: "今の気持ちを書いてください", hint: "Use: 〜と感じています / 〜気分です" },
];

// Listening Practice Data - JLPT N4 Style
const listeningExercises = [
  {
    id: 1,
    type: 'dialogue',
    situation: "At a restaurant",
    dialogue: [
      { speaker: "店員", text: "いらっしゃいませ。何名様ですか。" },
      { speaker: "客", text: "二人です。" },
      { speaker: "店員", text: "お席にご案内します。こちらへどうぞ。" },
      { speaker: "客", text: "すみません、窓の近くの席はありますか。" },
      { speaker: "店員", text: "はい、ございます。こちらでよろしいですか。" },
    ],
    question: "お客さんはどんな席がいいですか。",
    options: ["入り口の近く", "窓の近く", "トイレの近く", "どこでもいい"],
    correct: 1,
    explanation: "客は「窓の近くの席はありますか」と聞いています。"
  },
  {
    id: 2,
    type: 'dialogue',
    situation: "Phone call about a meeting",
    dialogue: [
      { speaker: "田中", text: "もしもし、山田さんですか。田中です。" },
      { speaker: "山田", text: "あ、田中さん。お疲れ様です。" },
      { speaker: "田中", text: "明日の会議の時間が変わりました。" },
      { speaker: "山田", text: "そうですか。何時からですか。" },
      { speaker: "田中", text: "午後2時からです。場所は同じです。" },
    ],
    question: "会議は何時からですか。",
    options: ["午前10時", "午後12時", "午後2時", "午後4時"],
    correct: 2,
    explanation: "田中さんは「午後2時からです」と言っています。"
  },
  {
    id: 3,
    type: 'dialogue',
    situation: "At a train station",
    dialogue: [
      { speaker: "客", text: "すみません、東京駅に行きたいんですが。" },
      { speaker: "駅員", text: "東京駅ですね。3番線から出る電車に乗ってください。" },
      { speaker: "客", text: "乗り換えはありますか。" },
      { speaker: "駅員", text: "いいえ、乗り換えなしで行けますよ。" },
      { speaker: "客", text: "どのくらいかかりますか。" },
      { speaker: "駅員", text: "だいたい20分ぐらいです。" },
    ],
    question: "東京駅まで何分ぐらいかかりますか。",
    options: ["10分", "20分", "30分", "40分"],
    correct: 1,
    explanation: "駅員は「だいたい20分ぐらいです」と答えています。"
  },
  {
    id: 4,
    type: 'dialogue',
    situation: "Shopping for clothes",
    dialogue: [
      { speaker: "客", text: "すみません、このシャツのMサイズはありますか。" },
      { speaker: "店員", text: "少々お待ちください。...申し訳ございません、Mサイズは売り切れです。" },
      { speaker: "客", text: "そうですか。じゃ、Lサイズはどうですか。" },
      { speaker: "店員", text: "Lサイズはございます。こちらです。" },
      { speaker: "客", text: "試着してもいいですか。" },
      { speaker: "店員", text: "はい、どうぞ。試着室はあちらです。" },
    ],
    question: "お客さんは最初に何サイズが欲しかったですか。",
    options: ["Sサイズ", "Mサイズ", "Lサイズ", "XLサイズ"],
    correct: 1,
    explanation: "客は最初に「このシャツのMサイズはありますか」と聞いています。"
  },
  {
    id: 5,
    type: 'dialogue',
    situation: "Making weekend plans",
    dialogue: [
      { speaker: "A", text: "週末、何か予定ある？" },
      { speaker: "B", text: "土曜日は友達と映画を見に行くよ。" },
      { speaker: "A", text: "いいね。日曜日は？" },
      { speaker: "B", text: "日曜日は家で勉強するつもり。来週テストがあるから。" },
      { speaker: "A", text: "そっか、頑張ってね。" },
    ],
    question: "Bさんは日曜日に何をしますか。",
    options: ["映画を見る", "友達と遊ぶ", "家で勉強する", "買い物に行く"],
    correct: 2,
    explanation: "Bさんは「日曜日は家で勉強するつもり」と言っています。"
  },
  {
    id: 6,
    type: 'dictation',
    text: "明日の天気は晴れでしょう。",
    hint: "Weather forecast",
    difficulty: "easy"
  },
  {
    id: 7,
    type: 'dictation',
    text: "すみません、トイレはどこですか。",
    hint: "Asking for directions",
    difficulty: "easy"
  },
  {
    id: 8,
    type: 'dictation',
    text: "週末は何をする予定ですか。",
    hint: "Asking about plans",
    difficulty: "medium"
  },
  {
    id: 9,
    type: 'dictation',
    text: "電車が遅れたので、会議に遅刻しました。",
    hint: "Explaining being late",
    difficulty: "medium"
  },
  {
    id: 10,
    type: 'dictation',
    text: "もう一度言っていただけませんか。",
    hint: "Asking someone to repeat",
    difficulty: "medium"
  },
];

// Gamification XP values
const XP_VALUES = {
  cardCorrect: 10,
  cardIncorrect: 2, // Still get some XP for trying
  streakBonus: 5, // Per card in streak
  sessionComplete: 50,
  missionComplete: 50,
  journalEntry: 30,
  shadowingComplete: 20,
  perfectSession: 100, // 100% accuracy bonus
};

// N4 Vocabulary Data (Core 200 words - expandable)
const vocabularyData = [
  { japanese: "会議", reading: "かいぎ", meaning: "meeting, conference", example: "明日会議があります。", exampleMeaning: "There's a meeting tomorrow." },
  { japanese: "経験", reading: "けいけん", meaning: "experience", example: "いい経験になりました。", exampleMeaning: "It was a good experience." },
  { japanese: "説明", reading: "せつめい", meaning: "explanation", example: "説明してください。", exampleMeaning: "Please explain." },
  { japanese: "相談", reading: "そうだん", meaning: "consultation", example: "先生に相談しました。", exampleMeaning: "I consulted with my teacher." },
  { japanese: "準備", reading: "じゅんび", meaning: "preparation", example: "準備はできましたか。", exampleMeaning: "Are you ready?" },
  { japanese: "予約", reading: "よやく", meaning: "reservation", example: "レストランを予約しました。", exampleMeaning: "I made a reservation at the restaurant." },
  { japanese: "紹介", reading: "しょうかい", meaning: "introduction", example: "友達を紹介します。", exampleMeaning: "I'll introduce my friend." },
  { japanese: "連絡", reading: "れんらく", meaning: "contact", example: "連絡してください。", exampleMeaning: "Please contact me." },
  { japanese: "予定", reading: "よてい", meaning: "plan, schedule", example: "今日の予定は何ですか。", exampleMeaning: "What's today's schedule?" },
  { japanese: "心配", reading: "しんぱい", meaning: "worry", example: "心配しないでください。", exampleMeaning: "Please don't worry." },
  { japanese: "最近", reading: "さいきん", meaning: "recently", example: "最近忙しいです。", exampleMeaning: "I've been busy recently." },
  { japanese: "普通", reading: "ふつう", meaning: "ordinary, normal", example: "普通の日です。", exampleMeaning: "It's an ordinary day." },
  { japanese: "特に", reading: "とくに", meaning: "especially", example: "特に問題はありません。", exampleMeaning: "There's no problem in particular." },
  { japanese: "急に", reading: "きゅうに", meaning: "suddenly", example: "急に雨が降りました。", exampleMeaning: "It suddenly started raining." },
  { japanese: "必ず", reading: "かならず", meaning: "certainly, surely", example: "必ず来てください。", exampleMeaning: "Please be sure to come." },
  { japanese: "届ける", reading: "とどける", meaning: "to deliver", example: "荷物を届けます。", exampleMeaning: "I'll deliver the package." },
  { japanese: "届く", reading: "とどく", meaning: "to arrive, reach", example: "手紙が届きました。", exampleMeaning: "The letter arrived." },
  { japanese: "壊れる", reading: "こわれる", meaning: "to break", example: "パソコンが壊れました。", exampleMeaning: "The computer broke." },
  { japanese: "壊す", reading: "こわす", meaning: "to break (something)", example: "窓を壊しました。", exampleMeaning: "I broke the window." },
  { japanese: "決める", reading: "きめる", meaning: "to decide", example: "時間を決めましょう。", exampleMeaning: "Let's decide on a time." },
  { japanese: "決まる", reading: "きまる", meaning: "to be decided", example: "予定が決まりました。", exampleMeaning: "The schedule has been decided." },
  { japanese: "増える", reading: "ふえる", meaning: "to increase", example: "人口が増えています。", exampleMeaning: "The population is increasing." },
  { japanese: "減る", reading: "へる", meaning: "to decrease", example: "お金が減りました。", exampleMeaning: "My money decreased." },
  { japanese: "続ける", reading: "つづける", meaning: "to continue", example: "勉強を続けます。", exampleMeaning: "I'll continue studying." },
  { japanese: "続く", reading: "つづく", meaning: "to continue (intransitive)", example: "雨が続いています。", exampleMeaning: "The rain is continuing." },
  { japanese: "変える", reading: "かえる", meaning: "to change (something)", example: "計画を変えました。", exampleMeaning: "I changed the plan." },
  { japanese: "変わる", reading: "かわる", meaning: "to change", example: "季節が変わりました。", exampleMeaning: "The season changed." },
  { japanese: "集める", reading: "あつめる", meaning: "to collect, gather", example: "切手を集めています。", exampleMeaning: "I collect stamps." },
  { japanese: "集まる", reading: "あつまる", meaning: "to gather", example: "人が集まりました。", exampleMeaning: "People gathered." },
  { japanese: "落とす", reading: "おとす", meaning: "to drop", example: "財布を落としました。", exampleMeaning: "I dropped my wallet." },
  { japanese: "落ちる", reading: "おちる", meaning: "to fall", example: "葉が落ちました。", exampleMeaning: "The leaves fell." },
  { japanese: "見つける", reading: "みつける", meaning: "to find", example: "鍵を見つけました。", exampleMeaning: "I found the key." },
  { japanese: "見つかる", reading: "みつかる", meaning: "to be found", example: "犯人が見つかりました。", exampleMeaning: "The criminal was found." },
  { japanese: "運ぶ", reading: "はこぶ", meaning: "to carry", example: "荷物を運びます。", exampleMeaning: "I'll carry the luggage." },
  { japanese: "起こす", reading: "おこす", meaning: "to wake someone", example: "朝、子供を起こします。", exampleMeaning: "I wake up my child in the morning." },
  { japanese: "育てる", reading: "そだてる", meaning: "to raise, grow", example: "花を育てています。", exampleMeaning: "I'm growing flowers." },
  { japanese: "捨てる", reading: "すてる", meaning: "to throw away", example: "ゴミを捨ててください。", exampleMeaning: "Please throw away the trash." },
  { japanese: "選ぶ", reading: "えらぶ", meaning: "to choose", example: "好きな色を選んでください。", exampleMeaning: "Please choose your favorite color." },
  { japanese: "払う", reading: "はらう", meaning: "to pay", example: "お金を払いました。", exampleMeaning: "I paid the money." },
  { japanese: "乗り換える", reading: "のりかえる", meaning: "to transfer (trains)", example: "新宿で乗り換えてください。", exampleMeaning: "Please transfer at Shinjuku." },
];

// N4 Kanji Data (Core 150 kanji)
const kanjiData = [
  { kanji: "会", onyomi: "カイ", kunyomi: "あ.う", meaning: "meet, meeting", words: ["会う (あう) - to meet", "会議 (かいぎ) - meeting", "会社 (かいしゃ) - company"] },
  { kanji: "同", onyomi: "ドウ", kunyomi: "おな.じ", meaning: "same, similar", words: ["同じ (おなじ) - same", "同時 (どうじ) - simultaneous"] },
  { kanji: "事", onyomi: "ジ", kunyomi: "こと", meaning: "thing, matter", words: ["事 (こと) - thing", "仕事 (しごと) - work", "食事 (しょくじ) - meal"] },
  { kanji: "自", onyomi: "ジ", kunyomi: "みずか.ら", meaning: "self", words: ["自分 (じぶん) - oneself", "自転車 (じてんしゃ) - bicycle"] },
  { kanji: "社", onyomi: "シャ", kunyomi: "やしろ", meaning: "company, shrine", words: ["会社 (かいしゃ) - company", "神社 (じんじゃ) - shrine"] },
  { kanji: "発", onyomi: "ハツ", kunyomi: "", meaning: "departure, emit", words: ["出発 (しゅっぱつ) - departure", "発表 (はっぴょう) - announcement"] },
  { kanji: "者", onyomi: "シャ", kunyomi: "もの", meaning: "person", words: ["医者 (いしゃ) - doctor", "若者 (わかもの) - young person"] },
  { kanji: "地", onyomi: "チ・ジ", kunyomi: "", meaning: "ground, earth", words: ["地下 (ちか) - underground", "地図 (ちず) - map"] },
  { kanji: "業", onyomi: "ギョウ", kunyomi: "わざ", meaning: "business, industry", words: ["仕業 (しわざ) - deed", "授業 (じゅぎょう) - class"] },
  { kanji: "方", onyomi: "ホウ", kunyomi: "かた", meaning: "direction, way", words: ["方 (かた) - person (polite)", "方法 (ほうほう) - method"] },
  { kanji: "新", onyomi: "シン", kunyomi: "あたら.しい", meaning: "new", words: ["新しい (あたらしい) - new", "新聞 (しんぶん) - newspaper"] },
  { kanji: "場", onyomi: "ジョウ", kunyomi: "ば", meaning: "place", words: ["場所 (ばしょ) - place", "駐車場 (ちゅうしゃじょう) - parking lot"] },
  { kanji: "員", onyomi: "イン", kunyomi: "", meaning: "member", words: ["会員 (かいいん) - member", "店員 (てんいん) - store clerk"] },
  { kanji: "立", onyomi: "リツ", kunyomi: "た.つ", meaning: "stand", words: ["立つ (たつ) - to stand", "国立 (こくりつ) - national"] },
  { kanji: "開", onyomi: "カイ", kunyomi: "あ.く・ひら.く", meaning: "open", words: ["開く (あく/ひらく) - to open", "開発 (かいはつ) - development"] },
  { kanji: "手", onyomi: "シュ", kunyomi: "て", meaning: "hand", words: ["手 (て) - hand", "上手 (じょうず) - skillful", "下手 (へた) - unskillful"] },
  { kanji: "力", onyomi: "リョク・リキ", kunyomi: "ちから", meaning: "power, strength", words: ["力 (ちから) - power", "努力 (どりょく) - effort"] },
  { kanji: "問", onyomi: "モン", kunyomi: "と.う", meaning: "question", words: ["問題 (もんだい) - problem", "質問 (しつもん) - question"] },
  { kanji: "代", onyomi: "ダイ", kunyomi: "か.わる", meaning: "substitute, era", words: ["時代 (じだい) - era", "代わり (かわり) - substitute"] },
  { kanji: "明", onyomi: "メイ・ミョウ", kunyomi: "あか.るい", meaning: "bright, clear", words: ["明るい (あかるい) - bright", "説明 (せつめい) - explanation"] },
  { kanji: "動", onyomi: "ドウ", kunyomi: "うご.く", meaning: "move", words: ["動く (うごく) - to move", "運動 (うんどう) - exercise"] },
  { kanji: "京", onyomi: "キョウ・ケイ", kunyomi: "", meaning: "capital", words: ["東京 (とうきょう) - Tokyo", "京都 (きょうと) - Kyoto"] },
  { kanji: "目", onyomi: "モク", kunyomi: "め", meaning: "eye", words: ["目 (め) - eye", "目的 (もくてき) - purpose"] },
  { kanji: "通", onyomi: "ツウ", kunyomi: "とお.る・かよ.う", meaning: "pass through", words: ["通る (とおる) - to pass", "通う (かよう) - to commute"] },
  { kanji: "言", onyomi: "ゲン・ゴン", kunyomi: "い.う", meaning: "say, word", words: ["言う (いう) - to say", "言葉 (ことば) - word"] },
  { kanji: "理", onyomi: "リ", kunyomi: "", meaning: "reason, logic", words: ["理由 (りゆう) - reason", "料理 (りょうり) - cooking"] },
  { kanji: "体", onyomi: "タイ", kunyomi: "からだ", meaning: "body", words: ["体 (からだ) - body", "体育 (たいいく) - physical education"] },
  { kanji: "田", onyomi: "デン", kunyomi: "た", meaning: "rice field", words: ["田んぼ (たんぼ) - rice paddy", "田中 (たなか) - Tanaka (name)"] },
  { kanji: "主", onyomi: "シュ", kunyomi: "おも・ぬし", meaning: "main, master", words: ["主人 (しゅじん) - husband/master", "主に (おもに) - mainly"] },
  { kanji: "題", onyomi: "ダイ", kunyomi: "", meaning: "topic, title", words: ["問題 (もんだい) - problem", "題名 (だいめい) - title"] },
];

// N4 Grammar Data (Essential 50 patterns)
const grammarData = [
  {
    pattern: "〜ている",
    meaning: "Continuous action / Resulting state",
    formation: "Verb て-form + いる",
    examples: [
      { japanese: "今、本を読んでいます。", meaning: "I am reading a book now." },
      { japanese: "結婚しています。", meaning: "I am married." }
    ],
    notes: "Used for ongoing actions or states resulting from past actions."
  },
  {
    pattern: "〜てから",
    meaning: "After doing ~",
    formation: "Verb て-form + から",
    examples: [
      { japanese: "ご飯を食べてから、勉強します。", meaning: "After eating, I'll study." },
      { japanese: "日本に来てから、三年になります。", meaning: "It's been 3 years since I came to Japan." }
    ],
    notes: "Indicates one action follows another."
  },
  {
    pattern: "〜ないで",
    meaning: "Without doing ~",
    formation: "Verb ない-form + で",
    examples: [
      { japanese: "朝ご飯を食べないで、学校に行きました。", meaning: "I went to school without eating breakfast." },
      { japanese: "辞書を使わないで、読んでください。", meaning: "Please read without using a dictionary." }
    ],
    notes: "Indicates an action done without doing something else."
  },
  {
    pattern: "〜なければならない",
    meaning: "Must do ~, have to ~",
    formation: "Verb ない-form (remove い) + ければならない",
    examples: [
      { japanese: "宿題をしなければなりません。", meaning: "I have to do my homework." },
      { japanese: "明日、早く起きなければならない。", meaning: "I have to wake up early tomorrow." }
    ],
    notes: "Expresses obligation or necessity."
  },
  {
    pattern: "〜なくてもいい",
    meaning: "Don't have to ~",
    formation: "Verb ない-form (remove い) + くてもいい",
    examples: [
      { japanese: "明日は来なくてもいいです。", meaning: "You don't have to come tomorrow." },
      { japanese: "全部食べなくてもいいですよ。", meaning: "You don't have to eat everything." }
    ],
    notes: "Expresses lack of necessity."
  },
  {
    pattern: "〜てもいい",
    meaning: "May ~, It's okay to ~",
    formation: "Verb て-form + もいい",
    examples: [
      { japanese: "ここで写真を撮ってもいいですか。", meaning: "May I take photos here?" },
      { japanese: "窓を開けてもいいですよ。", meaning: "You may open the window." }
    ],
    notes: "Asking or giving permission."
  },
  {
    pattern: "〜てはいけない",
    meaning: "Must not ~, May not ~",
    formation: "Verb て-form + はいけない",
    examples: [
      { japanese: "ここでたばこを吸ってはいけません。", meaning: "You must not smoke here." },
      { japanese: "遅れてはいけませんよ。", meaning: "You must not be late." }
    ],
    notes: "Expresses prohibition."
  },
  {
    pattern: "〜たことがある",
    meaning: "Have experienced ~",
    formation: "Verb た-form + ことがある",
    examples: [
      { japanese: "日本に行ったことがあります。", meaning: "I have been to Japan." },
      { japanese: "この映画を見たことがありますか。", meaning: "Have you seen this movie?" }
    ],
    notes: "Indicates past experience."
  },
  {
    pattern: "〜たほうがいい",
    meaning: "Should ~, It's better to ~",
    formation: "Verb た-form + ほうがいい",
    examples: [
      { japanese: "薬を飲んだほうがいいですよ。", meaning: "You should take medicine." },
      { japanese: "早く寝たほうがいい。", meaning: "You should go to bed early." }
    ],
    notes: "Giving advice (for doing something)."
  },
  {
    pattern: "〜ないほうがいい",
    meaning: "Should not ~, Better not to ~",
    formation: "Verb ない-form + ほうがいい",
    examples: [
      { japanese: "あまり食べないほうがいいですよ。", meaning: "You shouldn't eat too much." },
      { japanese: "遅くまで起きていないほうがいい。", meaning: "You shouldn't stay up late." }
    ],
    notes: "Giving advice (for not doing something)."
  },
  {
    pattern: "〜つもり",
    meaning: "Intend to ~, Plan to ~",
    formation: "Verb dictionary form + つもり",
    examples: [
      { japanese: "来年、日本に行くつもりです。", meaning: "I plan to go to Japan next year." },
      { japanese: "大学で何を勉強するつもりですか。", meaning: "What do you plan to study at university?" }
    ],
    notes: "Expresses intention or plan."
  },
  {
    pattern: "〜ことができる",
    meaning: "Can ~, Be able to ~",
    formation: "Verb dictionary form + ことができる",
    examples: [
      { japanese: "日本語を話すことができます。", meaning: "I can speak Japanese." },
      { japanese: "漢字を読むことができますか。", meaning: "Can you read kanji?" }
    ],
    notes: "Alternative way to express ability (more formal than potential form)."
  },
  {
    pattern: "Potential Form",
    meaning: "Can ~, Be able to ~",
    formation: "Change verb ending: る→られる, う→える",
    examples: [
      { japanese: "日本語が話せます。", meaning: "I can speak Japanese." },
      { japanese: "漢字が読めますか。", meaning: "Can you read kanji?" }
    ],
    notes: "Note: The object particle changes from を to が with potential form."
  },
  {
    pattern: "〜そうだ (appearance)",
    meaning: "Looks like ~, Seems ~",
    formation: "い-adj stem / な-adj / Verb stem + そうだ",
    examples: [
      { japanese: "このケーキはおいしそうですね。", meaning: "This cake looks delicious." },
      { japanese: "雨が降りそうです。", meaning: "It looks like it's going to rain." }
    ],
    notes: "Based on visual observation or intuition."
  },
  {
    pattern: "〜そうだ (hearsay)",
    meaning: "I heard that ~, They say ~",
    formation: "Plain form + そうだ",
    examples: [
      { japanese: "明日、雪が降るそうです。", meaning: "I heard it will snow tomorrow." },
      { japanese: "彼女は結婚したそうです。", meaning: "I heard she got married." }
    ],
    notes: "Reporting information heard from others."
  },
  {
    pattern: "〜ようだ / みたいだ",
    meaning: "Seems like ~, Appears to be ~",
    formation: "Plain form + ようだ / みたいだ",
    examples: [
      { japanese: "田中さんは忙しいようです。", meaning: "Mr. Tanaka seems to be busy." },
      { japanese: "彼は怒っているみたいだ。", meaning: "He seems to be angry." }
    ],
    notes: "Based on observation or information (みたいだ is more casual)."
  },
  {
    pattern: "〜ので",
    meaning: "Because ~, Since ~",
    formation: "Plain form + ので (な-adj/noun + なので)",
    examples: [
      { japanese: "病気なので、学校を休みます。", meaning: "Since I'm sick, I'll be absent from school." },
      { japanese: "時間がないので、急ぎましょう。", meaning: "Since we don't have time, let's hurry." }
    ],
    notes: "More polite/formal than から for giving reasons."
  },
  {
    pattern: "〜のに",
    meaning: "Although ~, Even though ~",
    formation: "Plain form + のに (な-adj + なのに)",
    examples: [
      { japanese: "約束したのに、来ませんでした。", meaning: "Even though he promised, he didn't come." },
      { japanese: "高いのに、買いました。", meaning: "Even though it was expensive, I bought it." }
    ],
    notes: "Expresses disappointment or unexpected results."
  },
  {
    pattern: "〜たら",
    meaning: "If ~, When ~",
    formation: "Verb た-form + ら",
    examples: [
      { japanese: "雨が降ったら、行きません。", meaning: "If it rains, I won't go." },
      { japanese: "駅に着いたら、電話してください。", meaning: "When you arrive at the station, please call." }
    ],
    notes: "Conditional form expressing 'if/when'."
  },
  {
    pattern: "〜ば",
    meaning: "If ~",
    formation: "Change verb ending: る→れば, う→えば",
    examples: [
      { japanese: "勉強すれば、合格できます。", meaning: "If you study, you can pass." },
      { japanese: "安ければ、買います。", meaning: "If it's cheap, I'll buy it." }
    ],
    notes: "Conditional form (more hypothetical than たら)."
  },
  {
    pattern: "〜なら",
    meaning: "If (it is the case that) ~",
    formation: "Noun/Na-adj + なら, Plain form + なら",
    examples: [
      { japanese: "日本に行くなら、京都に行ったほうがいいですよ。", meaning: "If you're going to Japan, you should go to Kyoto." },
      { japanese: "暇なら、手伝ってください。", meaning: "If you're free, please help me." }
    ],
    notes: "Used when responding to new information or giving advice."
  },
  {
    pattern: "〜と",
    meaning: "When ~, If ~ (always)",
    formation: "Verb dictionary/ない form + と",
    examples: [
      { japanese: "春になると、桜が咲きます。", meaning: "When spring comes, cherry blossoms bloom." },
      { japanese: "このボタンを押すと、ドアが開きます。", meaning: "If you press this button, the door opens." }
    ],
    notes: "Natural/inevitable consequences, or giving instructions."
  },
  {
    pattern: "〜てしまう",
    meaning: "End up doing ~, Completely ~",
    formation: "Verb て-form + しまう",
    examples: [
      { japanese: "財布をなくしてしまいました。", meaning: "I ended up losing my wallet." },
      { japanese: "全部食べてしまった。", meaning: "I ate it all up." }
    ],
    notes: "Expresses completion or regret."
  },
  {
    pattern: "〜ておく",
    meaning: "Do ~ in advance, Keep ~ (as is)",
    formation: "Verb て-form + おく",
    examples: [
      { japanese: "ホテルを予約しておきます。", meaning: "I'll make a hotel reservation in advance." },
      { japanese: "窓を開けておいてください。", meaning: "Please leave the window open." }
    ],
    notes: "Preparation or leaving something in a state."
  },
  {
    pattern: "〜てみる",
    meaning: "Try doing ~",
    formation: "Verb て-form + みる",
    examples: [
      { japanese: "日本料理を作ってみました。", meaning: "I tried making Japanese food." },
      { japanese: "この服を着てみてもいいですか。", meaning: "May I try on these clothes?" }
    ],
    notes: "Trying something to see what it's like."
  },
  {
    pattern: "〜ながら",
    meaning: "While doing ~",
    formation: "Verb ます-stem + ながら",
    examples: [
      { japanese: "音楽を聞きながら、勉強します。", meaning: "I study while listening to music." },
      { japanese: "歩きながら、話しましょう。", meaning: "Let's talk while walking." }
    ],
    notes: "Two actions happening simultaneously."
  },
  {
    pattern: "〜たり〜たりする",
    meaning: "Do things like ~ and ~",
    formation: "Verb た-form + り + Verb た-form + り + する",
    examples: [
      { japanese: "週末は映画を見たり、本を読んだりします。", meaning: "On weekends, I do things like watching movies and reading books." },
      { japanese: "天気が良くなったり悪くなったりしています。", meaning: "The weather keeps getting better and worse." }
    ],
    notes: "Lists representative actions (not exhaustive)."
  },
  {
    pattern: "〜し",
    meaning: "And also, Moreover (listing reasons)",
    formation: "Plain form + し",
    examples: [
      { japanese: "あの店は安いし、おいしいし、よく行きます。", meaning: "That restaurant is cheap, and the food is good, so I often go there." },
      { japanese: "時間もないし、お金もないし、旅行できません。", meaning: "I don't have time, and I don't have money, so I can't travel." }
    ],
    notes: "Lists multiple reasons or characteristics."
  },
  {
    pattern: "〜ようにする",
    meaning: "Try to ~, Make sure to ~",
    formation: "Verb dictionary/ない form + ようにする",
    examples: [
      { japanese: "毎日運動するようにしています。", meaning: "I try to exercise every day." },
      { japanese: "遅刻しないようにしてください。", meaning: "Please make sure not to be late." }
    ],
    notes: "Making an effort to do/not do something."
  },
  {
    pattern: "〜ようになる",
    meaning: "Come to ~, Become able to ~",
    formation: "Verb dictionary/ない form + ようになる",
    examples: [
      { japanese: "日本語が話せるようになりました。", meaning: "I've become able to speak Japanese." },
      { japanese: "最近、野菜を食べるようになった。", meaning: "Recently, I've started eating vegetables." }
    ],
    notes: "Gradual change in ability or habit."
  },
];

// Daily Conversation Phrases (Practical N3/N4 level)
const conversationData = [
  {
    category: "Greetings & Daily",
    phrases: [
      { japanese: "お疲れ様です", reading: "おつかれさまです", meaning: "Good work / Thank you for your work", usage: "Used when leaving work or greeting colleagues" },
      { japanese: "お先に失礼します", reading: "おさきにしつれいします", meaning: "Excuse me for leaving first", usage: "When leaving before others" },
      { japanese: "いってきます", reading: "いってきます", meaning: "I'm off / I'm leaving", usage: "Said when leaving home" },
      { japanese: "ただいま", reading: "ただいま", meaning: "I'm home", usage: "Said when returning home" },
      { japanese: "いただきます", reading: "いただきます", meaning: "Thank you for the food", usage: "Said before eating" },
      { japanese: "ごちそうさまでした", reading: "ごちそうさまでした", meaning: "Thank you for the meal", usage: "Said after eating" },
    ]
  },
  {
    category: "Making Requests",
    phrases: [
      { japanese: "〜をお願いします", reading: "〜をおねがいします", meaning: "Please give me ~ / I'd like ~", usage: "Polite request" },
      { japanese: "すみません、〜てもらえますか", reading: "すみません、〜てもらえますか", meaning: "Excuse me, could you ~?", usage: "Asking someone to do something" },
      { japanese: "〜ていただけませんか", reading: "〜ていただけませんか", meaning: "Would you mind ~?", usage: "Very polite request" },
      { japanese: "ちょっと待ってください", reading: "ちょっとまってください", meaning: "Please wait a moment", usage: "Asking someone to wait" },
    ]
  },
  {
    category: "Expressing Opinions",
    phrases: [
      { japanese: "〜と思います", reading: "〜とおもいます", meaning: "I think that ~", usage: "Sharing your opinion" },
      { japanese: "私の意見では", reading: "わたしのいけんでは", meaning: "In my opinion", usage: "Introducing your viewpoint" },
      { japanese: "〜かもしれません", reading: "〜かもしれません", meaning: "Maybe ~, Perhaps ~", usage: "Expressing possibility" },
      { japanese: "〜はずです", reading: "〜はずです", meaning: "Should be ~, Ought to ~", usage: "Expressing expectation" },
    ]
  },
  {
    category: "Shopping & Restaurant",
    phrases: [
      { japanese: "これはいくらですか", reading: "これはいくらですか", meaning: "How much is this?", usage: "Asking for price" },
      { japanese: "カードで払えますか", reading: "カードではらえますか", meaning: "Can I pay by card?", usage: "Asking about payment" },
      { japanese: "注文をお願いします", reading: "ちゅうもんをおねがいします", meaning: "I'd like to order, please", usage: "Getting waiter's attention" },
      { japanese: "お会計をお願いします", reading: "おかいけいをおねがいします", meaning: "Check, please", usage: "Asking for the bill" },
      { japanese: "持ち帰りでお願いします", reading: "もちかえりでおねがいします", meaning: "For takeout, please", usage: "Ordering takeout" },
    ]
  },
  {
    category: "Directions & Transportation",
    phrases: [
      { japanese: "〜はどこですか", reading: "〜はどこですか", meaning: "Where is ~?", usage: "Asking for location" },
      { japanese: "〜への行き方を教えてください", reading: "〜へのいきかたをおしえてください", meaning: "Please tell me how to get to ~", usage: "Asking for directions" },
      { japanese: "次の駅で降ります", reading: "つぎのえきでおります", meaning: "I'll get off at the next station", usage: "On public transport" },
      { japanese: "〜まで何分かかりますか", reading: "〜までなんぷんかかりますか", meaning: "How many minutes does it take to ~?", usage: "Asking about travel time" },
    ]
  },
];

// Quiz Questions for Listening Practice
const listeningQuestions = [
  {
    question: "田中さんは何時に会議がありますか。",
    audio: "Tanaka-san, ashita no kaigi wa nanji kara desu ka? — Juuji kara desu.",
    options: ["9時", "10時", "11時", "12時"],
    correct: 1,
    translation: "What time does Mr. Tanaka have a meeting?"
  },
  {
    question: "女の人は何を注文しましたか。",
    audio: "Sumimasen, koohii to keeki o onegaishimasu.",
    options: ["コーヒーだけ", "ケーキだけ", "コーヒーとケーキ", "紅茶とケーキ"],
    correct: 2,
    translation: "What did the woman order?"
  },
];

// SRS System - Spaced Repetition Algorithm
const SRS_INTERVALS = [
  0,      // Level 0: Review immediately (same session)
  1,      // Level 1: Review in 1 day
  3,      // Level 2: Review in 3 days
  7,      // Level 3: Review in 7 days
  14,     // Level 4: Review in 14 days
  30,     // Level 5: Review in 30 days
  90,     // Level 6: Review in 90 days (mastered)
];

// LocalStorage Keys
const STORAGE_KEYS = {
  vocabSRS: 'jlpt_n4_vocab_srs',
  kanjiSRS: 'jlpt_n4_kanji_srs',
  grammarSRS: 'jlpt_n4_grammar_srs',
  xp: 'jlpt_n4_xp',
  level: 'jlpt_n4_level',
  streak: 'jlpt_n4_streak',
  lastStudyDate: 'jlpt_n4_last_study_date',
  mistakeLog: 'jlpt_n4_mistakes',
  missionCompleted: 'jlpt_n4_mission_date',
  totalStudyDays: 'jlpt_n4_total_study_days',
};

// Helper functions for localStorage
const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('Could not save to localStorage:', e);
  }
};

const loadFromStorage = (key, defaultValue) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (e) {
    console.warn('Could not load from localStorage:', e);
    return defaultValue;
  }
};

const initializeSRSData = (data, type) => {
  return data.map((item, index) => ({
    ...item,
    id: `${type}-${index}`,
    srsLevel: 0,
    nextReview: new Date().toISOString(),
    reviewCount: 0,
    correctCount: 0,
    lastReviewed: null,
  }));
};

const getCardsForReview = (cards) => {
  const now = new Date();
  return cards
    .filter(card => new Date(card.nextReview) <= now)
    .sort((a, b) => {
      // Prioritize: lower SRS level first, then older review date
      if (a.srsLevel !== b.srsLevel) return a.srsLevel - b.srsLevel;
      return new Date(a.nextReview) - new Date(b.nextReview);
    });
};

const updateCardSRS = (card, isCorrect) => {
  const now = new Date();
  let newLevel = card.srsLevel;
  
  if (isCorrect) {
    newLevel = Math.min(card.srsLevel + 1, SRS_INTERVALS.length - 1);
  } else {
    // Drop back 2 levels on incorrect (but not below 0)
    newLevel = Math.max(card.srsLevel - 2, 0);
  }
  
  const daysUntilNext = SRS_INTERVALS[newLevel];
  const nextReview = new Date(now);
  nextReview.setDate(nextReview.getDate() + daysUntilNext);
  
  return {
    ...card,
    srsLevel: newLevel,
    nextReview: nextReview.toISOString(),
    reviewCount: card.reviewCount + 1,
    correctCount: card.correctCount + (isCorrect ? 1 : 0),
    lastReviewed: now.toISOString(),
  };
};

// Main App Component
export default function JLPTStudyApp() {
  const [currentView, setCurrentView] = useState('home');
  const [studyMode, setStudyMode] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [dailyProgress, setDailyProgress] = useState({ vocab: 0, kanji: 0, grammar: 0 });
  const [studyHistory, setStudyHistory] = useState([]);
  
  // SRS State - Load from localStorage or initialize fresh
  const [vocabSRS, setVocabSRS] = useState(() => {
    const saved = loadFromStorage(STORAGE_KEYS.vocabSRS, null);
    return saved || initializeSRSData(vocabularyData, 'vocab');
  });
  const [kanjiSRS, setKanjiSRS] = useState(() => {
    const saved = loadFromStorage(STORAGE_KEYS.kanjiSRS, null);
    return saved || initializeSRSData(kanjiData, 'kanji');
  });
  const [grammarSRS, setGrammarSRS] = useState(() => {
    const saved = loadFromStorage(STORAGE_KEYS.grammarSRS, null);
    return saved || initializeSRSData(grammarData, 'grammar');
  });
  const [reviewQueue, setReviewQueue] = useState([]);
  const [mistakeLog, setMistakeLog] = useState(() => loadFromStorage(STORAGE_KEYS.mistakeLog, []));
  
  // Gamification State - Load from localStorage
  const [xp, setXp] = useState(() => loadFromStorage(STORAGE_KEYS.xp, 0));
  const [level, setLevel] = useState(() => loadFromStorage(STORAGE_KEYS.level, 1));
  const [todayXp, setTodayXp] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [totalStudyDays, setTotalStudyDays] = useState(() => loadFromStorage(STORAGE_KEYS.totalStudyDays, 0));
  
  // Streak State - Load and check if streak is still valid
  const [streak, setStreak] = useState(() => {
    const savedStreak = loadFromStorage(STORAGE_KEYS.streak, 0);
    const lastStudyDate = loadFromStorage(STORAGE_KEYS.lastStudyDate, null);
    
    if (lastStudyDate) {
      const last = new Date(lastStudyDate);
      const today = new Date();
      const diffDays = Math.floor((today - last) / (1000 * 60 * 60 * 24));
      
      // If more than 1 day gap (excluding weekends logic could be added), reset streak
      if (diffDays > 2) {
        return 0;
      }
    }
    return savedStreak;
  });
  
  // Daily Mission State - Check if already completed today
  const [todayMission, setTodayMission] = useState(() => {
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    return dailyMissions[dayOfYear % dailyMissions.length];
  });
  const [missionCompleted, setMissionCompleted] = useState(() => {
    const completedDate = loadFromStorage(STORAGE_KEYS.missionCompleted, null);
    if (completedDate) {
      const today = new Date().toDateString();
      return completedDate === today;
    }
    return false;
  });
  
  // Save to localStorage whenever important state changes
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.vocabSRS, vocabSRS);
  }, [vocabSRS]);
  
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.kanjiSRS, kanjiSRS);
  }, [kanjiSRS]);
  
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.grammarSRS, grammarSRS);
  }, [grammarSRS]);
  
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.xp, xp);
  }, [xp]);
  
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.level, level);
  }, [level]);
  
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.streak, streak);
  }, [streak]);
  
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.mistakeLog, mistakeLog);
  }, [mistakeLog]);
  
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.totalStudyDays, totalStudyDays);
  }, [totalStudyDays]);
  
  // Update last study date when completing a session
  const markStudyDay = () => {
    const today = new Date().toDateString();
    const lastStudy = loadFromStorage(STORAGE_KEYS.lastStudyDate, null);
    
    if (lastStudy !== today) {
      saveToStorage(STORAGE_KEYS.lastStudyDate, today);
      setTotalStudyDays(prev => prev + 1);
      setStreak(prev => prev + 1);
    }
  };
  const [sessionTime, setSessionTime] = useState(15); // 15 or 30 minutes
  const [sessionTimer, setSessionTimer] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionPhase, setSessionPhase] = useState('cards'); // 'cards', 'shadowing', 'journal'
  
  // Active Recall State
  const [activeRecallMode, setActiveRecallMode] = useState(true);
  const [userInput, setUserInput] = useState('');
  const [inputFeedback, setInputFeedback] = useState(null);
  
  // Shadowing State
  const [currentShadowPhrase, setCurrentShadowPhrase] = useState(0);
  const [shadowingDone, setShadowingDone] = useState(false);
  
  // Journal State
  const [journalEntry, setJournalEntry] = useState('');
  const [todayPrompt, setTodayPrompt] = useState(() => {
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    return journalPrompts[dayOfYear % journalPrompts.length];
  });
  
  // Listening State
  const [currentListeningIndex, setCurrentListeningIndex] = useState(0);
  const [listeningAnswer, setListeningAnswer] = useState(null);
  const [showListeningResult, setShowListeningResult] = useState(false);
  const [dictationInput, setDictationInput] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [listeningScore, setListeningScore] = useState({ correct: 0, total: 0 });
  
  // Text-to-Speech function
  const speakJapanese = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.8; // Slower for learners
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    }
  };
  
  // Stop speech
  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };
  
  // Calculate level from XP
  const calculateLevel = (totalXp) => Math.floor(totalXp / 500) + 1;
  const xpForNextLevel = (lvl) => lvl * 500;
  const currentLevelProgress = (totalXp) => (totalXp % 500) / 500 * 100;
  
  // Add XP with animation trigger
  const addXp = (amount) => {
    setXp(prev => prev + amount);
    setTodayXp(prev => prev + amount);
    const newTotal = xp + amount;
    const newLevel = calculateLevel(newTotal);
    if (newLevel > level) {
      setLevel(newLevel);
      // Could trigger level up animation here
    }
  };
  
  // Session timer effect
  useEffect(() => {
    let interval;
    if (isSessionActive && sessionTimer > 0) {
      interval = setInterval(() => {
        setSessionTimer(prev => {
          if (prev <= 1) {
            setIsSessionActive(false);
            // Session complete
            addXp(XP_VALUES.sessionComplete);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSessionActive, sessionTimer]);
  
  // Format timer display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate days until exam
  const examDate = new Date('2026-07-06');
  const today = new Date();
  const daysUntilExam = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
  
  // Styles
  const styles = {
    app: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      fontFamily: "'Noto Sans JP', 'Segoe UI', sans-serif",
      color: '#e8e8e8',
      position: 'relative',
      overflow: 'hidden',
    },
    container: {
      maxWidth: '480px',
      margin: '0 auto',
      padding: '20px',
      minHeight: '100vh',
      position: 'relative',
      zIndex: 1,
    },
    header: {
      textAlign: 'center',
      marginBottom: '24px',
      padding: '20px 0',
    },
    title: {
      fontSize: '2rem',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #e94560 0%, #ff6b6b 50%, #feca57 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: '8px',
      letterSpacing: '2px',
    },
    subtitle: {
      fontSize: '0.9rem',
      color: '#8892b0',
      fontWeight: '400',
    },
    card: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      padding: '24px',
      marginBottom: '16px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    },
    cardHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
    },
    statCard: {
      background: 'linear-gradient(135deg, rgba(233, 69, 96, 0.2) 0%, rgba(255, 107, 107, 0.1) 100%)',
      borderRadius: '16px',
      padding: '20px',
      textAlign: 'center',
      border: '1px solid rgba(233, 69, 96, 0.3)',
    },
    statNumber: {
      fontSize: '2.5rem',
      fontWeight: '800',
      color: '#e94560',
      marginBottom: '4px',
    },
    statLabel: {
      fontSize: '0.85rem',
      color: '#8892b0',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    button: {
      background: 'linear-gradient(135deg, #e94560 0%, #ff6b6b 100%)',
      border: 'none',
      borderRadius: '12px',
      padding: '16px 32px',
      color: 'white',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      width: '100%',
    },
    buttonSecondary: {
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    flashcard: {
      background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
      borderRadius: '24px',
      padding: '40px 24px',
      textAlign: 'center',
      minHeight: '300px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      position: 'relative',
      overflow: 'hidden',
    },
    japanese: {
      fontSize: '3rem',
      fontWeight: '700',
      marginBottom: '16px',
      color: '#ffffff',
    },
    reading: {
      fontSize: '1.5rem',
      color: '#e94560',
      marginBottom: '12px',
    },
    meaning: {
      fontSize: '1.2rem',
      color: '#8892b0',
    },
    progressBar: {
      height: '8px',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '4px',
      overflow: 'hidden',
      marginBottom: '8px',
    },
    progressFill: {
      height: '100%',
      background: 'linear-gradient(90deg, #e94560 0%, #feca57 100%)',
      borderRadius: '4px',
      transition: 'width 0.5s ease',
    },
    menuItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '20px',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '16px',
      marginBottom: '12px',
      cursor: 'pointer',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      transition: 'all 0.3s ease',
    },
    iconBox: {
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    nav: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'rgba(26, 26, 46, 0.95)',
      backdropFilter: 'blur(20px)',
      padding: '12px 20px',
      display: 'flex',
      justifyContent: 'space-around',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      zIndex: 100,
    },
    navItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      color: '#8892b0',
      fontSize: '0.7rem',
      cursor: 'pointer',
      transition: 'color 0.3s ease',
      padding: '8px',
    },
    navItemActive: {
      color: '#e94560',
    },
    badge: {
      position: 'absolute',
      top: '-8px',
      right: '-8px',
      background: '#e94560',
      color: 'white',
      borderRadius: '12px',
      padding: '4px 8px',
      fontSize: '0.7rem',
      fontWeight: '700',
    },
    grammarBox: {
      background: 'rgba(233, 69, 96, 0.1)',
      borderRadius: '12px',
      padding: '16px',
      marginTop: '16px',
      borderLeft: '4px solid #e94560',
    },
    exampleBox: {
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '8px',
      padding: '12px',
      marginTop: '12px',
    },
    tag: {
      display: 'inline-block',
      background: 'rgba(233, 69, 96, 0.2)',
      color: '#e94560',
      borderRadius: '20px',
      padding: '4px 12px',
      fontSize: '0.75rem',
      fontWeight: '600',
      marginRight: '8px',
    },
    decorCircle: {
      position: 'absolute',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(233, 69, 96, 0.15) 0%, transparent 70%)',
      pointerEvents: 'none',
    },
  };

  // Reset study session with SRS
  const resetSession = () => {
    setCurrentIndex(0);
    setShowAnswer(false);
    setScore({ correct: 0, total: 0 });
  };

  // Start SRS study session
  const startSRSSession = (mode) => {
    let cards;
    if (mode === 'vocab') cards = vocabSRS;
    else if (mode === 'kanji') cards = kanjiSRS;
    else cards = grammarSRS;
    
    const dueCards = getCardsForReview(cards);
    // Mix in some new cards if not enough due cards (up to 5 new)
    const newCards = cards.filter(c => c.reviewCount === 0).slice(0, 5);
    const sessionCards = [...dueCards.slice(0, 15), ...newCards.slice(0, Math.max(0, 5 - dueCards.length))];
    
    setReviewQueue(sessionCards);
    setStudyMode(mode);
    setCurrentView('study');
    resetSession();
  };

  // Get counts for home screen
  const getDueCounts = () => ({
    vocab: getCardsForReview(vocabSRS).length,
    kanji: getCardsForReview(kanjiSRS).length,
    grammar: getCardsForReview(grammarSRS).length,
  });
  
  const dueCounts = getDueCounts();

  // Handle answer for flashcards with SRS
  const handleAnswer = (isCorrect) => {
    const currentCard = reviewQueue[currentIndex];
    
    // Update SRS data
    const updatedCard = updateCardSRS(currentCard, isCorrect);
    
    // Determine card type
    const cardType = currentCard.type || studyMode;
    
    // Update the correct SRS state
    if (cardType === 'vocab') {
      setVocabSRS(prev => prev.map(c => c.id === updatedCard.id ? updatedCard : c));
    } else if (cardType === 'kanji') {
      setKanjiSRS(prev => prev.map(c => c.id === updatedCard.id ? updatedCard : c));
    } else if (cardType === 'grammar') {
      setGrammarSRS(prev => prev.map(c => c.id === updatedCard.id ? updatedCard : c));
    }
    
    // Log mistakes for review
    if (!isCorrect) {
      setMistakeLog(prev => [...prev.slice(-49), { // Keep last 50 mistakes
        ...currentCard,
        mistakeDate: new Date().toISOString(),
        type: cardType,
      }]);
    }
    
    // Add XP
    if (isCorrect) {
      addXp(XP_VALUES.cardCorrect + (streak * XP_VALUES.streakBonus));
    } else {
      addXp(XP_VALUES.cardIncorrect);
    }
    
    // Update score and streak
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));
    
    if (isCorrect) {
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
    
    setShowAnswer(false);
    
    // If incorrect, add card back to end of queue for re-review this session
    if (!isCorrect && currentIndex < reviewQueue.length - 1) {
      setReviewQueue(prev => [...prev, currentCard]);
    }
    
    if (currentIndex < reviewQueue.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Cards done - transition to shadowing if in timed session
      if (isSessionActive) {
        setSessionPhase('shadowing');
      } else {
        setCurrentView('results');
      }
    }
  };

  // Render Home View
  const renderHome = () => (
    <div>
      {/* Decorative elements */}
      <div style={{...styles.decorCircle, width: '300px', height: '300px', top: '-100px', right: '-100px'}} />
      <div style={{...styles.decorCircle, width: '200px', height: '200px', bottom: '100px', left: '-80px'}} />
      
      {/* Header with Level */}
      <div style={styles.header}>
        <div style={styles.title}>日本語 N4</div>
        <div style={styles.subtitle}>JLPT Exam Preparation</div>
      </div>

      {/* XP & Level Bar */}
      <div style={{...styles.card, padding: '16px', marginBottom: '16px', background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.1) 100%)', border: '1px solid rgba(102, 126, 234, 0.3)'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <Award size={20} color="#feca57" />
            <span style={{fontWeight: '700', color: '#feca57'}}>Level {level}</span>
          </div>
          <div style={{fontSize: '0.8rem', color: '#8892b0'}}>
            {xp} / {xpForNextLevel(level)} XP
          </div>
        </div>
        <div style={{...styles.progressBar, height: '6px'}}>
          <div style={{...styles.progressFill, width: `${currentLevelProgress(xp)}%`, background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'}} />
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.75rem', color: '#8892b0'}}>
          <span>Today: +{todayXp} XP</span>
          <span>{xpForNextLevel(level) - xp} XP to Level {level + 1}</span>
        </div>
      </div>

      {/* Countdown Card */}
      <div style={{...styles.card, background: 'linear-gradient(135deg, rgba(233, 69, 96, 0.2) 0%, rgba(254, 202, 87, 0.1) 100%)'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
          <div style={{...styles.iconBox, background: 'linear-gradient(135deg, #e94560, #ff6b6b)'}}>
            <Calendar size={24} color="white" />
          </div>
          <div style={{flex: 1}}>
            <div style={{fontSize: '0.85rem', color: '#8892b0', marginBottom: '4px'}}>Days Until Exam</div>
            <div style={{fontSize: '2rem', fontWeight: '800', color: '#e94560'}}>{daysUntilExam}</div>
            <div style={{fontSize: '0.8rem', color: '#8892b0'}}>July 6, 2026</div>
          </div>
          <div style={{textAlign: 'right'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '4px', color: '#feca57'}}>
              <Flame size={20} />
              <span style={{fontWeight: '700'}}>{streak}</span>
            </div>
            <div style={{fontSize: '0.7rem', color: '#8892b0'}}>Day Streak</div>
          </div>
        </div>
      </div>

      {/* SMART SESSION START */}
      <div style={{...styles.card, background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.15) 0%, rgba(79, 172, 254, 0.1) 100%)', border: '1px solid rgba(0, 255, 136, 0.3)', marginTop: '16px'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px'}}>
          <h3 style={{fontSize: '1.1rem', fontWeight: '700', color: '#00ff88', margin: 0}}>🎯 Today's Session</h3>
          <div style={{display: 'flex', gap: '8px'}}>
            <button 
              onClick={() => setSessionTime(15)}
              style={{
                background: sessionTime === 15 ? '#00ff88' : 'rgba(255,255,255,0.1)',
                color: sessionTime === 15 ? '#1a1a2e' : '#8892b0',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              15 min
            </button>
            <button 
              onClick={() => setSessionTime(30)}
              style={{
                background: sessionTime === 30 ? '#00ff88' : 'rgba(255,255,255,0.1)',
                color: sessionTime === 30 ? '#1a1a2e' : '#8892b0',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              30 min
            </button>
          </div>
        </div>
        
        <div style={{fontSize: '0.85rem', color: '#8892b0', marginBottom: '16px'}}>
          Your session includes: SRS Cards → Shadowing → Quick Journal
        </div>
        
        <button 
          onClick={() => {
            // Start smart session with all due cards mixed
            const allDue = [
              ...getCardsForReview(vocabSRS).slice(0, 10).map(c => ({...c, type: 'vocab'})),
              ...getCardsForReview(kanjiSRS).slice(0, 5).map(c => ({...c, type: 'kanji'})),
              ...getCardsForReview(grammarSRS).slice(0, 5).map(c => ({...c, type: 'grammar'})),
            ];
            // Shuffle
            const shuffled = allDue.sort(() => Math.random() - 0.5);
            // Add new cards if not enough
            if (shuffled.length < 10) {
              const newVocab = vocabSRS.filter(c => c.reviewCount === 0).slice(0, 5).map(c => ({...c, type: 'vocab'}));
              shuffled.push(...newVocab);
            }
            setReviewQueue(shuffled);
            setStudyMode('mixed');
            setSessionTimer(sessionTime * 60);
            setIsSessionActive(true);
            setSessionPhase('cards');
            setCurrentIndex(0);
            setScore({ correct: 0, total: 0 });
            setShowAnswer(false);
            setCurrentView('study');
          }}
          style={{...styles.button, background: 'linear-gradient(135deg, #00ff88 0%, #00d4aa 100%)', color: '#1a1a2e'}}
        >
          <Play size={20} />
          Start {sessionTime}-Min Session
        </button>
      </div>

      {/* Daily Mission Card */}
      <div style={{...styles.card, marginTop: '16px', border: missionCompleted ? '1px solid rgba(0, 255, 136, 0.5)' : '1px solid rgba(250, 112, 154, 0.3)', background: missionCompleted ? 'rgba(0, 255, 136, 0.1)' : 'linear-gradient(135deg, rgba(250, 112, 154, 0.15) 0%, rgba(254, 225, 64, 0.1) 100%)'}}>
        <div style={{display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '12px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <span style={{fontSize: '1.2rem'}}>{missionCompleted ? '✅' : '📍'}</span>
            <h3 style={{fontSize: '0.95rem', fontWeight: '700', color: missionCompleted ? '#00ff88' : '#fa709a', margin: 0}}>
              Today's Real-World Mission
            </h3>
          </div>
          <span style={{background: 'rgba(254, 202, 87, 0.3)', color: '#feca57', padding: '2px 8px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '700'}}>
            +{todayMission.xp} XP
          </span>
        </div>
        
        <div style={{fontSize: '1.1rem', fontWeight: '600', marginBottom: '8px', color: missionCompleted ? '#8892b0' : '#fff', textDecoration: missionCompleted ? 'line-through' : 'none'}}>
          {todayMission.task}
        </div>
        <div style={{fontSize: '0.85rem', color: '#8892b0', marginBottom: '8px'}}>
          {todayMission.english}
        </div>
        <div style={{fontSize: '0.8rem', color: '#4facfe', fontStyle: 'italic'}}>
          💡 Example: {todayMission.example}
        </div>
        
        {!missionCompleted && (
          <button 
            onClick={() => {
              setMissionCompleted(true);
              saveToStorage(STORAGE_KEYS.missionCompleted, new Date().toDateString());
              addXp(todayMission.xp);
            }}
            style={{...styles.button, marginTop: '12px', background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', padding: '12px'}}
          >
            <Check size={18} />
            I Did It! (+{todayMission.xp} XP)
          </button>
        )}
      </div>

      {/* Quick Stats */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '16px', marginBottom: '24px'}}>
        <div style={styles.statCard}>
          <div style={{...styles.statNumber, fontSize: '1.8rem'}}>1,500</div>
          <div style={styles.statLabel}>Vocab</div>
        </div>
        <div style={styles.statCard}>
          <div style={{...styles.statNumber, fontSize: '1.8rem'}}>300</div>
          <div style={styles.statLabel}>Kanji</div>
        </div>
        <div style={styles.statCard}>
          <div style={{...styles.statNumber, fontSize: '1.8rem'}}>130+</div>
          <div style={styles.statLabel}>Grammar</div>
        </div>
      </div>

      {/* Compact Daily Study Plan */}
      <div style={{...styles.card, padding: '16px', background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.15) 0%, rgba(0, 242, 254, 0.1) 100%)', border: '1px solid rgba(79, 172, 254, 0.3)'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <Clock size={16} color="#4facfe" />
            <span style={{fontSize: '0.9rem', fontWeight: '700', color: '#4facfe'}}>Study Plan</span>
          </div>
          <span style={{fontSize: '0.7rem', background: 'rgba(254, 202, 87, 0.2)', color: '#feca57', padding: '3px 8px', borderRadius: '8px', fontWeight: '600'}}>MON-FRI</span>
        </div>
        
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '0.8rem'}}>
          <div style={{background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '10px'}}>
            <div style={{color: '#feca57', fontWeight: '600', marginBottom: '4px'}}>🌅 Morning</div>
            <div style={{color: '#8892b0'}}>15 vocab + 5 kanji</div>
          </div>
          <div style={{background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '10px'}}>
            <div style={{color: '#f093fb', fontWeight: '600', marginBottom: '4px'}}>🌙 Evening</div>
            <div style={{color: '#8892b0'}}>3 grammar + listening</div>
          </div>
        </div>
        
        <div style={{marginTop: '8px', fontSize: '0.75rem', color: '#a8edea', textAlign: 'center'}}>
          🌴 Weekends: Rest or light review only
        </div>
      </div>

      {/* Study Menu */}
      <h3 style={{fontSize: '1.1rem', fontWeight: '600', marginBottom: '16px', color: '#8892b0'}}>
        Start Studying
      </h3>
      
      {/* Reviews Due Alert */}
      {(dueCounts.vocab + dueCounts.kanji + dueCounts.grammar) > 0 && (
        <div style={{...styles.card, background: 'linear-gradient(135deg, rgba(250, 112, 154, 0.2) 0%, rgba(254, 225, 64, 0.1) 100%)', border: '1px solid rgba(250, 112, 154, 0.4)', marginBottom: '16px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
            <div style={{fontSize: '1.5rem'}}>🔔</div>
            <div>
              <div style={{fontWeight: '600', color: '#fa709a'}}>Reviews Due Today!</div>
              <div style={{fontSize: '0.85rem', color: '#8892b0'}}>
                {dueCounts.vocab > 0 && `${dueCounts.vocab} vocab `}
                {dueCounts.kanji > 0 && `${dueCounts.kanji} kanji `}
                {dueCounts.grammar > 0 && `${dueCounts.grammar} grammar`}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div 
        style={styles.menuItem}
        onClick={() => startSRSSession('vocab')}
      >
        <div style={{...styles.iconBox, background: 'linear-gradient(135deg, #667eea, #764ba2)'}}>
          <BookOpen size={24} color="white" />
        </div>
        <div style={{flex: 1}}>
          <div style={{fontWeight: '600', marginBottom: '4px'}}>Vocabulary</div>
          <div style={{fontSize: '0.85rem', color: '#8892b0'}}>1,500 essential N4 words</div>
        </div>
        {dueCounts.vocab > 0 && (
          <div style={{background: '#e94560', color: 'white', borderRadius: '12px', padding: '4px 10px', fontSize: '0.8rem', fontWeight: '700'}}>
            {dueCounts.vocab}
          </div>
        )}
        <ChevronRight size={20} color="#8892b0" />
      </div>

      <div 
        style={styles.menuItem}
        onClick={() => startSRSSession('kanji')}
      >
        <div style={{...styles.iconBox, background: 'linear-gradient(135deg, #f093fb, #f5576c)'}}>
          <Brain size={24} color="white" />
        </div>
        <div style={{flex: 1}}>
          <div style={{fontWeight: '600', marginBottom: '4px'}}>Kanji</div>
          <div style={{fontSize: '0.85rem', color: '#8892b0'}}>300 N4 kanji characters</div>
        </div>
        {dueCounts.kanji > 0 && (
          <div style={{background: '#e94560', color: 'white', borderRadius: '12px', padding: '4px 10px', fontSize: '0.8rem', fontWeight: '700'}}>
            {dueCounts.kanji}
          </div>
        )}
        <ChevronRight size={20} color="#8892b0" />
      </div>

      <div 
        style={styles.menuItem}
        onClick={() => startSRSSession('grammar')}
      >
        <div style={{...styles.iconBox, background: 'linear-gradient(135deg, #4facfe, #00f2fe)'}}>
          <FileText size={24} color="white" />
        </div>
        <div style={{flex: 1}}>
          <div style={{fontWeight: '600', marginBottom: '4px'}}>Grammar</div>
          <div style={{fontSize: '0.85rem', color: '#8892b0'}}>130+ grammar patterns</div>
        </div>
        {dueCounts.grammar > 0 && (
          <div style={{background: '#e94560', color: 'white', borderRadius: '12px', padding: '4px 10px', fontSize: '0.8rem', fontWeight: '700'}}>
            {dueCounts.grammar}
          </div>
        )}
        <ChevronRight size={20} color="#8892b0" />
      </div>

      <div 
        style={styles.menuItem}
        onClick={() => setCurrentView('mistakes')}
      >
        <div style={{...styles.iconBox, background: 'linear-gradient(135deg, #ff9a9e, #fecfef)'}}>
          <RotateCcw size={24} color="#1a1a2e" />
        </div>
        <div style={{flex: 1}}>
          <div style={{fontWeight: '600', marginBottom: '4px'}}>Mistake Review</div>
          <div style={{fontSize: '0.85rem', color: '#8892b0'}}>Review your weak points</div>
        </div>
        {mistakeLog.length > 0 && (
          <div style={{background: '#feca57', color: '#1a1a2e', borderRadius: '12px', padding: '4px 10px', fontSize: '0.8rem', fontWeight: '700'}}>
            {mistakeLog.length}
          </div>
        )}
        <ChevronRight size={20} color="#8892b0" />
      </div>

      <div 
        style={styles.menuItem}
        onClick={() => setCurrentView('conversation')}
      >
        <div style={{...styles.iconBox, background: 'linear-gradient(135deg, #fa709a, #fee140)'}}>
          <MessageCircle size={24} color="white" />
        </div>
        <div style={{flex: 1}}>
          <div style={{fontWeight: '600', marginBottom: '4px'}}>Daily Conversation</div>
          <div style={{fontSize: '0.85rem', color: '#8892b0'}}>Practical phrases for everyday use</div>
        </div>
        <ChevronRight size={20} color="#8892b0" />
      </div>

      <div 
        style={styles.menuItem}
        onClick={() => {
          setCurrentListeningIndex(0);
          setListeningScore({ correct: 0, total: 0 });
          setShowListeningResult(false);
          setListeningAnswer(null);
          setDictationInput('');
          setCurrentView('listening');
        }}
      >
        <div style={{...styles.iconBox, background: 'linear-gradient(135deg, #a8edea, #fed6e3)'}}>
          <Headphones size={24} color="#1a1a2e" />
        </div>
        <div style={{flex: 1}}>
          <div style={{fontWeight: '600', marginBottom: '4px'}}>Listening Practice</div>
          <div style={{fontSize: '0.85rem', color: '#8892b0'}}>Dialogues & dictation with audio</div>
        </div>
        <ChevronRight size={20} color="#8892b0" />
      </div>

      <div 
        style={styles.menuItem}
        onClick={() => setCurrentView('syllabus')}
      >
        <div style={{...styles.iconBox, background: 'linear-gradient(135deg, #a8edea, #fed6e3)'}}>
          <Target size={24} color="#1a1a2e" />
        </div>
        <div style={{flex: 1}}>
          <div style={{fontWeight: '600', marginBottom: '4px'}}>Exam Guide</div>
          <div style={{fontSize: '0.85rem', color: '#8892b0'}}>What you need to pass N4</div>
        </div>
        <ChevronRight size={20} color="#8892b0" />
      </div>
      
      <div style={{height: '100px'}} /> {/* Spacer for nav */}
    </div>
  );

  // Render Study View (Flashcards with SRS)
  const renderStudy = () => {
    // Handle shadowing phase
    if (sessionPhase === 'shadowing') {
      return renderShadowing();
    }
    
    // Handle journal phase
    if (sessionPhase === 'journal') {
      return renderJournal();
    }
    
    if (reviewQueue.length === 0) {
      return (
        <div style={{textAlign: 'center', paddingTop: '60px'}}>
          <div style={{fontSize: '4rem', marginBottom: '16px'}}>🎉</div>
          <h2 style={{fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px'}}>All Caught Up!</h2>
          <p style={{color: '#8892b0', marginBottom: '32px'}}>No cards due for review right now.<br/>Come back later or start fresh!</p>
          <button 
            style={styles.button}
            onClick={() => setCurrentView('home')}
          >
            Back to Home
          </button>
        </div>
      );
    }

    const currentData = reviewQueue[currentIndex];
    const dataLength = reviewQueue.length;
    const progress = ((currentIndex + 1) / dataLength) * 100;
    
    // Determine card type for mixed sessions
    const cardType = currentData.type || studyMode;
    
    // SRS Level indicator
    const srsLabels = ['New', 'Learning', 'Review', 'Good', 'Strong', 'Solid', 'Mastered'];
    const srsColors = ['#e94560', '#ff6b6b', '#feca57', '#4facfe', '#00f2fe', '#a8edea', '#00ff88'];
    
    // Check active recall answer
    const checkAnswer = () => {
      const correctAnswers = [];
      if (cardType === 'vocab') {
        correctAnswers.push(currentData.reading, currentData.meaning.toLowerCase());
      } else if (cardType === 'kanji') {
        correctAnswers.push(currentData.onyomi, currentData.kunyomi, currentData.meaning.toLowerCase());
      } else {
        correctAnswers.push(currentData.meaning.toLowerCase());
      }
      
      const userAnswer = userInput.trim().toLowerCase();
      const isClose = correctAnswers.some(ans => 
        ans && (userAnswer === ans.toLowerCase() || 
        ans.toLowerCase().includes(userAnswer) || 
        userAnswer.includes(ans.toLowerCase()))
      );
      
      setInputFeedback(isClose ? 'correct' : 'incorrect');
      setShowAnswer(true);
    };

    return (
      <div>
        {/* Session Timer Header */}
        {isSessionActive && (
          <div style={{
            background: sessionTimer < 60 ? 'rgba(233, 69, 96, 0.3)' : 'rgba(0, 255, 136, 0.2)',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            border: `1px solid ${sessionTimer < 60 ? 'rgba(233, 69, 96, 0.5)' : 'rgba(0, 255, 136, 0.3)'}`
          }}>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <Clock size={18} color={sessionTimer < 60 ? '#e94560' : '#00ff88'} />
              <span style={{fontWeight: '700', fontSize: '1.2rem', color: sessionTimer < 60 ? '#e94560' : '#00ff88'}}>
                {formatTime(sessionTimer)}
              </span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
              <span style={{fontSize: '0.8rem', color: '#8892b0'}}>+{todayXp} XP</span>
              <button
                onClick={() => setIsSessionActive(!isSessionActive)}
                style={{background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer'}}
              >
                {isSessionActive ? <Pause size={16} color="#8892b0" /> : <Play size={16} color="#8892b0" />}
              </button>
            </div>
          </div>
        )}
        
        {/* Header */}
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px'}}>
          <button 
            onClick={() => {
              setCurrentView('home');
              setIsSessionActive(false);
            }}
            style={{background: 'none', border: 'none', color: '#8892b0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'}}
          >
            <RotateCcw size={20} />
            Exit
          </button>
          <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '4px', color: '#feca57'}}>
              <Flame size={18} />
              <span style={{fontWeight: '700'}}>{streak}</span>
            </div>
            <div style={{color: '#e94560', fontWeight: '600'}}>
              {score.correct}/{score.total}
            </div>
          </div>
        </div>

        {/* Progress */}
        <div style={styles.progressBar}>
          <div style={{...styles.progressFill, width: `${progress}%`}} />
        </div>
        <div style={{textAlign: 'center', fontSize: '0.85rem', color: '#8892b0', marginBottom: '24px'}}>
          {currentIndex + 1} / {dataLength} • {sessionPhase === 'cards' ? 'Cards' : 'Review'}
        </div>

        {/* Flashcard */}
        <div style={styles.flashcard} onClick={() => !activeRecallMode && setShowAnswer(true)}>
          {/* SRS Level Badge */}
          <div style={{position: 'absolute', top: '12px', right: '12px', background: srsColors[currentData.srsLevel || 0], color: (currentData.srsLevel || 0) > 3 ? '#1a1a2e' : 'white', borderRadius: '8px', padding: '4px 10px', fontSize: '0.7rem', fontWeight: '700'}}>
            {srsLabels[currentData.srsLevel || 0]}
          </div>
          
          {/* Card Type Badge */}
          <div style={{position: 'absolute', top: '12px', left: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', padding: '4px 10px', fontSize: '0.7rem', fontWeight: '600', color: '#8892b0'}}>
            {cardType}
          </div>
          
          {cardType === 'vocab' && (
            <>
              <div style={styles.japanese}>{currentData.japanese}</div>
              
              {/* Active Recall Input */}
              {activeRecallMode && !showAnswer && (
                <div style={{marginTop: '20px'}}>
                  <div style={{fontSize: '0.85rem', color: '#8892b0', marginBottom: '8px'}}>Type the reading or meaning:</div>
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                    placeholder="ひらがな or English..."
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '2px solid rgba(255,255,255,0.2)',
                      background: 'rgba(255,255,255,0.05)',
                      color: 'white',
                      fontSize: '1.1rem',
                      outline: 'none',
                      textAlign: 'center'
                    }}
                    autoFocus
                  />
                  <button
                    onClick={checkAnswer}
                    style={{...styles.button, marginTop: '12px', padding: '12px'}}
                  >
                    Check Answer
                  </button>
                </div>
              )}
              
              {!activeRecallMode && !showAnswer && (
                <div style={{color: '#8892b0', marginTop: '20px'}}>Tap to reveal</div>
              )}
              
              {showAnswer && (
                <>
                  {inputFeedback && (
                    <div style={{
                      background: inputFeedback === 'correct' ? 'rgba(0, 255, 136, 0.2)' : 'rgba(233, 69, 96, 0.2)',
                      color: inputFeedback === 'correct' ? '#00ff88' : '#e94560',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      marginBottom: '12px',
                      fontWeight: '600'
                    }}>
                      {inputFeedback === 'correct' ? '✓ Great job!' : '✗ Not quite'}
                    </div>
                  )}
                  <div style={styles.reading}>{currentData.reading}</div>
                  <div style={styles.meaning}>{currentData.meaning}</div>
                  <div style={styles.exampleBox}>
                    <div style={{fontSize: '1rem', marginBottom: '4px'}}>{currentData.example}</div>
                    <div style={{fontSize: '0.85rem', color: '#8892b0'}}>{currentData.exampleMeaning}</div>
                  </div>
                </>
              )}
            </>
          )}
          
          {cardType === 'kanji' && (
            <>
              <div style={{...styles.japanese, fontSize: '5rem'}}>{currentData.kanji}</div>
              
              {activeRecallMode && !showAnswer && (
                <div style={{marginTop: '20px'}}>
                  <div style={{fontSize: '0.85rem', color: '#8892b0', marginBottom: '8px'}}>Type a reading or meaning:</div>
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                    placeholder="カタカナ, ひらがな, or English..."
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '2px solid rgba(255,255,255,0.2)',
                      background: 'rgba(255,255,255,0.05)',
                      color: 'white',
                      fontSize: '1.1rem',
                      outline: 'none',
                      textAlign: 'center'
                    }}
                    autoFocus
                  />
                  <button onClick={checkAnswer} style={{...styles.button, marginTop: '12px', padding: '12px'}}>
                    Check Answer
                  </button>
                </div>
              )}
              
              {!activeRecallMode && !showAnswer && (
                <div style={{color: '#8892b0', marginTop: '20px'}}>Tap to reveal</div>
              )}
              
              {showAnswer && (
                <>
                  {inputFeedback && (
                    <div style={{
                      background: inputFeedback === 'correct' ? 'rgba(0, 255, 136, 0.2)' : 'rgba(233, 69, 96, 0.2)',
                      color: inputFeedback === 'correct' ? '#00ff88' : '#e94560',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      marginBottom: '12px',
                      fontWeight: '600'
                    }}>
                      {inputFeedback === 'correct' ? '✓ Great job!' : '✗ Keep practicing!'}
                    </div>
                  )}
                  <div style={{display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '12px'}}>
                    <div>
                      <div style={styles.tag}>音読み</div>
                      <div style={{color: '#e94560'}}>{currentData.onyomi}</div>
                    </div>
                    <div>
                      <div style={styles.tag}>訓読み</div>
                      <div style={{color: '#e94560'}}>{currentData.kunyomi || '—'}</div>
                    </div>
                  </div>
                  <div style={styles.meaning}>{currentData.meaning}</div>
                  <div style={styles.exampleBox}>
                    <div style={{fontSize: '0.85rem', color: '#8892b0'}}>Common words:</div>
                    {currentData.words.map((word, i) => (
                      <div key={i} style={{fontSize: '0.9rem', marginTop: '4px'}}>{word}</div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
          
          {cardType === 'grammar' && (
            <>
              <div style={{...styles.japanese, fontSize: '2rem'}}>{currentData.pattern}</div>
              <div style={styles.meaning}>{currentData.meaning}</div>
              {showAnswer && (
                <>
                  <div style={styles.grammarBox}>
                    <div style={{fontSize: '0.85rem', color: '#8892b0', marginBottom: '8px'}}>Formation:</div>
                    <div style={{fontSize: '1rem'}}>{currentData.formation}</div>
                  </div>
                  {currentData.examples.map((ex, i) => (
                    <div key={i} style={styles.exampleBox}>
                      <div style={{fontSize: '1rem', marginBottom: '4px'}}>{ex.japanese}</div>
                      <div style={{fontSize: '0.85rem', color: '#8892b0'}}>{ex.meaning}</div>
                    </div>
                  ))}
                  <div style={{fontSize: '0.85rem', color: '#feca57', marginTop: '12px'}}>
                    💡 {currentData.notes}
                  </div>
                </>
              )}
              {!showAnswer && (
                <button onClick={() => setShowAnswer(true)} style={{...styles.button, marginTop: '20px', padding: '12px'}}>
                  Show Answer
                </button>
              )}
            </>
          )}
        </div>

        {/* Answer Buttons with SRS options */}
        {showAnswer && (
          <div style={{marginTop: '24px'}}>
            <div style={{display: 'flex', gap: '8px', marginBottom: '8px'}}>
              <button 
                style={{...styles.button, background: 'linear-gradient(135deg, #e94560, #ff6b6b)', flex: 1, padding: '14px'}}
                onClick={() => {
                  handleAnswer(false);
                  setUserInput('');
                  setInputFeedback(null);
                }}
              >
                <X size={18} />
                Again
              </button>
              <button 
                style={{...styles.button, background: 'linear-gradient(135deg, #4facfe, #00f2fe)', flex: 1, padding: '14px'}}
                onClick={() => {
                  handleAnswer(true);
                  setUserInput('');
                  setInputFeedback(null);
                }}
              >
                <Check size={18} />
                Got it!
              </button>
            </div>
            <div style={{textAlign: 'center', fontSize: '0.75rem', color: '#8892b0'}}>
              Next review: {(currentData.srsLevel || 0) === 0 ? 'Soon' : `in ${SRS_INTERVALS[Math.min((currentData.srsLevel || 0) + 1, 6)]} days`}
            </div>
          </div>
        )}

        <div style={{height: '100px'}} />
      </div>
    );
  };
  
  // Render Shadowing Phase
  const renderShadowing = () => {
    const phrase = shadowingPhrases[currentShadowPhrase];
    
    return (
      <div>
        {/* Timer */}
        {isSessionActive && (
          <div style={{
            background: 'rgba(240, 147, 251, 0.2)',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            border: '1px solid rgba(240, 147, 251, 0.3)'
          }}>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <Mic size={18} color="#f093fb" />
              <span style={{fontWeight: '700', color: '#f093fb'}}>Shadowing Practice</span>
            </div>
            <span style={{fontWeight: '700', fontSize: '1.2rem', color: '#f093fb'}}>
              {formatTime(sessionTimer)}
            </span>
          </div>
        )}
        
        <div style={{textAlign: 'center', marginBottom: '32px'}}>
          <h2 style={{fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px'}}>🎧 Shadowing</h2>
          <p style={{color: '#8892b0'}}>Listen (in your head) and repeat out loud immediately</p>
        </div>
        
        <div style={{...styles.flashcard, minHeight: '250px'}}>
          <div style={{fontSize: '1.8rem', fontWeight: '700', marginBottom: '20px', lineHeight: '1.4'}}>
            {phrase.japanese}
          </div>
          <div style={{fontSize: '1.1rem', color: '#8892b0', marginBottom: '16px'}}>
            {phrase.meaning}
          </div>
          <div style={{
            background: 'rgba(240, 147, 251, 0.1)',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '0.85rem',
            color: '#f093fb'
          }}>
            🎯 Speak this sentence out loud 3 times!
          </div>
        </div>
        
        <div style={{textAlign: 'center', color: '#8892b0', margin: '16px 0'}}>
          {currentShadowPhrase + 1} / 3 phrases
        </div>
        
        <button 
          onClick={() => {
            addXp(XP_VALUES.shadowingComplete);
            if (currentShadowPhrase < 2) {
              setCurrentShadowPhrase(prev => prev + 1);
            } else {
              setSessionPhase('journal');
              setCurrentShadowPhrase(0);
            }
          }}
          style={{...styles.button, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}}
        >
          {currentShadowPhrase < 2 ? 'Next Phrase' : 'Finish Shadowing'} (+{XP_VALUES.shadowingComplete} XP)
        </button>
        
        <button 
          onClick={() => {
            setSessionPhase('journal');
          }}
          style={{...styles.button, ...styles.buttonSecondary, marginTop: '12px'}}
        >
          Skip to Journal
        </button>
      </div>
    );
  };
  
  // Render Journal Phase
  const renderJournal = () => (
    <div>
      {/* Timer */}
      {isSessionActive && (
        <div style={{
          background: 'rgba(79, 172, 254, 0.2)',
          borderRadius: '12px',
          padding: '12px 16px',
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          border: '1px solid rgba(79, 172, 254, 0.3)'
        }}>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <Edit3 size={18} color="#4facfe" />
            <span style={{fontWeight: '700', color: '#4facfe'}}>Quick Journal</span>
          </div>
          <span style={{fontWeight: '700', fontSize: '1.2rem', color: '#4facfe'}}>
            {formatTime(sessionTimer)}
          </span>
        </div>
      )}
      
      <div style={{textAlign: 'center', marginBottom: '24px'}}>
        <h2 style={{fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px'}}>✍️ Output Practice</h2>
        <p style={{color: '#8892b0'}}>Write 1-2 sentences in Japanese</p>
      </div>
      
      <div style={{...styles.card, marginBottom: '20px'}}>
        <div style={{fontSize: '0.85rem', color: '#4facfe', marginBottom: '8px'}}>Today's Prompt:</div>
        <div style={{fontSize: '1.1rem', fontWeight: '600', marginBottom: '8px'}}>{todayPrompt.prompt}</div>
        <div style={{fontSize: '0.85rem', color: '#8892b0'}}>💡 Hint: {todayPrompt.hint}</div>
      </div>
      
      <textarea
        value={journalEntry}
        onChange={(e) => setJournalEntry(e.target.value)}
        placeholder="ここに日本語で書いてください..."
        style={{
          width: '100%',
          minHeight: '120px',
          padding: '16px',
          borderRadius: '12px',
          border: '2px solid rgba(255,255,255,0.2)',
          background: 'rgba(255,255,255,0.05)',
          color: 'white',
          fontSize: '1.1rem',
          outline: 'none',
          resize: 'vertical',
          fontFamily: 'inherit'
        }}
      />
      
      <div style={{fontSize: '0.8rem', color: '#8892b0', marginTop: '8px', textAlign: 'right'}}>
        {journalEntry.length} characters
      </div>
      
      <button 
        onClick={() => {
          if (journalEntry.length > 0) {
            addXp(XP_VALUES.journalEntry);
          }
          addXp(XP_VALUES.sessionComplete);
          if (score.total > 0 && score.correct === score.total) {
            addXp(XP_VALUES.perfectSession);
          }
          markStudyDay(); // Save that user studied today
          setIsSessionActive(false);
          setCurrentView('results');
        }}
        style={{...styles.button, marginTop: '20px', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'}}
      >
        Complete Session (+{XP_VALUES.journalEntry + XP_VALUES.sessionComplete} XP)
      </button>
      
      <button 
        onClick={() => {
          addXp(XP_VALUES.sessionComplete);
          markStudyDay(); // Save that user studied today
          setIsSessionActive(false);
          setCurrentView('results');
        }}
        style={{...styles.button, ...styles.buttonSecondary, marginTop: '12px'}}
      >
        Skip Journal
      </button>
    </div>
  );

  // Render Results View
  const renderResults = () => {
    const percentage = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 100;
    
    return (
      <div style={{textAlign: 'center', paddingTop: '40px'}}>
        <div style={{fontSize: '4rem', marginBottom: '16px'}}>
          {percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '💪'}
        </div>
        <h2 style={{fontSize: '1.8rem', fontWeight: '700', marginBottom: '8px'}}>Session Complete!</h2>
        <p style={{color: '#8892b0', marginBottom: '32px'}}>Great work on your study session</p>
        
        {/* XP Earned */}
        <div style={{...styles.card, background: 'linear-gradient(135deg, rgba(254, 202, 87, 0.2) 0%, rgba(255, 107, 107, 0.1) 100%)', marginBottom: '16px'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px'}}>
            <Zap size={24} color="#feca57" />
            <span style={{fontSize: '2rem', fontWeight: '800', color: '#feca57'}}>+{todayXp} XP</span>
          </div>
          <div style={{fontSize: '0.9rem', color: '#8892b0'}}>
            Level {level} • {xp} / {xpForNextLevel(level)} XP
          </div>
          <div style={{...styles.progressBar, marginTop: '12px', height: '6px'}}>
            <div style={{...styles.progressFill, width: `${currentLevelProgress(xp)}%`, background: 'linear-gradient(90deg, #feca57 0%, #ff6b6b 100%)'}} />
          </div>
        </div>
        
        <div style={{...styles.card, textAlign: 'center'}}>
          <div style={styles.statNumber}>{percentage}%</div>
          <div style={styles.statLabel}>Accuracy</div>
          <div style={{marginTop: '16px', color: '#8892b0'}}>
            {score.correct} correct out of {score.total}
          </div>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginTop: '24px'}}>
          <div style={styles.statCard}>
            <Trophy size={24} color="#feca57" style={{marginBottom: '8px'}} />
            <div style={{fontSize: '1.5rem', fontWeight: '700', color: '#feca57'}}>{streak}</div>
            <div style={styles.statLabel}>Best Streak</div>
          </div>
          <div style={styles.statCard}>
            <Star size={24} color="#4facfe" style={{marginBottom: '8px'}} />
            <div style={{fontSize: '1.5rem', fontWeight: '700', color: '#4facfe'}}>{score.total}</div>
            <div style={styles.statLabel}>Cards Done</div>
          </div>
        </div>

        {/* Encouragement based on performance */}
        <div style={{...styles.card, marginTop: '24px', background: 'rgba(255,255,255,0.05)'}}>
          <div style={{fontSize: '0.95rem', color: '#8892b0'}}>
            {percentage >= 80 
              ? "🌟 Excellent! Your hard work is paying off. Keep this momentum going!"
              : percentage >= 60 
              ? "👍 Good progress! The cards you missed will appear more often to help you learn."
              : "💪 Every mistake is a learning opportunity. Those tricky cards will come back for more practice!"}
          </div>
        </div>

        <button 
          style={{...styles.button, marginTop: '32px'}}
          onClick={() => { 
            resetSession(); 
            setSessionPhase('cards');
            setJournalEntry('');
            setCurrentView('home'); 
          }}
        >
          Back to Home
        </button>
      </div>
    );
  };

  // Render Conversation View
  const renderConversation = () => (
    <div>
      <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px'}}>
        <button 
          onClick={() => setCurrentView('home')}
          style={{background: 'none', border: 'none', color: '#8892b0', cursor: 'pointer'}}
        >
          <RotateCcw size={20} />
        </button>
        <h2 style={{fontSize: '1.5rem', fontWeight: '700'}}>Daily Conversation</h2>
      </div>

      <p style={{color: '#8892b0', marginBottom: '24px'}}>
        Master these practical phrases for everyday Japanese communication at N3/N4 level.
      </p>

      {conversationData.map((category, catIndex) => (
        <div key={catIndex} style={{marginBottom: '24px'}}>
          <h3 style={{fontSize: '1.1rem', fontWeight: '600', color: '#e94560', marginBottom: '12px'}}>
            {category.category}
          </h3>
          {category.phrases.map((phrase, pIndex) => (
            <div key={pIndex} style={{...styles.card, padding: '16px'}}>
              <div style={{fontSize: '1.3rem', fontWeight: '600', marginBottom: '4px'}}>
                {phrase.japanese}
              </div>
              <div style={{fontSize: '1rem', color: '#e94560', marginBottom: '8px'}}>
                {phrase.reading}
              </div>
              <div style={{fontSize: '0.95rem', marginBottom: '8px'}}>
                {phrase.meaning}
              </div>
              <div style={{fontSize: '0.85rem', color: '#8892b0', fontStyle: 'italic'}}>
                📝 {phrase.usage}
              </div>
            </div>
          ))}
        </div>
      ))}
      
      <div style={{height: '100px'}} />
    </div>
  );

  // Render Syllabus View
  const renderSyllabus = () => (
    <div>
      <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px'}}>
        <button 
          onClick={() => setCurrentView('home')}
          style={{background: 'none', border: 'none', color: '#8892b0', cursor: 'pointer'}}
        >
          <RotateCcw size={20} />
        </button>
        <h2 style={{fontSize: '1.5rem', fontWeight: '700'}}>JLPT N4 Exam Guide</h2>
      </div>

      {/* Exam Overview */}
      <div style={{...styles.card, background: 'linear-gradient(135deg, rgba(233, 69, 96, 0.2) 0%, rgba(254, 202, 87, 0.1) 100%)'}}>
        <h3 style={{fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px', color: '#e94560'}}>
          📋 Exam Structure
        </h3>
        <div style={{display: 'grid', gap: '12px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px'}}>
            <span>Language Knowledge (Vocab/Grammar)</span>
            <span style={{color: '#feca57'}}>30 min</span>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px'}}>
            <span>Reading</span>
            <span style={{color: '#feca57'}}>60 min</span>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px'}}>
            <span>Listening</span>
            <span style={{color: '#feca57'}}>35 min</span>
          </div>
        </div>
      </div>

      {/* Passing Requirements */}
      <div style={styles.card}>
        <h3 style={{fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px', color: '#4facfe'}}>
          🎯 Passing Requirements
        </h3>
        <div style={styles.grammarBox}>
          <div style={{fontSize: '1.1rem', fontWeight: '600', marginBottom: '8px'}}>Overall Score</div>
          <div style={{fontSize: '0.9rem', color: '#8892b0'}}>Minimum 90 out of 180 points (50%)</div>
        </div>
        <div style={{...styles.grammarBox, marginTop: '12px', borderLeftColor: '#feca57'}}>
          <div style={{fontSize: '1.1rem', fontWeight: '600', marginBottom: '8px'}}>Section Minimums</div>
          <div style={{fontSize: '0.9rem', color: '#8892b0'}}>
            • Language Knowledge + Reading: 38/120 (31.67%)<br/>
            • Listening: 19/60 (31.67%)
          </div>
        </div>
        <div style={{marginTop: '16px', padding: '12px', background: 'rgba(233, 69, 96, 0.1)', borderRadius: '8px'}}>
          <div style={{fontSize: '0.9rem', color: '#e94560'}}>
            ⚠️ Important: You must pass BOTH the overall score AND each section minimum. Even with a high total, failing one section means failing the entire test!
          </div>
        </div>
      </div>

      {/* What to Study */}
      <div style={styles.card}>
        <h3 style={{fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px', color: '#f093fb'}}>
          📚 What You Need to Know
        </h3>
        
        <div style={{marginBottom: '20px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px'}}>
            <span style={styles.tag}>Vocabulary</span>
            <span style={{fontWeight: '600'}}>~1,500 words</span>
          </div>
          <div style={{fontSize: '0.9rem', color: '#8892b0'}}>
            Common nouns, verbs, adjectives, and expressions for daily life situations like shopping, travel, work, and social interactions.
          </div>
        </div>

        <div style={{marginBottom: '20px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px'}}>
            <span style={styles.tag}>Kanji</span>
            <span style={{fontWeight: '600'}}>~300 characters</span>
          </div>
          <div style={{fontSize: '0.9rem', color: '#8892b0'}}>
            Kanji commonly used in everyday writing and signage. Know both readings (音読み and 訓読み) and common compound words.
          </div>
        </div>

        <div style={{marginBottom: '20px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px'}}>
            <span style={styles.tag}>Grammar</span>
            <span style={{fontWeight: '600'}}>~130 patterns</span>
          </div>
          <div style={{fontSize: '0.9rem', color: '#8892b0'}}>
            Key patterns include: て-form conjugations, potential form, conditional forms (たら、ば、なら、と), causative/passive, and sentence connectors.
          </div>
        </div>

        <div>
          <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px'}}>
            <span style={styles.tag}>Listening</span>
            <span style={{fontWeight: '600'}}>Daily conversations</span>
          </div>
          <div style={{fontSize: '0.9rem', color: '#8892b0'}}>
            Understand natural-speed conversations in everyday situations. Practice with podcasts, anime, and listening exercises.
          </div>
        </div>
      </div>

      {/* Study Tips */}
      <div style={styles.card}>
        <h3 style={{fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px', color: '#00f2fe'}}>
          💡 Study Tips for 15-30 min/day
        </h3>
        <div style={{display: 'grid', gap: '12px'}}>
          <div style={styles.exampleBox}>
            <div style={{fontWeight: '600', marginBottom: '4px'}}>🌅 Morning (10 min)</div>
            <div style={{fontSize: '0.9rem', color: '#8892b0'}}>Review 10-15 vocabulary flashcards and 5 kanji</div>
          </div>
          <div style={styles.exampleBox}>
            <div style={{fontWeight: '600', marginBottom: '4px'}}>🌙 Evening (20 min)</div>
            <div style={{fontSize: '0.9rem', color: '#8892b0'}}>Study 2-3 grammar points with examples, then practice listening</div>
          </div>
          <div style={styles.exampleBox}>
            <div style={{fontWeight: '600', marginBottom: '4px'}}>📱 Anytime</div>
            <div style={{fontSize: '0.9rem', color: '#8892b0'}}>Use this app during commute or breaks for quick reviews</div>
          </div>
        </div>
      </div>

      {/* Essential Grammar Categories */}
      <div style={styles.card}>
        <h3 style={{fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px', color: '#fa709a'}}>
          📝 Key Grammar Categories
        </h3>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
          {[
            'て-form', 'Potential', 'Conditional', 'Causative',
            'Passive', 'ている', 'てしまう', 'ておく',
            'ようにする', 'ようになる', 'そうだ', 'ようだ',
            'らしい', 'はず', 'つもり', 'ために'
          ].map((item, i) => (
            <span key={i} style={{...styles.tag, background: 'rgba(250, 112, 154, 0.2)', color: '#fa709a'}}>
              {item}
            </span>
          ))}
        </div>
      </div>

      <div style={{height: '100px'}} />
    </div>
  );

  // Render Mistakes View
  const renderMistakes = () => (
    <div>
      <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px'}}>
        <button 
          onClick={() => setCurrentView('home')}
          style={{background: 'none', border: 'none', color: '#8892b0', cursor: 'pointer'}}
        >
          <RotateCcw size={20} />
        </button>
        <h2 style={{fontSize: '1.5rem', fontWeight: '700'}}>Mistake Review</h2>
      </div>

      {mistakeLog.length === 0 ? (
        <div style={{textAlign: 'center', paddingTop: '60px'}}>
          <div style={{fontSize: '4rem', marginBottom: '16px'}}>✨</div>
          <h3 style={{fontSize: '1.3rem', fontWeight: '600', marginBottom: '8px'}}>No mistakes yet!</h3>
          <p style={{color: '#8892b0'}}>Start studying and your mistakes will appear here for review.</p>
        </div>
      ) : (
        <>
          <p style={{color: '#8892b0', marginBottom: '20px'}}>
            Review your recent mistakes to strengthen weak areas. These are the cards you got wrong.
          </p>
          
          {mistakeLog.slice().reverse().map((item, index) => (
            <div key={index} style={{...styles.card, padding: '16px', borderLeft: '4px solid #e94560'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px'}}>
                <span style={{...styles.tag, background: item.type === 'vocab' ? 'rgba(102, 126, 234, 0.3)' : item.type === 'kanji' ? 'rgba(240, 147, 251, 0.3)' : 'rgba(79, 172, 254, 0.3)', color: item.type === 'vocab' ? '#667eea' : item.type === 'kanji' ? '#f093fb' : '#4facfe'}}>
                  {item.type}
                </span>
                <span style={{fontSize: '0.7rem', color: '#8892b0'}}>
                  {new Date(item.mistakeDate).toLocaleDateString()}
                </span>
              </div>
              
              {item.type === 'vocab' && (
                <>
                  <div style={{fontSize: '1.5rem', fontWeight: '700', marginBottom: '4px'}}>{item.japanese}</div>
                  <div style={{color: '#e94560', marginBottom: '4px'}}>{item.reading}</div>
                  <div style={{color: '#8892b0'}}>{item.meaning}</div>
                </>
              )}
              
              {item.type === 'kanji' && (
                <>
                  <div style={{fontSize: '2rem', fontWeight: '700', marginBottom: '4px'}}>{item.kanji}</div>
                  <div style={{color: '#e94560', marginBottom: '4px'}}>{item.onyomi} / {item.kunyomi || '—'}</div>
                  <div style={{color: '#8892b0'}}>{item.meaning}</div>
                </>
              )}
              
              {item.type === 'grammar' && (
                <>
                  <div style={{fontSize: '1.2rem', fontWeight: '700', marginBottom: '4px'}}>{item.pattern}</div>
                  <div style={{color: '#8892b0'}}>{item.meaning}</div>
                </>
              )}
            </div>
          ))}
          
          <button 
            style={{...styles.button, marginTop: '20px', background: 'rgba(255,255,255,0.1)'}}
            onClick={() => setMistakeLog([])}
          >
            Clear All Mistakes
          </button>
        </>
      )}
      
      <div style={{height: '100px'}} />
    </div>
  );

  // Render Listening Practice View
  const renderListening = () => {
    const dialogueExercises = listeningExercises.filter(e => e.type === 'dialogue');
    const dictationExercises = listeningExercises.filter(e => e.type === 'dictation');
    const currentExercise = listeningExercises[currentListeningIndex];
    
    return (
      <div>
        <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px'}}>
          <button 
            onClick={() => {
              stopSpeech();
              setCurrentView('home');
              setCurrentListeningIndex(0);
              setShowListeningResult(false);
              setListeningAnswer(null);
              setDictationInput('');
            }}
            style={{background: 'none', border: 'none', color: '#8892b0', cursor: 'pointer'}}
          >
            <RotateCcw size={20} />
          </button>
          <h2 style={{fontSize: '1.5rem', fontWeight: '700'}}>🎧 Listening Practice</h2>
        </div>

        {/* Progress */}
        <div style={styles.progressBar}>
          <div style={{...styles.progressFill, width: `${((currentListeningIndex + 1) / listeningExercises.length) * 100}%`}} />
        </div>
        <div style={{textAlign: 'center', fontSize: '0.85rem', color: '#8892b0', marginBottom: '24px'}}>
          {currentListeningIndex + 1} / {listeningExercises.length} • Score: {listeningScore.correct}/{listeningScore.total}
        </div>

        {/* Dialogue Exercise */}
        {currentExercise.type === 'dialogue' && (
          <div>
            <div style={{...styles.card, marginBottom: '16px', background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.15) 0%, rgba(0, 242, 254, 0.1) 100%)'}}>
              <div style={{fontSize: '0.85rem', color: '#4facfe', marginBottom: '8px'}}>📍 {currentExercise.situation}</div>
              
              {/* Play All Button */}
              <button
                onClick={() => {
                  const fullDialogue = currentExercise.dialogue.map(d => d.text).join('。');
                  speakJapanese(fullDialogue);
                }}
                style={{
                  ...styles.button,
                  background: isPlaying ? 'rgba(233, 69, 96, 0.3)' : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  marginBottom: '16px',
                  padding: '12px'
                }}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                {isPlaying ? 'Playing...' : 'Play Dialogue'}
              </button>
              
              {/* Dialogue Lines */}
              <div style={{background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '16px'}}>
                {currentExercise.dialogue.map((line, i) => (
                  <div 
                    key={i} 
                    style={{
                      display: 'flex', 
                      gap: '12px', 
                      marginBottom: i < currentExercise.dialogue.length - 1 ? '12px' : 0,
                      alignItems: 'flex-start'
                    }}
                  >
                    <span style={{
                      background: 'rgba(79, 172, 254, 0.3)',
                      color: '#4facfe',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      whiteSpace: 'nowrap'
                    }}>
                      {line.speaker}
                    </span>
                    <div style={{flex: 1}}>
                      <span style={{fontSize: '1rem'}}>{line.text}</span>
                      <button
                        onClick={() => speakJapanese(line.text)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#8892b0',
                          cursor: 'pointer',
                          padding: '4px',
                          marginLeft: '8px'
                        }}
                      >
                        <Volume2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Question */}
            <div style={styles.card}>
              <div style={{fontSize: '1.1rem', fontWeight: '600', marginBottom: '16px'}}>
                {currentExercise.question}
              </div>
              
              {/* Options */}
              <div style={{display: 'grid', gap: '10px'}}>
                {currentExercise.options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (!showListeningResult) {
                        setListeningAnswer(i);
                      }
                    }}
                    disabled={showListeningResult}
                    style={{
                      background: showListeningResult 
                        ? i === currentExercise.correct 
                          ? 'rgba(0, 255, 136, 0.2)' 
                          : i === listeningAnswer 
                            ? 'rgba(233, 69, 96, 0.2)'
                            : 'rgba(255,255,255,0.05)'
                        : listeningAnswer === i 
                          ? 'rgba(79, 172, 254, 0.3)' 
                          : 'rgba(255,255,255,0.05)',
                      border: showListeningResult
                        ? i === currentExercise.correct
                          ? '2px solid #00ff88'
                          : i === listeningAnswer
                            ? '2px solid #e94560'
                            : '1px solid rgba(255,255,255,0.1)'
                        : listeningAnswer === i
                          ? '2px solid #4facfe'
                          : '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      textAlign: 'left',
                      color: 'white',
                      fontSize: '1rem',
                      cursor: showListeningResult ? 'default' : 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span style={{marginRight: '12px', opacity: 0.5}}>{i + 1}.</span>
                    {option}
                    {showListeningResult && i === currentExercise.correct && (
                      <Check size={18} color="#00ff88" style={{float: 'right'}} />
                    )}
                    {showListeningResult && i === listeningAnswer && i !== currentExercise.correct && (
                      <X size={18} color="#e94560" style={{float: 'right'}} />
                    )}
                  </button>
                ))}
              </div>

              {/* Check / Result */}
              {!showListeningResult && listeningAnswer !== null && (
                <button
                  onClick={() => {
                    setShowListeningResult(true);
                    setListeningScore(prev => ({
                      correct: prev.correct + (listeningAnswer === currentExercise.correct ? 1 : 0),
                      total: prev.total + 1
                    }));
                    if (listeningAnswer === currentExercise.correct) {
                      addXp(XP_VALUES.cardCorrect);
                    }
                  }}
                  style={{...styles.button, marginTop: '16px'}}
                >
                  Check Answer
                </button>
              )}
              
              {showListeningResult && (
                <div style={{marginTop: '16px'}}>
                  <div style={{
                    background: listeningAnswer === currentExercise.correct ? 'rgba(0, 255, 136, 0.1)' : 'rgba(233, 69, 96, 0.1)',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '12px'
                  }}>
                    <div style={{
                      fontWeight: '600',
                      color: listeningAnswer === currentExercise.correct ? '#00ff88' : '#e94560',
                      marginBottom: '4px'
                    }}>
                      {listeningAnswer === currentExercise.correct ? '✓ Correct!' : '✗ Incorrect'}
                    </div>
                    <div style={{fontSize: '0.9rem', color: '#8892b0'}}>
                      {currentExercise.explanation}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      if (currentListeningIndex < listeningExercises.length - 1) {
                        setCurrentListeningIndex(prev => prev + 1);
                        setListeningAnswer(null);
                        setShowListeningResult(false);
                        setDictationInput('');
                      } else {
                        setCurrentView('home');
                        setCurrentListeningIndex(0);
                        setShowListeningResult(false);
                        setListeningAnswer(null);
                      }
                    }}
                    style={styles.button}
                  >
                    {currentListeningIndex < listeningExercises.length - 1 ? 'Next Question' : 'Finish'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dictation Exercise */}
        {currentExercise.type === 'dictation' && (
          <div>
            <div style={{...styles.card, background: 'linear-gradient(135deg, rgba(240, 147, 251, 0.15) 0%, rgba(245, 87, 108, 0.1) 100%)'}}>
              <div style={{textAlign: 'center', marginBottom: '20px'}}>
                <div style={{fontSize: '0.85rem', color: '#f093fb', marginBottom: '8px'}}>✏️ Dictation Exercise</div>
                <div style={{fontSize: '0.9rem', color: '#8892b0'}}>Listen and type what you hear</div>
              </div>
              
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '16px',
                padding: '32px',
                textAlign: 'center',
                marginBottom: '20px'
              }}>
                <button
                  onClick={() => speakJapanese(currentExercise.text)}
                  style={{
                    background: isPlaying ? 'rgba(240, 147, 251, 0.3)' : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '80px',
                    height: '80px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px'
                  }}
                >
                  {isPlaying ? <Pause size={32} color="white" /> : <Volume2 size={32} color="white" />}
                </button>
                <div style={{fontSize: '0.9rem', color: '#8892b0'}}>
                  {isPlaying ? 'Playing...' : 'Tap to listen'}
                </div>
                <div style={{fontSize: '0.8rem', color: '#f093fb', marginTop: '8px'}}>
                  💡 Hint: {currentExercise.hint}
                </div>
              </div>
              
              <input
                type="text"
                value={dictationInput}
                onChange={(e) => setDictationInput(e.target.value)}
                placeholder="Type what you heard in Japanese..."
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: '2px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  fontSize: '1.1rem',
                  outline: 'none',
                  textAlign: 'center'
                }}
              />
              
              {!showListeningResult && dictationInput.length > 0 && (
                <button
                  onClick={() => {
                    setShowListeningResult(true);
                    const isCorrect = dictationInput.trim() === currentExercise.text.replace('。', '').trim() ||
                                     dictationInput.trim() === currentExercise.text.trim();
                    setListeningScore(prev => ({
                      correct: prev.correct + (isCorrect ? 1 : 0),
                      total: prev.total + 1
                    }));
                    if (isCorrect) addXp(XP_VALUES.cardCorrect);
                  }}
                  style={{...styles.button, marginTop: '16px', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}}
                >
                  Check Answer
                </button>
              )}
              
              {showListeningResult && (
                <div style={{marginTop: '16px'}}>
                  <div style={{
                    background: 'rgba(79, 172, 254, 0.1)',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '12px'
                  }}>
                    <div style={{fontWeight: '600', color: '#4facfe', marginBottom: '8px'}}>Correct Answer:</div>
                    <div style={{fontSize: '1.2rem'}}>{currentExercise.text}</div>
                  </div>
                  
                  <button
                    onClick={() => {
                      if (currentListeningIndex < listeningExercises.length - 1) {
                        setCurrentListeningIndex(prev => prev + 1);
                        setListeningAnswer(null);
                        setShowListeningResult(false);
                        setDictationInput('');
                      } else {
                        setCurrentView('home');
                        setCurrentListeningIndex(0);
                        setShowListeningResult(false);
                        setDictationInput('');
                      }
                    }}
                    style={styles.button}
                  >
                    {currentListeningIndex < listeningExercises.length - 1 ? 'Next Exercise' : 'Finish'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <div style={{height: '100px'}} />
      </div>
    );
  };

  // Render Progress View
  const renderProgress = () => {
    // Calculate mastery stats
    const calcStats = (srsData) => {
      const mastered = srsData.filter(c => c.srsLevel >= 5).length;
      const learning = srsData.filter(c => c.srsLevel > 0 && c.srsLevel < 5).length;
      const newCards = srsData.filter(c => c.srsLevel === 0).length;
      return { mastered, learning, newCards, total: srsData.length };
    };
    
    const vocabStats = calcStats(vocabSRS);
    const kanjiStats = calcStats(kanjiSRS);
    const grammarStats = calcStats(grammarSRS);
    
    // Reset all progress
    const resetAllProgress = () => {
      if (window.confirm('Are you sure you want to reset ALL progress? This cannot be undone!')) {
        Object.values(STORAGE_KEYS).forEach(key => {
          localStorage.removeItem(key);
        });
        window.location.reload();
      }
    };
    
    return (
    <div>
      <h2 style={{fontSize: '1.5rem', fontWeight: '700', marginBottom: '24px'}}>Your Progress</h2>
      
      {/* Saved Stats Overview */}
      <div style={{...styles.card, background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.15) 0%, rgba(79, 172, 254, 0.1) 100%)', border: '1px solid rgba(0, 255, 136, 0.3)', marginBottom: '16px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px'}}>
          <span style={{fontSize: '1.2rem'}}>💾</span>
          <span style={{fontWeight: '600', color: '#00ff88'}}>Progress Auto-Saved</span>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', textAlign: 'center'}}>
          <div>
            <div style={{fontSize: '1.5rem', fontWeight: '700', color: '#feca57'}}>{totalStudyDays}</div>
            <div style={{fontSize: '0.75rem', color: '#8892b0'}}>Days Studied</div>
          </div>
          <div>
            <div style={{fontSize: '1.5rem', fontWeight: '700', color: '#4facfe'}}>{xp}</div>
            <div style={{fontSize: '0.75rem', color: '#8892b0'}}>Total XP</div>
          </div>
          <div>
            <div style={{fontSize: '1.5rem', fontWeight: '700', color: '#f093fb'}}>{streak}</div>
            <div style={{fontSize: '0.75rem', color: '#8892b0'}}>Day Streak</div>
          </div>
        </div>
      </div>
      
      <div style={{...styles.card, background: 'linear-gradient(135deg, rgba(233, 69, 96, 0.2) 0%, rgba(254, 202, 87, 0.1) 100%)'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
          <div>
            <div style={{fontSize: '0.85rem', color: '#8892b0'}}>Current Streak</div>
            <div style={{fontSize: '2rem', fontWeight: '800', color: '#feca57'}}>{streak} days</div>
          </div>
          <Flame size={48} color="#feca57" />
        </div>
      </div>

      <h3 style={{fontSize: '1.1rem', fontWeight: '600', marginBottom: '16px', marginTop: '24px', color: '#8892b0'}}>
        SRS Mastery Progress
      </h3>

      <div style={styles.card}>
        {/* Vocabulary Progress */}
        <div style={{marginBottom: '24px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
            <span style={{fontWeight: '600'}}>📖 Vocabulary</span>
            <span style={{color: '#00ff88'}}>{vocabStats.mastered} mastered</span>
          </div>
          <div style={styles.progressBar}>
            <div style={{...styles.progressFill, width: `${(vocabStats.mastered / vocabStats.total) * 100}%`}} />
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#8892b0', marginTop: '4px'}}>
            <span>🟢 {vocabStats.mastered} mastered</span>
            <span>🟡 {vocabStats.learning} learning</span>
            <span>⚪ {vocabStats.newCards} new</span>
          </div>
        </div>

        {/* Kanji Progress */}
        <div style={{marginBottom: '24px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
            <span style={{fontWeight: '600'}}>🧠 Kanji</span>
            <span style={{color: '#00ff88'}}>{kanjiStats.mastered} mastered</span>
          </div>
          <div style={styles.progressBar}>
            <div style={{...styles.progressFill, width: `${(kanjiStats.mastered / kanjiStats.total) * 100}%`}} />
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#8892b0', marginTop: '4px'}}>
            <span>🟢 {kanjiStats.mastered} mastered</span>
            <span>🟡 {kanjiStats.learning} learning</span>
            <span>⚪ {kanjiStats.newCards} new</span>
          </div>
        </div>

        {/* Grammar Progress */}
        <div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
            <span style={{fontWeight: '600'}}>📝 Grammar</span>
            <span style={{color: '#00ff88'}}>{grammarStats.mastered} mastered</span>
          </div>
          <div style={styles.progressBar}>
            <div style={{...styles.progressFill, width: `${(grammarStats.mastered / grammarStats.total) * 100}%`}} />
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#8892b0', marginTop: '4px'}}>
            <span>🟢 {grammarStats.mastered} mastered</span>
            <span>🟡 {grammarStats.learning} learning</span>
            <span>⚪ {grammarStats.newCards} new</span>
          </div>
        </div>
      </div>

      {/* SRS Explanation */}
      <div style={{...styles.card, background: 'rgba(79, 172, 254, 0.1)', border: '1px solid rgba(79, 172, 254, 0.3)'}}>
        <h4 style={{fontSize: '1rem', fontWeight: '600', color: '#4facfe', marginBottom: '12px'}}>🔄 How SRS Works</h4>
        <div style={{fontSize: '0.85rem', color: '#8892b0', lineHeight: '1.6'}}>
          <div style={{marginBottom: '8px'}}>Cards you <strong style={{color: '#00ff88'}}>know well</strong> appear less often (up to 90 days)</div>
          <div style={{marginBottom: '8px'}}>Cards you <strong style={{color: '#e94560'}}>struggle with</strong> repeat more frequently</div>
          <div>This maximizes learning efficiency in your limited study time!</div>
        </div>
      </div>
      
      {/* Reset Progress Button */}
      <button
        onClick={resetAllProgress}
        style={{
          ...styles.button,
          background: 'rgba(233, 69, 96, 0.2)',
          border: '1px solid rgba(233, 69, 96, 0.3)',
          marginTop: '24px'
        }}
      >
        Reset All Progress
      </button>

      <div style={{height: '100px'}} />
    </div>
  );
  };

  return (
    <div style={styles.app}>
      <div style={styles.container}>
        {currentView === 'home' && renderHome()}
        {currentView === 'study' && renderStudy()}
        {currentView === 'results' && renderResults()}
        {currentView === 'conversation' && renderConversation()}
        {currentView === 'syllabus' && renderSyllabus()}
        {currentView === 'progress' && renderProgress()}
        {currentView === 'mistakes' && renderMistakes()}
        {currentView === 'listening' && renderListening()}
      </div>

      {/* Bottom Navigation */}
      <div style={styles.nav}>
        <div 
          style={{...styles.navItem, ...(currentView === 'home' ? styles.navItemActive : {})}}
          onClick={() => setCurrentView('home')}
        >
          <Home size={24} />
          <span>Home</span>
        </div>
        <div 
          style={{...styles.navItem, ...(currentView === 'progress' ? styles.navItemActive : {})}}
          onClick={() => setCurrentView('progress')}
        >
          <TrendingUp size={24} />
          <span>Progress</span>
        </div>
        <div 
          style={{...styles.navItem, ...(currentView === 'syllabus' ? styles.navItemActive : {})}}
          onClick={() => setCurrentView('syllabus')}
        >
          <Target size={24} />
          <span>Exam Guide</span>
        </div>
        <div 
          style={styles.navItem}
          onClick={() => alert('Settings coming soon!')}
        >
          <Settings size={24} />
          <span>Settings</span>
        </div>
      </div>
    </div>
  );
}
