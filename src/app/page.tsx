import { StackCheck } from "@/components/backend-panel";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 py-10 sm:px-8 sm:py-16">
      <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
        Frontend and backend · local
      </p>
      <h1 className="mt-5 font-serif text-6xl leading-none tracking-tight sm:text-8xl">Hello.</h1>
      <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
        This page is the frontend. Ask the backend, and the page calls{" "}
        <span className="font-mono whitespace-nowrap text-foreground">GET&nbsp;/api/hello</span>, then prints the
        reply. When both cards are live, this machine can run the stack.
      </p>

      <StackCheck />

      <p className="mt-10 font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
        Nothing here is deployed. Run it on the laptop you will share.
      </p>
    </main>
  );
}
