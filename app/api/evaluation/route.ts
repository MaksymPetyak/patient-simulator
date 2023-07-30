import {Configuration, OpenAIApi} from 'openai-edge'

import {auth} from '@/auth'
import {Message, OpenAIStream, StreamingTextResponse} from "ai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

const initialSystemMessages = [
    {
        role: 'system',
        content: 'You are evaluating a conversation between patient and doctor with the goal of providing feedback to the doctor about their performance.'
    },
    {
        role: 'system',
        content: "Here is the background information on the patient: " +
            "The patient is Jason Brody, a 26-year-old man who initially presents for a routine periodic health visit without any active health concerns. He is very casual, carefree, and has a generally unconcerned attitude towards his health. Jason is shocked and upset when he is informed about an unexpected positive HIV test result.\n" +
            "From his past medical history, Jason has been generally healthy with no significant issues apart from a broken arm in 4th grade. He has never had any surgeries and doesn't take any medications regularly, occasionally using Tylenol for headaches.\n" +
            "His social history reveals that he has never smoked tobacco but drinks a few times a week, mainly on weekends. He smokes marijuana a couple of times a month but has never tried any other drugs. Jason follows a healthy lifestyle that includes regular exercise and a good diet. He works as a freelance graphic designer and also paints houses for supplementary income.\n" +
            "Jason lives with his boyfriend, Alec, and they have been in a monogamous relationship for about 6 months. They mostly practice safe sex but have had a few occasions of unprotected anal intercourse. Prior to Alec, Jason has had multiple partners and mostly practiced safe sex. He has had one instance of chlamydia about a year and a half ago, which was treated. He has tested negative for HIV a year ago.\n" +
            "His family history includes a father who might have had high blood pressure and left when Jason was a child, and a healthy mother. He has no siblings.\n" +
            "After being told of the HIV positive result, Jason is shocked and distressed. He has limited knowledge about HIV, and although he is initially reluctant, he understands the importance of telling Alec about the results.\n",
    },
    {
        role: "system",
        content: `Use the following evaluation framework and criteria to give feedback:
* Established rapport
* Elicits Patients understanding of the testing. Explores experience (i.e. FIFE)
* Answers questions/delivers results appropriately
* Avoids medical jargon and euphemisms (i.e. uses clear easily understood language)
* Checks for understanding, invites response
* Responds appropriately to emotional reactions 
* Demonstrates appropriate attitude (ex. genuine, non-judgmental)  
* Demonstrates appropriate non-verbal behaviour and control 
* Asks whether the patient has any symptoms related to HIV/AIDS (opportunistic infections, nightsweats, weight loss, diarrhea)
* Assesses for current sexual activity
* Assesses for sexual exposure risk
* Assesses nonsexual exposure risk (e.g., IV drug use, occupational needle sticks, tattoos)
* Breaks bad news appropriately. 
( check how doctor provides initial warning statement. Provides appropriate pauses to allow information to sink in. Gave news of HIV result in an empathic way. Asked about baseline understanding of HIV. Asked about emotional state following news of HIV) 
* Management. 
(check how doctor discusses natural history and treatment of HIV (broadly). Arranges for bloodwork. Advised to tell partner/contact tracing. Advised barrier protection. Arranges follow up with themselves/HIV clinic. Organization (one bubble). Encounter was purposeful with logical flow. Intervenes with the patient as appropriate.)
* Interpersonal Behaviour 
(check how doctor demonstrates respectful management of interaction. Listens appropriately. Uses appropriate body language. Avoids offensive/aggressive behavior.)

For each criteria give a score choosing between 
Inadequate | Marginal | Adequate | Superior
and give a short explanation of the score and suggestion for improvement. Make sure to format the response nicely with whitespace between each section. Put the section and score in bold with html b tag.
`
    }
];

export async function POST(req: Request) {
    console.log("evaluating")

    const json = await req.json()
    const {messages} = json

    const chatHistoryMessage = {
        role: "user",
        content: messages.map((message: Message) => `${message.role === "assistant" ? "Patient: " : "Doctor: "}:${message.content}`).join("\n")
    }

    const fullMessages = initialSystemMessages.concat(chatHistoryMessage);
    const userId = (await auth())?.user.id

    if (!userId) {
        return new Response('Unauthorized', {
            status: 401
        })
    }
    try {
        const res = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            // @ts-ignore
            messages: fullMessages,
            temperature: 0.0,
            stream: true,
        })

        // Convert the response into a friendly text-stream
        const stream = OpenAIStream(res);

        // Respond with the stream
        return new StreamingTextResponse(stream);
    } catch (e) {
        console.log("error getting a response")
        console.log(e)
    }
}
