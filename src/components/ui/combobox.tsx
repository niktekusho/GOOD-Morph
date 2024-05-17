"use client";

import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { CommonOptions } from "child_process";

export type ComboboxItem = {
  value: string;
  label: string;
};

export type ComboboxProps<T extends ComboboxItem[]> = {
  items: T;
  placeholderText: string;
  emptyResultText: string;
  initialValue?: unknown;
  onChange?: (value: T[number]["value"]) => void;
};

export const MIN_WIDTH = "200px";

export function Combobox<T extends ComboboxItem[]>({
  items,
  placeholderText,
  emptyResultText,
  initialValue,
  onChange,
}: ComboboxProps<T>) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(initialValue);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-[${MIN_WIDTH}] justify-between`}
        >
          {value
            ? items.find((item) => item.value === value)?.label
            : placeholderText}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={`w-[${MIN_WIDTH}] p-0`}>
        <Command>
          <CommandInput placeholder={placeholderText} />
          <CommandEmpty>{emptyResultText}</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    const newValue = currentValue === value ? "" : currentValue;
                    setValue(newValue);
                    setOpen(false);
                    if (onChange) onChange(newValue);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
