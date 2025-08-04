import Chat from "@/components/Chat";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <header className="mb-16">
        <Navbar />
      </header>

      <main>
        <Chat />
      </main>
    </>
  );
}
