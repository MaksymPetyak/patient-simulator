'use client'

import {type Message} from 'ai'

import {Button} from '@/components/ui/button'
import {IconPlay, IconStop} from '@/components/ui/icons'
import {cn} from '@/lib/utils'
import React, {useEffect, useState} from "react";

async function playText(text: string, setIsPlaying: (isPlaying: boolean) => void) {
    const response = await fetch('/api/voice', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({text})
    })

    if (!response.ok) {
        throw new Error("Speech generation failed");
    }

    // @ts-ignore
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const audioData = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(audioData);

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start();

    source.onended = () => {
        audioContext.close();
    }
}

export function CharacterAudioPlayer({
                                         playMessage,
                                     }: { playMessage: Message | null }) {
    const [isPlaying, setIsPlaying] = useState<boolean>(false)

    const togglePlay = () => {
        if (isPlaying) {
            setIsPlaying(false)
        } else {
            setIsPlaying(true)
            if (playMessage !== null) {
                playText(playMessage.content, setIsPlaying)
            }
        }
    }

    const maxPlay = 2
    const [plays, setPlays] = useState<number>(0)

    useEffect(() => {
        if (plays >= maxPlay || playMessage === null || playMessage.role !== "assistant") {
            return
        }
        playText(playMessage.content, setIsPlaying)
    }, [playMessage?.content, setIsPlaying])

    if (playMessage === null || playMessage.role !== "assistant") {
        return null
    }

    return (
        <div
            className={cn(
                'flex items-center justify-center',
            )}
        >
            <Button variant="default" size="lg" onClick={togglePlay}>
                {isPlaying ? <IconStop/> : <IconPlay/>}
                <span className="sr-only">Play sound</span>
            </Button>
        </div>
    )
}
