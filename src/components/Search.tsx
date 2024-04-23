"use client";

import { useEffect, useRef, useState } from "react";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/Command";

const Search = () => {
  const commandRef = useRef<HTMLDivElement>(null);

  const [input, setInput] = useState<string>("");
  const [isExactMatch, setIsExactMatch] = useState<boolean>(false);
  const [isMismatchedWord, setIsMismatchedWord] = useState<boolean>(true);

  const [searchResults, setSearchResults] = useState<{
    results: string[];
    duration: number;
  }>();

  useEffect(() => {
    const fetchData = async () => {
      if (!input) return setSearchResults(undefined);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_WORKERS_BASE_URL}/api/search?q=${input}`
      );

      const data = (await res.json()) as typeof searchResults;

      setSearchResults(data);

      setIsExactMatch(
        () =>
          searchResults?.results.some(
            (result) => result.toLowerCase() === input.toLowerCase()
          ) as boolean
      );

      // compare each word in the input value with each word in the country name
      const wordMatch = searchResults?.results.map((result) => {
        const inputWords = input.toLowerCase().split(" ");
        const resultWords = result.toLowerCase().split(" ");

        return inputWords.some((word) => !resultWords.includes(word));
      });

      // check if there are any mismatched words
      const isMismatched = wordMatch ? wordMatch.includes(true) : false;

      setIsMismatchedWord(isMismatched);
    };

    fetchData();
  }, [input]);

  useOnClickOutside(commandRef, () => {
    setInput("");
  });

  return (
    <div className="max-w-md w-full">
      <Command ref={commandRef}>
        <CommandInput
          value={input}
          onValueChange={(text) => {
            const trimmedInput =
              isExactMatch || isMismatchedWord
                ? text.trimEnd()
                : text.trimStart();

            // remove extra spaces from the input to ensure consistency
            const sanitizedInput = trimmedInput.replace(/\s{2,}/g, " ");

            // update controlled input value
            setInput(sanitizedInput);
          }}
          placeholder="Search countries..."
          className="placeholder:text-zinc-500"
        />

        <CommandList className="thin-scrollbar-thumb-gray thin-scrollbar-thumb-rounded thin-scrollbar-track-gray-lighter scrollbar-w-2 scrolling-touch">
          {searchResults?.results?.length === 0 ? (
            <CommandEmpty>No results found.</CommandEmpty>
          ) : null}

          {input &&
          searchResults?.results &&
          searchResults.results.length > 0 ? (
            <>
              <CommandGroup heading="Results">
                {searchResults.results.map((result, i) => (
                  <CommandItem key={i} value={result} onSelect={setInput}>
                    {result}
                  </CommandItem>
                ))}
              </CommandGroup>

              <div className="h-px w-full bg-zinc-200" />

              <p className="text-xs text-zinc-500 px-3 py-2">
                Found {searchResults.results.length}&nbsp;
                {searchResults.results.length === 1 ? "result" : "results"}
                &nbsp;in&nbsp;
                {searchResults.duration.toFixed(0)}ms
              </p>
            </>
          ) : null}
        </CommandList>
      </Command>
    </div>
  );
};

export default Search;
