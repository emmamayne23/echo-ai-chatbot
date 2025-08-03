import Chat from "@/components/Chat";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <header>
        <Navbar />
      </header>

      <main>
        <Chat />
      </main>
    </>
  );
}
