import { McpServer } from "@modelcontextprotocol/server";
import { createMcpHandler } from "agents/mcp/server";
import { z } from "zod";

const URL_BRIEFING =
  "https://briefind-camilla.cguimaraes.workers.dev/";

function criarServidor() {
  const server = new McpServer({
    name: "briefing-camilla",
    version: "1.0.0",
  });

  server.registerTool(
    "consultar_briefing",
    {
      description:
        "Consulta o briefing diário da Camilla, incluindo prioridades críticas, tarefas de hoje, próximos 7 dias, dinheiro em risco, follow-ups, rotina CS e foco do dia.",
      inputSchema: {},
    },
    async () => {
      try {
        const resposta = await fetch(URL_BRIEFING);

        if (!resposta.ok) {
          throw new Error(
            `Erro ao consultar briefing: HTTP ${resposta.status}`
          );
        }

        const dados = await resposta.text();

        return {
          content: [
            {
              type: "text",
              text: dados,
            },
          ],
        };
      } catch (erro) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                erro: true,
                mensagem: String(erro),
              }),
            },
          ],
          isError: true,
        };
      }
    }
  );

  return server;
}

export default {
  fetch(request: Request, env: unknown, ctx: ExecutionContext) {
    return createMcpHandler(criarServidor)(request, env, ctx);
  },
};
