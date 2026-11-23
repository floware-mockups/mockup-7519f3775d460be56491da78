// @ts-nocheck
import { customTicker, customTimers } from "../customGuard.ts";
const __mk = customTicker("NumerazionePratiche");
const { setTimeout, setInterval, clearTimeout, clearInterval } = customTimers("NumerazionePratiche");
import { useEffect, useState } from "react";
import { Button, Card, useTable, usePrototype } from "../floware";

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
  const { notify } = usePrototype();
  const [massimo, setMassimo] = useState(contatore.massimo);
  useEffect(() => {__mk();
    if (!table || table.column("Pratica") < 0) return;
    contatore.massimo = table.rows.reduce((max, riga) => (__mk(), Math.max(max, progressivo(table.value(riga, "Pratica")))), contatore.massimo);
    table.rows.forEach((riga, indice) => {__mk();
      if (table.value(riga, "Pratica").trim() !== "") return;
      if (contatore.massimo >= Number.MAX_SAFE_INTEGER) return;
      contatore.massimo += 1;
      table.setCell(indice, "Pratica", formato(contatore.massimo));
    });
    setMassimo(contatore.massimo);
  }, [table]);

  const nuovaPratica = () => {__mk();
    if (!table || table.column("Pratica") < 0) return;
    const osservato = table.rows.reduce((max, riga) => (__mk(), Math.max(max, progressivo(table.value(riga, "Pratica")))), contatore.massimo);
    if (osservato >= Number.MAX_SAFE_INTEGER) {
      notify("Limite della numerazione raggiunto.");
      return;
    }
    contatore.massimo = osservato + 1;
    const identificativo = formato(contatore.massimo);
    const nuova = {};
    table.columns.forEach((colonna) => {__mk();
      nuova[colonna] = "";
    });
    nuova["Pratica"] = identificativo;
    if (table.column("Stato") >= 0) nuova["Stato"] = "Da fare";
    table.addRow(nuova);
    setMassimo(contatore.massimo);
    notify("Creata " + identificativo + ". Usa Modifica per completare i campi con dati dimostrativi.");
  };

  if (!table || table.column("Pratica") < 0) return <p>Per la numerazione serve la colonna Pratica.</p>;
  return <Card title="Numerazione automatica">
    <div className="space-y-3">
      <Button onClick={nuovaPratica} disabled={massimo >= Number.MAX_SAFE_INTEGER}>Nuova pratica</Button>
      <p>Il pulsante crea una pratica con identificativo automatico e stato Da fare. Usa Modifica sulla pratica per completare Indirizzo, Comune, Tecnico incaricato, Data sopralluogo, Stato e Indirizzo email con soli dati dimostrativi.</p>
      <p className="text-sm text-(--mk-muted)">Ultimo progressivo utilizzato: {formato(massimo)}. Gli identificativi esistenti restano invariati e i numeri rimossi non vengono riutilizzati. Anche le righe aggiunte con Pratica vuota ricevono un progressivo.</p>
      <p className="text-sm text-(--mk-muted)">Il contatore resta in memoria durante la sessione, anche cambiando pagina. Il ricaricamento del prototipo ripristina i dati dimostrativi.</p>
    </div>
  </Card>;
}
