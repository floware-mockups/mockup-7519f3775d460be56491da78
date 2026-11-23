// @ts-nocheck
import { customTicker, customTimers } from "../customGuard.ts";
const __mk = customTicker("MappaInterventi");
const { setTimeout, setInterval, clearTimeout, clearInterval } = customTimers("MappaInterventi");
import { useState } from "react";
import { Button, Card, Badge, useTable, usePrototype } from "../floware";

export default function MappaInterventi(props) {__mk();
  const table = useTable(props.pageId);
  const { openDetail } = usePrototype();
  const [selezionato, setSelezionato] = useState(-1);
  if (!table) return null;
  if (table.column("Coordinate (latitudine, longitudine)") < 0) return <p>La colonna Coordinate (latitudine, longitudine) è necessaria per mostrare i punti.</p>;
  const leggi = (indice, colonna) => (__mk(), table.column(colonna) >= 0 ? table.value(indice, colonna) : "Dato mancante");
  const punti = table.rows.map((riga, indice) => {__mk();
    const testo = table.value(riga, "Coordinate (latitudine, longitudine)");
    const parti = testo.split(",");
    const lat = Number((parti[0] || "").trim());
    const lon = Number((parti[1] || "").trim());
    const valido = parti.length === 2 && parti.every((p) => (__mk(), p.trim() !== "")) && Number.isFinite(lat) && Number.isFinite(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180;
    return { indice, lat, lon, valido, testo };
  });
  const validi = punti.filter((p) => (__mk(), p.valido));
  const latMin = validi.length ? Math.min(...validi.map((p) => (__mk(), p.lat))) : 0;
  const latMax = validi.length ? Math.max(...validi.map((p) => (__mk(), p.lat))) : 0;
  const lonMin = validi.length ? Math.min(...validi.map((p) => (__mk(), p.lon))) : 0;
  const lonMax = validi.length ? Math.max(...validi.map((p) => (__mk(), p.lon))) : 0;
  return (
    <Card title="Mappa dimostrativa degli interventi">
      <div className="space-y-4">
        <Badge tone="primary">Dimostrazione — luoghi e dati inventati</Badge>
        <p className="text-sm text-(--mk-muted)">Posizioni relative calcolate dalle coordinate, senza cartografia reale. La rappresentazione non è in scala e non serve alla navigazione. Seleziona un punto numerato per evidenziare la sua scheda.</p>
        <div className="relative overflow-hidden rounded-lg border border-(--mk-border) bg-(--mk-subtle)" style={{ height: "320px" }}>
          <svg width="100%" height="100%" viewBox="0 0 800 320" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 80 H800 M0 160 H800 M0 240 H800 M160 0 V320 M320 0 V320 M480 0 V320 M640 0 V320" fill="none" stroke="var(--mk-divider)" strokeWidth="1" />
          </svg>
          <div className="absolute left-3 top-2 text-sm text-(--mk-muted)">Nord ↑</div>
          {validi.map((p) => {__mk();
            const x = lonMax === lonMin ? 50 : 10 + 80 * (p.lon - lonMin) / (lonMax - lonMin);
            const y = latMax === latMin ? 50 : 15 + 70 * (latMax - p.lat) / (latMax - latMin);
            return <div key={p.indice} className="absolute" style={{ left: String(x) + "%", top: String(y) + "%", transform: "translate(-50%, -50%)" }}>
              <Button variant={selezionato === p.indice ? "primary" : "secondary"} onClick={() => (__mk(), setSelezionato(p.indice))}>{String(p.indice + 1)}{selezionato === p.indice ? " • Selezionato" : ""}</Button>
            </div>;
          })}
          {!validi.length && <div className="absolute left-4 top-12">Nessuna coordinata valida da mostrare.</div>}
        </div>
        <p className="text-sm text-(--mk-muted)">{validi.length} punti rappresentati su {punti.length} interventi. I numeri collegano i segnaposti alle schede.</p>
        <div className="grid gap-3 md:grid-cols-2">
          {punti.map((p) => (__mk(), <section key={p.indice} className={selezionato === p.indice ? "space-y-2 rounded-lg border-2 border-(--mk-border) bg-(--mk-subtle) p-4" : "space-y-2 rounded-lg border border-(--mk-border) bg-(--mk-surface) p-4"}>
            <h3 className="font-semibold">{p.indice + 1}. {leggi(p.indice, "Pratica")}</h3>
            {selezionato === p.indice && <Badge tone="primary">Intervento selezionato</Badge>}
            <p>{leggi(p.indice, "Indirizzo")}</p>
            <p>{leggi(p.indice, "Tipo intervento")}</p>
            <Badge tone="neutral">{leggi(p.indice, "Stato")}</Badge>
            <p className="text-sm text-(--mk-muted)">Coordinate: {p.testo || "Non disponibili"}</p>
            {!p.valido && <p className="text-sm text-(--mk-danger)">Coordinate non valide: segnaposto non rappresentato.</p>}
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => (__mk(), setSelezionato(p.indice))}>Seleziona intervento {p.indice + 1}</Button>
              <Button variant="link" onClick={() => (__mk(), openDetail(props.pageId, p.indice))}>Apri dettaglio</Button>
            </div>
          </section>))}
        </div>
      </div>
    </Card>
  );
}
