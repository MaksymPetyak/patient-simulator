'use client'

import { type Message } from 'ai'

import { Button } from '@/components/ui/button'
import {IconPlay, IconStop} from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import React, {useState} from "react";

interface ChatMessageActionsProps extends React.ComponentProps<'div'> {
  message: Message
}

async function playText(text: string, setIsPlaying: (isPlaying: boolean) => void) {
    const response = await fetch('/api/voice', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
    })

    if (!response.ok) {
        throw new Error("Speech generation failed");
    }

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

export function ChatMessageActions({
  message,
  className,
  ...props
}: ChatMessageActionsProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  const togglePlay = () => {
      if (isPlaying) {
          setIsPlaying(false)
      } else {
          setIsPlaying(true)
          playText(message.content, setIsPlaying)
      }
  }

  return (
    <div
      className={cn(
        'flex items-center justify-end md:absolute md:-right-10 md:-top-2',
        className
      )}
      {...props}
    >
      <Button variant="ghost" size="icon" onClick={togglePlay}>
        {isPlaying ? <IconStop /> : <IconPlay />}
        <span className="sr-only">Copy message</span>
      </Button>
    </div>
  )
}
