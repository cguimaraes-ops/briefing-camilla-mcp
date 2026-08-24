```typescript
import { createMcpHandler } from "agents/mcp/server";
import { McpServer } from "@modelcontextprotocol/server";

const URL_BRIEFING =
  "https://script.google.com/macros/s/AKfycbzElsr8aQX4zf4ZVpmprNNU5ffmIZowXOogYkLGXT3Qnmy6upS7MU8lkQEcQ7JQVmjl/exec";

function createServer() {
  const server = new McpServer({
    name: "Briefing Camilla",
    version: "1.0.0",
  });

  server.registerTool(
    "consultar_briefing",
    {
      description:
        "Consulta o briefing executivo diario da Camilla, obtido a partir do Google Apps Script.",
      inputSchema: {},
    },
    async () => {
      try {
        const resposta = await fetch(URL_BRIEFING, {
          method: "GET",
          redirect: "follow",
        });

        if (!resposta.ok) {
          return {
            content: [
              {
                type: "text",
                text:
                  "Erro ao consultar o briefing. HTTP " +
                  resposta.status +
                  ".",
              },
            ],
            isError: true,
          };
        }

        const texto = await resposta.text();

        return {
          content: [
            {
              type: "text",
              text: texto,
            },
          ],
        };
      } catch (erro) {
        return {
          content: [
            {
              type: "text",
              text: "Erro ao consultar o briefing: " + String(erro),
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
  async fetch(request: Request, env: unknown, ctx: ExecutionContext) {
    const url = new URL(request.url);

    if (url.pathname === "/mcp") {
      return createMcpHandler(createServer)(request, env, ctx);
    }

    if (url.pathname === "/briefing") {
      try {
        const resposta = await fetch(URL_BRIEFING, {
          method: "GET",
          redirect: "follow",
        });

        const texto = await resposta.text();

        return new Response(texto, {
          status: resposta.status,
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "no-store",
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
    }

    return new Response(
      "Briefing Camilla MCP — online. Use /mcp ou /briefing.",
      {
        status: 200,
        headers: {
          "Content-Type": "text/plain; charset=UTF-8",
        },
      }
    );
  },
};
```
