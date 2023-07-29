import {Separator} from "@/components/ui/separator";


export function Report({ report }: { report: string | null }) {

    return (
        <div className={"flex flex-col w-full justify-center items-center"}>
            <Separator className="my-4 md:my-8" />
            <p className={"text-lg font-semibold"}>EVALUATION</p>
            {report === null && <p className={"text-sm"}>Generating feedback report for your conversation...</p>}
            {report !== null && <p className={"text-sm"}>{report}</p>}
        </div>
    )
}