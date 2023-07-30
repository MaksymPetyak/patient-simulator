'use client'

import {useChat, type Message} from 'ai/react'

import {cn} from '@/lib/utils'
import {ChatList} from '@/components/chat-list'
import {ChatPanel} from '@/components/chat-panel'
import {EmptyScreen} from '@/components/empty-screen'
import {ChatScrollAnchor} from '@/components/chat-scroll-anchor'
import {useLocalStorage} from '@/lib/hooks/use-local-storage'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import {useEffect, useState} from 'react'
import {Button} from './ui/button'
import {Input} from './ui/input'
import {toast} from 'react-hot-toast'
import {CharacterAudioPlayer} from "@/components/character-audio-player";
import {Report} from "@/components/report";
import {EvaluationStage} from "@/lib/types";
import {useRouter} from "next/navigation";

const IS_PREVIEW = process.env.VERCEL_ENV === 'preview'

export interface ChatProps extends React.ComponentProps<'div'> {
    initialMessages?: Message[]
    id?: string
}

async function evaluateConversation(messages: Message[]): Promise<string> {
    const response = await fetch('/api/evaluation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages })
    })

    return (await response.json())["report"]
}


export function Chat({id, initialMessages, className}: ChatProps) {
    const router = useRouter()
    const [previewToken, setPreviewToken] = useLocalStorage<string | null>(
        'ai-token',
        null
    )
    const [playMessage, setPlayMessage] = useState<Message | null>(null)
    const [evaluationStep, setEvaluationStep] = useState<EvaluationStage>("intro")

    const [previewTokenDialog, setPreviewTokenDialog] = useState(IS_PREVIEW)
    const [previewTokenInput, setPreviewTokenInput] = useState(previewToken ?? '')

    const {messages, append, reload, stop, isLoading, input, setInput} =
        useChat({
            initialMessages,
            id,
            body: {
                id,
                previewToken
            },
            onResponse(response) {
                if (response.status === 401) {
                    toast.error(response.statusText)
                }
            },
            onFinish(message: Message) {
                setPlayMessage(message)
            }
        })

    const [report, setReport] = useState<string | null>(null)

    useEffect(() => {
        if (messages.length > 0 && evaluationStep === "intro") {
            setEvaluationStep("conversation")
        }
    }, [messages.length])

    const onEndChat = async () => {
        setEvaluationStep("report")
        const report = await evaluateConversation(messages)
        setReport(report)
    }

    const restart = () => {
        setEvaluationStep("intro")
        setReport(null)
        router.refresh()
        router.push('/')
    }

    return (
        <>
            <div className={cn('pb-[200px] pt-2 md:pt-10', className)}>
                {messages.length ? (
                    <>
                        <ChatList messages={messages}/>
                        <ChatScrollAnchor trackVisibility={isLoading}/>
                        {/*<CharacterAudioPlayer playMessage={playMessage} />*/}
                        {evaluationStep === "report" && <Report report={report} />}
                    </>
                ) : (
                    <EmptyScreen setInput={setInput}/>
                )}
            </div>
            <ChatPanel
                id={id}
                isLoading={isLoading}
                stop={stop}
                append={append}
                reload={reload}
                messages={messages}
                input={input}
                setInput={setInput}
                onEndChat={onEndChat}
                evaluationStep={evaluationStep}
                restart={restart}
            />

            <Dialog open={previewTokenDialog} onOpenChange={setPreviewTokenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Enter your OpenAI Key</DialogTitle>
                        <DialogDescription>
                            If you have not obtained your OpenAI API key, you can do so
                            by{' '}
                            <a
                                href="https://platform.openai.com/signup/"
                                className="underline"
                            >
                                signing up
                            </a>{' '}
                            on the OpenAI website. This is only necessary for preview
                            environments so that the open source community can test the
                            app.
                            The token will be saved to your browser&apos;s local storage
                            under
                            the name <code className="font-mono">ai-token</code>.
                        </DialogDescription>
                    </DialogHeader>
                    <Input
                        value={previewTokenInput}
                        placeholder="OpenAI API key"
                        onChange={e => setPreviewTokenInput(e.target.value)}
                    />
                    <DialogFooter className="items-center">
                        <Button
                            onClick={() => {
                                setPreviewToken(previewTokenInput)
                                setPreviewTokenDialog(false)
                            }}
                        >
                            Save Token
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
