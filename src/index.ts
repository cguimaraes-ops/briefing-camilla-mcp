export default {
  async fetch(request: Request): Promise<Response> {
    const URL_BRIEFING =
      "https://briefind-camilla.cguimaraes.workers.dev/";

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    try {
      const resposta = await fetch(URL_BRIEFING);

      const texto = await resposta.text();

      return new Response(texto, {
        status: resposta.status,
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (erro) {
      return new Response(
        JSON.stringify({
          erro: true,
          mensagem: String(erro),
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }
  },
};
