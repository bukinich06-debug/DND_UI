import type { IMasterReply } from "../../types"
import { postMaster } from "@/components/adventure/composer/api/postMaster"

interface IRequestLocationLookParams {
  signal?: AbortSignal
}

export const requestLocationLook = async ({
  signal,
}: IRequestLocationLookParams = {}): Promise<IMasterReply> => {
  const response = await postMaster({
    messages: [
      {
        role: "user",
        content:
          "Опиши, где я нахожусь и что вижу вокруг. Это прибытие в локацию.",
      },
    ],
    signal,
  })

  return {
    agent: "master",
    verdict: response.verdict,
    say: response.say,
    toolCalls: response.toolCalls || [],
  }
}
