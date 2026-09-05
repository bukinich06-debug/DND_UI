import type { IActionFormState, IBuildTurnTextParams, StructuredActionId } from "../types";
import { UNARMED_ID } from "../types";

export const buildTurnText = ({ action, form, npcs, items, exits }: IBuildTurnTextParams): string => {
  if (action === "talk") {
    const name = npcs.find((n) => n.id === form.npcId)?.name ?? form.npcId;
    let text = `Говорю с ${name}: «${form.say.trim()}».`;
    if (form.do.trim()) text += ` При этом ${form.do.trim()}.`;
    return text;
  }

  if (action === "inspect") {
    let target = "текущую локацию";
    if (form.inspectKind === "npc")
      target = npcs.find((n) => n.id === form.npcId)?.name ?? form.npcId;
    if (form.inspectKind === "item")
      target = items.find((i) => i.id === form.itemId)?.name ?? form.itemId;
    if (form.inspectKind === "other") target = form.otherTarget.trim();
    let text = `Осматриваю: ${target}.`;
    if (form.focus.trim()) text += ` Обращаю внимание на: ${form.focus.trim()}.`;
    return text;
  }

  if (action === "search") {
    const where =
      form.searchScope === "npc"
        ? `у ${npcs.find((n) => n.id === form.npcId)?.name ?? form.npcId}`
        : "в текущей локации";
    return `Ищу ${where}: ${form.query.trim()}.`;
  }

  if (action === "attack") {
    const name = npcs.find((n) => n.id === form.npcId)?.name ?? form.npcId;
    const weapon =
      form.weaponId === UNARMED_ID
        ? "безоружный"
        : (items.find((i) => i.id === form.weaponId)?.name ?? form.weaponId);
    if (form.manner.trim()) return `Атакую ${name} (${weapon}): ${form.manner.trim()}.`;
    return `Атакую ${name} (${weapon}).`;
  }

  if (action === "move") {
    if (form.exitId) {
      const exit = exits.find((e) => e.id === form.exitId);
      return `Иду в ${exit?.name ?? form.exitId}.`;
    }
    return `Иду: ${form.localPath.trim()}.`;
  }

  if (action === "rest") {
    let kind = "передышку";
    if (form.restKind === "short") kind = "короткий отдых";
    if (form.restKind === "long") kind = "долгий отдых";
    let text = `Беру ${kind}.`;
    if (form.circumstances.trim()) text += ` ${form.circumstances.trim()}.`;
    return text;
  }

  const from =
    !form.stealthNpcId
      ? "от окружения"
      : `от ${npcs.find((n) => n.id === form.stealthNpcId)?.name ?? form.stealthNpcId}`;
  return `Скрытность ${from}: ${form.stealthAction.trim()}.`;
};

export const canSendAction = (action: StructuredActionId, form: IActionFormState): boolean => {
  if (action === "talk") return Boolean(form.npcId && form.say.trim());
  if (action === "inspect") {
    if (form.inspectKind === "npc") return Boolean(form.npcId);
    if (form.inspectKind === "item") return Boolean(form.itemId);
    if (form.inspectKind === "other") return Boolean(form.otherTarget.trim());
    return true;
  }
  if (action === "search") {
    if (!form.query.trim()) return false;
    if (form.searchScope === "npc") return Boolean(form.npcId);
    return true;
  }
  if (action === "attack") return Boolean(form.npcId && form.weaponId);
  if (action === "move") {
    const hasExit = Boolean(form.exitId);
    const hasLocal = Boolean(form.localPath.trim());
    return (hasExit && !hasLocal) || (!hasExit && hasLocal);
  }
  if (action === "rest") return true;
  return Boolean(form.stealthAction.trim());
};
