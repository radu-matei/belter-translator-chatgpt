import { HttpRequest, HttpResponse } from "@fermyon/spin-sdk"
import { Configuration, OpenAIApi } from "@ericlewis/openai";

let decoder = new TextDecoder();
let encoder = new TextEncoder();
let router = utils.Router();

interface Prompt {
  id: string,
  message: string
  translation?: string
}

router.post("/api/translate", async (_req, extra) => {
  try {
    // Get the OpenAI key from the default KV store.
    let kv = spinSdk.kv.openDefault();
    let configuration = new Configuration({
      apiKey: decoder.decode(kv.get("openai_key")),
    });

    // Create a new instance of the OpenAI client.
    let openai = new OpenAIApi(configuration);

    // Read the conversation ID and message from the request body.
    let p = JSON.parse(decoder.decode(extra.body)) as Prompt;

    console.log(`Message: ${p.message}`);

    // Initialize ChatGPT with a system prompt, then add the user input. 
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { "role": "system", "content": "You are a helpful assistant that translates the input to the languages spoken by Belters from the Expanse universe, by James S.A. Corey. Please refrain from adding any additional notes and completions, only translate the user input." },
        { "role": "user", "content": `Translate the following to the Belter language: ${p.message}` },
      ],
    });
    console.log(JSON.stringify(completion));

    let text = completion.data.choices[0]!.message!.content! || "I guess the AI just gave up...";
    p.translation = text;

    // Attempt to write the conversation to the KV store, but return the result to the user in case writing failed.
    try {
      kv.set(p.id, JSON.stringify(p));
    } catch (err) {
      console.error(`Cannot write translation to KV store: ${err}`);
    }

    // Return the latest response to the user.
    return { status: 200, body: encoder.encode(text).buffer };
  } catch (err) {
    console.log(err);
    return error()
  }
});

// Function to generate a generic error message.
function error(): HttpResponse {
  return { status: 500, body: encoder.encode("You might want to ask ChatGPT to fix this...").buffer }
}

// The entrypoint to the Spin application.
export async function handleRequest(req: HttpRequest): Promise<HttpResponse> {
  return await router.handleRequest(req, { body: req.body });
}
