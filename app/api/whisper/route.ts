import {NextRequest, NextResponse} from "next/server";
import {writeFile} from 'fs/promises'
import fs from "fs";

const {Configuration, OpenAIApi} = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const FormData = require('form-data');


export const config = {
    api: {
        bodyParser: false,
    },
}

export async function POST(request: NextRequest) {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
        return NextResponse.json({success: false})
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const path = `/tmp/${file.name}`
    await writeFile(path, buffer)

    const openai = new OpenAIApi(configuration);
    const response = await openai.createTranscription(
        fs.createReadStream(path),
        "whisper-1"
    );
    const { text } = response.data


    if (text) {
        return NextResponse.json({
            text,
        });
    } else {
        console.log("Something went wrong")
    }
}
