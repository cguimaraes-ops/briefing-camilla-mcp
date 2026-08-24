import { McpServer } from "@modelcontextprotocol/server";
import { createMcpHandler } from "agents/mcp/server";

const BRIEFING_URL =
  "https://briefind-camilla.cguimaraes.workers.dev/";

function createServer() {
  const server = new McpServer({
    name: "briefing-camilla",
    version: "1.0.0",
  });

  server.registerTool(
    "consultar_briefing",
    {
      description:
        "Consulta o briefing diário da Camilla. Retorna prioridades críticas, tarefas de hoje, próximos 7 dias, dinheiro em risco, follow-ups, rotina de Customer Success e foco do dia.",
      inputSchema: {},
    },
    async () => {
      try {
        const resposta = await fetch(BRIEFING_URL);

        if (!resposta.ok) {
          return {
            content: [
              {
                type: "text",
                text: `Não foi possível consultar o briefing. HTTP ${resposta.status}.`,
              },
            ],
            isError: true,
          };
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
              text: `Erro ao consultar o briefing: ${String(erro)}`,
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
    return createMcpHandler(createServer)(request, env, ctx);
  },
};
