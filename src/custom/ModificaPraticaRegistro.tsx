// @ts-nocheck
import { customTicker, customTimers } from "../customGuard.ts";
const __mk = customTicker("ModificaPraticaRegistro");
const { setTimeout, setInterval, clearTimeout, clearInterval } = customTimers("ModificaPraticaRegistro");
import { useState } from "react";
import { Button, Dialog, TextInput, Select, Field, useTable, usePrototype } from "../floware";

const campi = ["Tipo intervento", "Indirizzo", "Comune", "Tecnico incaricato", "Data sopralluogo", "Stato", "Indirizzo email"];

export default function ModificaPraticaRegistro(props) {__mk();
  const table = useTable(props.pageId);
  const { notify } = usePrototype();
  const [aperto, setAperto] = useState(false);
  const [posizione, setPosizione] = useState(false);
  const [valori, setValori] = useState([]);
  const [originali, setOriginali] = useState([]);
  const [errore, setErrore] = useState("");
  const disponibile = table && table.column("Pratica") >= 0 && Boolean(table.rows[props.rowIndex]);
  const coordinate = disponibile && table.column("Coordinate") >= 0 ? table.value(props.rowIndex, "Coordinate") : "";
  const chiudi = () => (__mk(), setAperto(false));
  const apri = () => {__mk();
    if (!disponibile) return;
    setValori(campi.map((campo) => (__mk(), table.column(campo) >= 0 ? table.value(props.rowIndex, campo) : "")));
    setOriginali(table.columns.map((campo) => ((__mk(), { campo, valore: table.value(props.rowIndex, campo) }))));
    setErrore("");
    setAperto(true);
  };
  const cambia = (indice, valore) => {__mk();
    setValori(valori.map((dato, i) => (__mk(), i === indice ? valore : dato)));
    setErrore("");
  };
  const salva = () => {__mk();
    if (!disponibile || table.columns.length !== originali.length || !originali.every((dato) => (__mk(), table.column(dato.campo) >= 0 && table.value(props.rowIndex, dato.campo) === dato.valore))) {
      setErrore("La riga è cambiata. Chiudi e riapri il modulo.");
      return;
    }
    campi.forEach((campo, i) => {__mk();
      if (table.column(campo) >= 0) table.setCell(props.rowIndex, campo, valori[i]);
    });
    chiudi();
    notify("Modifiche salvate in memoria. Identificativo mantenuto.");
  };
  return <div className="space-y-2">
    <span>{props.value}</span>
    <div className="flex flex-wrap gap-2">
      <Button variant="secondary" disabled={!disponibile} onClick={apri}>Modifica</Button>
      <Button variant="secondary" disabled={!disponibile} onClick={() => (__mk(), setPosizione(true))}>Apri posizione</Button>
    </div>
    {posizione && <Dialog title="Posizione della pratica" onClose={() => (__mk(), setPosizione(false))} footer={<Button onClick={() => (__mk(), setPosizione(false))}>Chiudi</Button>}>
      <div className="space-y-4">
        <Field label="Pratica">{disponibile ? table.value(props.rowIndex, "Pratica") : props.value}</Field>
        {coordinate.trim() ? <>
          <Field label="Coordinate"><p className="select-text font-mono">{coordinate}</p></Field>
          <p>Seleziona e copia queste coordinate, poi incollale nella ricerca di Google Maps.</p>
          <p className="text-sm text-(--mk-muted)">Le coordinate provengono dalla stessa riga del registro. In questo prototipo non è disponibile l’apertura diretta di siti esterni.</p>
        </> : <p>Coordinate non disponibili per questa pratica.</p>}
      </div>
    </Dialog>}
    {aperto && <Dialog title="Modifica pratica" onClose={chiudi} footer={<><Button variant="secondary" onClick={chiudi}>Annulla</Button><Button onClick={salva} disabled={!disponibile}>Salva modifiche</Button></>}>
      <div className="space-y-4">
        <Field label="Pratica">{props.value || "Assegnazione automatica in corso"}</Field>
        <p className="text-sm text-(--mk-muted)">L’identificativo assegnato non viene modificato. Usa solo dati dimostrativi.</p>
        {campi.map((campo, i) => (__mk(), table && table.column(campo) >= 0 ? campo === "Stato" ? <Select key={campo} label={campo} value={valori[i] || ""} options={[valori[i] || "", ...table.statuses.filter((stato) => (__mk(), stato !== valori[i]))]} onChange={(valore) => (__mk(), cambia(i, valore))} /> : <TextInput key={campo} label={campo === "Data sopralluogo" ? "Data sopralluogo (gg/mm/aaaa)" : campo} value={valori[i] || ""} onChange={(valore) => (__mk(), cambia(i, valore))} /> : null))}
        {errore && <p className="text-(--mk-danger)">{errore}</p>}
      </div>
    </Dialog>}
  </div>;
}
