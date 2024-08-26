import Footer from "@/components/hospitals/landingpage/footer";
import Herosection from "@/components/hospitals/landingpage/herosection";
import Navbar from "@/components/hospitals/landingpage/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Herosection />
      {/* <Link href='/login'>
        <Button>Login</Button>
      </Link>
      <Link href='/register'>
        <Button>Register</Button>
      </Link> */}
      <Footer />
    </main>
  );
}
