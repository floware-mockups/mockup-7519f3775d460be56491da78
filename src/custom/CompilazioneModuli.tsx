// @ts-nocheck
import { customTicker, customTimers } from "../customGuard.ts";
const __mk = customTicker("CompilazioneModuli");
const { setTimeout, setInterval, clearTimeout, clearInterval } = customTimers("CompilazioneModuli");
import { useState } from "react";
import { Button, Card, Dialog, Select, Checkbox, Field, Badge, useTable } from "../floware";

const colonne = ["Pratica", "Tipo intervento", "Indirizzo", "Tecnico incaricato", "Data sopralluogo", "Stato"];
const modelli = ["Scheda intervento", "Verbale di sopralluogo"];
const etichetteScheda = ["Riferimento pratica", "Intervento previsto", "Luogo intervento", "Tecnico assegnato", "Data prevista", "Stato della pratica"];
const etichetteVerbale = ["Pratica di riferimento", "Oggetto del sopralluogo", "Luogo del sopralluogo", "Tecnico incaricato", "Data del sopralluogo", "Stato rilevato"];

export default function CompilazioneModuli(props) {__mk();
  const table = useTable(props.pageId);
  const [aperto, setAperto] = useState(false);
  const [pratica, setPratica] = useState("");
  const [modello, setModello] = useState("Scheda intervento");
  const [mappa, setMappa] = useState(colonne);
  const [fase, setFase] = useState(0);
  const [verificato, setVerificato] = useState(false);
  const [generato, setGenerato] = useState(null);
  if (!table || table.column("Pratica") < 0) return <p>La colonna Pratica è necessaria per compilare i moduli.</p>;
  const pratiche = table.rows.map((r) => (__mk(), table.value(r, "Pratica"))).filter((v) => (__mk(), v !== ""));
  const indice = pratica ? table.findRows("Pratica", pratica)[0] : -1;
  const riga = table.rows[indice];
  const etichette = modello === "Scheda intervento" ? etichetteScheda : etichetteVerbale;
  const valori = mappa.map((colonna) => (__mk(), riga && table.column(colonna) >= 0 ? table.value(riga, colonna) : ""));
  const completo = Boolean(riga) && valori.every((v) => (__mk(), v.trim() !== ""));
  const chiudi = () => (__mk(), setAperto(false));
  const apri = () => {__mk(); setFase(0); setVerificato(false); setAperto(true); };
  const cambiaMappa = (indiceCampo, valore) => {__mk();
    setMappa(mappa.map((c, i) => (__mk(), i === indiceCampo ? valore : c)));
    setVerificato(false);
  };
  const genera = () => {__mk();
    if (!completo || !verificato) return;
    setGenerato({ modello, pratica, campi: etichette.map((label, i) => ((__mk(), { label, valore: valori[i] }))) });
    setFase(2);
  };
  return (
    <Card title="Moduli prestabiliti">
      <div className="space-y-3">
        <p className="text-(--mk-muted)">Riporta i dati di una pratica in una scheda intervento o in un verbale di sopralluogo. Modelli dimostrativi, non documenti ufficiali.</p>
        <Button onClick={apri}>Compila modulo</Button>
      </div>
      {aperto && <Dialog title={fase === 2 ? "Modulo generato" : fase === 1 ? "Verifica del modulo" : "Configura il modulo"} onClose={chiudi} footer={<>
        <Button variant="secondary" onClick={chiudi}>Chiudi</Button>
        {fase === 0 && <Button disabled={!completo} onClick={() => {__mk(); setVerificato(false); setFase(1); }}>Verifica anteprima</Button>}
        {fase === 1 && <><Button variant="secondary" onClick={() => {__mk(); setVerificato(false); setFase(0); }}>Modifica mappatura</Button><Button disabled={!completo || !verificato} onClick={genera}>Genera modulo</Button></>}
        {fase === 2 && <Button onClick={() => {__mk(); setFase(0); setVerificato(false); }}>Compila un altro modulo</Button>}
      </>}>
        {fase === 0 && <div className="space-y-4">
          <Select label="Pratica da utilizzare" value={pratica} options={["", ...pratiche]} onChange={setPratica} />
          <Select label="Modello prestabilito" value={modello} options={modelli} onChange={setModello} />
          <p className="text-(--mk-muted)">Associa ogni campo a una colonna del registro. Tutti i campi sono obbligatori; la mappatura non modifica la pratica.</p>
          {etichette.map((label, i) => (__mk(), <div key={label} className="space-y-1 border-b border-(--mk-divider) pb-3">
            <Select label={label} value={table.column(mappa[i]) >= 0 ? mappa[i] : ""} options={["", ...table.columns]} onChange={(v) => (__mk(), cambiaMappa(i, v))} />
            <p className="text-sm text-(--mk-muted)">Valore: {valori[i] || "Dato mancante"}</p>
          </div>))}
          {!completo && <p>Seleziona una pratica e completa le associazioni con dati non vuoti.</p>}
        </div>}
        {fase === 1 && <div className="space-y-4">
          <Badge tone="neutral">Anteprima da verificare</Badge>
          <h3 className="font-semibold">{modello} — {pratica}</h3>
          {etichette.map((label, i) => (__mk(), <Field key={label} label={label}><p>{valori[i] || "Dato mancante"}</p><p className="text-sm text-(--mk-muted)">Colonna: {mappa[i]}</p></Field>))}
          <Checkbox label="Ho verificato i dati e le associazioni dei campi" checked={verificato} onChange={setVerificato} />
        </div>}
        {fase === 2 && generato && <div className="space-y-4">
          <Badge tone="primary">Generazione dimostrativa completata</Badge>
          <h3 className="font-semibold">{generato.modello} — {generato.pratica}</h3>
          {generato.campi.map((campo) => (__mk(), <Field key={campo.label} label={campo.label}>{campo.valore}</Field>))}
          <p className="text-sm text-(--mk-muted)">Copia dei dati al momento della generazione. Rimane in memoria fino alla prossima generazione o al ricaricamento; non viene prodotto alcun file.</p>
        </div>}
      </Dialog>}
    </Card>
  );
}
