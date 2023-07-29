
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'

import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'

export const runtime = 'edge'

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)
import { Message } from "ai";

const sampleMessages: Message[] = [
    {
        id: "1",
        role: "user",
        content: "Hey, how can I help you today?",
    },
    {
        id: "2",
        role: "assistant",
        content: "Well, I'm here for my periodic health visit. I don't have any specific concerns, just checking in and making sure everything is okay. How are you today, Dr. Raff?",
    },
    {
        id: "1",
        role: "user",
        content: "I'm doing well, thanks for asking. Before we get started I would like to get to know you a little better. Do you have any medical conditions?",
    },
    {
        id: "2",
        role: "assistant",
        content: "Nope, I'm actually pretty healthy. I've never had any major medical problems, just a broken arm when I was in 4th grade. Other than that, nothing to report.",
    },
    {
        id: "1",
        role: "user",
        content: "Do you take any medications or have any allergies?",
    },
    {
        id: "2",
        role: "assistant",
        content: "No, I don't take any medications on a regular basis. Sometimes I'll take Tylenol for a headache, but that's about it. As for allergies, I don't have any known allergies to medications or substances.",
    },
    {
        id: "1",
        role: "user",
        content: "Can you tell me a little bit more about yourself?",
    },
    {
        id: "2",
        role: "assistant",
        content: "Sure, I'd be happy to share. Well, I'm a 26-year-old guy and I work as a freelance graphic designer. It's a pretty flexible job, which I enjoy. In my free time, I like to paint houses to supplement my income. I find it relaxing and it allows me to be creative in a different way. I also enjoy going to the gym a few times a week to stay active. Overall, I lead a pretty simple and balanced lifestyle.",
    },
    {
        id: "1",
        role: "user",
        content: "If it is okay with you, can I ask you more personal questions about your sexual history?",
    },
    {
        id: "2",
        role: "assistant",
        content: "Sure, I don't mind answering questions about my sexual history. What would you like to know?",
    },
    {
        id: "1",
        role: "user",
        content: "Are you currently in a relationship? And how many partners have you had previously?",
    },
    {
        id: "2",
        role: "assistant",
        content: "Yes, I am currently in a relationship. I've been with my boyfriend, Alec, for about 6 months now. Before Alec, I've had a couple of other boyfriends, and there have also been periods of time when I was single but sexually active with men I met in bars and online. In total, I would say I've had around 20 partners in my life.",
    },
    {
        id: "1",
        role: "user",
        content: "Do you use protection?",
    },
    {
        id: "2",
        role: "assistant",
        content: "Yes, I believe in practicing safe sex. With Alec, my current partner, we usually use condoms for anal intercourse, but not for oral sex. However, I must admit that there have been a few occasions when we didn't use condoms for anal intercourse. With previous partners, I almost always used condoms for anal intercourse, and never for oral sex. It's important to me to prioritize my sexual health and the health of my partners.",
    },
    {
        id: "1",
        role: "user",
        content: "Have you ever had an STI?",
    },
    {
        id: "2",
        role: "assistant",
        content: "I did have chlamydia once about a year and a half ago. I took medication for about a week and it cleared up. As far as I know, I have never had syphilis, gonorrhea, or herpes. I always try to get tested regularly and practice safe sex to minimize any risks.",
    },
    {
        id: "1",
        role: "user",
        content: "When did you last get other STI testing such as HIV testing?",
    },
    {
        id: "2",
        role: "assistant",
        content: "Before the test I had done a few days ago, it had actually been about a year since my last negative HIV testing, which was during my last physical examination. I always try to stay on top of my sexual health and get tested regularly.",
    },
    {
        id: "1",
        role: "user",
        content: "Jason, I want to share with you the results of your recent labwork which is unfortunately a serious result. Your HIV blood test has come back positive which means you most likely have HIV."
    },
    {
        id: "2",
        role: "assistant",
        content: "(Silence as I process the news)Oh... wow. I... I can't believe it. Are you sure? Could the test be wrong? Is there any chance for a false positive? I mean, I've always been careful and I never expected this.",
    },
    {
        id: "1",
        role: "user",
        content: "There is a small chance of a false positive but this is quite rare. This very likely indicates that you do have HIV. I am so sorry to tell you this news."
    },
    {
        id: "2",
        role: "assistant",
        content: "(Speechless for a moment, then overcome with emotion) I... I don't know what to say. This is just... overwhelming. How... how long have I had it? Can you tell?",
    },
    {
        id: "1",
        role: "user",
        content: "Based on this test you have likely had HIV for at least 4 weeks but it may have been for longer."
    },
    {
        id: "2",
        role: "assistant",
        content: "(Visibly shaken) Four weeks... It's hard to believe. I never expected this. How... how could I have gotten it? I thought I was being careful.",
    },
    {
        id: "1",
        role: "user",
        content: "HIV can be transferred by unprotected sexual intercourse of via blood. It is okay Jason, with today's modern medicine, HIV is a well managed disease, people's life expectancy does not change. We will be able to support you"
    },
    {
        id: "2",
        role: "assistant",
        content: "(Overwhelmed with emotions, tears start to well up) Thank you, Dr. Raff. I appreciate your support and reassurance. It's just... a lot to take in. How long do I have to live? Will I be able to lead a normal life?",
    },
    {
        id: "1",
        role: "user",
        content: "With daily medication, HIV can be kept at low levels and you can lead a normal life. Jason, how are you feeling about this news?"
    },
    {
        id: "2",
        role: "assistant",
        content: "(Tearfully) Honestly, I'm feeling scared and shocked. This is not something I ever expected to hear. It's a lot to process. I'm worried about how this will affect my relationship with Alec and how it will impact my future. I'll do whatever it takes to manage this, but it's still overwhelming.",
    },
    {
        id: "1",
        role: "user",
        content: "I hear you, I can't imagine what you must be feeling right now. Do you understand what HIV is? do you have any questions for me?"
    },
    {
        id: "2",
        role: "assistant",
        content: "I have a basic understanding of HIV, but I would appreciate if you could explain more about it. What exactly does it do to the body and what are the treatment options? Also, is there anything I need to do differently in my daily life now that I have been diagnosed with HIV?",
    },
    {
        id: "1",
        role: "user",
        content: "HIV is a virus that gets into your immune cells where it is able to hide from the immune system. When untreated this can result in severe immunodeficiency - or a weakened immune system. A weakened immune system can lead someone to be susceptible to infections like diarrhea. Sometimes people get symptoms with HIV such as sweating at night, weight loss or diarrhea. Have you experienced any of these?"
    },
    {
        id: "2",
        role: "assistant",
        content: "No, I haven't experienced any of those symptoms. I feel fine and haven't noticed any significant changes in my health or weight. But it's good to know what to look out for. Thank you for explaining that to me, Dr. Raff.",
    },
    {
        id: "1",
        role: "user",
        content: "Before we move on to next steps, I just wanted to open a discussion about what you will discuss with your partner. Have you thought about this?"
    },
    {
        id: "2",
        role: "assistant",
        content: "Yes, I have been thinking about it. I'm really nervous to tell Alec about my diagnosis. I don't know how he will react or what it will mean for our relationship. But I understand that it's important for him to know so that he can get tested as well. I hope he will be supportive and understanding.",
    },
    {
        id: "1",
        role: "user",
        content: "Yes, you are correct, it is very important for his health and mandated by public health that we trace contacts to prevent people from getting HIV."
    },
    {
        id: "2",
        role: "assistant",
        content: "I understand the importance of contact tracing and preventing the spread of HIV. I will have a conversation with Alec as soon as I can gather the courage to do so. I hope that he will understand the situation and take the necessary steps to get tested and protect his own health. Thank you for emphasizing the importance of this, Dr. Raff.",
    },
    {
        id: "1",
        role: "user",
        content: "Additionally, moving forward it is recommended you wear a condom to prevent spread."
    },
    {
        id: "2",
        role: "assistant",
        content: "Thank you for the recommendation, Dr. Raff. I will definitely make sure to prioritize safe practices and use condoms moving forward to prevent the spread of HIV. It's a small step I can take to protect both myself and others.",
    },
    {
        id: "1",
        role: "user",
        content: "Do you have any questions for me?"
    },
    {
        id: "2",
        role: "assistant",
        content: "Yes, I do have a few questions, if that's alright. Are there any support groups or resources you can recommend for someone who has recently been diagnosed with HIV? What are the next steps in terms of treatment? Will I need to start medication right away?",
    },
    {
        id: "1",
        role: "user",
        content: "Yes, there are a few next steps. We will need to arrange bloodwork and will also refer you to the provincial HIV clinic where you will be started on medication to treat HIV. The medication you start will depend on the specific type of HIV you have so we will need to wait for that result. You will get an appointment in the next 1-2 weeks and they will discuss with you the monitoring process in the future. I can provide you with local support groups. Unfortunately we are out of time, but wishing you the best. Please contact our office if you have any questions."
    },
    {
        id: "2",
        role: "assistant",
        content: "Thank you, Dr. Raff, for your time and assistance. I appreciate your help in guiding me through this difficult news. I will make sure to contact your office if I have any further questions or concerns. Take care.",
    },
]

function appendMessageContents(messages: Message[]): string {
    return messages.map(message => message.content).join(' ');
}

console.log(appendMessageContents(sampleMessages))


