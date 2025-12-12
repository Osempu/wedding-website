import "./App.css";
import { CountdownTimer } from "./components/CountdownTimer";
import { ScheduleTimeline } from "./components/schedule-timeline";
import { Footer } from "./components/footer";

function App() {
  return (
    <>
      <section className="relative h-145 bg-cover bg-center bg-[url('/wedding_hero.jpg')]">
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 top-[25%] flex-col justify-center h-full text-center text-white px-6">
          <span className="text-4xl font-semibold">Save the Date</span>
          <h1 className="text-9xl font-bold mb-4">We're Getting</h1>
          <h1 className="text-9xl font-bold mb-4">Married!</h1>
          <h3 className="text-6xl font-bold mb-4">On November 30th, 2025</h3>
        </div>
      </section>

      <section>
        <CountdownTimer targetDate={new Date("2026-11-15")} />
      </section>

      <section className="flex-col justify-center text-center py-10">
        <h2 className="text-7xl">Donde será?</h2>
        <h2 className="text-4xl">Calle los pedregales, Colonia Doctores</h2>

        <div className="flex justify-center my-10">
          <iframe
            title="Wedding Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d20271.62639970023!2d-98.29534554833104!3d26.080922446008483!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x866509003f737ed9%3A0x57908cbc3c4a66d6!2sIglesia%20Ministerios%20Sion%20Reynosa!5e0!3m2!1ses-419!2smx!4v1763697053037!5m2!1ses-419!2smx"
            width="800"
            className="w-8/10 h-[400px] rounded-xl overflow-hidden shadow-md border-0"
            height="500"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>

      <section className="p-10">
        <h2 className="text-5xl text-center">Dress Code</h2>
        <p className="text-2xl mt-5">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem voluptas,
          quam aut voluptatem ipsam eos iure ut! Saepe corporis omnis excepturi
          in error assumenda voluptas magnam, dignissimos laudantium facere unde
          eos fugiat voluptatem voluptatum quasi dicta exercitationem enim
          deleniti. Natus impedit aperiam sunt fuga minima fugit porro quas
          autem animi sed repellat facilis maiores nam atque aut pariatur
          ratione quae perspiciatis doloremque, sequi excepturi sapiente ut
          aspernatur molestiae? Impedit asperiores in, iste facilis dolores
          quaerat facere repellat dignissimos. Omnis laudantium veritatis,
          suscipit vitae animi quis aut laboriosam eveniet, officiis ullam
          cumque voluptates, magni reprehenderit aperiam. Obcaecati, quidem ad.
          Eos, eius?
        </p>
      </section>

      {/* Schedule Section */}
      <section className="p-10 flex-col">
        <h2 className="text-5xl text-center mb-6">Schedule</h2>
        <div className="justify-self-center mt-10">
          <ScheduleTimeline />
        </div>
      </section>

      <Footer />
    </>
  );
}

export default App;
