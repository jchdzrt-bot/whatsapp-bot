export default function isCancelCommand(message: string): boolean {
  return ["cancelar", "cancel", "salir", "terminar"].includes(
    message.toLowerCase(),
  );
}