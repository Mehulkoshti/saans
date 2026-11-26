"use client";

import { useId, type ReactNode } from "react";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-foreground placeholder:text-foreground/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

interface FieldWrapperProps {
  label: string;
  hint?: string;
  error?: string;
  children: (ids: { inputId: string; describedBy?: string }) => ReactNode;
}

function FieldWrapper({ label, hint, error, children }: FieldWrapperProps) {
  const inputId = useId();
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div>
      <label htmlFor={inputId} className="text-sm font-medium">
        {label}
      </label>
      {children({ inputId, describedBy })}
      {hint ? (
        <p id={hintId} className="mt-1 text-xs text-foreground/70">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="mt-1 text-xs text-aqi-unhealthy">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextField(props: {
  label: string;
  hint?: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  return (
    <FieldWrapper label={props.label} hint={props.hint} error={props.error}>
      {({ inputId, describedBy }) => (
        <input
          id={inputId}
          type="text"
          className={inputClass}
          value={props.value}
          placeholder={props.placeholder}
          autoFocus={props.autoFocus}
          aria-describedby={describedBy}
          aria-invalid={Boolean(props.error)}
          onChange={(e) => props.onChange(e.target.value)}
        />
      )}
    </FieldWrapper>
  );
}

export function NumberField(props: {
  label: string;
  hint?: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}) {
  return (
    <FieldWrapper label={props.label} hint={props.hint}>
      {({ inputId, describedBy }) => (
        <input
          id={inputId}
          type="number"
          className={inputClass}
          value={props.value}
          min={props.min}
          max={props.max}
          aria-describedby={describedBy}
          onChange={(e) => {
            const parsed = Number(e.target.value);
            props.onChange(Number.isNaN(parsed) ? 0 : parsed);
          }}
        />
      )}
    </FieldWrapper>
  );
}

export function SelectField<T extends string>(props: {
  label: string;
  hint?: string;
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (value: T) => void;
}) {
  return (
    <FieldWrapper label={props.label} hint={props.hint}>
      {({ inputId, describedBy }) => (
        <select
          id={inputId}
          className={inputClass}
          value={props.value}
          aria-describedby={describedBy}
          onChange={(e) => props.onChange(e.target.value as T)}
        >
          {props.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}
    </FieldWrapper>
  );
}

export function CheckboxField(props: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  const id = useId();
  return (
    <div className="flex items-center gap-2.5">
      <input
        id={id}
        type="checkbox"
        checked={props.checked}
        onChange={(e) => props.onChange(e.target.checked)}
        className="h-4.5 w-4.5 rounded border-border text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      />
      <label htmlFor={id} className="text-sm font-medium">
        {props.label}
      </label>
    </div>
  );
}
