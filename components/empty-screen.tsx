import {UseChatHelpers} from 'ai/react'

import {Button} from '@/components/ui/button'
import {ExternalLink} from '@/components/external-link'
import {IconArrowRight} from '@/components/ui/icons'

const exampleMessages = [
    {
        heading: 'Explain technical concepts',
        message: `What is a "serverless function"?`
    },
    {
        heading: 'Summarize an article',
        message: 'Summarize the following article for a 2nd grader: \n'
    },
    {
        heading: 'Draft an email',
        message: `Draft an email to my boss about the following: \n`
    }
]

export function EmptyScreen({setInput}: Pick<UseChatHelpers, 'setInput'>) {
    return (
        <div className="mx-auto max-w-2xl px-4">
            <div className="rounded-lg border bg-background p-8">
                <h1 className="mb-2 text-lg font-semibold">
                    Welcome to patient simulator!
                </h1>
                <p className="mb-2 leading-normal text-muted-foreground">
                    For this case you will be seeing Jason Brody, a 26 year-old patient
                    of yours for
                    the past 3 years in overall good health. Jason is coming in today
                    for your periodic health visit. As is his custom, he came in last
                    week to have lab work drawn in preparation for his visit.

                    <span className={"font-semibold"}>
                        <br/>
                        In reviewing his lab results, you find that his HIV ELISA/Western Blot
                        (which had been done by verbal consent) has returned positive. He is
                        not yet aware of this result.
                        <br/>
                    </span>

                    Perform an appropriate history, disclose the results, and manage.
                </p>
                {/*<p className="leading-normal text-muted-foreground">*/}
                {/*    */}
                {/*</p>*/}
            </div>
        </div>
    )
}
