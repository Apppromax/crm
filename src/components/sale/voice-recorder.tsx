'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Mic, MicOff, Square, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
    onTranscript: (text: string) => void
    className?: string
}

interface SpeechRecognitionEvent {
    results: SpeechRecognitionResultList
    resultIndex: number
}

interface SpeechRecognitionErrorEvent {
    error: string
}

export function VoiceRecorder({ onTranscript, className }: Props) {
    const [isRecording, setIsRecording] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [transcript, setTranscript] = useState('')
    const [duration, setDuration] = useState(0)
    const [supported, setSupported] = useState(true)
    const recognitionRef = useRef<ReturnType<typeof createRecognition> | null>(null)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        const SpeechRecognition = (window as unknown as Record<string, unknown>).SpeechRecognition ||
            (window as unknown as Record<string, unknown>).webkitSpeechRecognition
        if (!SpeechRecognition) {
            setSupported(false)
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [])

    function createRecognition() {
        const SpeechRecognition = (window as unknown as Record<string, unknown>).SpeechRecognition ||
            (window as unknown as Record<string, unknown>).webkitSpeechRecognition
        if (!SpeechRecognition) return null

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const recognition = new (SpeechRecognition as any)()
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = 'vi-VN'
        return recognition
    }

    const startRecording = useCallback(() => {
        const recognition = createRecognition()
        if (!recognition) return

        recognitionRef.current = recognition
        setTranscript('')
        setDuration(0)
        setIsRecording(true)

        intervalRef.current = setInterval(() => {
            setDuration(prev => prev + 1)
        }, 1000)

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            let finalTranscript = ''
            let interimTranscript = ''

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i]
                if (result.isFinal) {
                    finalTranscript += result[0].transcript
                } else {
                    interimTranscript += result[0].transcript
                }
            }

            setTranscript(prev => {
                const combined = finalTranscript ? prev + finalTranscript : prev
                return combined || interimTranscript
            })
        }

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error('Speech recognition error:', event.error)
            stopRecording()
        }

        recognition.onend = () => {
            if (isRecording) {
                // Auto-restart if still recording
                try { recognition.start() } catch { /* ignore */ }
            }
        }

        recognition.start()
    }, [isRecording])

    const stopRecording = useCallback(() => {
        setIsRecording(false)
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }
        if (recognitionRef.current) {
            recognitionRef.current.stop()
            recognitionRef.current = null
        }

        if (transcript.trim()) {
            setIsProcessing(true)
            // Simulate AI processing delay
            setTimeout(() => {
                onTranscript(transcript.trim())
                setIsProcessing(false)
                setTranscript('')
                setDuration(0)
            }, 500)
        }
    }, [transcript, onTranscript])

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60)
        const s = secs % 60
        return `${m}:${s.toString().padStart(2, '0')}`
    }

    if (!supported) {
        return (
            <div className={cn('flex items-center gap-2 text-xs text-slate-400', className)}>
                <MicOff className="h-4 w-4" />
                <span>Trình duyệt không hỗ trợ ghi âm</span>
            </div>
        )
    }

    return (
        <div className={cn('flex items-center gap-2', className)}>
            {isRecording && (
                <div className="flex items-center gap-2 flex-1 min-w-0 animate-slide-up">
                    {/* Waveform animation */}
                    <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div
                                key={i}
                                className="w-0.5 bg-red-500 rounded-full animate-bounce-soft"
                                style={{
                                    height: `${8 + Math.random() * 12}px`,
                                    animationDelay: `${i * 0.1}s`,
                                }}
                            />
                        ))}
                    </div>
                    <span className="text-xs font-mono text-red-500 font-medium">{formatTime(duration)}</span>
                    {transcript && (
                        <p className="text-xs text-slate-500 truncate flex-1">{transcript}</p>
                    )}
                </div>
            )}

            {isProcessing ? (
                <div className="flex items-center gap-2 text-xs text-indigo-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Đang xử lý...</span>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={cn(
                        'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all',
                        isRecording
                            ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse-golden'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    )}
                >
                    {isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-5 w-5" />}
                </button>
            )}
        </div>
    )
}
