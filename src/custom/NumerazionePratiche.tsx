// @ts-nocheck
import { customTicker, customTimers } from "../customGuard.ts";
const __mk = customTicker("NumerazionePratiche");
const { setTimeout, setInterval, clearTimeout, clearInterval } = customTimers("NumerazionePratiche");
import { useEffect, useState } from "react";
import { Card, useTable } from "../floware";

const contatore = { massimo: 6 };

function progressivo(valore) {__mk();
  if (!valore.startsWith("UT-")) return 0;
  const cifre = valore.slice(3);
  if (!cifre || !cifre.split("").every((c) => (__mk(), "0123456789".includes(c)))) return 0;
  const numero = Number(cifre);
  return Number.isSafeInteger(numero) && numero > 0 ? numero : 0;
}

function formato(numero) {__mk();
  const testo = String(numero);
  return "UT-" + (testo.length < 4 ? "0000".slice(testo.length) : "") + testo;
}

export default function NumerazionePratiche(props) {__mk();
  const table = useTable(props.pageId);
  const [massimo, setMassimo] = useState(contatore.massimo);
  useEffect(() => {__mk();
    if (!table || table.column("Pratica") < 0) return;
    const osservato = table.rows.reduce((max, riga) => (__mk(), Math.max(max, progressivo(table.value(riga, "Pratica")))), contatore.massimo);
    contatore.massimo = osservato;
    table.rows.forEach((riga, indice) => {__mk();
      if (table.value(riga, "Pratica").trim() !== "") return;
      if (contatore.massimo >= Number.MAX_SAFE_INTEGER) return;
      contatore.massimo += 1;
      table.setCell(indice, "Pratica", formato(contatore.massimo));
    });
    setMassimo(contatore.massimo);
  }, [table]);
  if (!table || table.column("Pratica") < 0) return <p>Per la numerazione serve la colonna Pratica.</p>;
  return <Card title="Numerazione automatica">
    <div className="space-y-2">
      <p>Per una nuova pratica lascia vuoto il campo Pratica: verrà assegnato il successivo identificativo disponibile.</p>
      <p className="text-sm text-(--mk-muted)">Ultimo progressivo utilizzato: {formato(massimo)}. Gli identificativi esistenti restano invariati e i numeri rimossi non vengono riutilizzati. Il contatore si conserva durante questa sessione dimostrativa, anche cambiando pagina, e si azzera al ricaricamento del prototipo.</p>
    </div>
  </Card>;
}
