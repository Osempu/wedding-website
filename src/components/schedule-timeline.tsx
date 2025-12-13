import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline";

const items = [
  {
    id: 1,
    date: "05:00 PM",
    title: "Recepción",
    description: "Recepcion de invitados y sentado en mesa..",
  },
  {
    id: 2,
    date: "06:00 PM",
    title: "Ceremonia",
    description: "Inicio de ceremonia religiosa..",
  },
  {
    id: 3,
    date: "07:00 PM",
    title: "Comida",
    description: "Servicio de comida.",
  },
  {
    id: 4,
    date: "08:00 PM",
    title: "Baile de los Novios",
    description:
      "Los novios bailaran una cancion despues de la ceremonia y comida.",
  },
  {
    id: 5,
    date: "09:00 PM",
    title: "Entrega de Regalos",
    description: "Se abriran los regalos para los novios.",
  },
  {
    id: 6,
    date: "10:00 PM",
    title: "Despedida",
    description:
      "Se van todos a mimir a su casa porque ya es noche y nos engentamos.",
  },
];

export const ScheduleTimeline = () => {
  return (
    <Timeline defaultValue={3}>
      {items.map((item) => (
        <TimelineItem
          key={item.id}
          step={item.id}
          className="sm:group-data-[orientation=vertical]/timeline:ms-32"
        >
          <TimelineHeader>
            <TimelineSeparator />
            <TimelineDate className="sm:group-data-[orientation=vertical]/timeline:absolute sm:group-data-[orientation=vertical]/timeline:-left-32 sm:group-data-[orientation=vertical]/timeline:w-20 sm:group-data-[orientation=vertical]/timeline:text-right">
              {item.date}
            </TimelineDate>
            <TimelineTitle className="sm:-mt-0.5">{item.title}</TimelineTitle>
            <TimelineIndicator />
          </TimelineHeader>
          <TimelineContent>{item.description}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
};
