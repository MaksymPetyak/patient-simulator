import {UseChatHelpers} from 'ai/react'
import * as React from 'react'
import Textarea from 'react-textarea-autosize'

import {Button} from '@/components/ui/button'
import {IconArrowElbow, IconMicrophone, IconStop} from '@/components/ui/icons'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from '@/components/ui/tooltip'
import {useEnterSubmit} from '@/lib/hooks/use-enter-submit'
import {useRouter} from 'next/navigation'
import {useWhisper} from "@chengsokdara/use-whisper";
import {useEffect, useState} from "react";
import {cn} from "@/lib/utils";

export interface PromptProps
    extends Pick<UseChatHelpers, 'input' | 'setInput'> {
    onSubmit: (value: string) => Promise<void>
    isLoading: boolean
}


function RecordingButton({setInput, setIsRecording}: {
    setInput: (text: string) => void;
    setIsRecording: (isRecording: boolean) => void
}) {
    const onTranscribe = async (blob: Blob) => {
        const formData = new FormData();
        formData.append('file', blob, 'audio.wav');

        const {default: axios} = await import('axios')

        const response = await fetch('/api/whisper', {
            method: 'POST',
            body: formData,
        });
        const {text, error} = await response.json();

        // you must return result from your server in Transcript format
        return {
            blob,
            text,
        }
    }

    const {transcript, recording, startRecording, stopRecording} = useWhisper({
        // callback to handle transcription with custom server
        onTranscribe,
    })

    useEffect(() => {
        if (transcript) {
            setInput(transcript.text ?? "")
        }
    }, [transcript, setInput])

    useEffect(() => {
        setIsRecording(recording)
    }, [recording, setIsRecording])

    return (
        <div className={cn(
            "flex items-center justify-center bg-gray-50 hover:bg-gray-200 border border-gray-200 rounded-full p-2",
            recording && "bg-red-500 hover:bg-red-600 border border-red-700",
        )}
             onClick={() => {
                 if (recording) {
                     stopRecording()
                 } else {
                     startRecording()
                 }
             }
             }
        >
            {!recording && (
                <IconMicrophone/>
            )}
            {recording && (
                <IconStop className={"text-white"}/>
            )}
        </div>
    )
}

export function PromptForm({
                               onSubmit,
                               input,
                               setInput,
                               isLoading
                           }: PromptProps) {
    const {formRef, onKeyDown} = useEnterSubmit()
    const inputRef = React.useRef<HTMLTextAreaElement>(null)

    const [isRecording, setIsRecording] = useState(false)

    const router = useRouter()

    React.useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }, [])

    return (
        <form
            onSubmit={async e => {
                e.preventDefault()
                if (!input?.trim()) {
                    return
                }
                setInput('')
                await onSubmit(input)
            }}
            ref={formRef}
        >
            <div
                className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:rounded-md sm:border sm:px-12">
                {/*<Tooltip>*/}
                {/*  <TooltipTrigger asChild>*/}
                {/*    <button*/}
                {/*      onClick={e => {*/}
                {/*        e.preventDefault()*/}
                {/*        router.refresh()*/}
                {/*        router.push('/')*/}
                {/*      }}*/}
                {/*      className={cn(*/}
                {/*        buttonVariants({ size: 'sm', variant: 'outline' }),*/}
                {/*        'absolute left-0 top-4 h-8 w-8 rounded-full bg-background p-0 sm:left-4'*/}
                {/*      )}*/}
                {/*    >*/}
                {/*      <IconPlus />*/}
                {/*      <span className="sr-only">New Chat</span>*/}
                {/*    </button>*/}
                {/*  </TooltipTrigger>*/}
                {/*  <TooltipContent>New Chat</TooltipContent>*/}
                {/*</Tooltip>*/}
                <Textarea
                    ref={inputRef}
                    tabIndex={0}
                    onKeyDown={onKeyDown}
                    rows={1}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Hey, Jason! How are you today?"
                    spellCheck={false}
                    className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
                />
                <div className="absolute right-0 top-4 sm:right-4">
                    <div className={"flex gap-2"}>
                        <RecordingButton setInput={setInput}
                                         setIsRecording={setIsRecording}/>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    type="submit"
                                    size="icon"
                                    disabled={isLoading || input === '' || isRecording}
                                >
                                    <IconArrowElbow/>
                                    <span className="sr-only">Send message</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Send message</TooltipContent>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </form>
    )
}
