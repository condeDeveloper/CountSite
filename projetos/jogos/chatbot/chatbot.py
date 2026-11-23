import anthropic

client = anthropic.Anthropic()  # usa a chave da variável ANTHROPIC_API_KEY
historico = []

print("Chatbot com IA. Digite 'sair' para terminar.\n")

while True:
    pergunta = input("Você: ").strip()
    if pergunta.lower() == "sair":
        break
    if not pergunta:
        continue
    historico.append({"role": "user", "content": pergunta})

    print("Bot: ", end="", flush=True)
    with client.beta.messages.stream(
        model="claude-opus-5-5",
        max_tokens=2000,
        system="Você é um assistente simpático. Responda em português, em poucas frases.",
        messages=historico,
        output_config={"effort": "low"},
        betas=["server-side-fallback-2026-07-01"],
        fallbacks="default",
    ) as resposta:
        for pedaco in resposta.text_stream:
            print(pedaco, end="", flush=True)
        final = resposta.get_final_message()
    print("\n")

    if final.stop_reason == "refusal":
        print("(O bot não pode responder isso. Tente perguntar de outro jeito.)\n")
        historico.pop()
        continue
    historico.append({"role": "assistant", "content": final.content})

print("Até mais!")
