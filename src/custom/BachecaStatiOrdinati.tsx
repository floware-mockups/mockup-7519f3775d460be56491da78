// @ts-nocheck
import { customTicker, customTimers } from "../customGuard.ts";
const __mk = customTicker("BachecaStatiOrdinati");
const { setTimeout, setInterval, clearTimeout, clearInterval } = customTimers("BachecaStatiOrdinati");
import { Card, Badge, Button, useTable, usePrototype } from "../floware";

export default function BachecaStatiOrdinati(props) {__mk();
  const table = useTable(props.pageId);
  const { openDetail } = usePrototype();
  if (!table || table.column("Stato") < 0) return null;
  const stati = table.statuses.filter((stato) => (__mk(), stato !== "Da fare"));
  if (table.statuses.includes("Da fare")) stati.push("Da fare");
  return (
    <Card title="Bacheca ordinata">
      <p className="mb-3 text-sm text-(--mk-muted)">Vista aggiuntiva: «Da fare» è sempre l’ultima colonna.</p>
      <div className="flex gap-4 overflow-x-auto pb-3">
        {stati.map((stato) => {__mk();
          const indici = table.findRows("Stato", stato);
          return (
            <section key={stato} className="w-64 shrink-0 rounded-lg border border-(--mk-border) bg-(--mk-subtle) p-3">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="font-semibold text-(--mk-text)">{stato}</h3>
                <Badge tone="neutral">{indici.length}</Badge>
              </div>
              <div className="space-y-3">
                {indici.map((indice) => (
                  (__mk(), <div key={indice} className="space-y-2 rounded-lg border border-(--mk-border) bg-(--mk-surface) p-3">
                    <p className="font-semibold">{table.column("Pratica") >= 0 ? table.value(indice, "Pratica") : "Intervento"}</p>
                    {table.column("Tipo intervento") >= 0 && <p>{table.value(indice, "Tipo intervento")}</p>}
                    {table.column("Indirizzo") >= 0 && <p className="text-sm text-(--mk-muted)">{table.value(indice, "Indirizzo")}</p>}
                    <Button variant="secondary" onClick={() => (__mk(), openDetail(props.pageId, indice))}>Apri dettaglio</Button>
                  </div>)
                ))}
                {indici.length === 0 && <p className="text-sm text-(--mk-muted)">Nessun intervento.</p>}
              </div>
            </section>
          );
        })}
      </div>
    </Card>
  );
}
