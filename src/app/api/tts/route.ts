import { NextRequest, NextResponse } from 'next/server'

// Note: Inworld AI's actual TTS API endpoint may differ from this placeholder
// Since the API is returning 404, we'll use a fallback approach for now
// You may need to verify the correct endpoint with Inworld's documentation

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { text, voiceId, modelId } = body

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 })
        }

        // Get API key from environment
        const apiKey = process.env.INWORLD_API_KEY

        // For now, since the Inworld API endpoint is returning 404,
        // we'll return a fallback response that tells the client to use browser TTS
        // This allows the feature to work while you verify the correct Inworld API details

        if (!apiKey || apiKey === 'your_inworld_api_key_here') {
            console.log('[TTS] No valid Inworld API key configured, using fallback mode')
            return NextResponse.json({
                success: false,
                fallback: true,
                message: 'Using browser TTS fallback. Configure INWORLD_API_KEY for cloud TTS.'
            })
        }

        // Attempt to call Inworld TTS API
        // Note: The endpoint URL may need to be updated based on Inworld's actual API
        const INWORLD_TTS_API = 'https://studio.inworld.ai/v1/workspaces/default/text-to-speech'

        try {
            const response = await fetch(INWORLD_TTS_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    'Grpc-Metadata-session-id': 'web-session',
                },
                body: JSON.stringify({
                    text: text,
                    voice: voiceId || 'en-US-Neural2-C',
                    audioEncoding: 'MP3',
                }),
            })

            if (!response.ok) {
                const errorText = await response.text()
                console.error('[TTS] Inworld API error:', errorText)

                // Return fallback mode on API error
                return NextResponse.json({
                    success: false,
                    fallback: true,
                    message: 'Inworld API unavailable, using browser TTS fallback.',
                    error: errorText
                })
            }

            // Get audio data
            const audioBuffer = await response.arrayBuffer()
            const base64Audio = Buffer.from(audioBuffer).toString('base64')

            return NextResponse.json({
                success: true,
                audio: base64Audio,
                contentType: 'audio/mpeg'
            })
        } catch (apiError) {
            console.error('[TTS] Failed to reach Inworld API:', apiError)
            return NextResponse.json({
                success: false,
                fallback: true,
                message: 'Could not reach Inworld API, using browser TTS fallback.'
            })
        }

    } catch (error) {
        console.error('[TTS] Internal error:', error)
        return NextResponse.json({
            error: 'Internal server error',
            fallback: true
        }, { status: 500 })
    }
}
