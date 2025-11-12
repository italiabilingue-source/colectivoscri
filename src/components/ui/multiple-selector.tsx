'use client';

import * as React from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';

export interface Option {
  value: string;
  label: string;
  disable?: boolean;
  /** fixed option that can't be removed. */
  fixed?: boolean;
  /** Group the options by providing key. */
  [key: string]: string | boolean | undefined;
}
interface GroupOption {
  [key: string]: Option[];
}

interface MultipleSelectorProps {
  value?: Option[];
  defaultOptions?: Option[];
  options?: Option[];
  placeholder?: string;
  /** Loading component. */
  loadingIndicator?: React.ReactNode;
  /** Empty component. */
  emptyIndicator?: React.ReactNode;
  /** Debounce time for async search. Only work with `onSearch`. */
  delay?: number;
  /**
   * When `true`, the utility class `max-h-52` will be added to the `CommandList`.
   * @default false
   */
  maxHeight?: boolean;
  /**
   * When `true`, the user can create a new option.
   * @default false
   */
  creatable?: boolean;
  /**
   * The `onChange` function is called when the value of the input changes.
   * @param value
   * @returns
   */
  onChange?: (value: Option[]) => void;
  /**
   * The `onSearch` function is called when the user types in the search box.
   * @param value
   * @returns
   */
  onSearch?: (value: string) => Promise<Option[]>;
  /**
   * When `true`, the search box will be disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * The `onBlur` function is called when the user blurs the input.
   * @returns
   */
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
}

export const MultipleSelector = React.forwardRef<HTMLButtonElement, MultipleSelectorProps>(
  (
    {
      value,
      onChange,
      placeholder,
      defaultOptions: arrayDefaultOptions = [],
      options: arrayOptions,
      delay,
      onSearch,
      loadingIndicator,
      emptyIndicator,
      maxHeight = false,
      creatable = false,
      disabled,
      onBlur,
      className,
    }: MultipleSelectorProps,
    ref: React.Ref<HTMLButtonElement>
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [open, setOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [inputValue, setInputValue] = React.useState('');
    const [options, setOptions] = React.useState<GroupOption>(
      groupOptions(arrayDefaultOptions)
    );
    const [selected, setSelected] = React.useState<Option[]>(value || []);

    React.useEffect(() => {
      if (value) {
        setSelected(value);
      }
    }, [value]);

    const handleUnselect = React.useCallback(
      (option: Option) => {
        const newOptions = selected.filter((s) => s.value !== option.value);
        setSelected(newOptions);
        onChange?.(newOptions);
      },
      [selected, onChange]
    );

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        const input = e.target as HTMLInputElement;
        if (input) {
          if (e.key === 'Delete' || e.key === 'Backspace') {
            if (input.value === '' && selected.length > 0) {
              const lastSelectOption = selected[selected.length - 1];
              if (!lastSelectOption.fixed) {
                handleUnselect(lastSelectOption);
              }
            }
          }
          if (e.key === 'Escape') {
            input.blur();
          }
        }
      },
      [selected, handleUnselect]
    );

    const Debounce = <T extends (...args: any[]) => void>(
      func: T,
      delay: number
    ): ((...args: Parameters<T>) => void) => {
      let timeoutId: NodeJS.Timeout | null = null;
      return (...args: Parameters<T>): void => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
          func(...args);
        }, delay);
      };
    };

    React.useEffect(() => {
      if (!onSearch) {
        const newOption = groupOptions(arrayOptions || []);
        setOptions(newOption);
      }
    }, [arrayOptions, onSearch]);

    const debouncedSearch = React.useCallback(
      Debounce(async (value: string) => {
        if (!onSearch) {
          const newOptions = groupOptions(arrayDefaultOptions || []);
          const filteredOptions = Object.keys(newOptions).reduce(
            (acc, key) => {
              const options = newOptions[key].filter((option) =>
                option.label.toLowerCase().includes(value.toLowerCase())
              );
              if (options.length > 0) {
                acc[key] = options;
              }
              return acc;
            },
            {} as GroupOption
          );
          setOptions(filteredOptions);
          return;
        }

        setIsLoading(true);
        const res = await onSearch?.(value);
        setOptions(groupOptions(res || []));
        setIsLoading(false);
      }, delay || 500),
      [arrayDefaultOptions, onSearch]
    );

    const handleInputChange = React.useCallback(
      (value: string) => {
        setInputValue(value);
        debouncedSearch(value);
      },
      [debouncedSearch]
    );

    const creatableOption = () => {
        if (!creatable || !inputValue) return undefined;
        
        const isValueSelected = selected.some((s) => s.value === inputValue);
        if (isValueSelected) return undefined;

        const isOptionExist = Object.values(options).flat().some((o) => o.value === inputValue);
        if (isOptionExist) return undefined;

        return (
            <CommandItem
                key={inputValue}
                value={inputValue}
                className="cursor-pointer"
                onSelect={() => {
                    setInputValue('');
                    const newOptions = [...selected, { value: inputValue, label: inputValue }];
                    setSelected(newOptions);
                    onChange?.(newOptions);
                }}
            >
                {`Create "${inputValue}"`}
            </CommandItem>
        )
    };

    const commandFilter = (value: string, search: string) => {
        return value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0;
    };

    const selectedValues = new Set(selected.map((s) => s.value));

    return (
      <Command onKeyDown={handleKeyDown} filter={commandFilter} className="overflow-visible bg-transparent">
        <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          <div className="flex flex-wrap gap-1">
            {selected.map((option) => {
              return (
                <Badge
                  key={option.value}
                  className={option.fixed ? 'cursor-not-allowed' : ''}
                  variant="outline"
                >
                  {option.label}
                  <button
                    className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleUnselect(option);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() => handleUnselect(option)}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              );
            })}
            <CommandPrimitive.Input
              ref={inputRef}
              value={inputValue}
              onValueChange={onSearch ? handleInputChange : setInputValue}
              onBlur={(e) => {
                setOpen(false);
                onBlur?.(e);
              }}
              onFocus={() => setOpen(true)}
              placeholder={selected.length !== 0 ? '' : placeholder}
              disabled={disabled}
              className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
        <div className="relative mt-2">
          {open && (
            <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandList className={maxHeight ? 'max-h-52' : ''}>
                {isLoading ? (
                  <>{loadingIndicator}</>
                ) : (
                  <>
                    {Object.keys(options).length > 0 || creatable ? (
                       Object.entries(options).map(([key, groupOptions]) => (
                        <CommandGroup key={key} heading={key === 'undefined' ? undefined : key}>
                          {groupOptions
                            .filter(option => !selectedValues.has(option.value))
                            .map((option) => (
                            <CommandItem
                              key={option.value}
                              value={option.label}
                              disabled={option.disable}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                              onSelect={() => {
                                setInputValue('');
                                const newOptions = [...selected, option];
                                setSelected(newOptions);
                                onChange?.(newOptions);
                              }}
                              className="cursor-pointer"
                            >
                              {option.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      ))
                    ) : (
                      emptyIndicator
                    )}
                    {creatableOption()}
                  </>
                )}
              </CommandList>
            </div>
          )}
        </div>
      </Command>
    );
  }
);
MultipleSelector.displayName = 'MultipleSelector';

function groupOptions(options: Option[]): GroupOption {
  if (!options) {
    return {};
  }
  return options.reduce((acc, option) => {
    const group = option.group || '';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(option);
    return acc;
  }, {} as GroupOption);
}
