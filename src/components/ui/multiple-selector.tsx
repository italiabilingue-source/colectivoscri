'use client';

import * as React from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Command, CommandGroup, CommandItem } from '@/components/ui/command';

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
   * When `true`, the utility class `h-52` will be added to the `CommandList`.
   * @default false
   */
  minHeight?: boolean;
  /**
   * When `true`, the utility class `h-fit` will be added to the `CommandList`.
   * @default false
   */
  fitHeight?: boolean;
  /**
   * When `true`, the dropdown menu will be open.
   * @default false
   */
  open?: boolean;
  /**
   * Triggers when the dropdown menu is open or close.
   * @param open
   * @returns
   */
  onOpenChange?: (open: boolean) => void;
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
   * The component will be displayed in a form, this is the name of the form field.
   */
  name?: string;
  /**
   * The component will be displayed in a form, this is the class name of the form field.
   */
  className?: string;
  /**
   * The component will be displayed in a form, this is the placeholder of the search box.
   */
  selectFirstItem?: boolean;
  /**
   * When `true`, the user can create a new option.
   * @default false
   */
  creatable?: boolean;
  /**
   * The `onCreate` function is called when the user creates a new option.
   * @param value
   * @returns
   */
  onCreate?: (value: string) => void;
  /**
   * The `onBlur` function is called when the user blurs the input.
   * @returns
   */
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  /**
   * The `onFocus` function is called when the user focuses the input.
   * @returns
   */
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  /**
   * The `onRemove` function is called when the user removes an option.
   * @param option
   * @returns
   */
  onRemove?: (option: Option) => void;
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
      minHeight = false,
      fitHeight = false,
      disabled,
      open: externalOpen,
      onOpenChange: externalOnOpenChange,
      creatable = false,
      onCreate,
      onRemove,
    }: MultipleSelectorProps,
    ref: React.Ref<HTMLButtonElement>
  ) => {
    const [open, setOpen] = React.useState(externalOpen || false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [inputValue, setInputValue] = React.useState('');
    const [options, setOptions] = React.useState<GroupOption>(
      groupOptions(arrayDefaultOptions)
    );
    const [selected, setSelected] = React.useState<Option[]>(value || []);

    const onOpenChange = React.useCallback(
      (open: boolean) => {
        if (externalOnOpenChange) {
          externalOnOpenChange(open);
        } else {
          setOpen(open);
        }
      },
      [externalOnOpenChange]
    );

    const handleUnselect = React.useCallback(
      (option: Option) => {
        const newOptions = selected.filter((s) => s.value !== option.value);
        setSelected(newOptions);
        onChange?.(newOptions);
        onRemove?.(option);
      },
      [selected, onChange, onRemove]
    );

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        const input = e.currentTarget as HTMLDivElement;
        if (input) {
          if (e.key === 'Delete' || e.key === 'Backspace') {
            if (input.textContent === '' && selected.length > 0) {
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

    React.useEffect(() => {
      if (value) {
        setSelected(value);
      }
    }, [value]);

    React.useEffect(() => {
      /** If `onSearch` is provided, do not trigger options updated. */
      if (!arrayOptions || onSearch) {
        return;
      }
      const newOption = groupOptions(arrayOptions || []);
      setOptions(newOption);
    }, [arrayDefaultOptions, arrayOptions, onSearch]);

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

    const CreatableItem = () => {
      if (!creatable) return undefined;

      const Item = (
        <CommandItem
          key={inputValue}
          value={inputValue}
          className="cursor-pointer"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onSelect={(value: string) => {
            if (selected.length >= 5) {
              return;
            }
            setInputValue('');
            const newOptions = [...selected, { value, label: value }];
            setSelected(newOptions);
            onChange?.(newOptions);
            onCreate?.(value);
          }}
        >{`Create "${inputValue}"`}</CommandItem>
      );

      if (!onSearch && inputValue.length > 0) {
        return Item;
      }

      if (onSearch && inputValue.length > 0 && !isLoading) {
        return Item;
      }

      return undefined;
    };

    return (
      <Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent">
        <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          <div className="flex flex-wrap gap-1">
            {selected.map((option) => {
              return (
                <Badge
                  key={option.value}
                  className={`
                    ${option.fixed ? 'cursor-not-allowed' : 'cursor-pointer'}
                  `}
                  onClick={() => !option.fixed && handleUnselect(option)}
                >
                  {option.label}
                  {!option.fixed && <X className="ml-2 h-4 w-4" />}
                </Badge>
              );
            })}
            <CommandPrimitive.Input
              ref={ref}
              value={inputValue}
              onValueChange={onSearch ? handleInputChange : setInputValue}
              onBlur={() => onOpenChange(false)}
              onFocus={() => onOpenChange(true)}
              placeholder={selected.length !== 0 ? '' : placeholder}
              disabled={disabled}
              className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
        <div className="relative mt-2">
          {open && (
            <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandGroup>
                {isLoading ? (
                  <>{loadingIndicator}</>
                ) : (
                  <>
                    {Object.keys(options).length > 0 ? (
                      Object.keys(options).map((key) => (
                        <CommandGroup key={key} heading={key}>
                          {options[key].map((option) => (
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
                    ) : !creatable ? (
                      emptyIndicator
                    ) : null}
                  </>
                )}
                {CreatableItem()}
              </CommandGroup>
            </div>
          )}
        </div>
      </Command>
    );
  }
);
MultipleSelector.displayName = 'MultipleSelector';

function groupOptions(options: Option[]): GroupOption {
  return options.reduce((acc, option) => {
    const group = option.group || '';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(option);
    return acc;
  }, {} as GroupOption);
}
