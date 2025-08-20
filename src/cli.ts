#!/usr/bin/env node

import { cac } from "cac";
import assert from "node:assert";
import path from "node:path";
import fs from "node:fs/promises";
import { spawn } from "node:child_process";
import { Readable } from "node:stream";
import { dim, magenta } from "colorette";
import os from "node:os";
import { createInterface } from "node:readline";

const cli = cac("gh-emoji");

cli.version("v1.0.0");
cli.help();

const dir = path.resolve(os.homedir(), ".cache/gh-emoji");
const file = path.resolve(dir, "emojis.json");

interface IconData {
  name: string;
  code: string;
  emoji: string;
}

async function getEmojiData(): Promise<IconData[]> {
  const res = await fetch("https://api.github.com/emojis", {
    headers: {
      Accept: "application/json",
    },
  });
  assert(res.ok);
  const data = (await res.json()) as Record<string, string>;

  const out: IconData[] = [];
  for (const [name, url] of Object.entries(data)) {
    const code = path.basename(new URL(url).pathname, ".png");
    if (code === "atom") continue;
    try {
      const emoji = String.fromCodePoint(
        ...code.split("-").map((n) => globalThis.parseInt(n, 16)),
      );
      out.push({
        name,
        emoji,
        code,
      });
    } catch {}
  }
  return out;
}

async function refreshData() {
  const data = await getEmojiData();
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(file, JSON.stringify(data));
  return data;
}

async function getIconData(): Promise<IconData[]> {
  try {
    await fs.stat(file);
  } catch (err) {
    if (!(err instanceof Error && "code" in err && err.code === "ENOENT")) {
      throw err;
    }
    return await refreshData();
  }
  return fs.readFile(file, "utf-8").then((b) => JSON.parse(b));
}

function* iterEnum<T>(xs: Iterable<T>): IterableIterator<[number, T]> {
  let i = 0;
  for (const x of xs) {
    yield [i++, x];
  }
}

async function* iterFormattedIcons(icons: IconData[], color = true) {
  const n = Math.trunc(Math.log10(icons.length));
  for (const [index, item] of iterEnum(icons)) {
    if (color) {
      yield `${magenta(String(index).padStart(n, " "))}. ${item.emoji} ${dim(`:${item.name}:`)}\n`;
    } else {
      yield `${String(index).padStart(n, " ")}. ${item.emoji} :${item.name}:\n`;
    }
  }
}

cli
  .command("[list]", "List all emojis")
  .option("-c, --color", "Print with colors")
  .action(async (_, options: { color: boolean }) => {
    const icons = await getIconData();
    Readable.from(iterFormattedIcons(icons, options.color)).pipe(
      process.stdout,
    );
  });

cli.command("refresh", "Refresh the icon cache").action(async () => {
  await refreshData();
  console.log("Icons updated!");
});

cli.command("pick", "Pick emoji with skim").action(async () => {
  const icons = await getIconData();
  const child = spawn("sk", ["--no-multi", "--ansi"], {
    stdio: ["pipe", "pipe", "inherit"],
    shell: false,
  });

  Readable.from(iterFormattedIcons(icons, true)).pipe(child.stdin);

  const re = /^\s*(?<index>\d+)\./;
  let result: IconData | null = null;
  for await (const c of createInterface({ input: child.stdout })) {
    const index = c.match(re)?.groups?.index;
    if (!index) continue;
    result = icons[parseInt(index, 10)];
  }
  if (result) {
    console.log(JSON.stringify(result, null, 2));
  }
});

cli.parse(process.argv);
