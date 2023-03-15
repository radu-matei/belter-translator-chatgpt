# Building a Belter translator with Spin and ChatGPT

This is a simple example of a [Spin](https://github.com/fermyon/spin) application calling to [OpenAI's ChatGPT API](https://openai.com/blog/openai-api) to perform translation into the language spoken by Belters from [The Expanse books, written by James S.A. Corey](https://www.amazon.com/Books-Expanse/s?rh=n%3A283155%2Cp_lbr_books_series_browse-bin%3AThe+Expanse).

### How does this work?

This is a [Spin](https://github.com/fermyon/spin) application made up of two components:

- a front-end component, with a simple web page
- an API written in TypeScript

The API reads the OpenAI key from the [default Spin key/value store](https://developer.fermyon.com/spin/kv-store), then intializes the client and sends the request. It stores the result, then returns it to the user to display it:

```typescript
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
        { "role": "system", "content": "You are a helpful assistant that translates the input to the languages spoken by Belters from the Expanse universe, by James S.A. Corey." },
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
```

### Building and running

```bash
$ cd api && npm install
$ spin build
$ spin up
Available Routes:
  web: http://127.0.0.1:3000 (wildcard)
  api: http://127.0.0.1:3000/api (wildcard)
  kv-explorer: http://127.0.0.1:3000/internal/kv-explorer (wildcard)
```

Running it on your own requires to first obtain an OpenAI key, then set it in the default Spin key/value store using the KV explorer — access `/internal/kv-explorer`, then set the `openai_key` key with the API key.

To see a live demo, access https://belter-translator-jfufebls.fermyon.app/
