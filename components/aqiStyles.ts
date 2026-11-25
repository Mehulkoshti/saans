import type { AqiCategory } from "@/lib/types";

interface AqiStyleSet {
  text: string;
  bg: string;
  bgSoft: string;
  border: string;
  stroke: string;
}

export const AQI_STYLES: Record<AqiCategory, AqiStyleSet> = {
  good: {
    text: "text-aqi-good",
    bg: "bg-aqi-good",
    bgSoft: "bg-aqi-good/10",
    border: "border-aqi-good",
    stroke: "stroke-aqi-good",
  },
  moderate: {
    text: "text-aqi-moderate",
    bg: "bg-aqi-moderate",
    bgSoft: "bg-aqi-moderate/10",
    border: "border-aqi-moderate",
    stroke: "stroke-aqi-moderate",
  },
  unhealthy_sensitive: {
    text: "text-aqi-sensitive",
    bg: "bg-aqi-sensitive",
    bgSoft: "bg-aqi-sensitive/10",
    border: "border-aqi-sensitive",
    stroke: "stroke-aqi-sensitive",
  },
  unhealthy: {
    text: "text-aqi-unhealthy",
    bg: "bg-aqi-unhealthy",
    bgSoft: "bg-aqi-unhealthy/10",
    border: "border-aqi-unhealthy",
    stroke: "stroke-aqi-unhealthy",
  },
  very_unhealthy: {
    text: "text-aqi-very-unhealthy",
    bg: "bg-aqi-very-unhealthy",
    bgSoft: "bg-aqi-very-unhealthy/10",
    border: "border-aqi-very-unhealthy",
    stroke: "stroke-aqi-very-unhealthy",
  },
  hazardous: {
    text: "text-aqi-hazardous",
    bg: "bg-aqi-hazardous",
    bgSoft: "bg-aqi-hazardous/10",
    border: "border-aqi-hazardous",
    stroke: "stroke-aqi-hazardous",
  },
};
