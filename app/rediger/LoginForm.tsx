"use client";

import { useActionState } from "react";
import { login } from "./actions";

export function LoginForm() {
  const [state, action, venter] = useActionState(login, {});
  return (
    <form action={action} className="space-y-5">
      <div>
        <label htmlFor="adgangskode" className="text-xs uppercase tracking-[0.2em] text-ash">
          Adgangskode
        </label>
        <input
          id="adgangskode"
          name="adgangskode"
          type="password"
          required
          autoComplete="current-password"
          className="mt-2 w-full border border-ink/20 bg-transparent px-4 py-3 focus:border-ink focus:outline-none"
        />
      </div>
      {state.error ? (
        <p role="alert" className="text-sm text-red-800">
          {state.error}
        </p>
      ) : null}
      <button
        disabled={venter}
        className="bg-ink px-6 py-3 text-[0.95rem] tracking-wide text-pearl hover:bg-tourmaline disabled:opacity-60"
      >
        {venter ? "Logger ind…" : "Log ind"}
      </button>
    </form>
  );
}
