// @ts-nocheck
import { customTicker, customTimers } from "../customGuard.ts";
const __mk = customTicker("ModificaPraticaRegistro");
const { setTimeout, setInterval, clearTimeout, clearInterval } = customTimers("ModificaPraticaRegistro");
import { useState } from "react";
import { Button, Dialog, TextInput, Select, useTable, usePrototype } from "../floware";

const campi = ["Pratica", "Tipo intervento", "Indirizzo", "Comune", "Tecnico incaricato", "Data sopralluogo", "Stato", "Indirizzo email"];

export default function ModificaPraticaRegistro(props) {__mk();
  const table = useTable(props.pageId);
  const { notify } = usePrototype();
  const [aperto, setAperto] = useState(false);
  const [valori, setValori] = useState([]);
  const [originali, setOriginali] = useState([]);
  const [errore, setErrore] = useState("");
  const disponibile = table && table.rows[props.rowIndex] && campi.every((campo) => (__mk(), table.column(campo) >= 0));
  const chiudi = () => (__mk(), setAperto(false));
  const apri = () => {__mk();
    if (!disponibile) return;
    const dati = campi.map((campo) => (__mk(), table.value(props.rowIndex, campo)));
    setValori(dati);
    setOriginali(table.columns.map((campo) => (__mk(), table.value(props.rowIndex, campo))));
    setErrore("");
    setAperto(true);
  };
  const cambia = (indice, valore) => {__mk();
    setValori(valori.map((dato, i) => (__mk(), i === indice ? valore : dato)));
    setErrore("");
  };
  const salva = () => {__mk();
    if (!disponibile) {
      setErrore("La riga o alcuni campi non sono più disponibili.");
      return;
    }
    if (table.columns.length !== originali.length || !table.columns.every((campo, i) => (__mk(), table.value(props.rowIndex, campo) === originali[i]))) {
      setErrore("La riga è cambiata. Chiudi e riapri il modulo prima di modificare.");
      return;
    }
    if (!valori[0].trim()) {
      setErrore("Compila il campo Pratica.");
      return;
    }
    campi.forEach((campo, i) => (__mk(), table.setCell(props.rowIndex, campo, valori[i])));
    setAperto(false);
    notify("Modifiche salvate nel registro, solo in memoria.");
  };
  return <div className="space-y-2">
    <span>{props.value}</span>
    <div><Button variant="secondary" disabled={!disponibile} onClick={apri}>Modifica</Button></div>
    {aperto && <Dialog title="Modifica pratica" onClose={chiudi} footer={<><Button variant="secondary" onClick={chiudi}>Annulla</Button><Button onClick={salva} disabled={!disponibile}>Salva modifiche</Button></>}>
      <div className="space-y-4">
        <p className="text-sm text-(--mk-muted)">Modifica la pratica selezionata. I dati restano in memoria. Usa solo dati dimostrativi.</p>
        {campi.map((campo, i) => (__mk(), campo === "Stato" ? <Select key={campo} label={campo} value={valori[i] || ""} options={Array.from(new Set([valori[i] || "", ...(table ? table.statuses : [])]))} onChange={(valore) => (__mk(), cambia(i, valore))} /> : <TextInput key={campo} label={campo === "Data sopralluogo" ? "Data sopralluogo (gg/mm/aaaa)" : campo} value={valori[i] || ""} onChange={(valore) => (__mk(), cambia(i, valore))} />))}
        {errore && <p className="text-(--mk-danger)">{errore}</p>}
      </div>
    </Dialog>}
  </div>;
}
