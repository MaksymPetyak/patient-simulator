import {Separator} from "@/components/ui/separator";


export function Report({ report }: { report: string | null }) {

    return (
        <div className={"flex flex-col w-full justify-center items-center whitespace-pre-line"}>
            <Separator className="my-4 md:my-8" />
            <p className={"text-lg font-semibold"}>EVALUATION</p>
            {report === null && <p className={"text-sm"}>Generating feedback report for your conversation, this can take up to a minute...</p>}
            {report !== null && <p className={"text-sm whitespace-pre-line max-w-xl"} dangerouslySetInnerHTML={{__html: report}}></p>}
        </div>
    )
}