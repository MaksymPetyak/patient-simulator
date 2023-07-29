import {type UseChatHelpers} from 'ai/react'

import {Button} from '@/components/ui/button'
import {PromptForm} from '@/components/prompt-form'
import {ButtonScrollToBottom} from '@/components/button-scroll-to-bottom'
import {IconRefresh, IconStop} from '@/components/ui/icons'
import {FooterText} from '@/components/footer'
import {EvaluationStage} from "@/lib/types";
import {useTimer} from "react-timer-hook";
import {useEffect, useState} from "react";

export interface ChatPanelProps
    extends Pick<
        UseChatHelpers,
        | 'append'
        | 'isLoading'
        | 'reload'
        | 'messages'
        | 'stop'
        | 'input'
        | 'setInput'
    > {
    id?: string,
    onEndChat: () => void,
    evaluationStep: EvaluationStage,
    restart: () => void,
}

function Timer({ timeInterval = 14 }: { timeInterval?: number}) {
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + timeInterval);

    const {
        seconds,
        minutes,
        isRunning,
    } = useTimer({expiryTimestamp: expiryTime, onExpire: () => console.warn('onExpire called')});

    let paddedMinutes = String(minutes).padStart(2, '0');
    let paddedSeconds = String(seconds).padStart(2, '0');

    return (
        <div className={"bg-gray-100 border border-gray-300 m-4 p-0.5 rounded-sm"}>
            <p className={!isRunning ? "text-red-500" : "text-gray-900"}>{paddedMinutes}:{paddedSeconds}</p>
        </div>
    )
}


export function ChatPanel({
                              id,
                              isLoading,
                              stop,
                              append,
                              reload,
                              input,
                              setInput,
                              messages,
                              onEndChat,
                              evaluationStep,
                              restart,
                          }: ChatPanelProps) {
    if (evaluationStep === "report") {
        return (
            <div
                className="fixed inset-x-0 bottom-0 bg-gradient-to-b from-muted/10 from-10% to-muted/30 to-50%">
                <ButtonScrollToBottom/>
                <div className="mx-auto sm:max-w-2xl sm:px-8 mb-4">
                    <div className="flex h-10 items-center justify-center">
                        <Button
                            variant="default"
                            onClick={() => restart()}
                            className="bg-blue-400 hover:bg-blue-500"
                        >
                            <IconRefresh className="mr-2"/>
                            Try again
                        </Button>
                    </div>
                </div>
            </div>
        )
    }


    return (
        <div
            className="fixed inset-x-0 bottom-0 bg-gradient-to-b from-muted/10 from-10% to-muted/30 to-50%">
            <ButtonScrollToBottom/>
            <div className="mx-auto sm:max-w-2xl sm:px-4">
                <div className="flex h-10 items-center justify-center">
                    {messages?.length > 0 && (
                        <Button
                            variant="default"
                            onClick={() => onEndChat()}
                            className="bg-red-400 hover:bg-red-500"
                        >
                            <IconStop className="mr-2"/>
                            End conversation and get feedback
                            <Timer />
                        </Button>
                    )}
                </div>
                <div
                    className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
                    <PromptForm onSubmit={async value => {
                        await append({
                            id,
                            content: value,
                            role: 'user'
                        })
                    }}
                                input={input}
                                setInput={setInput}
                                isLoading={isLoading}
                    />
                    {/*<FooterText className="hidden sm:block" />*/}
                </div>
            </div>
        </div>
    )
}
