export default function isStartCommand(message: string): boolean {
  return ["agendar", "nueva cita", "empezar", "inicio", "hola"].includes(
    message.toLowerCase(),
  );
}